/**
 * Created by Administrator on 2015/9/22.
 */
var tempdis = true;
var tempajax = false;
var stopflg = 0;
var tpOne,tpTwo;
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
    if($("#selectxb").length >0){
        $("#showCount i").html(data.result.recordsNumber);
    }
    if(data.code ==200){
        tempajax =true;
    }
    $(data.result.pageItems).each(function (index, v) {
        var text = ArtList.Aworks(index, v, shFlag, sKm, dataArry);
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
        tempajax =true;
    }
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
        var text =$(ArtList.special(index, v, shFlag, dataArry));
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
        async:false,
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
    tempdis = true;
    stopflg = 1;
    var cUrl=""
    if(mark == 2){
        cUrl = "/goodsSite/editor/listEditorArtworks?";
    }
    if(mark == 7){
        cUrl = "/goodsSite/editor/listEditorInflux?";
    }
    Alange ="CN";
    if (mark == 2 || mark == 7) {//手工艺 创意品
        gFun = showYspList;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = cUrl+"pageSize=20&selectedTagId="+selectedTagId+"&editorId="+editorId+"&orderByType="+orderByType+"&pageNo=";
        gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = "/topicSocSite/topic/edit/editTopicList?selectedTagId="+selectedTagId+"&editorId="+editorId+"&orderByType="+orderByType+"&currPage=";
        gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
    }
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
            if (markValSrc == 1) {
                console.log("aaaaa");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&category=' + pid+'&pageSize='+20,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success:upSucceed.upInit,
                    error: function () {
                        console.log('内部接口错误');
                    },
                    complete: function () {
                        $(".loadshowcss").hide();
                        onflg = true;
                    }
                });
            }
            if (markValSrc == 2 || markValSrc == 7) {
                console.log("bbbbbb");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&category=' + pid,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: upSucceed.upInit,
                    error: function () {
                        console.log('内部接口错误');
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
    //排序筛选
    $("#selectxb").click(function(event){
        $(this).next("ul").show();
        var e=window.event || event;
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
        $(this).next("ul").find("li").unbind("click").click(function(){
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
    document.onclick = function(){
        $("#m-s>ul").hide();
    };
    /*大分类筛选*/
    $("#box-menu li").each(function (i) {
        if ($(this).attr("class") =="current") {
            sLei = $(this).attr("indexTag");
            LeiId = $(this).find("a").attr("data-classify");
        }
    });
    qi();
    sNav(sLei);
    setTimeout(function(){
        findFirstGoodsPage(sUrl, markVal, pid, srckey, selectedTagId);
    },500);
    $("#box-menu li").click(function () {
        if ($(this).attr("flg") =="true") {
        if(tempajax) {
            tempajax = false;
                $("#container").removeAttr('style');
                $(this).addClass("current").siblings().removeClass("current");
                $(this).attr("flg",false).siblings().attr("flg", true);
                $("#box-menu li").each(function (i) {
                    if ($(this).attr("class") == "current") {
                        sLei = $(this).attr("indexTag");
                        LeiId = $(this).find("a").attr("data-classify");
                        markValSrc = $(this).find("a").attr("data-mark");
                        orderByType = 2;
                        stopflg = 1;
                        $("#selectxb").html("按更新时间正序");
                        if (i == 2) {
                            sKm = $(this).find("a").attr("data-classify");
                        }
                        if (i == 0 || i == 1) {
                            sKm = "";
                        }
                    }
                });
                pid = "";
                sNav(sLei);
                $("#fenlei dd").find("a").removeClass("active click");
                var _markVal = $(this).find("a").attr("data-mark");
                markValSrc = _markVal;
            findFirstGoodsPage(sUrl, _markVal, pid, srckey);
                categoryId = _markVal;
            }
        }
    });
    //第三方商品  webData
    var $data=$(".edLeft a");
    var $edSmall=$(".edSmall a");
      $data.live("click",function(){
          $(this).addClass("active").siblings().removeClass("active");
          var cId=$(this).attr("data-id");
          var $cnt=$(this).parent().next(".edSmall");
          var $cntH =$(this).parent().parent().next(".edSmall");
          $cnt.empty();
          for(var i=1; i<webData.length; i++){
              var nW=webData[i];
              var nCid=nW.id;
              var nChildren = nW.children;
              for(var j=0; j<nChildren.length; j++){
                  if(nCid ==cId) {
                      $cnt.append("<a type='2' data-id='"+nChildren[j].id+"'><span>"+nChildren[j].typeName+"</span></a>");
                  }
              }
          }
      });
    $edSmall.live("click",function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(this).parent().parent().hide(100);
        var _dik=tagSK($(this));
        var _dikId=tagsId($(this));
        var $htm=$(this).parent().parent().prev();
        $htm.find(".cty span").html(_dik);
        var twoTypeId=$(this).attr("data-id");
        var oneTypeId=$(this).parent().prev(".edLeft").find("a.active").attr("data-id");
        $htm.find(".cty .oneTypeId").val(oneTypeId);
        $htm.find(".cty .twoTypeId").val(twoTypeId);
    });
    $(document).bind("click",function(e){
        var target  = $(e.target);
        if(target.closest(".edBox,.s_box_sel").length == 0){
            $(".edBox").hide(100);
        }
    })
});
/*分类筛选*/
function sNav(tag) {
    //var Alange=ArtJS.server.language;
    var Alange = "CN";
    var _http = "/topicSocSite/topic/getTypeBasesByPage" + '?source=web&page=index&abbr=' + Alange+ '&indexTag=' + sLei;
    $.ajax({
        url: _http,
        data:{},
        type: 'post',
        async:false,
        dataType: 'json',
        success: function (data) {
            var data = data;
            if (data.code == '200') {
                dataArry = data;
                $('#fenlei').html('');
                if(tag ==5){
                    $(data.result).each(function (index, v) {
                        var dataL="";
                        dataL=v;
                        var text = ArtList.NavFL(index, v, sLei);
                        $fenlei = $('#fenlei');
                        $fenlei.append(text);
                        var _id= v.id;
                        if(_id ==105){
                            ArtList.ztLei(index, v, tag, dataL);
                        }
                        if(_id ==2){
                            ArtList.xxLei(index, v, tag, dataL);
                        }
                        if(_id ==465){
                            ArtList.lang(index, v, tag, dataL);
                        }
                    });
                }
                if(tag ==1){
                    $(data.result).each(function (index, v) {
                        var dataL="";
                        dataL=v;
                        var text = ArtList.NavFL(index, v, sLei);
                        $fenlei = $('#fenlei');
                        $fenlei.append(text);
                        var _id= v.id;
                        if(_id ==207){
                            ArtList.dsq(index, v, tag, dataL);
                        }
                    });
                }
                $("#fenlei").find("dt:gt(0),dd:gt(0)").hide();
            } else {
                console.log('添加失败')
            }
        }
    });
}
//success
var upSucceed={
    upInit:function (data) {
        if (data.code == '200') {
            if(data.result.pageItems !=null){
                pageIndex ++;
                if (data.result.pageItems ==null || data.result.pageItems.length == 0) {
                    tempdis = false;
                    stopflg = 0;
                    return;
                } else {
                    tempdis = true;
                    stopflg = 1;
                }
                $(data.result.pageItems).each(function (index, v) {
                    if(markValSrc ==2 || markValSrc ==7){
                        text = ArtList.Aworks(index, v, shFlag, sKm);
                    }
                    if(special ==1){
                        text = ArtList.special(index, v, shFlag);
                    }
                    $container = $('#container');
                    $container.append(text).masonry('reload');
                });
            }else {
            tempdis = false;
            stopflg = 0;
         }
        } else {
            tempdis = false;
            stopflg = 0;
         }
    }
}
//所属分类名字
function tagSK(obj) {
    var tagSk = $(obj).parent().parent().find("a.active").map(function() {
        return $(this).find("span").html() || $(this).attr("data-id");
    }).get().join('>');
    return tagSk;
}
//所属分类id
function tagsId(obj) {
    var tagsId = $(obj).parent().parent().find("a.active").map(function() {
        var _tp = $(this).attr('type');
        console.log(_tp+'_tp');
        if(_tp ==1){
            tpOne = $(this).attr("data-id");
        }else if(_tp == 2){
            tpTwo = $(this).attr("data-id");
        }
        return tpOne,tpTwo;
    }).get().join(',');
    return tagsId;
}
function qi(){
    var dta={
            indexTag:7,
            //abbr:Alange,
            abbr:"CN",
            page:"index",
            source:"web"
        }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/getTypeBasesByPage",
        data:dta,
        dataType: "json",
        async:false,
        success: function (data) {
            if(data.code ==200){
                $(data.result).each(function (index, v) {
                    if(v.id ==207){
                        ArtList.Byxinqu(index, v);
                    }
                });
            }
        }
    });
}