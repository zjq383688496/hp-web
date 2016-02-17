/**
 * Created by Administrator on 2015/9/24.
 */
/**
 * Created by Administrator on 2015/9/22.
 */
//衍生品
var axFlg=true;
var tempajax = false;
var edited =0;
var tempdis = true;
var stopflg = 1;
function showGoodsList(data) {
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
    if(data.code ==200){
        tempajax =true;
    }
    var $container = $('#container');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: 'li',
            columnWidth: 0 //每两列之间的间隙为像素
        });
    });
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
    var $container = $('#container');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: 'li',
            columnWidth: 0 //每两列之间的间隙为像素
        });
    });
    if(data.code ==200){
        tempajax =true;
        axFlg =true;
    }
    var $sC = $("#showCount");
    if($sC.length >0){
        $sC.find('i').html("&nbsp&nbsp"+data.result.recordsNumber);
    }
    if(data.result.pageItems ==""){
        if(edited ==0)$('#container').html("<font style='text-align: center;color: red;display: inherit;font-size: 14px;'>暂无未编辑数据</font>");
    }
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Aworks(index, v, shFlag, sKm, dataArry);
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
    if(data.code ==200){
        tempajax =true;
    }
    var $container = $('#container');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: 'li',
            columnWidth: 0 //每两列之间的间隙为像素
        });
    });
    if (typeof(data.result) === "undefined") {
        return;
    }
    if(data.code ==200){
        axFlg =true;
    }
    if($("#showCount").length >0){
        $("#showCount i").html(data.result.recordsNumber);
    }
    $(data.result.pageItems).each(function (index, v) {
        var text =$(ArtList.special(index, v, shFlag, dataArry));
        $container = $('#container');
        $container.append(text).masonry('reload');
    });
}
// 初始化数据
function findFirstGoodsPage(sUrl, mark, pid, srckey, editorId) {
    $("#container").html('');
    dataFun(sUrl, mark, pid, srckey, editorId);
    $.ajax({
        type: "GET",
        url: gUrl,
        dataType: "json",
        //beforeSend: LoadFunction,
        success: gFun,
        beforeSend: function () {
            $(".loadshowcss").show();
        },
        complete: function () {
            onflg = true;
            $(".loadshowcss").hide();
        }
    });
}
function dataFun(sUrl, mark, pid, srckey) {
    pageIndex = 1;
    if(mark == 2){
        cUrl = "goodsSite/editor/listEditorArtworks?";
    }
    if(mark == 7){
        cUrl = "goodsSite/editor/listEditorInflux?";
    }
    if (mark == 2) {
        gFun = showYspList;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = artUrl + cUrl+ "pageSize=20&selectedTagId="+selectedTagId+"&orderByType="+orderByType+"&edited="+edited+"&editorId="+editorId+"&category="+pid+"&pageNo=";
        gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = artUrl + "topicSocSite/topic/edit/editTopicList?pageSize=20&selectedTagId="+selectedTagId+"&orderByType="+orderByType+"&edited="+edited+"&editorId="+editorId+"&category="+pid+"&currPage=";
        gUrl = getGoodsUrl + gYurl;
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
    var k = 5;
    var range = 1050;
    var onflg = true;
    var _pageIndex = 1;
    var flag = true;
    $(window).scroll(function () {
        var srollPos = $(window).scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight && onflg && tempdis && stopflg == 1) {
            if (markValSrc == 2) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: sKm.suFun,
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
            if (markValSrc == 1) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: sKm.suFun,
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
        }
    });
    // 初始化数据
    var $menuLi =$("#box-menu li");
    $menuLi.each(function(){
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
    categoryId = markVal;
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }
    $(".m-ss").click(function(index,i){
        var that=$(this),
            selectTitle=that.find(">.select-title"),
            ulTag=that.find(">.ul-tag"),
            mIdx=that.index();
        ulTag.show();
        ulTag.find("li").unbind().bind("click",function(e){
            e.stopPropagation();
            if(mIdx ==0){
                orderByType =$(this).attr("id");
                edited =0;
            }else if(mIdx ==1){
                edited =0;
                editorId =$(this).attr("id");
            }
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    markVal =$(this).find("a").attr("data-mark");
                }
            });
            selectTitle.html($(this).html());
            findFirstGoodsPage(sUrl, markVal, pid, srckey, editorId);
            ulTag.hide();
        });
    });
    //是否已编辑
    var $mTag =$('#m-s-tag');
    $mTag.find('span').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        edited =$(this).attr('id');
        $menuLi.each(function () {
            if ($(this).attr("class") == "current") {
                markVal =$(this).find("a").attr("data-mark");
            }
        });
         tempdis = true;
         stopflg = 1;
        findFirstGoodsPage(sUrl, markVal, pid, srckey, editorId);
    });
    $(document).bind("click",function(e){
        var target  = $(e.target);
        if(target.closest(".select-title").length == 0){
            $(".ul-tag").hide();
        }
    })
    sNav(sLei);
    setTimeout(function(){
        findFirstGoodsPage(sUrl, markVal, pid, srckey, editorId);
    },500);
    $menuLi.click(function () {
        if(tempajax) {
            $("#container").removeAttr('style');
            $(this).addClass("current").siblings().removeClass("current");
            $menuLi.each(function () {
                if ($(this).attr("class") == "current") {
                    sLei = $(this).attr("indexTag");
                    LeiId = $(this).find("a").attr("data-classify");
                    markValSrc = $(this).find("a").attr("data-mark");
                    orderByType = 2;
                    tempdis = true;
                    stopflg = 1;
                    $("#selectxb").html("按更新时间正序");
                    if(markValSrc ==2){
                        sKm.show();
                    }else if(markValSrc ==1){
                        sKm.hide();
                    }
                }
            });
            pid = "";
            sNav(sLei);
            $("#fenlei dd").find("a").removeClass("active click");
            var _markVal = $(this).find("a").attr("data-mark");
            markValSrc = _markVal;
            edited =1;
            $('#m-s-tag span').removeClass('active');
            $('#m-s-tag span').eq(1).addClass('active');
            findFirstGoodsPage(sUrl, _markVal, pid, srckey);
            categoryId = _markVal;
        }
    });
    /*小分类选择*/
    $("#fenlei dd a").live("click", function (event) {
        var MarkVal = "";
        $menuLi.each(function(){
            if($(this).attr("class") =="current"){
                MarkVal =$(this).find("a").attr("data-mark");
                markValSrc =$(this).find("a").attr("data-mark");
            }
        });
        if(axFlg) {
            axFlg =false;
            if ($(this).hasClass("a active click")) {
                $(this).removeClass("active click");
            } else {
                $(this).addClass("active click");
                $(this).prevAll("a").removeClass('active click');
                $(this).nextAll("a").removeClass('active click');
            }
            var flag = $(this).parents("dd").find("a").eq(0).attr("class");
            if ($(this).attr("data-pid") == "") {
                $(this).removeClass('click');
                var _class = $(this).attr("class");
                if (_class == "active allActive" || _class == "allActive") {//去除全部
                    $(this).removeClass('active');
                    $(this).removeClass('allActive');
                    $(this).nextAll("a").removeClass('click');
                    $(this).nextAll("a").removeClass('active');
                } else {
                    $(this).addClass('allActive');
                    $(this).nextAll("a").removeClass('active');
                }
            } else {
                var sl = true;
                if (flag == undefined || flag == "") {
                    sl = false;
                } else {
                    if (sl) {
                        $(this).parents("dd").find("a").eq(0).removeAttr('class');
                        $(this).parents("dd").find("a").removeClass("click")
                        $(this).addClass('click');
                    }
                }
            }
            var categoryId = bm();
            categoryId = categoryId.toString();
            pid = categoryId;
            findFirstGoodsPage(sUrl, MarkVal, categoryId, srckey);
        }
    });
});
/*分类筛选*/
function sNav(tag) {
    var Alange="CN";
    var data={
        source :"web",
        page :"index",
        abbr :Alange,
        indexTag :sLei
    }
    var _http = artUrl + "topicSocSite/topic/getTypeBasesByPage";
    $.ajax({
        url: _http,
        data:data,
        type: 'post',
        async:false,
        dataType: 'json',
        success: function (data) {
            var data = data;
            if (data.code == '200') {
                dataArry = data;
                $('#fenlei').html('');
                $(data.result).each(function (index, v) {
                        dataL=v;
                        var text = ArtList.NavFL(index, v, sLei);
                        $fenlei = $('#fenlei');
                        $fenlei.append(text);
                    var _id= v.id;
                    if(tag ==5){
                        if(_id ==105){
                            ArtList.ztLei(index, v, tag, dataL);
                        }
                        if(_id ==2){
                            ArtList.xxLei(index, v, tag, dataL);
                        }
                        if(_id ==465){
                            ArtList.lang(index, v, tag, dataL);
                        }
                    }else if(tag ==1){
                        if(_id ==207){
                            ArtList.dsq(index, v, tag, dataL);
                        }
                    }
                });
                //$("#fenlei").find("dt:gt(0),dd:gt(0)").hide();
            } else {
                console.log('添加失败')
            }
        }
    });
}
//获取分类id
function bm() {
    var sval = $("#fenlei dd a.click").map(function() {
        return $(this).attr("data-pid");
    }).get().join(',');
    return sval;
}
var sKm={
    suFun: function (data) {
            if (data.code == '200') {
                pageIndex++;
                var totalSize = data.size;
                var curIndex = data.curIndex;
                if (data.result.pageItems.length == 0) {
                    tempdis = false;
                    stopflg = 0
                    return;
                } else {
                    $('#stopFlg').val(1);
                    tempdis = true;
                }
                $(data.result.pageItems).each(function (index, v) {
                    if(markValSrc ==1){
                        text = ArtList.special(index, v, shFlag);
                    }else if(markValSrc ==2){
                        text = ArtList.Aworks(index, v, shFlag, sKm, dataArry);
                    }
                    $container = $('#container');
                    $container.append(text).masonry('reload');
                });
            } else {
                tempdis = false;
                stopflg = 0
            }
        },
    show:function(){
        $("#fenlei a").each(function(){
            var id = $(this).attr("data-pid");
            if(id ==218 || id ==345){
                $(this).show();
            }
        });
    },
    hide:function(){
        $("#fenlei a").each(function(){
            var id = $(this).attr("data-pid");
            if(id ==218 || id ==345){
                $(this).hide();
            }
        });
    }
}