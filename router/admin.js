let express = require('express');

let router = express.Router();

const mysql = require('../config/db');

const crypto = require('crypto');

//监听用户访问地址
router.use(function (request, response, next) {
    //判断url地址
    //是否可以直接访问
    if (request.url != "/login" && request.url != "/check") {
        //判断是否登录
        if (request.session.loginMessageIsAdmin && request.session.loginMessageAdminUsername) {
            next();
        } else {
            response.send("<script>alert('请登录！');location.href = '/admin/login';</script>")
        }
    } else {
        next();
    }
});
//后台登陆页面
router.get('/login', function (request, response, next) {
    response.render('admin/login');
});

//后台登陆处理操作
router.post('/check', function (request, response, next) {
    let {admin_username, admin_password} = request.body;
    if (admin_username) {
        if (admin_password) {
            let md5 = crypto.createHash('md5');
            admin_password = md5.update(admin_password).digest('hex');
            //判断用户是否存在
            mysql.query("select * from admin where admin_username = ? and admin_password = ? and admin_status = 0", [admin_username, admin_password], function (err, data) {
                if (err) {
                    console.log(err);
                    return "";
                } else {
                    if (data.length == 1) {
                        request.session.loginMessageIsAdmin = true;
                        request.session.loginMessageAdminUsername = data[0].admin_username;
                        let username = request.session.loginMessageAdminUsername;
                        response.send("<script>alert('欢迎您！" + username + "');location.href = '/admin/';</script>");
                    } else {
                        response.send("<script>alert('用户名或密码错误！');location.href = '/admin/login';</script>");
                    }
                }
            })
        } else {
            response.send("<script>alert('请输入密码！');location.href = '/admin/login';</script>");
        }
    } else {
        response.send("<script>alert('请输入用户名！');location.href = '/admin/login';</script>");
    }
});
//退出登录
router.get('/logout', function (request, response, next) {
    request.session.loginMessageIsAdmin = false;
    request.session.loginMessageAdminUsername = "";
    response.send("<script>alert('退出成功！');location.href = '/admin/login';</script>");
});
//后台欢迎页面
router.get('/welcome', function (request, response, next) {
    response.render('admin/welcome');
});
//后台首页构建
router.get('/', function (request, response, next) {
    response.render('admin/index');
});
//管理员管理
let adminRouter = require('./admin/admin');
router.use('/admin', adminRouter);
//会员管理
let userRouter = require('./admin/user');
router.use('/user', userRouter);
//轮播图管理
let bannerRouter = require('./admin/slider');
router.use('/slider', bannerRouter);
//系统管理
let systemRouter = require('./admin/system');
router.use('/system', systemRouter);
//新闻类别管理
let newsTypeRouter = require('./admin/newsType');
router.use('/types', newsTypeRouter);
//新闻管理
let newsRouter = require('./admin/news');
router.use('/news', newsRouter);
//评论管理
let commentRouter = require('./admin/comment');
router.use('/comment', commentRouter);

// //栏目管理
// let columnRouter = require('./admin/column');
// router.use('/column',columnRouter);

// //评论管理
// let commentRouter = require('./admin/comment');
// router.use('/comment',commentRouter);

module.exports = router;