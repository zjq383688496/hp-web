var HOST_URL = ArtJS.server.art;
var ajax_href="http://xyz.wireless-world.cn/xyz/";
var storage = window.localStorage;

var emailms = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,         //邮件格式验证
    isMobile = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/,                          //电话号码格式010-12345678
    isPhone = /^1[3|4|5|7|8][0-9]\d{8}$/,                                                        //手机号码格式13900000000
    isWeburl = /^http:\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,      //验证网址
    isnumb = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,  //验证数字类型
    isQQ = /^[1-9]\d{4,9}$/;   

$.fn.extend({
    //百分比
    removeitem: function (options) {
        var that = this,
            el=$(that),
            dd=el.find(".delete-dd"),
            sibDd=el.siblings("li").find(".delete-dd"),
            _delete=el.find(".delete-btn");
        that.options = {
            callback: function () { },                   //自定义回调函数
            removeI:function(e){
                e.stopPropagation();
                dd.css({"-webkit-transform":"translateX(-100%)"});
                setTimeout(function(){
                    el.slideUp(100,function(){
                        el.remove();
                    });
                },200);
            }
        };
        for (var i in options) {
            that.options[i] = options[i];
        }
        var opt=that.options;
        
        var x=0,
            endx=0;
        dd.on("vmousedown",function(e){
            x=e.pageX;
            dd.addClass("animatenone");
        }).on("vmouseup",function(){
            dd.removeClass("animatenone");
            if(endx>=30){
                endx=65;
            }else{
                endx=0;
            }
            setX(-endx);
        }).on("vmousemove",function(e){
            var mx=e.pageX;
            endx=x-mx;
            if(endx>=0&&endx<=65){
                setX(-endx);
            }
        }).on("tap",function(e){
            setX(0);
            e.stopPropagation();
        });
        $("body").on("tap",function(){
            setX(0);
        });
        function setX(sx){
            sibDd.css({"-webkit-transform":"translateX(0px)"});
            dd.css({"-webkit-transform":"translateX("+sx+"px)"});
        }
        opt.callback(opt);
        return opt;
    },
    alertTips: function (options) {
        var that = this;
        that.options = {
            titles:null,
            speed:3000,
            closeback:function(){}
        };
        for (var i in options) {
            that.options[i] = options[i];
        }
        var opt=that.options;
        var panle=$('<div class="alert-tips">'+opt.titles+'</div>');
        $(that).append(panle);
        panle.css({
            "margin-left":-(panle.outerWidth()/2)+"px",
            "margin-top":-(panle.outerHeight()/2+50)+"px"
        });
        panle.animate({
            "opacity":1,
            "margin-top":-(panle.outerHeight()/2)+"px"
        },function(){
            setTimeout(function(){
                panle.animate({
                    "opacity":0,
                    "margin-top":-(panle.outerHeight()/2-50)+"px"
                },function(){
                    panle.remove();
                    if(opt.closeback) opt.closeback();
                });
            },opt.speed);
        });
    },
    //弹出层
    pop: function (options) {
        var that = this;
        that.options = {
            wrapper:null,
            w:null,
            title:null,
            classn:"",
            content: null,
            button:null,
            resize:function(){},
            callback: function () { },                   //自定义回调函数
            close: function () { },
            closeback:function(){}
        };
        for (var i in options) {
            that.options[i] = options[i];
        }
        var opt=that.options,
            /*弹出层 - 添加图片*/
            pop=$('<div class="tk_box">'+
                '<div class="tk_frameBox">'+
                    '<span id="quit" class="title_close"></span>'+
                    '<div class="frame_content">'+
                        '<h2 class="title">'+(opt.title==null?'&nbsp;':opt.title)+'</h2>'+
                        '<div class="pop-conter '+opt.classn+'"></div>'+
                    '</div>'+
                '</div>'+
            '</div>'),
            /*end弹出层*/
            pop_panle=pop.find(".tk_frameBox"),
            pop_conter=pop_panle.find(".pop-conter"),
            close=pop_panle.find(".title_close"),
            closeStar=false;
        if(opt.w!=null){
            pop_panle.width(opt.w);
        }
        pop_conter.append(opt.content);
        if(opt.button!=null){
            $.each(opt.button,function(i,item){
                var but=$('<a class="btn '+i+'">'+item.name+'</a>');
                
                pop_conter.append(but);
                if(item.callback) item.callback(opt,pop);
            });
        }
        opt.close=function() {
            if(closeStar){
                pop.addClass("animate");
                setTimeout(function(){
                    pop.remove();
                    if(opt.closeback) {opt.closeback();}
                },600);
            }
        }
        close.click(function () {
            opt.close();
        });
        if(opt.wrapper!=null){
            $(opt.wrapper).append(pop);
        }else{
            $("body").append(pop);
        }
        pop.click(function(){
            opt.close();
        });
        opt.resize=function(){
            pop_panle.css({"margin-top":-pop_panle.outerHeight()/2,"margin-left":-pop_panle.outerWidth()/2});
            pop.animate({"opacity":1},function(){
                closeStar=true;
            });
        }
        pop.show(function(){
            opt.resize();
        });
        
        pop_panle.click(function(e){
            e.stopPropagation();
        });
        return opt;
    },
    //加载图片
    loadImage: function (options) {
        var that = this;
        that.options = {
            url: undefined,
            callback: function () { },                   //自定义回调函数
            errors:function() { }
        };
        for (var i in options) {
            that.options[i] = options[i];
        }

        var img = new Image();                          //创建一个Image对象，实现图片的预下载
        img.src = that.options.url == undefined ? that.attr("src") : that.options.url;
        
        if (img.src == undefined) {
            that.options.callback(that, img);
        } else {
            if (img.complete) {                             //如果图片已经存在于浏览器缓存，直接调用回调函数
                that.options.callback(that, img);
                return;                                     //直接返回，不用再处理onload事件
            }
            img.onload = function () {                      //图片下载完毕时异步调用callback函数。
                that.options.callback(that, img);           //将回调函数的this替换为Image对象
            };
            img.onerror = function () {                      //图片下载错误时异步调用callback函数。
                that.options.errors(that, img);           //将回调函数的this替换为Image对象
            };
        }
    },
    //轮播
    settranslate: function (options) {
        var that = this,
            panle = $(this);
        that.options = {
            nav: null,
            active: null,
            next: null,
            prev: null,
            active_nav: null,
            tranX: 0,
            tran_next_X: 0,
            tran_prev_X: 0,
            speed: 3000,
            interval: true,
            refresh: function (e) {
                opt.nav.find("li").remove();
                panle.find('li').each(function (i) {
                    var that = $(this),
                        li = $('<li/>');
                    if (i == 0) {
                        that.addClass("active")
                        li.addClass("active");
                    }
                    opt.nav.append(li);
                });
                opt.nav.css("margin-left",-opt.nav.outerWidth()/2);
            }
        }
        var reg = /\-?[0-9]+\.?[0-9]*/g;

        for (var i in options) {
            this.options[i] = options[i];
        }
        var opt = that.options,
            set_Ints = null,
            vmouse = false,
            starX = 0;
        opt.refresh();

        opt.tranX = 0;
        opt.tran_next_X = panle.width();
        opt.tran_prev_X = -panle.width();
        var active_left = 0,
            prev_left = 0,
            next_left = 0,
            mX,
            intm = true;

        $(window).resize(function () {
            setIntsSile();
            panle.height(panle.find('li.active').height());
        }).resize();

        panle.unbind();
        panle.find('li').removeAttr("style");
        panle.on("touchstart", function () {              //手势移上
            if (panle.find('li').length >= 2) {
                clearInterval(set_Ints);
                getItem();
                starX = event.targetTouches[0].pageX;
                active_left = 0;
                prev_left = -panle.width();
                next_left = panle.width();
                vmouse = true;
                mX = 0;
            }
        }).on("touchend", function () {                   //手势移出
            if (panle.find('li').length >= 2) {
                setIntsSile();
                var max_left = panle.width() / 5,
                    type = undefined;
                if (mX <= -max_left) {
                    getX(-panle.width(), 0, panle.width());
                    type = 'next';
                } else if (mX >= max_left) {
                    getX(panle.width(), -panle.width(), 0);
                    type = 'prev';
                } else {
                    opt.tranX = 0;
                    opt.tran_prev_X = -panle.width();
                    opt.tran_next_X = panle.width();
                }
                if (intm == true) {
                    set(type, true);
                }
                vmouse = false;
            }
        }).on("touchmove", function (e) {                  //手势中
            if (vmouse == true && intm == true && panle.find('li').length >= 2) {
                mX = (event.targetTouches[0].pageX - starX);
                var min_move = 5;
                if (mX > min_move || mX < -min_move) {
                    event.preventDefault();
                }
                getX(mX + active_left, mX + next_left, mX + prev_left);
                set();
            }
        });
        //定义自动轮播的方法
        function setIntsSile() {
            if (panle.find('li').length >= 2) {
                clearInterval(set_Ints);
                if (opt.interval == true) {
                    set_Ints = setInterval(function () {
                        getItem();
                        getX(0, panle.width(), panle.width());
                        set();
                        getItem();
                        getX(-panle.width(), 0, panle.width());
                        set("next", true);
                    }, opt.speed);
                }
            }
        }
        //定义获得active，next，prev的项
        function getItem() {
            opt.active = panle.find('li.active');
            opt.active_nav = opt.nav.find('li.active');
            if (panle.find('li').length == 2) {
                if (opt.tranX < 0) {
                    opt.prev = undefined;
                    opt.next = opt.active.next('li');
                    if (opt.next.length <= 0) {
                        opt.next = opt.active.prev('li');
                    }
                } else if (opt.tranX > 0) {
                    opt.next = undefined;
                    opt.prev = opt.active.prev('li');
                    if (opt.prev.length <= 0) {
                        opt.prev = opt.active.next('li');
                    }
                }
            } else {
                opt.next = opt.active.next('li');
                opt.prev = opt.active.prev('li');
                if (opt.next.length <= 0) {
                    opt.next = panle.find('li').eq(0);
                }
                if (opt.prev.length <= 0) {
                    opt.prev = panle.find('li:last-child');
                }
            }
        }
        //定义赋值当前，下一个，上一个坐标
        function getX(x, nx, px) {
            opt.tranX = x;
            opt.tran_next_X = nx;
            opt.tran_prev_X = px;
        }
        function set(type, animate_s) {
            getItem();
            if (intm == true && animate_s == true) {
                intm = false;
                opt.active.addClass('transition05');
                if (type == "next" && opt.next != undefined) {
                    opt.active.removeClass('active');
                    opt.next.addClass('active transition05');
                    opt.active_nav.removeClass("active");
                    opt.nav.find('li').eq(opt.next.index()).addClass("active");
                } else if (type == "prev" && opt.prev != undefined) {
                    opt.active.removeClass('active');
                    opt.prev.addClass('active transition05');
                    opt.active_nav.removeClass("active");
                    opt.nav.find('li').eq(opt.prev.index()).addClass("active");
                } else {
                    if (opt.next != undefined) opt.next.addClass('transition05');
                    if (opt.prev != undefined) opt.prev.addClass('transition05');
                }
                setTimeout(function () {
                    panle.find('li').removeClass('transition05');
                    opt.active.siblings("li").removeAttr("style");
                    panle.height(opt.active.height());
                    intm = true;
                }, 500);
            }
            opt.active[0].style['-webkit-transform'] = 'translate3d(' + opt.tranX + 'px,0,0)';
            if (opt.next != undefined) {
                opt.next[0].style['-webkit-transform'] = 'translate3d(' + opt.tran_next_X + 'px,0,0)';
            }
            if (opt.prev != undefined) {
                opt.prev[0].style['-webkit-transform'] = 'translate3d(' + opt.tran_prev_X + 'px,0,0)';
            }
        }
        return that.options;
    },
    //判断不能为空
    verifyNull: function (num) {
        if ($(this).val() == "") {
            return true;
        } else {
            return false;
        }
    },
    verifyEmail: function () {
        if (!emailms.test($(this).val()) && $(this).val() != "") {
            return true;
        } else {
            return false;
        }
    },
    verifyMobile: function (val) {
        if (val == undefined) {
            val = $(this).val();
        }
        if (!isMobile.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    verifyPhone: function () {
        if (!isPhone.test($(this).val()) && $(this).val() != "") {
            return true;
        } else {
            return false;
        }
    },
    verifyPhoneOrMobile: function () {
        if (isPhone.test($(this).val()) || isMobile.test($(this).val())) {
            return false;
        }
        else {
            return true;
        }
    },
    verifyWeburl: function () {
        if (isWeburl.test($(this).val())) {
            return true;
        } else {
            return false;
        }
    },
    verifyQQ: function () {
        if (!isQQ.test($(this).val()) && $(this).val() != "") {
        } else {
            return false;
        }
    },
    verifyIsnumb: function (num) {
        if (!isnumb.test($(this).val()) && $(this).val() != "") {
            return true;
        } else {
            return false;
        }
    },
    verifyIDcard: function () {
        var idcard = $(this).val().toString();
        //var Errors=new Array("验证通过!","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
        var Errors = new Array(false, true, true, true, true);
        var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
        var idcard, Y, JYM;
        var S, M;
        var idcard_array = new Array();
        idcard_array = idcard.split("");
        //地区检验
        if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
        //身份号码位数及格式检验
        switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                }
                if (ereg.test(idcard)) return Errors[0];
                else return Errors[2];
                break;
            case 18:
                //18 位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard)) {//测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                        + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y, 1);//判断校验位
                    if (M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                    else return Errors[3];
                }
                else return Errors[2];
                break;
            default:
                return Errors[1];
                break;
        }
    },
    //护照格式不正确
    verifyPassport: function () {
        var cid = $(this).val();
        var Expression = /^[a-zA-Z0-9]{3,21}$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(cid) == true) {
            return false;
        } else {
            return true;
        }
    },
    //驾驶证格式不正确
    verifylicense: function () {
        var cid = $(this).val();
        var Expression = /(\d{15})$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(cid) == true) {
            return false;
        } else {
            return true;
        }
    },
    //上传图片
    fileUp:function(options) {
        var that = this,
            panle = $(this),
            ajaxUrl='http://upload.qiniu.com/';

        if(window.location.href.indexOf("https")>=0){
            ajaxUrl='https://up.qbox.me/';
        }
        that.options = {
            type:"image",//上传类型，image图片类型， video视频类型
            gifType:true,
            ajaxUrl:ajaxUrl,
            maxSize:null,
            fload:function(){},
            ferror:function(){},
            progress:function(){}
        }
        for (var i in options) {
            this.options[i] = options[i];
        }
        var opt=that.options,
            fileObj = that[0]; // 获取文件对象
        var suppotFile = [ 'jpg','bmp','png','jpeg','tiff'];//'gif',

        if(opt.type=='video'){
            suppotFile = [ 'mp4','3gp'];
        }
        if(opt.ajaxUrl==null){
            $("body").alertTips({
                titles: LANGUAGE_NOW.withdraw.UploadAddressNull,
                speed:2000
            });
            return;
        }
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac){
            opt.maxSize=opt.maxSize*1000*1000;
        }
        if (isWin){
            opt.maxSize=opt.maxSize*1024*1024;
        }
        
        if(fileObj!=undefined){
            var verification=true;
            $.each(that[0].files,function(i,item){
                var fileType = (item.name.substring(item.name.lastIndexOf(".") + 1,item.name.length)).toLowerCase();
                var titps;

                if($.inArray(fileType,suppotFile)<0){
                    titps=LANGUAGE_NOW.withdraw.FiletypeNull+suppotFile.join(",")+LANGUAGE_NOW.title.format;
                    verification=false;
                }else if(item.size>=opt.maxSize && opt.type=="video"){
                    titps=LANGUAGE_NOW.withdraw.LimitSize;
                    verification=false;
                }
                if(!verification){
                    $("body").alertTips({
                        titles: titps,
                        speed:2000
                    });
                    return;
                }
            });
            if(verification){
                function se(userid) {
                    getConfigurationUrl(function(figuration){
                        $.each(that[0].files,function(i,item){
                            var fileNamePreFix = item.name.substring(item.name.indexOf("."),item.name.length),
                                fileName=(new Date(item.lastModifiedDate).getTime())+""+this.size,
                                key = figuration.imagNamePrefix+(opt.type=="video"?'video/':'')+userid+"/"+fileName+fileNamePreFix;
                            getQiToken({
                                'key':key,
                                'callback':function(responseJSON){
                                    if(responseJSON.uptoken!=undefined){
                                        var xhr = new XMLHttpRequest(),                              // XMLHttpRequest 对象 
                                            response;
                                        xhr.open("post", opt.ajaxUrl, true);                         // 接收上传文件的后台地址
                                        var form = new FormData();                                   // FormData 对象
                                        form.append("token", responseJSON.uptoken);                  // 上传的token值
                                        form.append("key", key);                                     // 上传指定的文件夹路径
                                        form.append("file", item);
                                        
                                        xhr.onload = function (el) {
                                            response=JSON.parse(el.target.response);
                                            if(response.error!=undefined){
                                                opt.ferror(el);
                                            }else{
                                                response.domain=figuration.imagDomainUrl;
                                                response.key=response.key.substring(figuration.imagNamePrefix.length,response.key.length);
                                                
                                                var httpVar=response.domain;
                                                if(opt.type=="video"){
                                                    opt.fload(response);
                                                }else{
                                                    imageInfo({
                                                        "url":httpVar+figuration.imagNamePrefix+response.key+"?",
                                                        "callback":function(result){
                                                            $.each(result,function(i,item){
                                                                response[i]=item;
                                                            });
                                                            opt.fload(response);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        xhr.onerror =function(el){
                                            opt.ferror(el);
                                        }
                                        xhr.upload.addEventListener('progress',function(evt){
                                            if(evt.lengthComputable){
                                                var percentComplate=Math.round(evt.loaded*100/evt.total); //上传字节数的百分比
                                                opt.progress(evt,percentComplate);
                                            }
                                        },false);
                                        xhr.send(form);
                                    }
                                }
                            });
                        });
                    });
                }
                if(typeof(ArtJS) != 'undefined'){
                    ArtJS.login.pop(function (e){
                        ArtJS.login.getUser(function(d){
                            se(d.memberId);
                        });
                    });
                }else{
                    se('0000');
                }
            }
        }
    },
    //轮播
    slides:function(options){
        var that = this,
            panle = $(this);
        that.options = {
            "resizes":function(){},
            "leftBtn":null,
            "rightBtn":null,
            "find":null
        }
        for (var i in options) {
            this.options[i] = options[i];
        }
        var opt=that.options,
            li;


        var list_li_width,
            list_width;
        opt.resizes=function(){
            li=panle.find(opt.find);
            list_li_width=li.outerWidth()+parseInt(li.css("margin-left"))+parseInt(li.css("margin-right")),
            list_width=li.length*list_li_width;
            panle.width(list_width);

            
        }
        opt.resizes();
        if(panle.find(opt.find+".active").length<=0){
            li.eq(0).addClass("active");
        }
        opt.rightBtn.unbind().click(nextImg);

        function nextImg () {
            var list_active=panle.find(opt.find+".active"),
                next_list_active=list_active.next(opt.find),
                _left=parseFloat(panle.css("left"))-list_li_width;
            if(next_list_active.length<=0){
                _left=0;
                next_list_active=panle.find(opt.find).eq(0);
            }
            if(list_width-Math.abs(_left)>=panle.parent().outerWidth()){
                panle.animate({"left":_left+"px"});
            }
            list_active.removeClass("active");
            next_list_active.addClass("active");
        }
        opt.leftBtn.unbind().click(prevImg);
        function prevImg () {
            var list_active=panle.find(opt.find+".active"),
                prev_list_active=list_active.prev(opt.find),
                _left=parseFloat(panle.css("left"))+list_li_width;
            if(prev_list_active.length<=0){
                _left=-(list_width-panle.parent().outerWidth());
                prev_list_active=panle.find("> li").eq(panle.find(">li").length-1);
            }
            if(_left<=0){
                panle.animate({"left":_left+"px"});
            }
            list_active.removeClass("active");
            prev_list_active.addClass("active");
        }
        return opt;
    }
});

//转base64位图片
function imageFileVisible(file,callbakc) {
    var reader = new FileReader();
    reader.onload = function(){
        if(callbakc) callbakc(reader.result);
    };
    reader.readAsDataURL(file);
};
//判断图片是否是动画
function IsAnimatedGif(filename,callback){
    $.get(filename,function(f){
        var chr = ''+
                'NETSCAPE2.0';
        if(callback) callback(f.indexOf(chr)>0?true:false);
    },'text');
}
function getConfigurationUrl(callback){
    $.ajax({
        url : ArtJS.server.art+'goodsSite/artsOperate/getConfigurationUrl',
        async : false,
        type : "get",
        dataType : "json",
        success : function(figuration) {
            if(callback) callback(figuration);
        }
    });
}
/*获取七牛上传token*/
function getQiToken(options){
    // if(window.location.href.indexOf("https")>=0){
    //     ajaxUrl='https://up.qbox.me/';
    // }
    var optionsCp = {
        "key":'',
        "callback":function(){}
    }
    for (var i in options) {
        optionsCp[i] = options[i];
    }
    $.ajax({
        async: false,
        url:  ArtJS.server.art+"goodsSite/artsOperate/getUploadToken",
        type: "get",
        dataType: 'json',
        jsonp: 'callback',
        data:{
            "key":optionsCp.key
        },
        success: function(responseJSON) {
            if(optionsCp.callback) optionsCp.callback(responseJSON);
        }
    });
}
function imageInfo(options){
    var optionsC={
        url:null,
        callback:null
    }
    for (var i in options) {
        optionsC[i] = options[i];
    }
    $.ajax({
        async: true,
        url : optionsC.url+"imageInfo",
        type: "GET",
        dataType: 'json',
        jsonp: 'callback',
        success : function(result) {
            if(optionsC.callback) optionsC.callback(result);
        }
    });
}


/*--获取网页传递的参数--*/
function request(paras,values) {
    var url = location.href.split("?");
    if(values==undefined && url[1]==undefined){
        return "";
    }else{
        var hUrl="";
        var paraObj = {};
        if(url[1]==undefined){
            paraObj[paras]=values;
        }else{
            var paraString = url[1].split("&");
            for (i = 0; j = paraString[i]; i++) {
                var n=j.substring(0, j.indexOf("=")),
                    v=j.substring(j.indexOf("=") + 1, j.length);
                paraObj[n] = v;
            }
            if(paraObj[paras]==undefined && values==undefined){
                return "";
            }
        }

        if(values=="remove"){
            if(paraObj[paras]!=undefined){
                delete paraObj[paras];
            }
        }else if(values!="remove" && values!=undefined){
            paraObj[paras]=base64encode(values.toString());
        }else{
            var rtVal=paraObj[paras];
            if(rtVal!=undefined){
                var idx=rtVal.indexOf("ECDO");
                if(idx>=0){
                    rtVal=base64decode(rtVal.substring(0,idx));
                }
            }
            return rtVal;
        }
        $.each(paraObj,function(i,item){
            if(hUrl!=""){
                i="&"+i;
            }
            hUrl+=i+"="+item;
        });
        window.history.pushState("","",url[0]+"?"+hUrl);
    }
}

/*--过滤script--*/

function replaceScript(val){
    return val.replace(/<script.*?>.*?<\/script>/ig, '');
}
/*--加密--*/
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array( - 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            //out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            //out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out+"ECDO";
}
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while ( i < len && c1 == - 1 );
        if (c1 == -1) break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while ( i < len && c2 == - 1 );
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while ( i < len && c3 == - 1 );
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while ( i < len && c4 == - 1 );
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            // 0xxxxxxx
            out += str.charAt(i - 1);
            break;
        case 12:
        case 13:
            // 110x xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
        case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
    }
    return out;
}