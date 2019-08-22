const express = require('express');

const router = new express.Router();

const mysql = require('../../config/db');

//分类查看页面
router.get("/",function(request,response,next){
    //加载页面
    let search = request.query.search?request.query.search : "";
    mysql.query("select * from types where types_name like ? order by types_sort desc",[`%${search}%`],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            response.render('admin/types/index',{search:search,data:data});
        }
    });
})

//分类添加页面
router.get("/add",function(request,response,next){
    //加载页面
    response.render('admin/types/add');
})

//ajax分类删除功能
router.get('/ajax_del',function(request,response,next){
    let {types_id} = request.query;
    mysql.query("delete from types where types_id = ?",[types_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            if(data.affectedRows == 1){
                response.send("1");
            }else{
                response.send("0");
            }
        }
    })
})

//ajax修改分类排序
router.get('/ajax_changeSort',function(request,response,next){
    let {types_sort,types_id} = request.query;
    mysql.query("update types set types_sort = ? where types_id = ?",[types_sort,types_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            if(data.affectedRows == 1){
                response.send("1");
            }else{
                response.send("0")
            }
        }
    })
})

//分类修改页面
router.get("/edit",function(request,response,next){
    //加载页面
    let types_id = request.query.types_id;
    mysql.query("select * from types where types_id =?",[types_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            response.render('admin/types/edit',{data:data[0]}); 
        }
    })
})

//分类添加功能
router.post("/add",function(request,response,next){
    let {types_name,types_keywords,types_description,types_sort} = request.body;
    //插入数据库
    mysql.query("insert into types(types_name,types_keywords,types_description,types_sort) value(?,?,?,?)",[types_name,types_keywords,types_description,types_sort],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows == 1 ? response.send("<script>alert('添加成功！');location.href='/admin/types';</script>") : response.send("<script>alert('添加失败！');history.go(-1);</script>");
        }
    })

})

//分类修改功能
router.post("/edit",function(request,response,next){
    let{types_name,types_keywords,types_description,types_sort,types_id} = request.body;
    mysql.query("update types set types_name = ?,types_keywords = ?,types_description = ?,types_sort = ? where types_id = ?",[types_name,types_keywords,types_description,types_sort,types_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows == 1 ? response.send("<script>location.href='/admin/types';alert('修改成功！');</script>") : response.send("<script>alert('修改失败！');history.go(-1);</script>");
        }
    });
})

module.exports = router;