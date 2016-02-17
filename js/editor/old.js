/**
 * Created by Administrator on 2015/9/22.
 */
//艺术品
var TagId=0;
function showYspList(data) {
    onflg = false;
    var data = data;
    pageIndex++;
    var $container = $('#container');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: 'li',
            columnWidth: 0 //每两列之间的间隙为像素
        });
    });
    if($("#selectxb").length >0){
        $("#showCount i").html(data.result.recordsNumber);
    }
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Aworks(index, v, shFlag, dataArry);
        $container = $('#container');
        $container.append(text).masonry('reload');
    });
}

// 初始化数据
function findFirstGoodsPage(sUrl, mark, pid, srckey, selectedTagId) {
    $("#container").html('');
    dataFun(sUrl, mark, pid, srckey, selectedTagId);
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
function dataFun(sUrl, mark, pid, srckey) {
    pageIndex = 1;
    if (mark == 2) {//艺术品
        gFun = showYspList;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = "/goodsSite/editor/listEditorArtworks?pageSize=20&selectedTagId="+TagId+"&editorId=0&orderByType=" + orderByType + "&pageNo=";
        gUrl = getGoodsUrl + gYurl;
    }
}
//滚动加载
$(document).ready(function () {
    var k = 5;
    var range = 1050;
    var onflg = true;
    var _pageIndex = 1;
    var flag = true;
    var tempdis = true;
    var stopflg = 1;
    $(window).scroll(function () {
        var srollPos = $(window).scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight && onflg && tempdis && stopflg == 1) {
            if (markValSrc == 2) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&category=' + pid,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: function (data) {
                        if (data) {
                            pageIndex++;
                            var totalSize = data.result.totalPage;
                            var curIndex = data.result.pageNo;
                            if (data.result.pageItems.length == 0) {
                                $('#stopFlg').val(0);
                                tempdis = 0;
                                return;
                            } else {
                                $('#stopFlg').val(1);
                                tempdis = 1;
                            }
                            $(data.result.pageItems).each(function (index, v) {
                                text = ArtList.Aworks(index, v, shFlag);
                                $container = $('#container');
                                    $container.append(text).masonry('reload');
                            });
                        } else {
                            tempdis = 0
                        }
                    },
                    error: function () {
                        //alert('Query failed');
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
    categoryId = markVal;
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }
    //筛选条件
    $("#selectxb").click(function(){
        $(this).next("ul").slideToggle();
        $(this).next("ul").find("li").unbind("click").click(function(){
            console.log($(this).attr("id"));
            orderByType =$(this).attr("id");
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    markVal =$(this).find("a").attr("data-mark");
                }
            });
            findFirstGoodsPage(sUrl, markVal, pid, srckey, selectedTagId);
            $("#selectxb").html($(this).html());
            $(this).parent().slideUp();
        });
    });
    //未发布
    $("#M_nav").click(function(){
        $(this).next("ul").slideToggle();
        $(this).next("ul").find("li").unbind("click").click(function(){

            TagId =$(this).attr("tagid");
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    markVal =$(this).find("a").attr("data-mark");
                }
            });
            findFirstGoodsPage(sUrl, markVal, pid, srckey, selectedTagId);
            $("#M_nav").html($(this).html());
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
    sNav(sLei);
    setTimeout(function(){
        findFirstGoodsPage(sUrl, markVal, pid, srckey, selectedTagId);
    },500);
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
                $("#M_nav").html("未发布");
            }
        });
        pid = "";
        sNav(sLei);
        $("#fenlei dd").find("a").removeClass("active click");
        var _markVal = $(this).find("a").attr("data-mark");
        markValSrc = _markVal;
        findFirstGoodsPage(sUrl, _markVal, pid, srckey);
        categoryId = _markVal;
    });
});
/*分类筛选*/
function sNav(sLei) {
    //var Alange=ArtJS.server.language;
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
                    var dataL="";
                        dataL=v;
                        var text = ArtList.NavFL(index, v, sLei);
                        $fenlei = $('#fenlei');
                        $fenlei.append(text);
                    var _id= v.id;
                    if(_id ==207 || _id ==105){
                        ArtList.ztLei(index, v, sLei, dataL);
                    }
                    if(_id ==2){
                        ArtList.xxLei(index, v, sLei, dataL);
                    }
                    if(_id ==465){
                        ArtList.lang(index, v, sLei, dataL);
                    }
                });
                $("#fenlei").find("dt:gt(0),dd:gt(0)").hide();
            } else {
                console.log('添加失败')
            }
        }
    });
}