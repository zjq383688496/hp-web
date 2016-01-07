"use strict";
//构建各配置项
var global_config={
    defaultEnv:"dist/dev",//默认环境目录
    revSrc:"dist/rev",//默认版本地图目录
    delSrc:"dist"//清除目录地址
};
// var defaultEnv="dist/dev",//默认环境目录
//     revSrc="dist/rev",//默认版本地图目录
//     delSrc="dist",//清除目录地址
//     delCssSrc=defaultEnv+"/css";//清除css空文件目录

function FileConfig(devPath) {
  if(devPath){
    global_config.defaultEnv=devPath;
    global_config.delSrc=devPath;
  }
  var config={
    zipName:"homepage-new.zip",//打包名称
    envs:[
      {id:"dev",name:"开发环境",path:"dist/dev"},//开发环境
      {id:"test",name:"测试环境",path:"dist/test"},//测试环境
      {id:"online",name:"生产环境",path:"dist/online"}//生产环境
    ],//各环境参数
    host:"m.cmall.com",//测试域名地址
    delCssSrc:global_config.defaultEnv+"/css",//清除css空文件目录
    zipSrc:[global_config.defaultEnv+"/*.*",global_config.defaultEnv+"/**/*.*"],//zip打包目录
    seoSrc:["*.txt"],//seo相关配置文件复制
    seoDest:global_config.defaultEnv,//seo相关配置文件复制目标目录
    lessSrc:["less/*.less","less/**/*.less"],//less源文件地址
    lessDest:global_config.defaultEnv+"/css",//less目标文件输出地址
    cssSrc:[global_config.defaultEnv+"/*.css",global_config.defaultEnv+"/**/*.css"],//css源文件地址
    cssSrc1:["*.css","**/*.css","!css/*","!css/**/*","!node_modules/**/*","!dist/*","!dist/**/*","!less/*","!less/**/*"],//css源文件地址
    cssDest:global_config.defaultEnv,//css目标文件输出地址  
    cssMapDest:"./maps",//css map目标文件输出地址
    revCssSrc:[global_config.revSrc+"/**/*.json",global_config.defaultEnv+"/*.css",global_config.defaultEnv+"/**/*.css"],//css rev 版本map填充原地址
    revCssDest:global_config.revSrc+"/css",//版本号map输出地址
    jsSrc:["*.js","**/*.js","!node_modules/**/*","!dist/*","!dist/**/*"],//js源文件地址
    jsDest:global_config.defaultEnv,//js目标文件输出地址
    jsMapDest:"./../maps/js",//js map目标文件输出地址
    revJsDest:global_config.revSrc+"/js",//版本号map输出地址
    revJsSrc:[global_config.revSrc+"/**/*.json",global_config.defaultEnv+"/*.js",global_config.defaultEnv+"/**/*.js"],//js rev 版本map填充原地址
    imgSrc:["*.+(gif|png|jpg|jpeg)","**/*.+(gif|png|jpg|jpeg)","!node_modules/*","!node_modules/**/*","!dist/*","!dist/**/*"],//img源文件地址
    imgDest:global_config.defaultEnv,//img目标文件输出地址
    revImgDest:global_config.revSrc+"/images",//版本号map输出地址
    fontSrc:["font/*.*","!font/*.css","!font/*.html"],//font源文件地址
    fontDest:global_config.defaultEnv+"/font",//font目标文件输出地址
    revFontDest:global_config.revSrc+"/font",//版本号map输出地址
    htmlSrc:["*.html","**/*.html","!node_modules/*","!node_modules/**/*","!dist/*","!dist/**/*"],//html源文件目录
    htmlDest:global_config.defaultEnv,
    revHtmlSrc:[global_config.revSrc+"/**/*.json",global_config.defaultEnv+"/*.html",global_config.defaultEnv+"/**/*.html"],//html rev 版本map填充原地址
  };

  for(var i in global_config){
    config[i]=global_config[i];
  }

  return config;
}

module.exports=FileConfig;
