//分享
ArtJS.load.add('qrcode', {js: ArtJS.server.art+'js/ArtJS/qrcode.js'});
ArtJS.load.add('canvas2image', {js: ArtJS.server.art+'js/ArtJS/canvas2image.js'});

angular.module("shear-mod",['ngRoute']).directive("shear", ['$http','$timeout',function($http,$timeout){
    return {
        restrict:'EA',
        templateUrl:'/shear.html',
        transclude:true,
        link: function (scope, element, attributes) {
            scope.LANGUAGE_NOW=LANGUAGE_NOW;
            
            ArtJS.load(['qrcode'], function(){
                scope.shearData={
                    id:"",
                    url:"",
                    summary:"",
                    pic:"",
                    email:"",
                    shareType:""
                }
                var scrpt=$('<div class="jiathis"></div>');
                $(element).click(function(e){
                    e.stopPropagation();
                });
                $("body").click(function(){
                    //scope.closeShear();
                });
                scope.showShear=function(data){
                    if(window.event!=undefined){
                        window.event.stopPropagation();
                    }
                    $(element).find(".copy-link").removeClass("showlink").find("font").html(scope.LANGUAGE_NOW.title.copyLink);
                    var options={
                        title:"",
                        id:"",
                        url:"",
                        summary:"",
                        pic:"",
                        email:"",
                        shareType:""
                    }
                    for (var i in options) {
                        options[i] = data[i];
                    }
                    scope.shearData=options;
                    if(scope.shearData.pic!=null && scope.shearData.pic.indexOf("http://")<0){
                        scope.shearData.pic=ArtJS.server.image+scope.shearData.pic;
                    }
                    $(element).find(".goods_Share").fadeIn();
                    var host = window.location.host;
                    scope.shearLink = window.location.href;
                    for (var i in options) {
                        options[i] = data[i];
                    }
                    $http.post(ArtJS.server.art+"topicSocSite/topic/shortUrlByParam?"+$.param({
                        shareType:scope.shearData.shareType,
                        shareUserId:(ArtJS.login.userData==undefined? '':ArtJS.login.userData.memberId),
                        shareSourceId:scope.shearData.id
                    })).success(function(responseJSON) {
                        if(responseJSON.code=="200" && responseJSON.result!=null){
                            scope.shearLink=responseJSON.result.tinyurl.replace("dwz.cn","share.artbulb.com");
                        }
                        var qrcode = new QRCode($(element).find("#qrcode")[0], {
                            width : 1000,//设置宽高
                            height : 1000
                        });
                        qrcode.makeCode(scope.shearLink,function(q){
                            $timeout(function(){
                                scope.canvas=q._elCanvas;
                            });
                        });
                        var scrpts='<script type="text/javascript">'+
                                'var jiathis_config = {'+
                                    'title: "'+(scope.shearData.title==null?' ':scope.shearData.title)+'",'+
                                    'url: "'+scope.shearLink+'",'+
                                    'summary:"' +scope.shearData.summary+ '",'+
                                    'pic:"' +scope.shearData.pic+'"'+
                                '};'+
                            '</script>'+
                            '<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js" charset="utf-8"></script>';
                        scrpt.append(scrpts);
                        $(element).append(scrpt);
                    });
                }
                scope.copyLink=function(strLink){
                    var inputLink=$(element).find(".link input")[0];//对象是contents 
                    inputLink.select(); //选择对象 
                    document.execCommand("Copy"); //执行浏览器复制命令
                    $(element).find(".copy-link").addClass("showlink").find("font").html(scope.LANGUAGE_NOW.title.copySuccess);
                }
                scope.closeShear=function(){
                    $(element).find(".goods_Share").fadeOut();
                    scrpt.remove(); 
                    scope.shearData={
                        id:"",
                        url:"",
                        summary:"",
                        pic:"",
                        email:""
                    }
                }
                ArtJS.load(['canvas2image'], function(){
                    scope.saveImg=function(){
                        //下载二维码
                        Canvas2Image.saveAsPNG(scope.canvas, false, 1000, 1000,'artbulb.png');
                    }
                })
            });
        }
    }
}]);
//举报
angular.module("report-mod",['ngRoute']).directive("report", ['$http',function($http){
    return {
        restrict:'EA',
        templateUrl:'/report.html',
        transclude:true,
        link: function (scope, element, attributes) {
            var reportPanl=$(element).find(".report");
            reportPanl.click(function(e){
                e.stopPropagation();
            });
            $(element).siblings().click(function(){
                scope.closeReport();
            });
            scope.changeRoport=function(data){
                data.contents=data.content;
                scope.reportThis=data;
            }
            scope.showReport=function(id,type){
                if(window.event!=undefined){
                    window.event.stopPropagation();
                }
                scope.reportType=type;
                scope.reportId=id;
                $http.get(ArtJS.server.art+"memberSite/sys/getAccTypeByAbbr?"+$.param({
                    "abbr":ArtJS.server.language
                })).success(function(responseJSON) {
                    if(responseJSON.code==200){
                        scope.changeRoport(responseJSON.result[0]);
                        scope.reportList=responseJSON.result;
                    }
                });
                reportPanl.fadeIn();
            }
            scope.postReport=function(){
                $http.post(ArtJS.server.art+"memberSite/sys/addAcc?"+$.param({
                    "sourceId":scope.reportId,
                    "acctReson":scope.reportThis.contents,
                    "goodsType":scope.reportType,
                    "abbr":ArtJS.server.language
                })).success(function(responseJSON) {
                    if(responseJSON.code==200){
                        $("body").alertTips({
                            titles: LANGUAGE_NOW.new001.t0143,//"sorry！当前商品暂时不能购买",
                            speed: 1000,
                            closeback:function(){
                                scope.closeReport();
                            }
                        });
                    }
                });
            }
            scope.closeReport=function(){
                reportPanl.fadeOut();
            }
            return scope;
        }
    }
}]);

//公用module
angular.module("plug-in-unit",[]).filter('trustHtml', function ($sce){
    return function (input) {
        if(input!=undefined){
            var re = {
                '&lt;': '<',
                '&gt;': '>',
                '&amp;': '&',
                '&quot;': '"'
            };
            for (var i in re) {
                input = input.replace(new RegExp(i, 'g'), re[i]);
            }
        }
        return $sce.trustAsHtml(input);
    }
});