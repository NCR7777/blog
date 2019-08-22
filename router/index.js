let express = require('express');

let router = express.Router();

const fs = require('fs');

const mysql = require('../config/db');

const moment = require('moment');

const crypto = require('crypto');

//登陆操作
router.post('/login', function (request, response, next) {
    let {user_username, user_password} = request.body;
    //判断用户是否存在
    if (user_username) {
        if (user_password) {
            let md5 = crypto.createHash('md5');
            user_password = md5.update(user_password).digest('hex');
            mysql.query("select * from user where user_username = ? and user_password = ?", [user_username, user_password], function (err, data) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    if (data.length == 1) {
                        request.session.loginMessageIsUser = true;
                        request.session.loginMessageUserUsername = data[0].user_username;
                        response.send("1");
                    } else {
                        response.send("2");
                    }
                }
            });
        } else {
            response.send("3");
        }
    } else {
        response.send("3");
    }
});
//用户注册
router.post('/reg', function (request, response, next) {
    let {user_username, user_password} = request.body;
    let regUsernameData = user_username.length >= 6 && user_username.length >= 6;
    let regPasswordData = user_password.length >= 6 && user_password.length >= 6;
    if (regUsernameData && regPasswordData) {
        //查询用户名是否存在
        mysql.query("select * from user where user_username = ?", [user_username], function (err, data) {
            if (err) {
                console.log(err);
                return "";
            } else {
                if (data.length == 1) {
                    response.send("2");
                } else if (data.length == 0) {
                    let user_time = Math.round((new Date().getTime()) / 1000);
                    let md5 = crypto.createHash('md5');
                    user_password = md5.update(user_password).digest('hex');
                    //插入数据
                    mysql.query("insert into user (user_username,user_password,user_status,user_time) value(?,?,?,?)", [user_username, user_password, "0", user_time], function (err, data) {
                        if (err) {
                            console.log(err);
                            return "";
                        } else {
                            if (data.affectedRows == 1) {
                                request.session.loginMessageIsUser = true;
                                request.session.loginMessageUserUsername = user_username;
                                response.send("1");
                            } else {
                                response.send("3");
                            }
                        }
                    });
                } else {
                    response.send("3");
                }
            }
        });
    } else {
        response.send("4");
    }
});
//退出登录
router.get('/logout', function (request, response, next) {
    request.session.loginMessageIsUser = false;
    request.session.loginMessageUserUsername = "";
    response.send("<script>alert('退出成功！');location.href='/';</script>");
});
//评论操作
router.post('/article', function (request, response, next) {
    //判断用户是否登录
    if (request.session.loginMessageIsUser && request.session.loginMessageUserUsername) {
        let {comment_text, news_id} = request.body;
        let user_username = request.session.loginMessageUserUsername;
        //查询用户数据
        mysql.query("select user_id from user where user_username = ?", [user_username], function (err, userData) {
            if (err) {
                console.log(err);
                return "";
            } else {
                //当前时间戳
                let comment_time = Math.round((new Date().getTime()) / 1000);
                let user_id = userData[0].user_id;
                //插入评论数据
                mysql.query("insert into comment (user_id,news_id,comment_text,comment_time,comment_status) value(?,?,?,?,?)", [user_id, news_id, comment_text, comment_time, "0"], function (err, data) {
                    if (err) {
                        console.log(err);
                        return "";
                    } else {
                        response.send("<script>alert('评论成功，经审核后才可显示！');history.go(-1);</script>");
                    }
                })
            }
        })
    } else {
        response.send("<script>alert('请先登录！');history.go(-1);</script>");
    }
});
// 首页
router.get('/', function (request, response, next) {
    //读取网站配置
    let webConfig = fs.readFileSync(__dirname + "/../config/webConfig.json");
    webConfig = JSON.parse(webConfig.toString());
    //读取分类信息
    mysql.query("select * from types order by types_sort desc", function (err, typesData) {
        if (err) {
            console.log(err);
            return "";
        } else {
            //读取轮播图信息
            mysql.query("select * from slider order by slider_sort desc", function (err, sliderData) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    //查询最新发布的文章
                    mysql.query("select news.*,types.types_name,types.types_id from news,types where news.news_cid = types.types_id order by news.news_id desc", function (err, newsData) {
                        if (err) {
                            console.log(err);
                            return "";
                        } else {
                            newsData.forEach(item => {
                                item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD HH:mm:ss");
                            });
                            mysql.query("select * from news order by news_num desc limit 5", function (err, hotNewsData) {
                                if (err) {
                                    console.log(err);
                                    return "";
                                } else {
                                    hotNewsData.forEach(item => {
                                        item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD");
                                    });
                                    if (request.session.loginMessageUserUsername) {
                                        let loginMessageUserUsername = request.session.loginMessageUserUsername;
                                        response.render('home/index', {
                                            webConfig: webConfig,
                                            typesData: typesData,
                                            sliderData: sliderData,
                                            newsData: newsData,
                                            hotNewsData: hotNewsData,
                                            loginMessageUserUsername: loginMessageUserUsername,
                                        });
                                    } else {
                                        response.render('home/index', {
                                            webConfig: webConfig,
                                            typesData: typesData,
                                            sliderData: sliderData,
                                            newsData: newsData,
                                            hotNewsData: hotNewsData,
                                            loginMessageUserUsername: "",
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            })
        }
    });
});
// 文章页
router.get('/article', function (request, response, next) {
    let id = request.query.id;
    //读取网站配置
    let webConfig = fs.readFileSync(__dirname + "/../config/webConfig.json");
    webConfig = JSON.parse(webConfig.toString());
    //加载分类数据
    mysql.query("select * from types order by types_sort desc", function (err, typesData) {
        if (err) {
            console.log(err);
            return ""
        } else {
            //查询对应的文章数据
            mysql.query("select news.*,types.types_name tName,types.types_id tId from news,types where news.news_cid = types.types_id and news.news_id = ?", [id], function (err, newsData) {
                if (err) {
                    console.log(err);
                    return ""
                } else {
                    if (newsData[0]) {
                        let news_cid = newsData[0].news_cid;
                        newsData.forEach(item => {
                            item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD HH:mm:ss");
                        });
                        //查询评论信息
                        mysql.query("select user.user_username,comment.* from comment,user where comment.user_id = user.user_id and comment.news_id = ? and comment.comment_status = ? order by comment.comment_id desc limit 15", [id, "1"], function (err, commentData) {
                            if (err) {
                                console.log(err);
                                return ""
                            } else {
                                commentData.forEach(item => {
                                    item.comment_time = moment(item.comment_time * 1000).format("YYYY-MM-DD")
                                });
                                //分类下热门新闻
                                mysql.query("select * from news where news_cid = ? order by news_num desc limit 5", [news_cid], function (err, hotNewsData) {
                                    if (err) {
                                        console.log(err);
                                        return ""
                                    } else {
                                        hotNewsData.forEach(item => {
                                            item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD")
                                        });
                                        if (request.session.loginMessageUserUsername) {
                                            let loginMessageUserUsername = request.session.loginMessageUserUsername;
                                            response.render('home/article', {
                                                webConfig: webConfig,
                                                typesData: typesData,
                                                newsData: newsData[0],
                                                commentData: commentData,
                                                hotNewsData: hotNewsData,
                                                loginMessageUserUsername: loginMessageUserUsername,
                                            });
                                        } else {
                                            response.render('home/article', {
                                                webConfig: webConfig,
                                                typesData: typesData,
                                                newsData: newsData[0],
                                                commentData: commentData,
                                                hotNewsData: hotNewsData,
                                                loginMessageUserUsername: "",
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        if (request.session.loginMessageUserUsername) {
                            let loginMessageUserUsername = request.session.loginMessageUserUsername;
                            response.render('home/404', {
                                webConfig: webConfig,
                                typesData: typesData,
                                loginMessageUserUsername: loginMessageUserUsername,
                            });
                        } else {
                            response.render('home/404', {
                                webConfig: webConfig,
                                typesData: typesData,
                                loginMessageUserUsername: "",
                            });
                        }
                    }
                }
            });
        }
    });
});
// 分类页面
router.get('/list', function (request, response, next) {
    let id = request.query.id;
    //读取网站配置
    let webConfig = fs.readFileSync(__dirname + "/../config/webConfig.json");
    webConfig = JSON.parse(webConfig.toString());
    //读取分类数据
    mysql.query("select * from types order by types_sort desc", function (err, typesData) {
        if (err) {
            console.log(err);
            return ""
        } else {
            //获取当前分类信息
            let typesInfo = "";
            typesData.forEach(item => {
                if (item.types_id == id) {
                    typesInfo = item;
                }
            });
            if (typesInfo) {
                //查询对应新闻信息
                mysql.query("select * from news where news_cid = ? order by news_id desc", [id], function (err, newsData) {
                    if (err) {
                        console.log(err);
                        return ""
                    } else {
                        newsData.forEach(item => {
                            item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD")
                        });
                        //分类下热门新闻
                        mysql.query("select * from news where news_cid = ? order by news_num desc limit 5", [id], function (err, hotNewsData) {
                            if (err) {
                                console.log(err);
                                return ""
                            } else {
                                hotNewsData.forEach(item => {
                                    item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD")
                                });
                                if (request.session.loginMessageUserUsername) {
                                    let loginMessageUserUsername = request.session.loginMessageUserUsername;
                                    response.render('home/list', {
                                        webConfig: webConfig,
                                        typesData: typesData,
                                        typesInfo: typesInfo,
                                        newsData: newsData,
                                        hotNewsData: hotNewsData,
                                        loginMessageUserUsername: loginMessageUserUsername,
                                    });
                                } else {
                                    response.render('home/list', {
                                        webConfig: webConfig,
                                        typesData: typesData,
                                        typesInfo: typesInfo,
                                        newsData: newsData,
                                        hotNewsData: hotNewsData,
                                        loginMessageUserUsername: "",
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                if (request.session.loginMessageUserUsername) {
                    let loginMessageUserUsername = request.session.loginMessageUserUsername;
                    response.render('home/404', {
                        webConfig: webConfig,
                        typesData: typesData,
                        loginMessageUserUsername: loginMessageUserUsername,
                    });
                } else {
                    response.render('home/404', {
                        webConfig: webConfig,
                        typesData: typesData,
                        loginMessageUserUsername: "",
                    });
                }
            }
        }
    });
});
//404错误界面
router.get('/404', function (request, response, next) {
    let webConfig = fs.readFileSync(__dirname + "/../config/webConfig.json");
    webConfig = JSON.parse(webConfig.toString());
    mysql.query("select * from types order by types_sort desc", function (err, typesData) {
        if (err) {
            console.log(err);
            return ""
        } else {
            if (request.session.loginMessageUserUsername) {
                let loginMessageUserUsername = request.session.loginMessageUserUsername;
                response.render('home/404', {
                    webConfig: webConfig,
                    typesData: typesData,
                    loginMessageUserUsername: loginMessageUserUsername,
                });
            } else {
                response.render('home/404', {
                    webConfig: webConfig,
                    typesData: typesData,
                    loginMessageUserUsername: "",
                });
            }
        }
    });
});

module.exports = router;