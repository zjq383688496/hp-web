/**
 * Created by Administrator on 2015/9/18.
 */
//用户id
var User_id = parseInt(getCookie("User_id"));
var enshrines_key = getCookie('enshrines_key');
var axFlg=true;
var flagAjax=true;
var category="";
var targetType="top";
//衍生品
function showGoodsList(data) {
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
    if(data.code ==200){
        axFlg =true;
        flagAjax =true;
    }
    var $container = $('#container');
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Aartwork(index, v, shFlag);
        $container = $('#container');
        $container.append(text);
    });
}
//艺术品
function showYspList(data) {
    onflg = false;
    var data = data;
    pageIndex++;
    if(data.code ==200){
        axFlg =true;
        flagAjax =true;
    }
    var $container = $('#container');
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Aworks(index, v, shFlag, dataArry);
        $container = $('#container');
        $container.append(text);
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
        axFlg =true;
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
function dataFun(mark) {
    pageIndex = 1;
    if (mark == 2) {
        gFun = showYspList;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
            gYurl = gYurl;
            getGoodsUrl = artUrl + "goodsSite/arts/listArts?pageSize=20&orderByType="+orderByType+"&category="+category+"&pageNo=";
            gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 3) {
        gFun = showGoodsList;
        var gYurl = pageIndex + '&abbr=' + Alange;
            gYurl = gYurl;
            getGoodsUrl = artUrl + "goodsSite/goods/getIndexGoods?category="+category+"&orderByType="+orderByType+"&targetType="+targetType+"&pageNo=";
            gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
    }
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
            gYurl = gYurl;
            getGoodsUrl = artUrl + "topicSocSite/topic/topicList?category="+category+"&orderByType="+orderByType+"&currPage=";
            gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
        }
}
//滚动加载
$(document).ready(function () {
    var _shFlag="";
    $(window).scroll(function () {
        var srollPos = $(window).scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight && onflg && tempdis && stopflg == 1) {
            if (markValSrc == 2) {
                console.log("艺术品");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: stickUcc.sUcc,
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
            if (markValSrc == 3) {
                console.log("衍生品");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&pageSize=' + 20,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: stickUcc.sUcc,
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
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
                    beforeSend: LoadPushFunction,
                    success: stickUcc.sUcc,
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
        }
    });
    // 初始化数据
    $("#box-menu li").each(function(){
        if($(this).attr("class") =="current"){
            markVal =$(this).find("a").attr("data-mark");
            markValSrc =$(this).find("a").attr("data-mark");
        }
    });
    $(".editor-nav a").each(function(){
        if($(this).hasClass("active")){
            shFlag = $(this).attr("flag");
        }
    });
    findFirstGoodsPage(markVal);
    categoryId = markVal;
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }
    //排序筛选
    $("#selectxb").click(function(){
        $(this).next("ul").slideToggle();
        $(this).next("ul").find("li").unbind("click").click(function(){
            orderByType =$(this).attr("id");
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    markVal =$(this).find("a").attr("data-mark");
                }
            });
            findFirstGoodsPage(markVal, pid, srckey, selectedTagId);
            $("#selectxb").html($(this).html());
            $(this).parent().slideUp();
        });
    });
    /*置顶筛选*/
    //排序筛选
    $("#selectTop").click(function(){
        $(this).next("ul").slideToggle();
        $(this).next("ul").find("li").unbind("click").click(function(){
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    markVal =$(this).find("a").attr("data-mark");
                }
            });
            targetType =$(this).attr("id");
            findFirstGoodsPage(markVal);
            $("#selectTop").html($(this).html());
            $(this).parent().slideUp();
        });
    });
    /*大分类筛选*/
    $("#box-menu li").each(function () {
        if ($(this).attr("class") =="current") {
            sLei = $(this).attr("indexTag");
            LeiId = $(this).find("a").attr("data-classify");
        }
    });
    //sNav(sLei);
    $("#box-menu li").click(function () {
        $("#container").removeAttr('style');
        $(this).addClass("current").siblings().removeClass("current");
        $("#box-menu li").each(function () {
            if ($(this).attr("class") == "current") {
                sLei = $(this).attr("indexTag");
                LeiId = $(this).find("a").attr("data-classify");
                markValSrc = $(this).find("a").attr("data-mark");
                if(markValSrc ==2 || markValSrc ==3){
                    xiaL.hide();
                    $("#stick-classify").find(".shopSx").show();
                    $("#stick-classify").find("dl.right").removeClass("dl_sp");
                    $("#shopClass").show();
                    xiaL.getSpInter(3);
                }else if(markValSrc ==1){
                    $("#stick-classify").find(".shopSx").hide();
                    $("#stick-classify").find("dl.right").addClass("dl_sp");
                    xiaL.show();
                    xiaL.getSpInter(1);
                    category ="";
                    $("#index-classify dd").find("a").removeClass("active click");
                    $(".shopSx").find("span").html($(".shopSx").attr("sname"));
                    $("#shopClass").hide();
                }
                orderByType = 2;
                stopflg = 1;
                $("#selectxb").html("按更新时间正序");
                if($(this).attr("indexTag") == 2){
                    $('.ysp-top').show();
                }else{
                    $('.ysp-top').hide();
                }
            }
        });
        flagAjax =true;
        pid = "";
        sNav(sLei);
        $("#fenlei dd").find("a").removeClass("active click");
        var _markVal = $(this).find("a").attr("data-mark");
        markValSrc = _markVal;
        findFirstGoodsPage(_markVal);
        categoryId = _markVal;
    });
    //小分类选择
    $(".shopSx").live("hover",function(){
        $(this).next().removeClass("hide");
    });
    var $nav =$("#stick-classify dd a");
    $nav.live("click", function (event) {
        var MarkVal = "";
        $("#box-menu li").each(function(){
            if($(this).attr("class") =="current"){
                MarkVal =$(this).find("a").attr("data-mark");
                markValSrc =$(this).find("a").attr("data-mark");
            }
        });
        if(flagAjax) {
            flagAjax =false;
            $(this).attr("tag", 1).siblings().attr("tag", 0);
            var parent = $('#' + $(this).parent().attr('data-dtid'));
            if (parent.data('state') == null || parent.data('state')) {
                parent.data('state', false);
                var name = $(this).attr('data-name');
                $(this).parent().parent().parent().find("a").removeClass('active click');
                if($(this).hasClass("a active click")){
                    $(this).removeClass("a active click");
                }else{
                    $(this).addClass("active click");
                    $(this).parent().parent().parent().parent().addClass("hide");
                    $(this).parent().parent().parent().parent().parent().addClass("hide");
                }
                /*var _sXp=sXp();
                if(_sXp ==""){
                }else if(_sXp !=""){
                    $('#pid_id_4').find('span').html(_sXp+"<i class='iconfont icon-close-s'></i>")
                }*/
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
                var _categoryId = bm();
                category =_categoryId;
                $("#nogoodsDatail").hide();
                if(_categoryId ==","){
                    _categoryId = "";
                }
                stopflg = 1;
                findFirstGoodsPage(MarkVal, _categoryId, srckey);
            }
        }
    });
    $sXp=$('.box_choice dt.shopSx');
    $sXp.find('span i.icon-close-s').live("click",function(){
        var sMark="";
        var _sName = $(this).parent().parent().attr("sname");
        $(this).parent().html(_sName);
        $("#stick-classify dd.liwu").find("a").removeClass("active click");
        $("#box-menu li").each(function(){
            if($(this).attr("class") =="current"){
                sMark =$(this).find("a").attr("data-mark");
            }
        });
        var categoryId = bm();
        category = categoryId;
        stopflg = 1;
        findFirstGoodsPage(sMark, categoryId, pid);
    });
    //soRc.soRcf();
});
/*分类筛选*/
function sNav(sLei) {
    var Alange="CN";
    var _http = artUrl + "topicSocSite/topic/getTypeBasesByPage";
    var data={
        source :"web",
        page :"index",
        abbr :Alange,
        indexTag :sLei
    }
    $.ajax({
        url: _http,
        data:data,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            var data = data;
            if (data.code == '200') {
                dataArry = data;
                $('#fenleiNav').html('');
                $(data.result).each(function (index, v) {
                    var text = ArtList.NavFL(index, v, sLei);
                    $fenleiNav = $('#fenleiNav');
                    $fenleiNav.append(text);
                    if(sLei !=1) {
                        xiaL.hide();
                    }
                });
            } else {
                console.log('添加失败')
            }
        }
    });
}
function bm() {//选中的id
    var category = $("#stick-classify dd a.click").map(function() {
        return $(this).attr("data-pid");
    }).get().join(',');
    return category;
}
function sXp() {
    var Cm = [];
    $("#stick-classify dd a.click").map(function() {
        var cName = $(this).find("tt").html();
        Cm.push(cName);
    });
    var sName = [Cm.join('')];
    return sName;
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
        $("#fenleiNav a").each(function(){
            var id = $(this).attr("data-pid");
            if(id ==218 || id ==345){
                $(this).show();
            }
        });
    },
    hide:function(){
        $("#fenleiNav a").each(function(){
            var id = $(this).attr("data-pid");
            if(id ==218 || id ==345){
                $(this).hide();
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
xiaL.init();

var stickUcc={
    sUcc:function (data) {
        if (data) {
            pageIndex++;
            if (data.result.pageItems.length == 0) {
                $('#stopFlg').val(0);
                stopflg = 0;
                return;
            } else {
                $('#stopFlg').val(1);
                stopflg = 1;
            }
            $(data.result.pageItems).each(function (index, v) {
                if(markValSrc ==2){
                    text = ArtList.Aworks(index, v, shFlag);
                }else if(markValSrc ==3){
                    text = ArtList.Aartwork(index, v, shFlag);
                }else if(markValSrc ==1){
                    text = ArtList.special(index, v, shFlag);
                }
                $container = $('#container');
                $container.append(text);
            });
        } else {
            stopflg = 0
        }
    }
}