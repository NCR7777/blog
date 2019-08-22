let express = require('express');

let router = new express.Router();

const mysql = require('../../config/db');

const moment = require('moment');

const crypto = require('crypto');

const toPages = require('../../common/toPages');
//展示会员列表页面
router.get('/list', function (request, response, next) {
    //分页
    let p = request.query.p ? request.query.p : 1;
    let size = 5;
    let search = request.query.search ? request.query.search : "";
    mysql.query("select count(*) tot from user where user_username like ?", [`%${search}%`], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            let tot = data[0].tot;
            let Pages = toPages(tot, p, size, search);
            //查询数据
            mysql.query("select * from user where user_username like ? order by user_id desc limit ?,?", [`%${search}%`, Pages.start, Pages.size], function (err, data) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    data.forEach(item => {
                        item.user_time = moment(item.user_time * 1000).format("YYYY-MM-DD  HH:mm:ss");
                    });
                    response.render('admin/user/list',
                        {
                            data: data,
                            search: search,
                            show: Pages.show
                        }
                    );
                }
            })
        }
    });


});

//添加会员页面
router.get('/add', function (request, response, next) {
    response.render('admin/user/add');
});

//新增会员
router.get('/insert', function (request, response, next) {
    let {password, repassword, status, username} = request.query
    if (username) {
        //判断用户名
        if (username.length >= 6 && username.length <= 12) {
            //判断密码
            if (password) {
                if (password == repassword) {
                    //判断用户名是否已经注册
                    mysql.query("select * from user where user_username = ?", [username], function (err, data) {
                        if (err) {
                            console.log(err);
                            return "";
                        } else {
                            if (data.length == 0) {
                                //当前时间戳
                                let time = Math.round((new Date().getTime()) / 1000);
                                //密码md5加密
                                let md5 = crypto.createHash('md5');
                                password = md5.update(password).digest('hex');
                                //插入数据
                                mysql.query("insert into user (user_username,user_password,user_status,user_time) value(?,?,?,?)", [username, password, status, time], function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        return "";
                                    } else {
                                        if (data.affectedRows == 1) {
                                            response.send("<script>alert('添加成功！');location.href='/admin/user/list';</script>")
                                        } else {
                                            response.send("<script>alert('添加失败！');history.go(-1);</script>");
                                        }
                                    }
                                })
                            } else response.send("<script>alert('该用户名已经被注册,请重新输入！');history.go(-1);</script>");
                        }
                    });
                } else response.send("<script>alert('输入的两次密码不一致！');history.go(-1);</script>");
            } else response.send("<script>alert('请输入密码！');history.go(-1);</script>");
        } else response.send("<script>alert('请输入6-12位的用户名！');history.go(-1);</script>");
    } else response.send("<script>alert('请输入账户名！');history.go(-1);</script>");
})

//ajax修改会员状态
router.get('/ajax_status', function (request, response, next) {
    let {user_id, user_status} = request.query;
    mysql.query("update user set user_status = ? where user_id = ?", [user_status, user_id], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            data.affectedRows == 1 ? response.send("1") : response.send("0");
        }
    })
})

//ajax删除会员
router.get('/ajax_del', function (request, response, next) {
    let {user_id} = request.query;
    mysql.query("delete from user where user_id = ?", [user_id], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            data.affectedRows == 1 ? response.send("1") : response.send("0");
        }
    })
})

//会员修改页面
router.get('/edit', function (request, response, next) {
    let user_id = request.query.user_id;
    mysql.query("select * from user where user_id =?", [user_id], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            response.render('admin/user/edit', {data: data[0]});
        }
    })
})

//会员修改操作
router.post('/edit', function (request, response, next) {
    let {user_id, user_password, user_repassword, user_status, user_username} = request.body;
    //判断用户是否修改密码
    if (user_password) {
        let md5 = crypto.createHash('md5');
        user_password = md5.update(user_password).digest('hex');
        sql = `update user set user_status = ?,user_password = ? where user_id = ?`;
        mysql.query(sql, [user_status, user_password, user_id], function (err, data) {
            if (err) {
                console.log(err);
                return "";
            } else {
                if (data.affectedRows == 1) {
                    response.send("<script>location.href='/admin/user/list';alert('修改成功！');</script>")
                } else {
                    response.send("<script>alert('修改失败！');history.go(-1);</script>")
                }
            }
        })
    } else {
        sql = `update user set user_status = ? where user_id = ?`;
        mysql.query(sql, [user_status, user_id], function (err, data) {
            if (err) {
                console.log(err);
                return "";
            } else {
                if (data.affectedRows == 1) {
                    response.send("<script>location.href='/admin/user/list';alert('修改成功！');</script>")
                } else {
                    response.send("<script>alert('修改失败！');history.go(-1);</script>")
                }
            }
        })
    }

})


module.exports = router;