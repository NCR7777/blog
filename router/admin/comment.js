const express = require('express');
const router = express.Router();

const mysql = require('../../config/db');

const moment = require('moment');

const toPages = require('../../common/toPages');

//评论查看页面
router.get('/',function (request, response, next) {
    let search = request.query.search ? request.query.search : "";
    let p = request.query.p ? request.query.p : 1;
    let size = 5;

    mysql.query("select count(*) tot from comment,user,news where comment.user_id = user.user_id and comment.news_id = news.news_id and comment.comment_text like ?",[`%${search}%`],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            let tot = data[0].tot;
            let Pages = toPages(tot, p, size, search);
            mysql.query("select comment.*,user.user_username,news.news_title,news.news_img from comment,user,news where comment.user_id = user.user_id and comment.news_id = news.news_id and comment.comment_text like ? order by comment.comment_id desc limit ?,?",[`%${search}%`,Pages.start,Pages.size],function(err,data){
                if(err){
                    console.log(err);
                    return "";
                }else{
                    data.forEach(item=>{
                        item.comment_time = moment(item.comment_time*1000).format("YYYY-MM-DD HH:mm:ss");
                    });
                    response.render('admin/comment/index',{data:data,search:search,show:Pages.show});
                }
            })
        }
    });
});

//ajax修改评论状态
router.get('/ajax_status',function(request,response,next){
    let {comment_id,comment_status} = request.query;
    mysql.query("update comment set comment_status = ? where comment_id = ?",[comment_status,comment_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows == 1 ? response.send("1") : response.send("0");
        }
    });
})

module.exports = router;