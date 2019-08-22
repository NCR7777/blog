const path = require('path');

const fs = require('fs');

//上传文件方法
function uploads(changeSliderImagesRes,type = ""){
    //获取文件临时目录
    let tempPath = changeSliderImagesRes.path;
    //指定文件上传目录
    let ext = path.extname(changeSliderImagesRes.originalname);
    let newName = "" + (new Date().getTime()) + Math.round(Math.random()*10000) + ext;
    let newPath = type + "/" + newName;
    //文件拷贝
    let fileData = fs.readFileSync(tempPath);
    fs.writeFileSync(__dirname +"/../"+ newPath,fileData);
    return newPath;
}

module.exports = uploads;