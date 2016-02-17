ArtJS.define('ArtJS.video', {
        tmpl: '<video src="{url}" width="{width}" height="{height}" controls>您的浏览器不支持该视频播放!</video>',
        url: function (url, width, height) {
            var param = {};
            if (typeof(url) === 'object') {
                param = url;
            } else {
                param.url = url;
            }
            param.url = param.url || '';
            param.width = param.width || 640;
            param.height = param.height || 360;
            if (param.url) {
                return this.tmpl.substitute(param);
            } else {
                return '';
            }
        }
    });
var detail=angular.module("detail",['modHeaderFull','ngRoute','plug-in-unit','shop-details','art-details']);
detail.controller('detailCtr', ['$scope','$compile','$http','$timeout', function($scope,$compile,$http,$timeout){
    ArtJS.load(['header'], function () {
        $timeout(function () {
    //瀑布流加载
    $scope.img_url=ArtJS.server.image;
    $scope.icon_img_url="http://imagetest02.cmall.com/imgsrv/";
    $scope.imagetest="http://imagetest.cmall.com/imgsrv/";
    $scope.LANGUAGE_NOW=LANGUAGE_NOW;
    $scope.LANG=LANG;
    $scope.detailArr={};
    $scope.postContent="";

    ArtJS.login.getUser(function(){
        $scope.userData=ArtJS.login.userData;
    });

    if(request("id")!=""){
        $scope.commentPage=1;
        var ajaxStar=true;
        $scope.getComment=function(type){
            if(ajaxStar){
                ajaxStar=false;
                if(type!=undefined){
                    if(type=="next"){
                        $scope.commentPage+=1;
                    }else if(type=="prev"){
                        if($scope.commentPage<=1){
                            ajaxStar=true;
                            return;
                        }else{
                            $scope.commentPage-=1;
                        }
                    }
                }
                var pageSize=5;
                if(!$.browser.isPC()){
                    pageSize=3;
                }
                //获取评论数据
                $.ajax({
                    async: false,
                    url:  "/topicSocSite/topic/getDiscussByTopic",
                    type: "post",
                    dataType: 'json',
                    jsonp: 'callback',
                    data:{
                        topicId: request("id"),
                        currPage:$scope.commentPage,
                        pageSize:pageSize,
                        abbr:ArtJS.server.language
                    },
                    success: function(responseJSON) {
                        ajaxStar=true;
                        if(responseJSON.code==200){
                            if(responseJSON.result.pageItems.length<=0){
                                if($scope.commentPage>1){
                                    $scope.commentPage-=1;
                                }
                            }else{
                                $.each(responseJSON.result.pageItems,function(i, item){
                                    if(item.ownerHead.indexOf($scope.icon_img_url)>=0){
                                        item.ownerHead=item.ownerHead.split($scope.icon_img_url)[1];
                                    }else if(item.ownerHead.indexOf($scope.imagetest)>=0){
                                        item.ownerHead=item.ownerHead.split($scope.imagetest)[1];
                                    }
                                    item.startArr=[];
                                    for(var i=1;i<=5;i++){
                                        if(i<=item.cussNum){
                                            item.startArr.push({
                                                "class":"active"
                                            });
                                        }else{
                                            item.startArr.push({
                                                "class":""
                                            });
                                        }
                                    }
                                });
                            }
                            $scope.getDiscussByTopic=responseJSON.result;
                        }
                    }
                });
            }
        }
        //获取专题数据
        $.ajax({
            async: false,
            url:  "/topicSocSite/topic/getTopicById;",
            type: "post",
            dataType: 'json',
            jsonp: 'callback',
            data:{
                id: request("id"),
                abbr:ArtJS.server.language
            },
            success: function(responseJSON) {
                if(responseJSON.code==200 && responseJSON.result!=null){
                    responseJSON.result.title=replaceScript(responseJSON.result.title);

                    $scope.detailArr=responseJSON.result;
                    $scope.detailArr.videoUrlStr= ArtJS.video.url(ArtJS.server.image+$scope.detailArr.videoUrl);
                    $("title").html($scope.detailArr.title);


                    $scope.detailArr.arts=[];
                    var getTopicGoodsIdArr="";
                    if($scope.detailArr.bindIds!=null){
                        getTopicGoodsIdArr={
                            goodsIds:JSON.stringify($scope.detailArr.bindIds).split("[")[1].split("]")[0],
                            abbr:ArtJS.server.language
                        }
                        if(ArtJS.login.userData!=undefined){
                            getTopicGoodsIdArr['customerId']=ArtJS.login.userData.memberId;
                        }
                        $http.post("/goodsSite/goods/getTopicGoods?"+$.param(getTopicGoodsIdArr)).success(function(rspon) {
                            if(rspon.code==200){
                                if(rspon.result.pageItems!=null){
                                    $.each(rspon.result.pageItems,function(p,ptem){
                                        $scope.detailArr.arts.push(ptem);
                                    });
                                }
                            }
                        });
                    }


                    $timeout(function(){
                        setTimeout(function () {
                            var u = navigator.userAgent;
                            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
                            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                            if (!isAndroid && !isiOS) {
                                var img = $('p img');
                                $(".topic_content section,.topic_content figure").removeAttr('style');
                                img.removeAttr('style').css({"width": '100%',"height":"auto"});
                            }
                        }, 10);
                    });

                    $scope.goodsItemImg=function(datas){
                        $scope.openShopDetails(datas.id);
                    }
                }
                $scope.getComment();
            }
        });
    }else{
        var TopicPoArr=JSON.parse(storage.getItem('TopicPo'));
        var artsStar=[];

        $scope.detailArr=TopicPoArr;
        $.each(TopicPoArr.arts,function(i,item){
            artsStar.push(item);
        });
        $scope.detailArr.arts=artsStar;

        $timeout(function(){
            var img = $('p img');
            $(".topic_content section,.topic_content figure").removeAttr('style');
            img.removeAttr('style').css({"max-width": '100%',"height":"auto"});
        },20);

        $(".Comment_list").hide();
        $("title").html($scope.detailArr.title);
    }

    //发表评论
    $scope.postBtopic=function(el){
        var date=new Date();
        createDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        var cussNum = ~~(stars2_input.val())
        cussNum = cussNum < 1? 1: cussNum
        cussNum = cussNum > 5? 5: cussNum
        var postContent = $scope.postContent? $scope.postContent.replace(/\s/g, ''): '';
        if (postContent == '') {
            $("body").alertTips({
                titles: LANGUAGE_NOW.special.CommentNull,
                speed: 1000
            });
            return false;
        }
        $.ajax({
            async: false,
            url:  "/topicSocSite/topic/publicDiscuss",
            type: "post",
            dataType: 'json',
            jsonp: 'callback',
            data:{
                topicId: request("id"),
                ownerId: ArtJS.login.userData.memberId,
                ownerName: ArtJS.login.userData.nikeName,
                ownerHead: ArtJS.login.userData.imageUrl,
                cussContext:$scope.postContent,
                cussNum:cussNum,
                abbr:ArtJS.server.language
            },
            success: function(responseJSON) {
                if(responseJSON.code==200){
                    // var itemArr={
                    //     "id": responseJSON.result.id,
                    //     "ownerId":ArtJS.login.userData.memberId,
                    //     "ownerHead": ArtJS.login.userData.imageUrl,
                    //     "ownerName": ArtJS.login.userData.nikeName,
                    //     "createDate": createDate,
                    //     "cussContext":$scope.postContent,
                    //     "startArr": []
                    // }
                    // for(var i=1;i<=5;i++){
                    //     if(i<=cussNum){
                    //         itemArr.startArr.push({
                    //             "class":"active"
                    //         });
                    //     }else{
                    //         itemArr.startArr.push({
                    //             "class":""
                    //         });
                    //     }
                    // }
                    // if($scope.getDiscussByTopic==undefined){
                    //     $scope.getDiscussByTopic={
                    //         "pageItems":[]
                    //     };
                    // }
                    // $scope.getDiscussByTopic.pageItems.splice(0, 0, itemArr);

                    c_input.val("");
                    mr_div_input.removeClass("div_input").addClass("mr_div_input");
                    dp_list_show.removeClass("i_u_tx vi").addClass("mr_i_u_tx");
                    $scope.getComment();
                }
            }
        });
    }

    //定义喜欢点击事件
    $scope.like=function(data){
        ArtJS.login.pop(function () {
            $http.post("/goodsSite/goods/like?"+$.param({
                id:data.id,
                customerId:ArtJS.login.userData.memberId,
                like:(data.light==false?1:2),
                abbr:ArtJS.server.language
            })).success(function(rspon) {
                if(rspon.code==200){
                    if(data.light==false){
                        data.light=true;
                        data.collectionNumber+=1;
                    }else{
                        data.light=false;
                        data.collectionNumber-=1;
                    }
                    // data.light=rspon.result.light;
                    // data.collectionNumber=rspon.result.collectionNumber;
                }
            });
        });
    }
    //定义喜欢当前专题点击事件
    $scope.Sitelike=function(){
        ArtJS.login.pop(function () {
            var likenum=($scope.detailArr.light==true?2:1);
            $http.post("/topicSocSite/topic/like?"+$.param({
                id:$scope.detailArr.id,
                memberId:ArtJS.login.userData.memberId,
                like:likenum,
                abbr:ArtJS.server.language
            })).success(function(rspon) {
                if(rspon.code==200){
                    $scope.detailArr.light=rspon.result.light;
                    $scope.detailArr.like=rspon.result.like;
                }
            });
        });
    }

    //删除评论
    $scope.delDiscuss=function(data){
        ArtJS.login.pop(function () {
            $http.post("/topicSocSite/topic/delDiscuss?"+$.param({
                id:data.id,
                ownerId:data.ownerId
            })).success(function(rspon) {
                if(rspon.code==200){
                    $scope.getComment();
                }
            });
        });
    }
    //分享
    $scope.showShearSite=function () {
        ArtJS.login.getUser(function(userData){
            $scope.userData=userData;
        });
        var nikeName=$scope.userData!=undefined?$scope.userData.nikeName:'';
        var summary=nikeName+LANGUAGE_NOW.shear.blog+"，"+$scope.detailArr.title+"-"+$scope.detailArr.memberName+LANGUAGE_NOW.shear.come;

        var data={
            id:$scope.detailArr.id,
            pic:$scope.detailArr.cover,
            summary:summary,
            shareType:"TOPIC"
            //title:$scope.detailArr.title,
            //url:window.location.href,
        }
        $scope.showShear(data);
    }

    });
    });
}]).filter('trustContent', function ($sce){
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
        if(input==undefined){
            return $sce.trustAsHtml(input);
        }
        input=replaceScript(input);
        var _HTML=$($("<div/>").append(input));
        _HTML.find("img").each(function(){
            var _src=$(this).attr("src"),
                idxOf=_src.indexOf("?imageView2"),
                maxwidth=420;
            if(idxOf>=0){
                _src=_src.substring(0,idxOf);
            }
            if(parseFloat($(this).attr("data-width"))>420){
                maxwidth=parseFloat($(this).attr("data-width"));
            }
            $(this).attr({"src":_src+"?imageView2/2/w/"+maxwidth+"/q/90"}).removeAttr("width").removeAttr("height");
        });
        _HTML.find(".link").each(function(){
            $(this).append("<span class='iconfont icon-cart'>"+LANGUAGE_NOW.title.cart+"</span>").attr("onClick","goodsItemImgOnClick('"+$(this).attr("data-id")+"')");
        });
        input=_HTML.html();
        return $sce.trustAsHtml(input);
    }
});
var my_Comment=$(".my_Comment"),
    mr_div_input=$("#mr_div_input"),
    dp_list_show=$("#dp_list_show"),
    stars2_input=$("#stars2-input"),
    c_input=$("#c_input");
$("#c_input").focus(function(){
    mr_div_input.removeClass("mr_div_input").addClass("div_input");
    dp_list_show.removeClass("mr_i_u_tx").addClass("i_u_tx vi");
});
//灯泡的值
$("#_bulb >a").each(function(i){
    var that=$(this);
    that.click(function(){
        $(this).addClass("active").siblings("a").removeClass("active");
        stars2_input.val(i+1);
    });
});
//此方法暂时定义
function goodsItemImgOnClick(id) {//商品购买显示层
    var appElement = document.querySelector('[ng-controller="detailCtr"]');
    var $scope = angular.element(appElement).scope();
    $scope.openShopDetails(id);
};