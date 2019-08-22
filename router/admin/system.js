let express = require('express');

const fs = require('fs');

const multer = require('multer');

const upload = multer({dest:"temp/"})

const uploads = require('../../common/uploads');

let router = new express.Router();



//系统管理首页
router.get('/',function(request,response,next){
    //读取系统设置
    let fileData = fs.readFileSync(__dirname+"/../../config/webConfig.json");
    let systemData = JSON.parse(fileData.toString());
    //加载页面
    response.render("admin/system/index",{data:systemData});
})

//更改系统设置
router.post('/',upload.single("system_logo"),function(request,response,next){
    let {system_title,system_keywords,system_description,old_system_logo,system_copyright,system_record,system_countCode} = request.body;
    let logoImageRes = request.file;
    let newLogo = "";
    if(logoImageRes){
        newLogo = uploads(logoImageRes,"/uploads");
    }
    //格式化数据
    let data = {
        title:system_title,
        keywords:system_keywords,
        description:system_description,
        copyright:system_copyright,
        record:system_record,
        logo:newLogo ? newLogo : old_system_logo,
        countCode:system_countCode
    };
    //写入json
    fs.writeFileSync(__dirname+"/../../config/webConfig.json",JSON.stringify(data));
    if(logoImageRes){
        if(fs.existsSync(__dirname + "/../../" + old_system_logo)){
            fs.unlinkSync(__dirname + "/../../" + old_system_logo);
        }
    }
    response.send("<script>alert('修改成功！');location.href = '/admin/system'</script>");
})



module.exports = router;