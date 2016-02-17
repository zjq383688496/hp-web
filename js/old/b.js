//定义变量
var FrameNum = 1;
var num = 0;
var onflg = true;
var pageIndex = 1;
var range = 350;
var searchType = "00"
var searchContext = "";
var flagAjax=true;
var Alange = ArtJS.server.language;
var prFag = true;
//用户id
var User_id = parseInt(getCookie("User_id"));
//works
//域名url
var worksVal = "";
var artUrl = ArtJS.server.art;
var pid = "";//分类选择
var srckey = "", _key = "", _keydata = '', sUrl = "", sEId = "";//搜索关键字 sUrl搜索url
var _inputSV = "";

/*滚动参数*/
var k = 5;
var range = 1050;
var onflg = true;
var _pageIndex = 1;
var flag = true;
var tempdis = 1;
var stopflg = true;
var recordsNumber =0;

/*DOTO 分类*/

//衍生品
function showGoodsList(data) {
    var appElement = document.querySelector('[ng-controller=works-ctr]');
    var $scope = angular.element(appElement).scope();
    // $scope.loading = '';
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
    if (data.code ==200){
        flagAjax =true;
        prFag =true;
    }
    if (data.result.pageItems == "") {
        $("#nogoodsDatail").show();
    }
    $("#index-Artists,#container").html('').removeClass('show').addClass('hide');


    var $container = $('#container');
    $(data.result.pageItems).each(function (index, v) {
        var text = sEId? $(ArtList.Aartwork(index, v)): $(ArtList.AartworkNew(index, v));
        $container = $('#container');
        text.find(".art_img").click(function(){
            var id=v.goodsId;
            if(v.type==0){
                // $scope.$$childTail.openArtDeatils(v.goodsId);
                ArtJS.goods.detail(id);
            }else if(v.type==1){
                // $scope.$$childTail.openShopDetails(v.goodsId,1);
                ArtJS.goods.detail(id);
            }else if(v.type==2){
                // $scope.$$childTail.openShopDetails(v.goodsId);
                ArtJS.goods.detail(id);
            }
        })
        $container.append(text);
    });
    $("#index-Artists,#container").removeClass('hide').addClass('show');
}
//艺术品
function showYspList(data) {
    var appElement = document.querySelector('[ng-controller=works-ctr]');
    var $scope = angular.element(appElement).scope();
    // $scope.loading = '';
    onflg = false;
    var data = data;
    pageIndex++;
    if (data.code ==200){
        flagAjax =true;
        prFag =true;
        recordsNumber = data.result.recordsNumber;
    }
    if (data.result.pageItems == "") {
        $("#nogoodsDatail").show();
    }
    var $container = $('#container');
    $("#index-Artists,#container").html('').removeClass('show').addClass('hide');
    $(data.result.pageItems).each(function (index, v) {
        var text = sEId? $(ArtList.Aworks(index, v)): $(ArtList.AartworkNew(index, v));
        $container = $('#container');
        text.find(".art_img").click(function(){
            var id=v.goodsId;
            if(v.type==0){
                // $scope.$$childTail.openArtDeatils(v.goodsId);
                // goodsSite/goodsDetails/info?abbr=CN&goodsId= 
                ArtJS.goods.detail(id);
            }else if(v.type==1){
                // $scope.$$childTail.openShopDetails(v.goodsId,1);
                ArtJS.goods.detail(id);
            }else if(v.type==2){
                // $scope.$$childTail.openShopDetails(v.goodsId);
                ArtJS.goods.detail(id);
            }
        });
        $container.append(text);
    });
    $("#index-Artists,#container").removeClass('hide').addClass('show');
}
//灯丝圈
function special(data) {    
    onflg = false;
    var data = data;
    pageIndex++;
    var text = "";
    $("#index-Artists,#container").html('').removeClass('show').addClass('hide');
    $("#container").removeAttr("style");
    if (data.code ==200){
        flagAjax =true;
        prFag =true;
    }
    if (typeof(data.result) === "undefined") {
        return;
    }
    $(data.result.pageItems).each(function (index, v) {
        var text =$(ArtList.special(index, v));
        if(text.find(".del").length>0){
            text.find(".del").click(function(){
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    jsonp: 'callback',
                    url: "/topicSocSite/topic/delTopic",
                    data: {
                        "id": v.id
                    },
                    success: function (rs) {
                        if(rs.code==200){
                            text.remove();
                        }
                    }
                });
            });
        }
        $container = $('#container');
        $container.append(text);
    });
    $("#index-Artists,#container").removeClass('hide').addClass('show');
}
//艺术家
function Artists(data) {    
    onflg = false;
    var data = data;
    pageIndex++;
    var text = "";
    $("#index-Artists,#container").html('').removeClass('show').addClass('hide');
    $("#container").removeAttr("style");
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Artists(index, v);
        $Artists = $('#index-Artists');
        $Artists.append(text);
    });
    $("#index-Artists,#container").removeClass('hide').addClass('show');
}
// 初始化数据
function findFirstGoodsPage(works, pid, sEId,pageIndexStart,callback) {
    // var appElement = document.querySelector('[ng-controller=works-ctr]');
    // var $scope = angular.element(appElement).scope();
    var $loading=$("div[ng-controller=works-ctr] .loading");
    $loading.show();
    $('.data-not').hide();
    dataFun(works, pid, sEId , pageIndexStart);
    pid = pid;
    tempdis = 1;
    $.ajax({
        type: "GET",
        url: gUrl,
        dataType: "json",
        //beforeSend: LoadFunction,
        success: function (data) {
            $loading.hide();
            if(!data||!data.result||!data.result.pageItems||data.result.pageItems.length<1){
                $('.data-not').show();
            }
            gFun(data);
            if (typeof callback == 'function') callback();            
        },
        beforeSend: function () {
            // $loading.show();
            $(".loadshowcss").show();
        },
        error: function () {
            $('.data-not').show();
            //alert('Query failed');
            $loading.hide();
        },
        complete: function () {
            $loading.hide();
            onflg = true;
            $(".loadshowcss").hide();
        }
    });
}
//数据url
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
// search初始化 | search选择
function dataFun(works, pid, sEId,pageIndexStart) {
    _key = decodeURIComponent(GetQueryString("searchContext")) || '';
    $("#sVal").val(_key);
    if (_key) {
        $(".ztag").addClass("js-hidetips");
        $("#searchs").show();
    } else {
        $("#searchs").hide();
    }
    searchContext = _key;
    pageIndex=pageIndexStart==undefined?1:pageIndexStart;
    if (works == 0 || sEId == 1) {
        gFun = showYspList;
        recordsNumber =0;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/goodsSite/arts/searchArts?igsType=11";
        if (sEId == 1) {
            getGoodsUrl = sUrl + '&pageSize=' + 20+ '&customerId=' + (User_id || '') + '&searchContext=' + _key + "&pageNo=";
            gUrl = getGoodsUrl + gYurl;
        } else {
            if (pid) gYurl = gYurl + '&category=' + pid[0] + '&productTypeId=' + pid[1] + '&interestTypeId=' + pid[2] + '&targetType=' + pid[3];
            getGoodsUrl = "/goodsSite/market/getIndexMarket?customerId="+(User_id || '')+"&pageSize=20&pageNo=";
            gUrl = getGoodsUrl + gYurl+"&recordsNumber=" + recordsNumber+"";
        }
    }
    if (works == 1 || sEId == 3) {
        gFun = showGoodsList;
        recordsNumber =0;
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/goodsSite/goods/searchGoods?igsType=11";
        if (sEId == 3) {
            getGoodsUrl = sUrl + '&pageSize=' + 20+ '&customerId=' + (User_id || '') + '&searchContext=' + _key + '&pageNo=';
            gUrl = getGoodsUrl + gYurl;
        } else {
            if (pid) gYurl = gYurl + '&category=' + pid[0] + '&productTypeId=' + pid[1] + '&interestTypeId=' + pid[2] + '&targetType=' + pid[3];
            getGoodsUrl = "/goodsSite/market/getIndexMarket?customerId=" + (User_id || '')+"&pageNo=";
            gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20+"&recordsNumber=" + recordsNumber+"";
        }
    }
    if (works == 2 || sEId == 4) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/topicSocSite/topic/searchTopic?";
        if (sEId == 4) {
            getGoodsUrl = sUrl + '&pageSize=' + 20+ '&customerId=' + (User_id || '') + '&searchContext=' + _key + '&searchType=02&pageNo=';
            gUrl = getGoodsUrl + gYurl;
        } else {
            gYurl = gYurl + '&category=' + pid;
            getGoodsUrl = "/topicSocSite/topic/topicList?memberId="+(User_id || '')+"&currPage=";
            gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
        }
    }
    if (works == 3 || sEId == 2) {
        gFun = Artists;
        sUrl = "/memberSite/members/searchArtists?";
        getGoodsUrl = sUrl + 'searchContext=' + _key+ '&customerId=' + (User_id || '') + '&pageSize=' + 10 + '&pageNo=';
        gUrl = getGoodsUrl + pageIndex + '&abbr=' + Alange //+ '&opMemberId=' + User_id;
    }
}
/**
 * TODO 替换setGoodsLike、subGoodsLikes、setGoodsLikes
 * like及取消like
 * @param goodsId 商品ID
 * @param isCancel 是否为取消。true/false
 */
function clickLike(obj, goodsId) {
    var me = $(obj);
    var code = me.attr("data-code");
    var operation = 1;
    var _code = parseInt(me.attr("data-code"));
    if (_code == 1) operation = -1;
    ArtJS.login.pop(function () {
        if (me.data('state') == null || me.data('state')) {
            me.data('state', false);
            $.ajax({
                type: "GET",
                url: '/goodsSite/goods/like?id=' + goodsId + '&like=' + operation + '&customerId=' + User_id,
                dataType: "json",
                success: function (rs) {
                    if (rs.code == 200) {
                        var num = ~~(me.next('c').html());
                        // 1: 取消 0: 关注
                        if (code == 1) {
                            me.attr("data-code", 0).removeClass('ico-likes').next('c').html(--num);
                        } else {
                            me.attr("data-code", 1).addClass('ico-likes').next('c').html(++num);
                        }
                    } else {
                        alert("system error , try again later")
                    }
                    me.data('state', true);
                },
                error: function () {
                    me.data('state', true);
                }
            });
        }
    });
}

// 喜欢
var likestatus = true;
function artsLike(obj, goodsId, type) {
    // var item = obj.item;
    var me = $(obj);
    var data_code=me.attr("data-code");
    if(data_code&&data_code=="1"){
        //已经关注过 要取消
        type=true;
    }
    ArtJS.login.pop(function (o) {
        likestatus = false;
        var data = {
            goodsId:goodsId,
            type:type? 2: 1
        }
        var likeUrl="/goodsSite/goods/like/{goodsId}/{type}";
        $.ajax({
                type: "post",
                url: likeUrl.substitute(data),
                data: [],
                dataType: "json",
                success: function (data) {
                     if(data.result){
                        var num = data.result;
                        // 1: 关注 2: 取消
                            // if (code == '1') {
                            //     me.attr('data-code', '2')
                        if(type){
                            me.attr('data-code', '2').removeClass('ico-likes').next('i').html(num);                    
                        }else{
                            me.attr('data-code', '1').addClass('ico-likes').next('i').html(num);    
                        }
                        // item.light = item.light? false: true;
                    }
                    likestatus = true;
                },
                error: function () {
                    likestatus = true;
                }});
        /*$http.get(likeUrl.substitute(data)).
        success(function (data) {
            if(data.result){
                var num = data.result;
                if(type){
                    me.removeClass('ico-likes').next('i').html(num);                    
                }else{
                    me.addClass('ico-likes').next('i').html(num);    
                }
                // item.light = item.light? false: true;
            }
            likestatus = true;
        }).
        error(function () {
            likestatus = true;
        });*/
    });
}
/*
function artsLike(obj, goodsId, type) {
    var me = $(obj);
    ArtJS.login.pop(function () {
        if (me.data('state') == null || me.data('state')) {
            me.data('state', false);
            User_id = ArtJS.cookie.get('User_id') || ''
            var apiUrl;
            var code = me.attr('data-code');
            var data = {
                id: goodsId,
                like: code
            };
            // 0: 艺术品   1: 衍生品   2: 灯丝圈
            if (type == '0') {
                apiUrl = '/goodsSite/arts/like'
                data.customerId = User_id
            } else if (type == '1') {
                apiUrl = '/goodsSite/goods/like'
                data.customerId = User_id
            } else if (type == '2') {
                apiUrl = '/topicSocSite/topic/like'
                data.memberId = User_id
            }
            data.like = code;
            $.ajax({
                type: "POST",
                url: apiUrl,
                data: data,
                dataType: "json",
                success: function (rs) {
                    if (rs.code == 200) {
                        if (rs.result) {
                            var rst = rs.result;
                            var num = typeof rst.collectionNumber == 'number'? rst.collectionNumber: rst.like;
                            // 1: 关注 2: 取消
                            if (code == '1') {
                                me.attr('data-code', '2').addClass('ico-likes').next('i').html(num);
                            } else {
                                me.attr('data-code', '1').removeClass('ico-likes').next('i').html(num);
                            }
                        } else {
                            var num = ~~(me.next('i').html());
                            if (code == '1') {
                                me.attr('data-code', '2').addClass('ico-likes').next('i').html(++num);
                            } else {
                                me.attr('data-code', '1').removeClass('ico-likes').next('i').html(--num);
                            }
                        }
                    } else {
                        alert("system error , try again later")
                    }
                    me.data('state', true);
                },
                error: function () {
                    me.data('state', true);
                }
            });
        }
    });
}*/
// 关注艺术家
function doFollowArtist(obj, id) {
    var me = $(obj);
    ArtJS.login.pop(function () {
        var code = me.attr('data-code');
        var followUrl = '/memberSite/memberFollows/opFollow';
        var data={
            memberId:ArtJS.login.userData.memberId,
            followingId:id,
            opType:$(obj).attr("data-code")
        }
        if (me.data('state') == null || me.data('state')) {
            me.data('state', false);
            $.ajax({
                type: "POST",
                url: followUrl,
                data: data,
                success: function (rs) {
                    var result = rs;
                    if (result.code == 200) {
                        if (code == 1) {
                            me.removeClass('active').attr("data-code", 0).html(LANGUAGE_NOW.goods.follow);
                        } else {
                            me.addClass('active').attr("data-code", 1).html(LANGUAGE_NOW.goods.following);
                        }
                    } else {
                        alert(result.message);
                    }
                    me.data('state', true);
                },
                error: function () {
                    me.data('state', true);
                }
            });
        }
    });
}
var index = 1;
function checkScrollSide() {
    var parentNode = document.getElementById('image_wall');
    var imgArr = getObj(parentNode, 'good-item masonry-brick');

    //高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var lastH = (imgArr[imgArr.length - 1].offsetTop + Math.floor(imgArr[imgArr.length - 1].offsetHeight / 2)) * 300;
    if (index == 1) {
        lastH = (imgArr.length - 1) * 280;
    } else {
        lastH = (imgArr.length - 1) * 320;
        index++;
    }

    //注意解决兼容性
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    //窗口高度
    var documentH = document.documentElement.clientHeight;

    //到达指定高度后 返回true
    return (lastH < scrollTop + documentH) ? true : false;
}
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(location.search).substr(1).match(reg);
    if(r!=null)return  unescape(r[2]);
    return null;
}
// 滚动拖动事件
$(document).ready(function () {
    //搜索nav hover
    var _container=$("#cont-box").find("ul");
    var sEId = _key = decodeURIComponent(GetQueryString("Type"));//获取Type值
    //加载hover
    var _hover = "";
    if (sEId == "" || sEId == "null") {
        worksVal = $("#container").attr("data-works");
    } else {
        $("#search li").each(function () {
            _hover = parseInt($(this).find("a").attr("data-search"));
            if (sEId == _hover) {
                $(this).addClass("hover");
                worksVal = $(this).find("a").attr("data-works");
            }
        });
    }
    $(window).scroll(function () {
        var srollPos = $(window).scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        var IDStr = pid? '&category=' + pid[0] + '&productTypeId=' + pid[1] + '&interestTypeId=' + pid[2] + '&targetType=' + pid[3]: '';
        if (($(document).height() - range) <= totalheight && onflg && tempdis ==1&& stopflg) {
            // 0:收藏品 1: 礼品 2: 灯丝圈 3: 艺术家
            if (worksVal == 0) {
                if($("#cont-box").find("ul").attr("tag")==1){
                    return;
                }else {
                    onflg = false;
                    FrameNum++;
                    $.ajax({
                        type: "GET",
                        url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum + '&recordsNumber=' + recordsNumber+ '&abbr=' + Alange + IDStr,
                        dataType: "json",
                        beforeSend: LoadPushFunction,
                        success: function (data) {
                            if (data) {
                                recordsNumber = data.result.recordsNumber;
                                pageIndex++;
                                var totalSize = data.result.totalPage;
                                var curIndex = data.result.pageNo;
                                if (data.result.pageItems==null || data.result.pageItems.length == 0) {
                                    $("#nogoodsDatail").show();
                                    $('#stopFlg').val(0);
                                    tempdis = 0;
                                    return;
                                } else {
                                    $('#stopFlg').val(1);
                                    tempdis = 1;
                                }

                                var appElement = document.querySelector('[ng-controller=works-ctr]');
                                var $scope = angular.element(appElement).scope();

                                $(data.result.pageItems).each(function (index, v) {
                                    text = $(ArtList.AartworkNew(index, v));
                                    $container = $('#container');
                                    text.find(".art_img").click(function () {
                                        var id=v.goodsId;
                                        if(v.type==0){
                                            // $scope.$$childTail.openArtDeatils(v.goodsId);
                                            ArtJS.goods.detail(id);
                                        }else if(v.type==1){
                                            // $scope.$$childTail.openShopDetails(v.goodsId,1);
                                            ArtJS.goods.detail(id);
                                        }else if(v.type==2){
                                            // $scope.$$childTail.openShopDetails(v.goodsId);
                                            ArtJS.goods.detail(id);
                                        }
                                    });
                                    $container.append(text);
                                });
                            } else {
                                $("#nogoodsDatail").show();
                                tempdis = 0
                            }
                        },
                        complete: function () {
                            $(".loadshowcss").hide();
                            onflg = true;
                        }
                    });
                }
            }
            if (worksVal == 1) {
                    onflg = false;
                    FrameNum++;
                    $.ajax({
                        type: "GET",
                        url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum + '&abbr=' + Alange + IDStr + '&pageSize=' + 20,
                        dataType: "json",
                        beforeSend: LoadPushFunction,
                        success: function (data) {
                            if (data) {
                                recordsNumber =data.result.recordsNumber;
                                pageIndex++;
                                var currentPage = data.result.pageNo;
                                if (data.result.pageItems==null || data.result.pageItems.length == 0) {
                                    $("#nogoodsDatail").show();
                                    tempdis = 0;
                                } else {
                                    tempdis = 1;
                                }
                                var appElement = document.querySelector('[ng-controller=works-ctr]');
                                var $scope = angular.element(appElement).scope();

                                $(data.result.pageItems).each(function (index, v) {
                                    text = $(ArtList.AartworkNew(index, v));
                                    $container = $('#container');
                                    text.find(".art_img").click(function () {
                                        var id=v.goodsId;
                                        if(v.type==0){
                                            // $scope.$$childTail.openArtDeatils(v.goodsId);
                                            ArtJS.goods.detail(id);
                                        }else if(v.type==1){
                                            // $scope.$$childTail.openShopDetails(v.goodsId,1);
                                            ArtJS.goods.detail(id);
                                        }else if(v.type==2){
                                            // $scope.$$childTail.openShopDetails(v.goodsId);
                                            ArtJS.goods.detail(id);
                                        }
                                    });
                                    $container.append(text);
                                });
                            } else {
                                $("#nogoodsDatail").show();
                                tempdis = 0
                            }
                        },
                        complete: function () {
                            $(".loadshowcss").hide();
                            onflg = true;
                        }
                    });
            }
            if (worksVal == 2) {
                if($("#cont-box").find("ul").attr("tag")==1){
                    return;
                }else {
                    onflg = false;
                    FrameNum++;
                    $.ajax({
                        type: "GET",
                        url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum + '&abbr=' + Alange + IDStr + '&pageSize=' + 20,
                        dataType: "json",
                        beforeSend: LoadPushFunction,
                        success: function (data) {
                            if (data.code == '200') {
                                pageIndex++;
                                var totalSize = data.size;
                                var curIndex = data.curIndex;
                                if (data.result.pageItems.length == 0) {
                                    $("#nogoodsDatail").show();
                                    tempdis = 0;
                                    return;
                                } else {
                                    $('#stopFlg').val(1);
                                    tempdis = 1;
                                }
                                $(data.result.pageItems).each(function (index, v) {
                                    text = ArtList.special(index, v);
                                    $container = $('#container');
                                    $container.append(text);
                                });
                            } else {
                                $("#nogoodsDatail").show();
                                tempdis = 0
                            }
                        },
                        complete: function () {
                            $(".loadshowcss").hide();
                            onflg = true;
                        }
                    });
                }
            }
            if (worksVal == 3) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: function (data) {
                        if (data.code == '200') {
                            pageIndex++;
                            var curIndex = data.curIndex;
                            if (data.result.pageItems==null || data.result.pageItems.length == 0) {
                                $("#nogoodsDatail").show();
                                tempdis = 0;
                                return;
                            } else {
                                $('#stopFlg').val(1);
                                tempdis = 1;
                            }
                            $(data.result.pageItems).each(function (index, v) {
                                var text = ArtList.Artists(index, v);
                                $Artists = $('#index-Artists');
                                $Artists.append(text);
                            });
                        } else {
                            $("#nogoodsDatail").show();
                            tempdis = 0
                        }
                    },
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
        }
    });
    // 初始化数据
    if ($("#tagId").val() > 0) {
        searchGoodsByTag($("#tagId").val());
    } else {
        if($("#container").attr("data-works") ==2){
            pid ="";
        }
        findFirstGoodsPage($("#container").attr("data-works"), pid, sEId);
    }
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }
});
//艺术品分类检索
function artworkFun() {
    var nav = document.getElementById("navList");
}
/*分类筛选*/
;(function () {
    //搜索结果分类选择
    $("#search").on("click","li",function () {
        $(this).addClass("hover").siblings().removeClass("hover");
        var works = $(this).find("a").attr("data-works"), Shref = $(this).find("a").attr("data-href"), Sid = $(this).find("a").attr("data-search");
        srckey = $("#search").val();
        sUrl = Shref;
        sEId = Sid;
        worksVal = works;
        findFirstGoodsPage(works, pid, sEId);
        tempdis =1;
    });
    //搜索显示结果
    var dataSearch = document.getElementById("dataSearch");
    var s_val= document.getElementById("s_val");
    var searchval = document.getElementById("search");
    var upVal = document.getElementById("upVal");
})();
var typeBases = {
    // 兴趣
    interest: function (obj) {
        var that  = this;
        var obj   = $(obj);
        var wks   = parseInt($("#container").attr("data-works"));
        var actId = obj.attr("data-pid");
        var tName = obj.attr('data-name');
        $('#fenleiSpecial .shopSx span').html(tName);
        if (actId == 218 || actId == 345) {
            obj.prevAll().removeClass("click");
            obj.addClass("active").siblings().removeClass("active");
            if(obj.attr("tag") ==0) {
                obj.attr("tag",1).siblings().attr("tag",0);
                $("#cont-box, #cont-box >ul").addClass("activity");
                $("#cont-box >ul").attr({id: "activity", tag: 1});
                var _ty = obj.attr("typeid");
                actList.actInit(_ty);
                var p = 1;
                actList.actSorc(p,_ty);
            }
        } else {
            if (flagAjax) {
                flagAjax = true;
                obj.attr("tag", 1).siblings().attr("tag", 0);
                $("#cont-box, #cont-box >ul").removeClass("activity");
                $("#cont-box >ul").attr({id: "container", tag: 0});
                var name = obj.attr('data-name');
                if (obj.hasClass("active click")) {
                    obj.removeClass("a active click");
                } else {
                    obj.addClass("active click");
                    obj.prevAll().removeClass("a active click");
                    obj.nextAll().removeClass("a active click");
                }
                var flag = obj.parents("dd").find("a").eq(0).attr("class");
                if (obj.attr("data-pid") == "") {
                    obj.removeClass('click');
                    var _class = obj.attr("class");
                    if (_class == "active allActive" || _class == "allActive") {//去除全部
                        obj.removeClass('active allActive');
                        obj.nextAll("a").removeClass('click');
                        obj.nextAll("a").removeClass('active');
                    } else {
                        obj.addClass('allActive');
                        obj.nextAll("a").removeClass('active');
                    }
                } else {
                    name = obj.parent().find('a').eq(0).attr('data-name');
                    var sl = true;
                    if (flag == undefined || flag == "") {
                        sl = false;
                    } else {
                        if (sl) {
                            obj.parents("dd").find("a").eq(0).removeAttr('class');
                            obj.parents("dd").find("a").removeClass("click")
                            obj.addClass('active click');
                        }
                    }
                }
                var categoryId = that.bm(actId);
                pid = categoryId;
                if (pid == ",") categoryId = "";
                $("#nogoodsDatail").hide();
                findFirstGoodsPage(wks, categoryId, sEId);
            }
        }
    },
    // 商品
    product: function (obj) {
            var that = this;
            var obj = $(obj);
            $('.fenlei-product a').removeClass("active click");
            obj.addClass("active click");

            var wks = parseInt($("#container").attr("data-works"));
            var actId = obj.attr("data-pid");
            var categoryId = that.bm(actId),
                pageIndexStart = undefined;

            var yzp1 = ["350", "351", "352", "353", "354", "355", "358", "360"];

            //筛选全部商品规则不一样
            if (categoryId[3] == 'renqi') {       //人气最高最高时从20页后查询
                pageIndexStart = 20;
            }
            if (categoryId[3] == 'zuixin') {    //最新上架最高时从40页后查询
                pageIndexStart = 40;
            }
            if ($.inArray(actId, yzp1) >= 0) {        //判断是艺术原作时
                var list = obj.parent().parent().find('dd').html();
                list = list.replace(/(product)/g, 'product2');
                $('#fenleiSpecial>dt').append('<a data-pid="' + actId + '" style="display:none;"></a>').find(">span").html(obj.html());
                $('#fenleiSpecial>dd').html(list);
                //ArtList.NavSpecialMod(list);
            } else {
                $('#fenleiSpecial').remove();
                that.getInterest(obj);
            }
            //零时解决方案--end
            pid = categoryId;
            if (pid == ",") categoryId = "";

            findFirstGoodsPage(wks, categoryId, sEId, pageIndexStart);
    },
    // 商品(艺术原作特殊处理)
    product2: function (obj) {
        var that = this;
        var obj = $(obj);
        var wks = parseInt($("#container").attr("data-works"));
        var actId = obj.attr("data-pid");
        var tName = obj.text().trim();
        $('#fenleiSpecial .shopSx span').html(tName);
        if (!obj.hasClass("active click")) {
            $('.fenlei-product a').removeClass("active click");
            obj.addClass("active click").siblings("a").removeClass("active click");
            var categoryId = that.bm(actId);
            pid = categoryId;
            if (pid == ",") categoryId = "";
            findFirstGoodsPage(wks, categoryId, sEId);
        }
    },
    // 商品(全部, 最新, 人气, 最新)
    product3: function (obj) {
        var that = this;
        var obj = $(obj);
        var wks = parseInt($("#container").attr("data-works"));
        var actId = obj.attr("data-pid");
        var pageIndexStart=undefined;
        if (!obj.hasClass("active click")) {
            $('.fenlei-product a').removeClass("active click");
            obj.addClass("active click");
            var categoryId = that.bm(actId);
            //筛选全部商品规则不一样
            if (categoryId[3] == 'renqi') {       //人气最高最高时从20页后查询
                pageIndexStart = 20;
            } if (categoryId[3] == 'zuixin') {    //最新上架最高时从40页后查询
                pageIndexStart = 40;
            }
            if (!~~actId) {
                $('#fenleiSpecial').remove();
                $('#fenlei').append(typeBases._init);
            }
            pid = categoryId;
            if (pid == ",") categoryId = "";
            findFirstGoodsPage(wks, categoryId, sEId,pageIndexStart);
        }
    },
    bm: function (id) {
        var category       = '';    // 1
        var productTypeId  = '';    // 2
        var interestTypeId = '';    // 3
        var targetType     = [];
        $("#fenlei a.click").map(function() {
            pid = $(this).attr('data-pid');
            var type = $(this).attr('data-type');
            if (isNaN(pid-0)) targetType.push(pid)
            else {
                if (type == 1) {        // 商品一级分类
                    category = pid;
                } else if (type == 2) { // 商品二级分类
                    if(prFag) {
                        prFag = false;
                        productTypeId = pid;
                        category = $(this).parent().parent().find('dt>a').attr('data-pid');
                    }
                } else if (type == 3) { // 兴趣分类
                    interestTypeId = pid;
                }
                if (id == pid) {
                    if (type == 1) {
                        productTypeId = '';
                    } else if (type == 2) {
                        if(prFag) {
                            prFag = false;
                            var dt = $(this).parent().parent().find('dt>a');
                            category = dt.attr('data-pid');
                            dt.addClass('active click');
                        }
                    }
                }
            }
        });
        var sval = [category, productTypeId, interestTypeId, targetType.join(',')];
        return sval;
    },
    getInterest: function (obj) {
        var that = this;
        if (!that.statue || that.statue) {
            that.statue = false;
            var id   = obj.attr('data-pid');
            var type = obj.attr('data-type');
            if (type == 1) {
                var dd = obj.parent().parent().find('dd>a');
                var ids = [];
                dd.each(function (i, e) {
                    ids.push($(e).attr('data-pid'));
                });
                id = ids.join(',');
            }
            $.ajax({
                type: 'get',
                url:  '/topicSocSite/topic/listInterestIdsByGoodsCount',
                data: {
                    abbr: Alange,
                    typeIds: id
                },
                success: function (rs) {
                    if (rs.code && rs.code == 200 && rs.result.length>0) {
                        var list = rs.result;
                        var str = ArtList.NavSpecialMod(list);
                        $('#fenlei').append(str);
                    }
                    that.statue = true;
                },
                error: function () {
                    that.statue = true;
                }
            });
        }
    }
};