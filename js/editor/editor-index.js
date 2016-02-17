/**
 * Created by Administrator on 2015/9/18.
 */
//用户id
var User_id = parseInt(getCookie("User_id"));
var enshrines_key = getCookie('enshrines_key');
var flagAjax=true;
var sEId = ""; //兴趣 interestTypeId  //productTypeId 商品父级
var category       = "";    // 1
var productTypeId  = "";    // 2
var interestTypeId = "";    // 3
//衍生品||艺术品(合并)
function showGoodsList(data) {
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
    if(data.code ==200){
        flagAjax =true;
    }
    var $container = $('#container');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: 'li',
            columnWidth: 0 //每两列之间的间隙为像素
        });
    });
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.giftShop(index, v, shFlag);
        $container = $('#container');
        $container.append(text).masonry('reload');
    });
}
//灯丝圈
function special(data) {
    onflg = false;
    var data = data;
    pageIndex++;
    var text = "";
    $("#container").removeAttr("style");
    if (typeof(data.result) === "undefined") {
        return;
    }
    if(data.code ==200){
        flagAjax =true;
    }
    $(data.result.pageItems).each(function (index, v) {
        var text =$(ArtList.special(index, v, shFlag, dataArry));
        $container = $('#container');
        $container.append(text);
    });
}
// 初始化数据
function findFirstGoodsPage(mark) {
    $("#container").html('');
    dataFun(mark);
    $.ajax({
        type: "GET",
        url: gUrl,
        dataType: "json",
        //beforeSend: LoadFunction,
        success: gFun,
        beforeSend: function () {
            $(".loadshowcss").show();
        },
        error: function () {
            //alert('Query failed');
        },
        complete: function () {
            onflg = true;
            $(".loadshowcss").hide();
        }
    });
}
function dataFun(mark) {
    //pageIndex = 1;
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = "/topicSocSite/topic/topicList?parentCategoryId="+interestTypeId+"&currPage=";
        gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
    }
    if (mark == 3) {//礼品店
        gFun = showGoodsList;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = "/goodsSite/market/getIndexMarket?customerId=&parentCategoryId="+category+"&productCategoryId="+productTypeId+"&interestCategoryId="+interestTypeId+"&pageNo=";
        gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
    }
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
//滚动加载
$(document).ready(function () {
    var _shFlag="";
    $(window).scroll(function () {
        var srollPos = $(window).scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        console.log("aaaa");
        if (($(document).height() - range) <= totalheight && onflg && tempdis && stopflg == 1) {
            if (markValSrc == 3) {
                console.log("衍生品");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&pageSize=' + 20,
                    dataType: "json",
                    beforeSend: gSucce.LoadPush,
                    success: gSucce.gfunt,
                    complete: gSucce.complete
                });
            }
            if (markValSrc == 1) {
                console.log("灯丝圈");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+'&pageSize='+20,
                    dataType: "json",
                    beforeSend: gSucce.LoadPush,
                    success: gSucce.gfunt,
                    complete: gSucce.complete
                });
            }
        }
    });
    // 初始化数据
    $("#box-menu li").each(function(){
        if($(this).attr("class") =="current"){
            markVal =$(this).find("a").attr("data-mark");
            markValSrc =$(this).find("a").attr("data-mark");
            sLei = $(this).attr("indexTag");
            LeiId = $(this).find("a").attr("data-classify");
        }
    });
    $(".editor-nav a").each(function(){
        if($(this).hasClass("active")){
            shFlag = $(this).attr("flag");
        }
    });
    setTimeout(function(){findFirstGoodsPage(markVal);},500);
    categoryId = markVal;
    /*大分类筛选*/
    //sNav(sLei);
    $("#box-menu li").click(function () {
        $("#container").removeAttr('style');
        $(this).addClass("current").siblings().removeClass("current");
        $("#box-menu li").each(function () {
            if ($(this).attr("class") == "current") {
                sLei = $(this).attr("indexTag");
                LeiId = $(this).find("a").attr("data-classify");
                markValSrc = $(this).find("a").attr("data-mark");
                orderByType = 2;
                stopflg = 1;
                $("#selectxb").html("按更新时间正序");
            }
        });
        if(LeiId ==3){
            $("#classify").find(".shopSx").show();
            $("#classify").find("dl.right").removeClass("dl_sp");
            $("#shopClass").show();
        }else{
            $("#classify").find(".shopSx").hide();
            $("#classify").find(".right").addClass("dl_sp");
            xiaL.getSpInter(1);
            setTimeout(function(){xiaL.show();},2000);
            $("#shopClass").hide();
        }
        flagAjax =true;
        $("#fenlei dd").find("a").removeClass("active click");
        var _markVal = $(this).find("a").attr("data-mark");
        markValSrc = _markVal;
        category ="";
        $("#index-classify dd").find("a").removeClass("active click");
        $(".shopSx").find("span").html($(".shopSx").attr("sname"));
        findFirstGoodsPage( _markVal);
    });
    var $nav =$("#shopClass dd a");
    var $dtR =$("#fenleiSpecial");
    $nav.live("click", function (event) {
        var MarkVal = "";
        var obj=$(this);
        var fyPid=$(this).attr("data-pid");
        $("#box-menu li").each(function(){
            if($(this).attr("class") =="current"){
                MarkVal =$(this).find("a").attr("data-mark");
                markValSrc =$(this).find("a").attr("data-mark");
            }
        });
        if(flagAjax) {
            if(fyPid ==350){
               var _html =obj.next().html();
                var part =$dtR.find('div');
                obj.next().hide();
                part.html(_html);
            }else{
                xiaL.getInterest(obj);
            }
            flagAjax =false;
            $(this).attr("tag", 1).siblings().attr("tag", 0);
            var parent = $('#' + $(this).parent().attr('data-dtid'));
            if (parent.data('state') == null || parent.data('state')) {
                parent.data('state', false);
                var name = $(this).attr('data-name');
                $(this).parent().parent().parent().find("a").removeClass('active click');
                if($(this).hasClass("active click")){
                    $(this).removeClass("active click");
                }else{
                    $(this).addClass("active click");
                }
                var flag = $(this).parents("dd").find("a").eq(0).attr("class");
                if ($(this).attr("data-pid") == "") {
                    $(this).removeClass('click');
                    var _class = $(this).attr("class");
                    if (_class == "active allActive" || _class == "allActive") {//去除全部
                        $(this).removeClass('active allActive');
                        $(this).nextAll("a").removeClass('click');
                        $(this).nextAll("a").removeClass('active');
                    } else {
                        $(this).addClass('allActive');
                        $(this).nextAll("a").removeClass('active');
                    }
                } else {
                    name = $(this).parent().find('a').eq(0).attr('data-name');
                    var sl = true;
                    if (flag == undefined || flag == "") {
                        sl = false;
                    } else {
                        if (sl) {
                            $(this).parents("dd").find("a").eq(0).removeAttr('class');
                            $(this).parents("dd").find("a").removeClass("click")
                            $(this).addClass('active click');
                        }
                    }
                }
                parent.html(name);
                var _inter = xiaL.interFy(fyPid);
                interestTypeId ="";
                $("#nogoodsDatail").hide();
                stopflg = 1;
                findFirstGoodsPage(MarkVal);
            }
        }
    });
    //兴趣
    var $inter = $('#fenleiSpecial div>a');
    $inter.live("click", function(){
        var that = $(this);
        var interAct = that.attr("data-pid");
        $("#box-menu li").each(function(){
            if($(this).attr("class") =="current"){
                MarkVal =$(this).find("a").attr("data-mark");
                markValSrc =$(this).find("a").attr("data-mark");
            }
        });
        if(flagAjax) {
            flagAjax = true;
            if (that.hasClass("active click")) {
                that.removeClass("active click");
            } else {
                $('.fenlei-special>div a').removeClass("active click");
                that.addClass("active click");
            }
            var _inter = xiaL.interFy(interAct);
            findFirstGoodsPage(MarkVal);
        }
    });
    xiaL.init();
});
/*分类筛选*/
function sNav(sLei) {
    //var Alange = ArtJS.server.language;
    var Alange = "CN";
    var _http = "/topicSocSite/topic/getTypeBasesByPage" + '?source=web&page=index&abbr=' + Alange+ '&indexTag=' + sLei;
    $.ajax({
        url: _http,
        data:{},
        type: 'post',
        dataType: 'json',
        success: function (data) {
            var data = data;
            if (data.code == '200') {
                dataArry = data;
                $('#fenlei').html('');
                $(data.result).each(function (index, v) {
                    var text = ArtList.NavFL(index, v, sLei);
                    $fenlei = $('#fenlei');
                    $fenlei.append(text);
                });
                $("#fenlei").find("dt:gt(0),dd:gt(0)").hide();
            } else {
                console.log('添加失败')
            }
        }
    });
}
//获取下啦分类
var xiaL={
    init:function(){
        var that = this;
        that.xAjax();
        that.getSpInter(3);
    },
    xAjax:function(){
        $.ajax({
            url: "/topicSocSite/topic/getTypeBasesByPage",
            data:{
                abbr:"CN",
                indexTag:2,
                page:"index",
                source:"web"
            },
            type: 'post',
            dataType: 'json',
            success: function (data) {
                var data = data;
                if (data.code == '200') {
                    $(data.result).each(function (index, v) {
                        var text = ArtList.indexClass(index, v, sLei);
                        $shopClass = $('#shopClass');
                        $shopClass.append(text);
                    });
                } else {
                    console.log('添加失败')
                }
            }
        });
    },
    show:function(){
            $("#fenleiSpecial div a").each(function(){
                var id = $(this).attr("data-pid");
                if(id ==218 || id ==345){
                    $(this).show();
                }
            });
        },
    hide:function(){
            $("#fenleiSpecial div a").each(function(){
                var id = $(this).attr("data-pid");
                if(id ==218 || id ==345){
                    $(this).hide();
                }
            });
        },
    interFy:function(id) {//选中的id
        var _sval ='';
        $("#classify a.click").map(function() {
            var _pid = $(this).attr('data-pid');
            var sort = $(this).attr('data-sort');
            pageIndex =1;
                if (sort == 1) {        // 商品一级分类
                    if(_pid == 437){
                        category = "";
                        _sval =category;
                    }else{
                        category = _pid;
                        _sval =category;
                    }
                } else if (sort == 2) { // 商品二级分类
                    if( _pid== 439 || _pid == 441 || _pid == 443){
                        _sval = "";
                        category = "";
                        productTypeId ="";
                        if(_pid ==443){
                            pageIndex =40;
                        }
                        if(_pid ==441){
                            pageIndex =20;
                        }
                    }else{
                        productTypeId = _pid;
                        _sval = productTypeId;
                        category = $(this).parent().prev().attr('data-pid');
                    }
                } else if (sort == 3) { // 兴趣分类
                    interestTypeId = _pid;
                    _sval = interestTypeId;
                }
                if (id == pid) {
                    if (sort == 1) {
                        productTypeId = '';
                    } else if (sort == 2) {
                        category = $(this).parent().prev().attr('data-pid');
                    }
                }
        });
        var sval = _sval//[category, productTypeId, interestTypeId];
        return sval;
   },
    getInterest:function(obj){
        var that =obj;
        var id   = obj.attr('data-pid');
        var type = obj.attr('data-sort');
        if (type == 1) {
            var dd = obj.parent().find('div > a');
            console.log(dd+"ddddddddd");
            var ids = [];
            dd.each(function (i, g) {
                ids.push($(g).attr('data-pid'));
            });
            console.log(ids+"idsidsids");
            id = ids.join(',');
        }
        $.ajax({
            type: 'get',
            url:  '/topicSocSite/topic/listInterestIdsByGoodsCount',
            data: {
                abbr: "CN",
                typeIds: id
            },
            success: function (rs) {
                $('#fenleiSpecial').empty();
                if (rs.code && rs.code == 200) {
                    var rRe = rs.result;
                        var str = ArtList.NavInter(rRe);
                        $('#fenleiSpecial').append(str);
                    xiaL.hide();
                }
                that.statue = true;
            },
            error: function () {
                that.statue = true;
            }
        });
    },
    getSpInter:function(amrk){
        var Url = "/topicSocSite/topic/getTypeBasesByPage";
        var data = {
            language: Alange,
            indexTag: 1,
            abbr: "CN",
            page: "index",
            source: "web"
        };
        $.ajax({
            url: Url,
            data: data,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var data = data;
                if (data.code == '200') {
                    $('#fenleiSpecial').empty();
                    $(data.result).each(function (index, v) {
                        var str = ArtList.NavSpecial(amrk,index, v);
                        $('#fenleiSpecial').append(str);
                        //xiaL.hide();
                    });
                }
            }
        });
    }
}
//滚动成
var gSucce={
    gfunt:function (data) {
        if (data) {
            pageIndex++;
            if (data.result.pageItems.length == 0) {
                stopflg = 0;
            } else {
                stopflg = 1;
            }
            $(data.result.pageItems).each(function (index, v) {
                if(markValSrc ==3){
                    text = ArtList.giftShop(index, v, shFlag);
                }else if(markValSrc ==1){
                    text = ArtList.special(index, v, shFlag);
                }
                $container = $('#container');
                $container.append(text).masonry('reload');
            });
        } else {
            stopflg = 0
        }
    },
    complete: function () {
        $(".loadshowcss").hide();
        onflg = true;
    },
    LoadPush : function(){
        $(".loadshowcss").show();
    }
}