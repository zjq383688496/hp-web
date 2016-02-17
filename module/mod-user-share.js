//分享
ArtJS.load.add('qrcode', {js: ArtJS.server.art+'js/ArtJS/qrcode.js'});
ArtJS.load.add('canvas2image', {js: ArtJS.server.art+'js/ArtJS/canvas2image.js'});
;var modShare = angular.module('modUserShare', []);
modShare.directive('modusershare',['$http','$timeout',function($http,$timeout){
	 return {
        restrict:'EA',
        templateUrl:'/module/mod-user-shear.html',
        transclude:true,
        link: function (scope, element, attributes, timeout) {
            ArtJS.load(['header'], function () {
				scope.LANG      = LANG;
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
	                    $(element).find(".copy-link").removeClass("showlink").find("font").html('复制');
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
	                    var spic = ArtJS.server.image+scope.shearData.pic+"?imageView2/1/w/240/h/240/q/90";
	                    if(scope.shearData.pic!=null && scope.shearData.pic.indexOf("http://")<0){
	                        scope.shearData.pic=ArtJS.server.image+scope.shearData.pic;
	                    }
	                    $('#smalldetailuri-share').attr('src',spic);
	                    $('body').after('<div class="cover-mark"></div>')
	                    $(element).find(".goods_Share").fadeIn();
	                    var host = window.location.host;
	                    scope.shearLink = window.location.href;
	                    for (var i in options) {
	                        options[i] = data[i];
	                    }
	                    var _url ="http://www.artbulb.com/page/CN/user/gallery.html?";
	                    var uir =encodeURIComponent(_url +'uid=' + request('uid')+ '&shareType=' + scope.shearData.shareType+ '&shareUserId=' + (ArtJS.login.userData==undefined? '':ArtJS.login.userData.memberId)+'&shareSourceId=' + scope.shearData.id);
	                    //var uir = encodeURIComponent(_url +'uid=' + base64encode(request('uid')));
	                    $http.post(ArtJS.server.art+"topicSocSite/topic/getShortUrl?"+$.param({
	                    //$http.post(ArtJS.server.art+"topicSocSite/topic/shortUrlByParam?"+$.param({
	                        //shareType:scope.shearData.shareType,
	                        //shareUserId:(ArtJS.login.userData==undefined? '':ArtJS.login.userData.memberId),
	                        //shareSourceId:scope.shearData.id,
	                        url:uir
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
	                    $(element).find(".copy-link").addClass("showlink").find("font").html(scope.LANG.BUTTON.COPYSUS);
	                }
	                scope.closeShear=function(){
	                    $(element).find(".goods_Share").fadeOut();
	                    scrpt.remove();
	                    $('.cover-mark').remove();
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
			});
        }
    }   
}]);