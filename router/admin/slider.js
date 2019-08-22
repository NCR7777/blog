let express = require('express');

let router = new express.Router();

const path = require('path');

const multer = require('multer');

const upload = multer({dest:"temp/slider/"})

const fs = require('fs');

const mysql = require('../../config/db');

const uploads = require('../../common/uploads');

//轮播图管理路由


//轮播图首页
router.get('/list',function(request,response,next){
    //查询数据
    let search = request.query.search?request.query.search : "";
    mysql.query("select * from slider where slider_name like ? order by slider_sort desc",[`%${search}%`],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            response.render('admin/slider/list',{search:search,data:data});
        }
    });
})

//轮播图添加页
router.get('/add',function(request,response,next){
    response.render('admin/slider/add');
})

//轮播图添加功能
router.post('/add',upload.single("slider_img"),function(request,response,next){
    let {slider_name,slider_url,slider_sort} = request.body;
    let sliderImagesRes = request.file;
    //获取文件临时目录
    let tempPath = sliderImagesRes.path;
    //指定文件上传目录
    let ext = path.extname(sliderImagesRes.originalname);
    let newName = "" + (new Date().getTime()) + Math.round(Math.random()*10000) + ext;
    let newPath = "/uploads/slider/" + newName;
    //文件拷贝
    let fileData = fs.readFileSync(tempPath);
    fs.writeFileSync(__dirname +"/../../"+ newPath,fileData);
    //插入数据
    mysql.query("insert into slider(slider_name,slider_url,slider_sort,slider_img) value(?,?,?,?)",[slider_name,slider_url,slider_sort,newPath],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows ==1 ? response.send("<script>alert('上传成功！');location.href='/admin/slider/list';</script>") : response.send("<script>alert('上传失败！');history.go(-1);</script>");
        }
    })

})


//轮播图修改页
router.get('/edit',function(request,response,next){
    let slider_id = request.query.slider_id;
    mysql.query("select * from slider where slider_id =?",[slider_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            response.render('admin/slider/edit',{data:data[0]});
        }
    })
})


//轮播图修改功能
router.post("/edit",upload.single("slider_img"),function(request,response,next){
    //接收图片
    let changeSliderImagesRes = request.file;
    //接收表单数据
    let {slider_id,slider_name,slider_url,slider_sort,old_slider_img} = request.body;
    //判断图片是否存在
    let sql = "";
    let arr = [];
    if(changeSliderImagesRes){
        //上传图片
        let slider_img = uploads(changeSliderImagesRes,"/uploads/slider");
        sql = "update slider set slider_name = ?,slider_url = ?,slider_sort = ?,slider_img=? where slider_id = ?";
        arr = [slider_name,slider_url,slider_sort,slider_img,slider_id];
    }else{
        sql = "update slider set slider_name = ?,slider_url = ?,slider_sort = ? where slider_id = ?";
        arr = [slider_name,slider_url,slider_sort,slider_id];
    }
    mysql.query(sql,arr,function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            if(data.affectedRows == 1){
                //判断图片是否修改
                if(changeSliderImagesRes){
                    if(fs.existsSync(__dirname + "/../../" + old_slider_img)){
                        fs.unlinkSync(__dirname + "/../../" + old_slider_img);
                    }
                }
                response.send("<script>alert('修改成功！');location.href = '/admin/slider/list';</script>");
            }else response.send("<script>alert('修改失败！');history.go(-1);</script>");
        }
    })
})


//ajax轮播图删除功能
router.get('/ajax_del',function(request,response,next){
    let {slider_id,slider_img} = request.query;
    mysql.query("delete from slider where slider_id = ?",[slider_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            if(data.affectedRows == 1){
                if(fs.existsSync(__dirname+"/../../"+slider_img)){
                fs.unlinkSync(__dirname+"/../../"+slider_img);
                };
                response.send("1");
            }else{
                response.send("0");
            }
        }
    })
})

//ajax修改轮播图排序
router.get('/ajax_changeSort',function(request,response,next){
    let {slider_sort,slider_id} = request.query;
    mysql.query("update slider set slider_sort = ? where slider_id = ?",[slider_sort,slider_id],function(err,data){
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





module.exports = router;