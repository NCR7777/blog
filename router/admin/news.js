const express = require('express');

const router = express.Router();

const multer = require('multer');
const upload = multer({dest: "temp/"});

const moment = require('moment');
const toPages = require('../../common/toPages');

const uploads = require('../../common/uploads');

const fs = require('fs');

const mysql = require('../../config/db');
//加载新闻管理页面
router.get('/', function (request, response, next) {
    //查询数据
    let search = request.query.search ? request.query.search : "";
    let p = request.query.p ? request.query.p : 1;
    let size = 5;

    mysql.query("select count(*) tot from news,types where news.news_cid = types.types_id and news.news_title like ?", [`%${search}%`], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            let tot = data[0].tot;
            let Pages = toPages(tot, p, size, search);
            //查询数据
            mysql.query("select news.*,types.types_name types_name from news,types where news.news_cid = types.types_id and news.news_title like ? order by news.news_id desc limit ?,?", [`%${search}%`, Pages.start, Pages.size], function (err, data) {
                if (err) {
                    console.log(err);
                    return ""
                } else {
                    data.forEach(item => {
                        item.news_time = moment(item.news_time * 1000).format("YYYY-MM-DD HH:mm:ss");
                    });
                    response.render('admin/news/index',
                        {
                            data: data,
                            search: search,
                            show: Pages.show
                        });
                }
            });
        }
    });
});
//加载新闻添加页面
router.get('/add', function (request, response, next) {
    mysql.query("select * from types order by types_sort desc", function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            response.render('admin/news/add', {data: data});
        }
    });
});
//加载新闻修改页面
router.get('/edit', function (request, response, next) {
    //查询新闻分类
    mysql.query("select * from types order by types_sort desc", function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            //查询对应数据
            let news_id = request.query.news_id;
            mysql.query("select * from news where news_id = ?", [news_id], function (err, newsData) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    response.render("admin/news/edit", {data: data, newsData: newsData[0]});
                }
            });
        }
    });
});
//新闻添加功能
router.post('/add', upload.single("news_img"), function (request, response, next) {
    //接收文件
    let imgRes = request.file;
    //接收表单内容
    let {news_title, news_keywords, news_description, news_author, news_cid, news_info, news_text} = request.body;
    let news_num = 0;
    let news_time = Math.round((new Date().getTime()) / 1000);
    //上传图片
    let news_img = uploads(imgRes, "/uploads/news");
    //插入数据
    let sql = "insert into news(news_cid,news_title,news_img,news_time,news_num,news_info,news_author,news_text,news_keywords,news_description) value(?,?,?,?,?,?,?,?,?,?)";
    let arr = [news_cid, news_title, news_img, news_time, news_num, news_info, news_author, news_text, news_keywords, news_description];
    mysql.query(sql, arr, function (err, data) {
        if (err) {
            console.log(err);
            return ""
        } else data.affectedRows == 1 ? response.send("<script>alert('添加成功！');location.href = '/admin/news';</script>") : response.send("<script>alert('修改失败！');history.go(-1);</script>");
    })
});
//新闻管理修改功能
router.post('/edit', upload.single('news_img'), function (request, response, next) {
    let changeImgRes = request.file;
    let {news_title, news_keywords, news_description, news_author, news_cid, news_info, news_id, news_oldImg, news_text} = request.body;
    let sql = "update news set news_title = ?, news_keywords = ?, news_description = ?, news_author = ?, news_cid = ?, news_info = ?, news_img = ?, news_text = ? where news_id = ?";
    let arr = [news_title, news_keywords, news_description, news_author, news_cid, news_info, news_oldImg, news_text, news_id];
    if (changeImgRes) {
        let news_img = uploads(changeImgRes, "/uploads/news");
        arr = [news_title, news_keywords, news_description, news_author, news_cid, news_info, news_img, news_text, news_id];
    }
    mysql.query(sql, arr, function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            if (data.affectedRows == 1) {
                if (changeImgRes) {
                    if (fs.existsSync(__dirname + "/../../" + news_oldImg)) {
                        fs.unlinkSync(__dirname + "/../../" + news_oldImg);
                    }
                }
                response.send("<script>alert('修改成功！');location.href = '/admin/news';</script>");
            } else {
                response.send("<script>alert('修改失败！');history.go(-1);</script>");
            }
        }
    });
});
//ajax新闻删除功能
router.get('/ajax_del',function(request,response,next){
    let news_id = request.query.news_id;
    let news_img = request.query.news_img;
    mysql.query("delete from news where news_id = ?",[news_id],function (err, data) {
        if (err){
            console.log(err);
            return "";
        }else{
            if (data.affectedRows == 1){
                if (fs.existsSync(__dirname + "/../../" + news_img)) {
                    fs.unlinkSync(__dirname + "/../../" + news_img);
                }
                response.send("1");
            }else{
                response.send("0");
            }
        }
    });
});

module.exports = router;