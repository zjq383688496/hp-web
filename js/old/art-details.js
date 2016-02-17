ArtJS.load.add('art-details-css', {"css": ArtJS.server.art+'drift/css/art-details.css'});
angular.module("art-details",['ngRoute','shear-mod','report-mod','plug-in-unit']).controller('art-details-ctr', ['$scope','$compile','$timeout','$http', function($scope,$compile,$timeout,$http){
    $scope.img_url=ArtJS.server.image;
    $scope.LANGUAGE_NOW=LANGUAGE_NOW;

    //获取艺术品
    $scope.openArtDeatils=function(id){
        if(window.event!=undefined){
            window.event.stopPropagation();
        }
        request("artworkId",id);
        ArtJS.load(['art-details-css'], function(){
            $("body").css({"overflow":"hidden","padding-right":"17px"});
            $("#art-details").fadeIn(600,function(){
                //$scope.getComment();
                $scope.getArtworkGoods();
                $scope.getArtworkTopics();
            });
        });

        $scope.artworkId=id;
        $scope.getArtworkDetail=[];
        $scope.getArtworkComments=[];
		$scope.artsGoodsVos=[];
		$scope.artsTopicInfoVos=[];

        $http.get("/goodsSite/arts/getArtworkDetail?"+$.param({
            artworkId:$scope.artworkId,
            terminalType:2,
            abbr:ArtJS.server.language
        })).success(function(responseJSON) {
            if(responseJSON.code==200){
                var result=responseJSON.result;
                // var userImg = result.artsMemberInfoVo.memberHead? result.artsMemberInfoVo.memberHead.replace('https://', 'http://'): '';
                // userImg = userImg.indexOf('http') > -1? userImg: $scope.img_url + userImg;
                // result.artsMemberInfoVo.memberHead = userImg;
                
                result.artsTitle = (result.artsTitle!=null ? result.artsTitle: '');
                result.artsDescp = (result.artsDescp!=null ? result.artsDescp: '');
                if(~~(result.sellStatus)==0 || ~~(result.sellPrice)==0){
                    result.sellStatusStr=$scope.LANGUAGE_NOW.goods.sellout;//"非买品";
                }else if(result.sellStatus==1){
                    result.sellStatusStr=result.currencySymbol+result.sellPrice;
                }else if(result.sellStatus==2){
                    result.sellStatusStr=$scope.LANGUAGE_NOW.goods.buyAdvice;//"购买咨询";
                }
                $scope.getArtworkDetail = result;
                
                $scope.artShear=function(e){
                    e.stopPropagation();
                    ArtJS.login.getUser(function(userData){
                        $scope.userData=userData;
                    });
                    
                    var nikeName=$scope.userData!=undefined?$scope.userData.nikeName:'';
                    var summary=nikeName+" "+LANGUAGE_NOW.shear.shop+"，"+result.artsTitle+"-"+result.authorName+" "+LANGUAGE_NOW.shear.come;
                    var shearData={
                        id:result.artsId,
                        summary:summary,
                        pic: ArtJS.server.image+result.artsUri,
                        shareType:"Artwork"
                    };
                    if(typeof($scope.showShear)=="function"){
                        $scope.showShear(shearData);
                    }
                }
            }
        })
        $("#art-details").find(".pro-f-box").scrollTop(0);
    }
    $scope.commentPage=1;
    var ajaxStar=true;
    //艺术品的评论查询
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
            //获取评论数据
            $http.get("/goodsSite/arts/getArtworkComments?"+$.param({
                artworkId: $scope.artworkId,
                pageNo:$scope.commentPage,
                pageSize:5,
                abbr:ArtJS.server.language
            })).success(function(responseJSON) {
                ajaxStar=true;
                if(responseJSON.result.pageItems.length<=0){
                    if($scope.commentPage>1){
                        $scope.commentPage-=1;
                    }
                    return;
                }
                $.each(responseJSON.result.pageItems,function(i, item){
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
                $scope.getArtworkComments=responseJSON.result.pageItems;
            });
        }
    }
    //艺术品的添加评论
    $scope.postComments=function(el){
        ArtJS.login.pop(function (e){
            ArtJS.login.getUser(function(user){
                var date = new Date();
                createDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                var startNum = ~~($("#stars2-input").val())
                startNum = startNum < 1? 1: startNum
                startNum = startNum > 5? 5: startNum
                var postContent = $scope.postContent? $scope.postContent.replace(/\s/g, ''): ''
                if (postContent == '') {
                    alert('评论内容不能为空');
                    return false;
                }
                var datas={
                    artsId: $scope.artworkId,
                    cussContent: $scope.postContent,
                    cussNum: startNum,
                    customerName: user.nikeName,
                    ownerId: user.memberId,
                    userPicture: user.imageUrl,
                    abbr:ArtJS.server.language
                }
                $http.post("/oodsSite/arts/addArtworkComments?"+$.param(datas)).success(function(responseJSON) {
                    if(responseJSON.code==200){
                        var itemArr={
                            "ownerId": user.memberId,
                            "ownerName": user.nikeName,
                            "ownerHead": user.imageUrl,
                            "cussNum": startNum,
                            "lastUpdateDate": createDate,
                            "cussContext":$scope.postContent,
                            "startArr": []
                        }
                        for(var i=1;i<=5;i++){
                            if(i<=startNum){
                                itemArr.startArr.push({
                                    "class":"active"
                                });
                            }else{
                                itemArr.startArr.push({
                                    "class":""
                                });
                            }
                        }
                        if($scope.getArtworkComments==null){
                            $scope.getArtworkComments.push(itemArr);
                        }else{
                            $scope.getArtworkComments.splice(0, 0, itemArr);
                        }
                        
                        
                        $("#c_input").val("");
                        $("#mr_div_input").removeClass("div_input").addClass("mr_div_input");
                        $("#dp_list_show").removeClass("i_u_tx vi").addClass("mr_i_u_tx");
                    }
                });
            });
        });
    }
    //艺术品的衍生品查询
    $scope.getArtworkGoods=function(){
        $http.get("/goodsSite/arts/getArtworkGoods?"+$.param({
            artworkId:$scope.artworkId,
            pageNo:1,
            pageSize:500,
            abbr:ArtJS.server.language
        })).success(function(responseJSON) {
            if (responseJSON.code == 200) {
                if(!responseJSON.result.pageItems.length){
                    $("body").loadImage({
                        url:$scope.img_url+$scope.getArtworkDetail.artsUri,
                        callback:function(el,img){
                            $.ajax({
                                async: false,
                                url:  "/goodsSite/artsOperate/processArtsSvg",
                                type: "post",
                                dataType: 'json',
                                jsonp: 'callback',
                                data:{
                                    artsWidth:img.width,
                                    artsHight:img.height,
                                    svgUri:$scope.img_url + $scope.getArtworkDetail.artsUri,
                                    artsId:$scope.getArtworkDetail.artsId,
                                    abbr:ArtJS.server.language
                                },
                                success: function(responseSVG) {
                                    if(responseSVG.code==200){
                                        $scope.processArtsSvg=[];
                                        $.each(responseSVG.result,function(i,item){
                                            $timeout(function(){
                                                var svgs=svgGop.recombineSvg({
                                                    svg:item.svgContent,
                                                    p_w:270
                                                });
                                                svgs.svg.removeAttr("onclick");
                                                item.svgContent=$("<div/>").append(svgs.svg).html();
                                                $scope.processArtsSvg.push(item);
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    });
                }else{
                    $scope.artsGoodsVos=responseJSON.result;
                }
            }
        });
    }
    //艺术品的专题查询
    $scope.getArtworkTopics=function(){
        $http.get("/goodsSite/arts/getArtworkTopics?"+$.param({
            artworkId:$scope.artworkId,
            pageNo:1,
            pageSize:500,
            abbr:ArtJS.server.language
        })).success(function(responseJSON) {
            if (responseJSON.result.pageItems.length) {
                $scope.artsTopicInfoVos = responseJSON.result;
            }
        });
    }
    $scope.closeArtDetails=function(callback){
        $timeout(function(){
            //$scope.getArtworkDetail="";
            request("artworkId","remove");
            $("#art-details").fadeOut(function(){
                $("body").css({"overflow":"inherit","padding-right":"0"});
                if(callback) callback();
            });
            if(typeof($scope.closeShear)=="function"){
                $scope.closeShear();
            }
            $scope.processArtsSvg="";
        });
    }
    $scope.suchGoods=function (evt,data,type){
        evt.stopPropagation();
        if(type==1){
            $scope.closeArtDetails(function(){
                $scope.openShopDetails(data.id);
            });
        }else{
            $("body").loadImage({
                url:$scope.img_url+$scope.getArtworkDetail.artsUri,
                callback:function(el,img){
                    $http.post("/goodsSite/artsOperate/processArtsGoods?"+$.param({
                        artsId:data.artsId,
                        artsWidth:img.width,
                        artsHight:img.height,
                        categoryId0:data.categoryId0,
                        customerId:$scope.getArtworkDetail.artsMemberInfoVo.memberId,
                        abbr:ArtJS.server.language
                    })).success(function(responseJSON) {
                        if(responseJSON.code){
                            $scope.openShopDetails(responseJSON.result);
                        }
                    });
                }
            });
        }
    }
    
    $scope.ArtAddCat=function(){
        if(~~($scope.getArtworkDetail.sellStatus)==0 || ~~($scope.getArtworkDetail.sellPrice)==0){
            return;
        }
        ArtJS.login.pop(function () {
            if($scope.getArtworkDetail.sellStatus==1){
                var ajData={
                    goodsId:$scope.getArtworkDetail.artsId,
                    showGoodsId:request("artworkId"),
                    goodsCount:1,
                    goodsType:43,
                    goodsPrice:$scope.getArtworkDetail.sellPrice,
                    goodsJson:JSON.stringify($scope.getArtworkDetail.artsMemberInfoVo),
                    abbr:ArtJS.server.language
                };
                $http.post('/orderPaySite/cart/addCart?'+$.param(ajData)).success(function(responseJSON) {
                    if(responseJSON.code==200){
                        $("body").alertTips({
                            titles:$scope.LANGUAGE_NOW.goods.cartSus,//"加入购物成功",
                            speed:1000
                        });
                    }else{
                        $("body").alertTips({
                            titles:$scope.LANGUAGE_NOW.goods.cartErr,//"加入购物车失败",
                            speed:1000
                        });
                    }
                });
            }else if($scope.getArtworkDetail.sellStatus==2){
                var emailArr=$.param({
                    "cc":$scope.getArtworkDetail.askEmail,
                    "bcc":$scope.getArtworkDetail.askEmail,
                    "subject":"艺术品《"+$scope.getArtworkDetail.artsTitle+"》购买咨询",
                    "body":"Hi,我希望购买您的作品《"+$scope.getArtworkDetail.artsTitle+"》想和您详细沟通！<br/><a href='"+window.location.href+"'>"+window.location.href+"</a>"
                });
                window.location.href="mailto:"+$scope.getArtworkDetail.askEmail+"?"+emailArr;
            }
        });
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if(request("artworkId")!=""){
            $timeout(function(){
                $scope.openArtDeatils(request("artworkId"));
            },100);
        }
    });
}]).directive("artdetails", [function(){
    return {
        restrict:'EA',
        templateUrl:'/art-details.html',
        transclude:true,
        controller: 'art-details-ctr',
        link: function (scope, element, attributes) {
            $(element).find(".pro_show_box").click(function(e){
                e.stopPropagation();
                scope.closeShear();
                //scope.closeReport();
            });
            $(element).click(function(e){
                scope.closeArtDetails();
            });

            var my_Comment=$(".my_Comment"),
                mr_div_input=$("#mr_div_input"),
                dp_list_show=$("#dp_list_show"),
                stars2_input=$("#stars2-input"),
                c_input=$("#c_input");
            $("#c_input").focus(function(){
                ArtJS.login.pop(function () {
                    mr_div_input.removeClass("mr_div_input").addClass("div_input");
                    dp_list_show.removeClass("mr_i_u_tx").addClass("i_u_tx vi");
                });
            });
            $("#_bulb >li").each(function(i){
                var that=$(this);
                that.click(function(){
                    $(this).addClass("active").siblings("li").removeClass("active");
                    stars2_input.val(i+1);
                });  
            });
        }
    }
}]).directive("loads", ['$timeout',function($timeout){
    return {
        restrict:'AE',
        replace: true,
        link: function (scope, element, attributes) {
            var url=attributes.url;
            $(element).loadImage({
                url:url,
                callback:function(){
                    element.attr("src",url);
                    //定义回调方法
                    $timeout(function() {
                        scope.$emit('loadscallback');
                    });
                }
            });
        }
    }
}]).directive('onFinishRenderFilters', function ($timeout) {
    //定义directive相关作品绑定完成后的事件
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }else{
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});