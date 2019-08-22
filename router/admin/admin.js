let express = require('express');

let router = new express.Router();

const mysql = require('../../config/db');

const crypto = require('crypto');

const moment = require('moment');

//管理员列表页面
router.get('/list',function(request,response,next){
    let search = request.query.search?request.query.search : "";
    //从数据库查询管理员数据
    mysql.query("select * from admin where admin_username like ? order by admin_id desc",[`%${search}%`],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.forEach(item=>{
                item.admin_time = moment(item.admin_time*1000).format("YYYY-MM-DD  HH:mm:ss");
            });
            response.render('admin/admin/list',{data:data,search:search});
        }
    });
});

//管理员添加功能
router.get('/add',function(request,response,next){
    response.render('admin/admin/add');
});

//新增管理员
router.post('/insert',function(request,response,next){
    let {admin_password,admin_repassword,admin_status,admin_username} = request.body;
    if(admin_username){
        //判断用户名
        if(admin_username.length>=6 && admin_username.length<=12){
            //判断密码
            if(admin_password){
                if(admin_password == admin_repassword){
                    //判断用户名是否已经注册
                    mysql.query("select * from admin where admin_username = ?",[admin_username],function(err,data){
                        if(err){
                            console.log(err);
                            return "";
                        }else{
                            if(data.length == 0){
                                //当前时间戳
                                let admin_time = Math.round((new Date().getTime())/1000);
                                //密码md5加密
                                let md5 = crypto.createHash('md5');
                                admin_password = md5.update(admin_password).digest('hex');
                                //插入数据
                                mysql.query("insert into admin (admin_username,admin_password,admin_status,admin_time) value(?,?,?,?)",[admin_username,admin_password,admin_status,admin_time],function(err,data){
                                    if(err) {
                                        console.log(err);
                                        return "";
                                    }else{
                                        if(data.affectedRows == 1){
                                            response.send("<script>alert('添加成功！');location.href='/admin/admin/list';</script>");
                                        }else{
                                            response.send("<script>alert('添加失败！');history.go(-1);</script>");
                                        }
                                    }
                                })
                            }else response.send("<script>alert('该用户名已经被注册,请重新输入！');history.go(-1);</script>");
                        } 
                    });
                }else response.send("<script>alert('输入的两次密码不一致！');history.go(-1);</script>");
            }else response.send("<script>alert('请输入密码！');history.go(-1);</script>");
        }else response.send("<script>alert('请输入6-12位的用户名！');history.go(-1);</script>");
    }else response.send("<script>alert('请输入账户名！');history.go(-1);</script>");
})

//ajax修改管理员状态
router.get('/ajax_status',function(request,response,next){
    let {admin_id,admin_status} = request.query;
    mysql.query("update admin set admin_status = ? where admin_id = ?",[admin_status,admin_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows == 1 ? response.send("1") : response.send("0");
        }
    })
})

//ajax删除管理员
router.get('/ajax_del',function(request,response,next){
    let {admin_id} = request.query;
    mysql.query("delete from admin where admin_id = ?",[admin_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            data.affectedRows == 1 ? response.send("1") : response.send("0");
        }
    })
})

//管理员修改页面
router.get('/edit',function(request,response,next){
    let admin_id = request.query.admin_id;
    mysql.query("select * from admin where admin_id =?",[admin_id],function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            response.render('admin/admin/edit',{data:data[0]}); 
        }
    })
})

//管理员修改操作
router.post('/edit',function(request,response,next){
    let {admin_id,admin_password,admin_repassword,admin_status,admin_username} = request.body;
    //判断用户是否修改密码
    if(admin_password){
        let md5 = crypto.createHash('md5');
        admin_password = md5.update(admin_password).digest('hex');
        sql = `update admin set admin_status = ?,admin_password = ? where admin_id = ?`;
        mysql.query(sql,[admin_status,admin_password,admin_id],function(err,data){
            if(err){
                console.log(err);
                return "";
            }else{
                data.affectedRows == 1 ? response.send("<script>location.href='/admin/admin/list';alert('修改成功！');</script>") : response.send("<script>alert('修改失败！');history.go(-1);</script>");
            }
        });
    }else{
        sql = `update admin set admin_status = ? where admin_id = ?`;
        mysql.query(sql,[admin_status,admin_id],function(err,data){
            if(err){
                console.log(err);
                return "";
            }else{
                data.affectedRows == 1 ? response.send("<script>location.href='/admin/admin/list';alert('修改成功！');</script>") : response.send("<script>alert('修改失败！');history.go(-1);</script>");
            }
        });
    }
    
})

module.exports = router;