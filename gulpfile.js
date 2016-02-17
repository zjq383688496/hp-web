//gulp核心
var gulp=require("gulp"),
//编译less插件
less=require("gulp-less"),
//css压缩插件
cssmin=require("gulp-minify-css"),
//检测css 插件
csslint = require('gulp-csslint'),
//重命名插件 
rename=require("gulp-rename"),
//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
notify = require('gulp-notify'),
//if判断，用来区别生产环境还是开发环境的  //生产环境为true，开发环境为false，默认为true
gulpif  = require('gulp-if'),
//监听异常
plumber = require('gulp-plumber'),
//验证js
jshint = require('gulp-jshint'),
//高亮显示插件
stylish = require('jshint-stylish'),
//合并文件插件
concat = require('gulp-concat'),
//js混淆插件
uglify = require('gulp-uglify'),
//控制task顺序
// runSequence = require('run-sequence'),
runSequence = require('gulp-sequence'),
//文件copy操作
gulpCopy = require('gulp-file-copy'),
//图片文件压缩操作
imagemin = require('gulp-imagemin'),
//html文件压缩
// htmlmin = require('gulp-htmlmin'),
  minifyHtml = require('gulp-minify-html'),
//清除文件插件
clean = require('gulp-clean'),
//gulp zip 打包插件
zip = require('gulp-zip'),
//版本号控制插件 Gulp自动添加版本号
rev = require('gulp-rev'),
revCollector = require('gulp-rev-collector'),
//工程相关配置
FileConfig=require("./fileConfig"),
config=new FileConfig();
//sourcemaps 操作
sourcemaps = require("gulp-sourcemaps"),
//WEB测试服务器
connect = require('gulp-connect'),
//angularjs的处理
ngAnnotate = require('gulp-ng-annotate'),
ngmin = require('gulp-ngmin'),
stripDebug = require('gulp-strip-debug'),

//判断是开发环境还是测试，生产环境
flag=true,
//文件操作
fs = require('fs');

//环境参数配置
// var envs=[
// 	{id:"dev",name:"开发环境",path:"dist/dev"},//开发环境
// 	{id:"test",name:"测试环境",path:"dist/test"},//测试环境
// 	{id:"online",name:"生产环境",path:"dist/online"}//生产环境
// ];

// function compileLess(){
	//console.log("进行less编译");
	//编译less目录下所有less文件，*代表匹配所有以.less结果的文件，**代表包括0个或多个子目录
//	gulp.src(["less/*.less","less/**/*.less"])//编译符合规则的less文件
	// .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//防止watch终止
	// .pipe(less())//进行less编译
	// .pipe(gulp.dest("test/css"))//编译之后的css文件输出目录
	// .pipe(rename({suffix: '.min'}))//输出两份css文件
	// .pipe(cssmin())//输出的min文件进行压缩  //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
	// .pipe(gulp.dest("test/css"));
// }

//Fonts & Images 根据MD5获取版本号
gulp.task("revFont", function(){
  return gulp.src(config.fontSrc)
    .pipe(rev())
    .pipe(gulp.dest(config.fontDest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.revFontDest));
});
// Images 根据MD5获取版本号
gulp.task("revImg", function(){
	// console.log(JSON.stringify(files));
	if(config.defaultEnv==="dist/dev"){
		flag=false;
	}else{
		flag=true;
	}
	console.log("revImg's flag="+flag);
	return gulp.src(config.imgSrc)
    .pipe(gulpif(flag,imagemin()))
    .pipe(rev())
    .pipe(gulp.dest(config.imgDest))//压缩之后的图片文件输出目录
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.revImgDest));
});

//编译less任务
gulp.task("less",function(){
	//console.log("进行less编译");
	//编译less目录下所有less文件，*代表匹配所有以.less结果的文件，**代表包括0个或多个子目录
	return gulp.src(config.lessSrc)//编译符合规则的less文件
	.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//防止watch终止
	.pipe(less())//进行less编译
	.pipe(gulp.dest(config.lessDest));//编译之后的css文件输出目录
});

//检测CSS
gulp.task('csslint', function(){
  // return gulp.src(config.cssSrc)
  //   .pipe(csslint())
  //   .pipe(csslint.reporter())
  //   .pipe(csslint.failReporter());
});

//样式复制任务  （考虑其它文件夹下有可能存在样式文件）
gulp.task("csscp",function(){
	return gulp.src(config.cssSrc1)
	.pipe(gulp.dest(config.cssDest));
});

//压缩css任务
gulp.task("cssmin",function(){
	console.log("cssmin config.defaultEnv="+config.defaultEnv);
	if(config.defaultEnv==="dist/dev"){
		flag=false;
	}else{
		flag=true;
	}
	console.log("cssmin's flag="+flag);
	return gulp.src(config.cssSrc)
	.pipe(sourcemaps.init())//sourcemaps 初始化
	.pipe(gulpif(flag,cssmin()))//输出的min文件进行压缩  //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
	.pipe(sourcemaps.write("."))//在当前目录生成map文件 
	.pipe(rev())//生成相关版本号
	.pipe(gulp.dest(config.cssDest))//压缩之后的css文件输出目录
	.pipe(rev.manifest())//生成版本号地图
    .pipe(gulp.dest(config.revCssDest));
});


//删除less编译之后内容为空的文件
gulp.task("delCssEmpty",function(){
	console.log("开始清除内容为空的文件...");
	return delEmptyFile(config.delCssSrc);//清除压缩之后文件内容为0的文件
});

//CSS里更新引入文件版本号
gulp.task('revCollectorCss', function () {
  return gulp.src(config.revCssSrc)
    .pipe(revCollector())
    .pipe(gulp.dest(config.cssDest));
});

//验证js
gulp.task("jshint",function(){
	 return gulp.src(config.jsSrc) //检测JS风格
    // .pipe(jshint({"undef": false,"unused": false}))
    // .pipe(jshint.reporter('default'))  //错误默认提示
    // .pipe(jshint.reporter(stylish))   //高亮提示
    .pipe(jshint.reporter('fail'));
});
//压缩js任务  /生成版本号
gulp.task("jsmin",function(){
	console.log("jsmin config.defaultEnv="+config.defaultEnv);
	if(config.defaultEnv==="dist/dev"){
		flag=false;
	}else{
		flag=true;
	}
	console.log("jsmin's flag="+flag);
	return gulp.src(config.jsSrc)
	.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//防止watch终止
	.pipe(sourcemaps.init())//sourcemaps 初始化
	// .pipe(ngAnnotate())
 //        .pipe(ngmin({dynamic: false}))  
        // .pipe(stripDebug())
	.pipe(gulpif(flag,uglify({mangle:false})))//mangle 跳过需要编译的参数
	.pipe(sourcemaps.write("."))//在当前目录生成map文件 
	.pipe(rev())
	.pipe(gulp.dest(config.jsDest))//压缩之后的js文件输出目录
	.pipe(rev.manifest())
    .pipe(gulp.dest(config.revJsDest));
});

//jS里更新引入文件版本号
gulp.task("revCollectorJs", function () {
  return gulp.src(config.revJsSrc)
    .pipe(revCollector())
    .pipe(gulp.dest(config.jsDest));
});

//压缩html任务
gulp.task("htmlmin", function() {
	console.log("htmlmin config.defaultEnv="+config.defaultEnv);
	if(config.defaultEnv==="dist/dev"){
		flag=false;
	}else{
		flag=true;
	}
	console.log("htmlmin's flag="+flag);
    return gulp.src(config.htmlSrc)
    .pipe(gulpif(flag,minifyHtml({empty:true})))
    // .pipe(revCollector())
    .pipe(gulp.dest(config.htmlDest));
    // gulp.src(["module/**/*.html","module/*.html"])
    // .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(gulp.dest("dist/dev/module"));
    // gulp.src(["page/**/*.html","page/*.html"])
    // .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(gulp.dest("dist/dev/page"));
});

//CSS里更新引入文件版本号
gulp.task('revCollectorHtml', function () {
  return gulp.src(config.revHtmlSrc)
    .pipe(revCollector())
    .pipe(gulp.dest(config.htmlDest));
});

//清除空文件任务
gulp.task("clean",function(){
	// delEmptyFile("dist/dev/css");	
	console.log("清除dist文件目录...");
    return gulp.src(config.delSrc)
    .pipe(clean({force: true}));//force 强制删除
});


//增加seo文件处理任务
gulp.task("seo",function(){
	// delEmptyFile("dist/dev/css");	
	console.log("seo配置文件复制任务...");
    return gulp.src(config.seoSrc)
    .pipe(gulp.dest(config.seoDest));
});

//监听less 任务
gulp.task("watch",function(){
	console.log("启动less监听！");
	// gulp.watch(["less/*.less","less/**/*.less"],["less"]);
	gulp.watch(config.lessSrc,["less"]);
	console.log("启动img监听！");
	gulp.watch(config.imgSrc,["revImg"]);
	console.log("启动font监听！");
	gulp.watch(config.fontSrc,["revFont"]);
	console.log("启动js监听！");
	gulp.watch(config.jsSrc,["jsmin"]);
	console.log("启动css监听！");
	gulp.watch(config.cssSrc1,["csscp","cssmin"]);
	console.log("启动html监听！");
	return gulp.watch(config.htmlSrc,["htmlmin"]);
	// return  gulp.watch("./../**/*",["reload-dev"]);
});

// //拷贝图片文件
// gulp.task('imagemin', function(){
//     return gulp.src(["images/*.*","images/**/*.*"])
//         .pipe(imagemin())
//         .pipe(gulp.dest("dist/dev/images"));//压缩之后的图片文件输出目录
// });
// //拷贝字体文件
// gulp.task('fonts', function(){
//     return gulp.src(["font/*.*","!font/*.css","!font/*.html"])
//         .pipe(gulp.dest("dist/dev/font"));//压缩之后的图片文件输出目录
// });

gulp.task("cleanRev",function(){
	console.log("清除版本地图目录dist/rev文件目录...");
	return gulp.src(config.revSrc)
	 .pipe(clean({force: true}));//force 强制删除
});


//默认任务执行  gulp  不用带任何参数
gulp.task("default",function(cb){
	gulp.start("help");
	// console.log("default"+cb);
	//return runSequence("clean","less",["revFont","revImg","jshint","csslint"],["cssmin","jsmin","htmlmin"],["revCollectorCss","revCollectorJs","revCollectorHtml"],"delCssEmpty","cpEnvs");
});

//编译各环境
gulp.task("build",function(cb){
	var sequence=[];
	for(var i in config.envs){
		var env=config.envs[i];
		var name=env.name,path=env.path,id=env.id;
		// if(path!==config.defaultEnv){
			console.log("正在编译"+name+"相关内容，路径为"+path);
			// gulp.src(config.zipSrc)
        	// .pipe(gulp.dest(path));//压缩之后的图片文件输出目录
        	// gulp.start(id);
        	sequence.push(id);
    		// gulp.start(id);
    	// }
    }
    sequence.push(cb);
    //return runSequence("dev","test","online");
    return runSequence.apply([],sequence);
});


//语言版本发布任务
gulp.task("lang",function(cb){
	console.log("语言包发布任务");
	// for(var i in config.langs){
		// var lang=config.langs[i];
		var lang={code:"US",name:"英语"};
		// if(lang.code!=="CN"){
			console.log("正在发布语种'"+lang.name+"'的文件到"+config.langHtmlDest+"/"+lang.code+"......");
		return	gulp.src(config.langHtmlSrc).pipe(gulp.dest(config.langHtmlDest+"/"+lang.code));
		// }
	// }
});

//生产环境打包
gulp.task("online",function(cb){
	// gulp.start(["help","less","watch"]);
	// console.log("default"+cb);
	console.log("生产环境打包！");
	config=new FileConfig("dist/online");
	return runSequence("gulp","clean","csscp","less","delCssEmpty",["revFont","revImg","jshint","csslint"],["revCollectorCss"],["cssmin"],"jsmin","revCollectorJs",["htmlmin"],["revCollectorHtml"],"seo","lang","zip","cleanRev")(cb);
});

//测试环境打包
gulp.task("test",function(cb){
	// gulp.start(["help","less","watch"]);
	// console.log("default"+cb);
	// config.defaultEnv="dist/test";
	console.log("测试环境打包！");
	config=new FileConfig("dist/test")
	return runSequence("gulp","clean","csscp","less","delCssEmpty",["revFont","revImg","jshint","csslint"],["revCollectorCss"],["cssmin"],"jsmin","revCollectorJs",["htmlmin"],["revCollectorHtml"],"seo","lang","zip","cleanRev")(cb);
});

//开发环境打包
gulp.task("dev",function(cb){
	// gulp.start(["help","less","watch"]);
	// console.log("default"+cb);
	console.log("开发环境打包！");
	config=new FileConfig("dist/dev")
	return runSequence("gulp","clean","csscp","less","delCssEmpty",["revFont","revImg","jshint","csslint"],["revCollectorCss"],["cssmin"],"jsmin","revCollectorJs",["htmlmin"],["revCollectorHtml"],"seo","lang","zip","cleanRev")(cb);
});

//打包
gulp.task("zip",function(){
	return gulp.src(config.zipSrc)
		.pipe(zip(config.zipName))
		.pipe(gulp.dest(config.defaultEnv)); 
});

//gulp 参数配置 
gulp.task("gulp",function(){
	gulp.src("gulp/gulp-rev-index.js").pipe(rename("index.js")).pipe(gulp.dest("node_modules/gulp-rev"));
	gulp.src("gulp/gulp-rev-rev-path-index.js").pipe(rename("index.js")).pipe(gulp.dest("node_modules/gulp-rev/node_modules/rev-path"));
	gulp.src("gulp/gulp-rev-collector-index.js").pipe(rename("index.js")).pipe(gulp.dest("node_modules/gulp-rev-collector"));
});

// gulp.task("live",["connectDev","watch"]);

// //server
// gulp.task('connectDev', function() {
//     connect.server({
//         root: config.host,
//         port: 80,
//         livereload: true
//     });
// });
 
// //reload server
// gulp.task('reload-dev',function() {
// 	runSequence("less",["revFont","revImg","jshint","csslint"],["cssmin","jsmin","htmlmin"],["revCollectorCss","revCollectorJs","revCollectorHtml"],"delCssEmpty");
//     gulp.src('./../**/*.*')
//       .pipe(connect.reload());
// });

// 说明
gulp.task("help",function () {
  console.log("	gulp help			gulp参数说明");
  console.log("	gulp revFont			建立字体文件版本map");
  console.log("	gulp revImg			建立图片文件版本map");
  console.log("	gulp ccscp			css 文件复制任务，防止其它目录有漏掉相关css文件");
  console.log("	gulp less			less文件编译为css文件");
  console.log("	gulp delCssEmpty		清除css目录中的空文件");
  console.log("	gulp csslint			检查css文件");
  console.log("	gulp cssmin			压缩css文件");
  console.log("	gulp revCollectorCss		将css文件中的地址增加版本号");
  console.log("	gulp jshint			js文件检查");
  console.log("	gulp jsmin			js文件压缩");
  console.log("	gulp revCollectorJs		将js文件中的地址增加版本号");
  console.log("	gulp htmlmin			压缩html文件并在资源文件地址增加版本号");
  console.log("	gulp seo			seo配置文件复制任务");
  console.log("	gulp clean			清理文件目录");
  console.log("	gulp gulp			替换修改过的插件内容");
  // console.log("	gulp cpEnvs			多环境复制");
  console.log("	gulp watch			文件监控打包(包括less,js,css,img,font,html的监控)");
  console.log("	gulp lang			语言包发布任务");
  console.log("	gulp zip			文件打包");
  // console.log("	gulp server			测试server");
  console.log("	gulp online			生产环境打包");
  console.log("	gulp test			测试环境打包");
  console.log("	gulp dev			开发环境打包（默认开发环境）");
  // console.log("	gulp -m <module>			部分模块打包（默认全部打包）");

});

//删除空文件
function delEmptyFile(){
	if(arguments.length>0){
		if(arguments.length==1&&Object.prototype.toString.call(arguments[0]) === '[object Array]'){
			var tempArgu=arguments[0];
			for(var i=0;i<tempArgu.length;i++){
				try{
					var filenames=fs.readdirSync(tempArgu[i]);
					if(filenames&&filenames.length>0){
						var length=filenames.length;
						for(var j=0;j<length;j++){
							var filename=tempArgu[i]+"/"+filenames[j];
							if(fs.statSync(filename).isDirectory()) { // 判断是否是文件夹
								delEmptyFile(filename);
								var files=fs.readdirSync(filename);
								if(!files||files.length<1){
									fs.rmdirSync(filename);//如果文件夹下无文件则删除文件夹
								}
							}else{
								var content=fs.readFileSync(filename,'utf-8');
								// console.log(filename+"的文件内容为="+content);
								if(content.length<1){
									console.warn("删除"+filename);
									fs.unlinkSync(filename);
								}
							}
						}					
					}
				}catch(e){
					console.error(e);
					// delEmptyFile(arguments[0]);
				}
			}
		}else{
			for(var i=0;i<arguments.length;i++){
				try{
					var filenames=fs.readdirSync(arguments[i]);
					if(filenames&&filenames.length>0){
						var length=filenames.length;
						for(var j=0;j<length;j++){
							var filename=arguments[i]+"/"+filenames[j];
							if(fs.statSync(filename).isDirectory()) {  // 判断是否是文件夹
								delEmptyFile(filename);
								var files=fs.readdirSync(filename);
								if(!files||files.length<1){
									fs.rmdirSync(filename);//如果文件夹下无文件则删除文件夹
								}					
							}else{
								var content=fs.readFileSync(filename,'utf-8');
								// console.log(filename+"的文件内容为="+content);
								if(content.length<1){
									console.warn("删除"+filename);
									fs.unlinkSync(filename);
								}
							}
						}					
					}					
				}catch(e){
					console.error(e);
					// delEmptyFile(arguments[0]);
				}
			}
		}
	}else{
		console.warn("请输入需要删除文件的地址");
	}
}