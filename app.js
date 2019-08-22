const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const ueditor = require('ueditor');

const session = require('express-session');

const ejs = require('ejs');

const path = require('path');

//注册session
app.use(
    session(
        {
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }
    )
)

app.use(bodyParser.urlencoded({extended: false}));
//设置模板引擎

//设置模板存放目录
app.set("views", './views');

//定义使用的模板引擎
app.engine("html", ejs.__express);

//在app中注册模板引擎
app.set("view engine", "html");

//设置静态资源的访问
app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/images", express.static(__dirname + "/images"));

//包含前台路由文件
let indexRouter = require('./router/index.js');
let adminRouter = require('./router/admin.js');

//富文本编辑器
app.use("/public/editor/ueditors", ueditor(path.join(__dirname, ''), function (request, response, next) {
    if (request.query.action === 'uploadimage') {
        // let foo = request.ueditor;
        // console.log(foo.filename); // exp.png
        // console.log(foo.encoding); // 7bit
        // console.log(foo.mimetype); // image/png
        let img_url = '/images/uEditor';//图片保存路径
        response.ue_up(img_url);
        response.setHeader("Content-Type", "text/html")
    } else if (request.query.action === 'listimage') {
        let dir_url = '/images/uEditor';//图片读取路径
        response.ue_list(dir_url)
    } else {
        response.setHeader('Content-Type', 'application/json');
        response.redirect('/public/editor/php/config.json')//ueditor的config.json路径
    }
}));

// app.post("/api/ueditor",function(request,response){//富文本编辑器提交请求接口
//     console.log(request.body);
// });

//使用前台路由
app.use('/', indexRouter);

app.use('/admin', adminRouter);

//监听服务器
app.listen(8888, function () {
    console.log('node服务已启动，端口8888!');
});