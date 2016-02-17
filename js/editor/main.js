/**
 * Created by Administrator on 2015/9/21.
 */

//定义变量
var FrameNum = 1;
var num = 0;
var onflg = true;
var pageIndex = 1;
var range = 350;
var searchType = "00"
var searchContext = "";
var Alange = ArtJS.server.language;
var markVal = "";
var artUrl = ArtJS.server.art;//域名url
var srckey = "", _key = "", sUrl = "",  pid = "",gUrl="",gFun="" ;//分类选择;//搜索关键字 sUrl搜索url
var categoryId="";//置顶id
var markValSrc="";
var shFlag="";
var sLei="";LeiId=""//分类
var dataArry="",typeName="";
var tagName=[];

var selectedTagId="";
var editorId=0;
var orderByType=2;
var webData="";
var sKm="";
//滚动
var k = 5;
var range = 1050;
var onflg = true;
var _pageIndex = 1;
var flag = true;
var tempdis = true;
var stopflg = 1;

//用户权限判断(主编还是小编)
var user_Roleid =getCookie("roleId");
var user_toKen =getCookie("toKen");
//判断是否为空
var divcss = {
    border: '1px solid #ff6550',
};
//用户id
var enshrines_key = getCookie('enshrines_key');
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
var mainE ={
    noLogin: function(){//3小编  //4主编
        if(user_toKen =="" || user_toKen =="undefined"){
            window.location.href = ArtJS.server.art;
            return;
        }else{
            if(user_Roleid !=3 && user_Roleid !=4) {
                window.location.href = ArtJS.server.art;
                return;
            }
        }
    }
}
$(document).ready(function(){
    mainE.noLogin();
    //绑定事件
    $('#zhiding').hide();//置顶注释
    $("#box-menu").find("li").unbind("click");
    $("body").after('<a href="javascript:scroll(0,0)" target="_self" id="gotoTop" class="gotop"></a>');
    ArtList.gotoTop(600,"gotoTop");
    /*DOTO筛选更多*/
    $(".morebtn").live("click", function () {
        $(this).find("i").toggleClass("flipy");
        if($(this).find("c").html() =="更多筛选") {
            $(this).find("c").html("收起筛选");
        }else{
            $(this).find("c").html("更多筛选");
        }
        $("#fenlei").find("dt:gt(0),dd:gt(0)").toggle("fast");
    });
   //删除手动输入标签
    $(".div-label div.label").find(".icon-close-b").live("click",function(){
        _v = tagName;
        for(var i=0; i<_v.length; i++){
            if(_v[i] ==$(this).find("font").attr("data-token"))
                _v.remove(_v[i]);
        }
        $(this).parent().remove();
    });
   //选中标签
    $(".editor-tag .Aworks p.qtVal span>a").live("click",function(){
       if($(this).hasClass("active")){
           $(this).removeClass("active");
           $(this).removeAttr("name","tagK");
       }else {
           $(this).addClass("active");
           $(this).attr("name","tagK");
       }
   });
    //兴趣
    $(".editor-tag .Aworks p.xqVal span>a, p.langueVal span>a").live("click",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).removeAttr("name","tagK");
        }else {
            $(this).addClass("active");
            $(this).attr("name","tagK");
            $(this).prevAll().removeClass("active");
            $(this).nextAll().removeClass("active");
            $(this).prevAll().removeAttr("name");
            $(this).nextAll().removeAttr("name");
        }
    });
   /*灯丝圈*/
    $(".editor-tag .special span>a").live("click",function(){
        $(this).addClass("active").siblings().removeClass("active");
        $(this).attr("name","tagK").siblings().removeAttr("name","tagK");
    });
   //版权问题 || 需要扣图
    $(".art-tag-m i").live("click",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).attr("cd",0);
        }else {
            $(this).addClass("active");
            $(this).attr("cd",1);
        }
    });
    //星级
    $(".art-star p> em").live("click",function(){
        if($(this).index() ==0){
            $(this).addClass("active");
            $(this).nextAll().removeClass("active");
        }
        if($(this).index() ==1){
            $(this).addClass("active");
            $(this).prevAll().addClass("active");
            $(this).nextAll().removeClass("active");
        }
        if($(this).index() ==2){
            $(this).addClass("active");
            $(this).prevAll().addClass("active");
        }
    });
    //selectedTagId 选择的标签级别
    $(".editor-nav a").each(function(){
        if($(this).hasClass("active")){
            selectedTagId = $(this).attr("flag");
        }
    });
    //置顶精品搜索
    if($(".e-search").length > 0) {
        $("#e-search").click(function () {
            searFun($("#intxt").val());
        });
        $("#intxt").keydown(function(e){
            if (e.keyCode == 13){
                searFun($(this).val());
            }
        });
        function searFun(val){
            if(val == ""){
                alert("请输入关键字！");
                return;
            }else {
                var w = ArtJS.server.art+"editor/search.html?"+"searchVal=" + $("#searchVal,#intxt").val();
                location.href =w;
            }
        }
    }
    //判断是小编还是主编
    if(user_Roleid ==3){
        $("#zhiding,#eIndex,.mune-select,.Trash").remove();
    }else{
    //读取小编或者主编
    if($("#ul-tag").length > 0) {
        var str="";
        $.ajax({
            type: "post",
            url:"/topicSocSite/topic/edit/getEditMembers",
            data:{},
            dataType: "json",
            success: function (data) {
                if(data.code ==200){
                    var str="<li id='0'>全部</li>";
                    for(var i=0; i<data.result.length; i++){
                       str +="<li id='"+data.result[i].memberId+"'>"+data.result[i].accountName+"</li>"
                    }
                    $("#ul-tag").html(str);
                }
            }
        });
    }
  }
    //手工艺
    var $bm=$(".editor-nav a");
    $bm.each(function(){
        var fMun=$(this).attr("flag");
        var dta={
            indexTag:2,
            //abbr:Alange,
            abbr:"CN",
            page:"index",
            source:"web"
        }
        if(fMun==1){
            setTimeout(function(){
                $.ajax({
                    type: "post",
                    url:"/topicSocSite/topic/getTypeBasesByPage",
                    data:dta,
                    dataType: "json",
                    success: function (data) {
                        if(data.code ==200){
                            $(data.result).each(function (index, v) {
                                if(v.id ==4){
                                    webData = v.children;
                                    ArtList.ByPage(index, webData);
                                }
                                if(v.id ==207){
                                    ArtList.Byxinqu(index, v.children);
                                }
                            });
                        }
                    }
                });
            },0);
        }
    });
    $(".s_box_sel").live("click",function(){
        var $edBox=$(this).parent().next(".edBox");
        var $cntn =$(this).parent().next(".edBox").find(".edSmall");
        var $cUl =$(this).parent().parent().parent().parent();
        $cntn.empty();
            $edBox.slideToggle();
            $cUl.prevAll().find('.edBox').hide(100);
            $cUl.nextAll().find('.edBox').hide(100);
            for(var i=0; i<webData.length; i++){
                var nW = webData[i];
                var nCid=nW.id;
                var nChildren=nW.children;
                console.log(webData[i].id+'nW.children');
                for(var j=0; j<nChildren.length; j++){
                    if(nCid == 73) {
                        $(".edLeft a[data-id='73']").addClass("active").siblings().removeClass("active");
                        $cntn.append("<a data-id='"+nChildren[j].id+"'><span>"+nChildren[j].typeName+"</span></a>");
                    }
                }
            }
    });
});
//form 表单
function queryForm() {
    //屏蔽回车键提交表单
    var queryForm=document.getElementById("queryForm");
    queryForm.onsubmit=function(){
        if (myform.searchVal.value =="")
        {
            alert("请输入关键字！");
            return false;
        }
        return true;
    }
}
//输入标签
//文本框tagDown
function tagDown(obj){
    $(obj).parent().parent().parent().parent().parent().css({"z-index":999});
    var e = window.event || arguments.callee.caller.arguments[0];
    var _reg = /[,]|[，]*/ig //, _sreg = /[^\|"'<>]/;
    var val = $(obj).val();
    if (_reg.test($(obj).val())) {
        val = val.replace(_reg, '');
        if (val == "") {
            $(obj).val('');
        }
    }
    if (e && e.keyCode == 13 || e && e.keyCode == 188) { // enter 键 逗号键
        //要做的事情
        if (val == "") {
            return;
        }
        $(obj).parent().parent("div").find(".div-label .none").remove();
        $(obj).parent().parent("div").find(".div-label").append('<div class="label"><font class="ng-binding" data-token="' + val + '" name="token">' + val + '</font><i class="iconfont icon-close-b"></i></div>');
        tagName.push(val);
        $(obj).val('');
    }
}
//文本框tagblur
function tagBlur(obj,event){
    var e = window.event || arguments.callee.caller.arguments[0];
    var _reg = /[,]|[，]*/ig;
    var val = $(obj).val();
    if (_reg.test($(this).val())) {
        val = val.replace(_reg, '');
        if (val == "") {
            $(obj).val('');
        }
    }
    //要做的事情
    if (val == "") {
        return;
    }
    $(obj).parent().parent("div").find(".div-label").append('<div class="label"><font class="ng-binding" data-token="' + val + '" name="token">' + val + '</font><i class="iconfont icon-close-b"></i></div>');
    tagName.push(val);
    $(obj).val('');
}
//返回修改
function artStickDel(obj, id){
    if($(obj).attr("code") ==0){
        $(obj).addClass("active");
        $(obj).attr("code",1);
    }else{
        return
        $(obj).removeClass("active");
    }
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/arts/delArts",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>回退成功</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//主编退回修改艺术品
var releaseStatus=3;//主编拒绝
function artworkBackToEdit(obj, id, type){
    var data = {
        id: id,
        releaseStatus:releaseStatus
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/artworkBackToEdit",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $("body").after("<span id='stick-success'>回退成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//回收站恢复艺术品
function recoverArtwork(obj, id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/recoverArtAndGoods",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $("body").after("<span id='stick-success'>回退成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//回收站恢复衍生品
function recoverDerivative(obj, id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/recoverGoods",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $("body").after("<span id='stick-success'>回退成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//删除衍生品
function deleDerivative(obj, id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/delGoods",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $("body").after("<span id='stick-success'>删除衍生品成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//删除艺术品
function deleAworks(obj,id){
    var _type=$(obj).attr("type");
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/delArtAndGoods",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $("body").after("<span id='stick-success'>删除成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//删除礼品deleGift
function deleGift(obj,id){
    var _type=$(obj).attr("type");
    var _url="";
    if(_type ==0 || _type ==1){
        _url="/goodsSite/editor/delArtAndGoods";
    }
    if(_type ==2){
        _url="/goodsSite/editor/delGoods";
    }
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:_url,
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().parent().remove();
                $("body").after("<span id='stick-success'>删除成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//删除灯丝圈 topicSocSite/topic/edit/editDelTopic
function deleSpecial(obj,id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/edit/editDelTopic",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>删除成功</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//回收站恢复
function restoreTaskArtwork(obj,id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/edit/editResumeTopic",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>已恢复</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//灯丝圈删除到回收站
function restoreTaskArtwork1(obj,id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/edit/editDelTopic",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>已删除到回收站</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//退回的接口
function SeditBack(obj,id){
    var data = {
        id: id
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/edit/editBackTopic",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent().remove();
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>退回成功</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//置顶函数
/*InfluxGoodsflag(潮品置顶)*/
function artStick(obj, id, InfluxGoodsflag){
    var _url = '/topicSocSite/topic/top';//灯丝圈

    $(obj).addClass("active");
    if(InfluxGoodsflag ==true){
        LeiId = 4;
    }else {
        $("#box-menu li").each(function () {
            if ($(this).attr("class") == "current") {
                if ($(this).find("a").html() == "艺术品") {
                    LeiId = '';
                    _url = '/goodsSite/editor/goodsTop';
                }
                if ($(this).find("a").html() == "衍生品") {
                    LeiId = '';
                }
                if ($(this).find("a").html() == "灯丝圈") {
                    LeiId = 1;
                }
            }
        });
    }
    $.ajax({
        type: "post",
        url:_url,
        data:{'id':id},
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>置顶成功</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500)
            }
        }
    });
}
//礼品店置顶
function giftStick(obj, id, type){
    $(obj).addClass("active");
    var _url = '/goodsSite/editor/goodsTop';
    $.ajax({
        type: "post",
        url:_url,
        data:{'id':id},
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>置顶成功</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500)
            }
        }
    });
}
//特别推荐
function artRecommend(obj, id){
    var status="";
    var stick_txt="";
    if($(obj).attr("code") ==0){
        $(obj).addClass("active");
        $(obj).attr("code",1);
        status = 1 ;
        stick_txt="推荐成功";
    }else{
        $(obj).removeClass("active");
        $(obj).attr("code",0);
        status = 2 ;
        stick_txt="取消推荐";
    }
    var data ={
        id:id,
        category:categoryId,
        status:status
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/recommend",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(".pro-f-y").show();
                $("body").after("<span id='stick-success'>"+stick_txt+"</span>");
                setTimeout(function(){
                    $(".pro-f-y").hide();
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//提交艺术品数据

// typeIds  分类逗号分隔
// editorLabels  小编标签 逗号分隔
// versionProblem  版权
// amendImage  抠图
// likeStartNumber  打星

var _editorDescription="";
var _artTypeId="";
function artSubt(obj,id){
    var url="/goodsSite/editor/saveEditArtworks";
    var cod=0;
    fun(obj,id,url,cod);
}
function artAllot(obj,id){
    var url="/goodsSite/editor/assignEditArtworks";
    var cod=1;
    fun(obj,id,url,cod);
}
//共通
function fun(obj,id,url,cod){
    var _editorDescription = tagFun(obj,id);
    _editorDescription = _editorDescription.toString();

    var _type =langType(obj,id);
    _type =_type.toString();

    var _artTypeId = tagFunId(obj,id);
    _artTypeId = _artTypeId.toString();

    var lanLen = $(obj).parent().parent("li").find(".editor-tag-fenlei >p.langueVal").find('a.active').length;
    var xqLen = $(obj).parent().parent("li").find(".editor-tag-fenlei >p.xqVal").find('a.active').length;
    var qtLen = $(obj).parent().parent("li").find(".editor-tag-fenlei >p.qtVal").find('a.active').length;

    if(cod ==0) {
        if (lanLen == 0) {
            cs(obj,cod);
            return;
        } else if (xqLen == 0) {
            cs(obj,cod);
            return;
        } else if (qtLen == 0) {
            cs(obj,cod);
            return;
        }
    }else{
        if (lanLen == 0) {
            cs(obj,cod);
            return;
        }
    }
    function cs(obj,cod){
        if(cod==0) {
            $(obj).parent().parent("li").find(".editor-tag-fenlei >p").css(divcss);
            setTimeout(function () {
                $(obj).parent().parent("li").find(".editor-tag-fenlei >p").removeAttr("style");
            }, 500);
        }else{
            $(obj).parent().parent("li").find(".editor-tag-fenlei >p.langueVal").css(divcss);
            setTimeout(function () {
                $(obj).parent().parent("li").find(".editor-tag-fenlei >p.langueVal").removeAttr("style");
            }, 500);
        }
    }

    var versionProblem =$(obj).parent().parent("li").find("i.target_status_bq").attr("cd");
    var amendImage =$(obj).parent().parent("li").find("i.target_status_kt").attr("cd");
    var manageStar =$(obj).parent().parent("li").find(".art-star p >em.active").length;

    if(manageStar ==0){
        manageStar =="";
    }
    if(cod ==0) {
        var data = {
            // id: id, //艺术品id 必填
            // versionProblem: versionProblem, //版本问题 必填
            // amendImage: amendImage, //需要抠图 必填
            // editorDescription: _editorDescription, //小编标签 选填
            // artTypeId: _artTypeId, //艺术品分类ID，逗号间隔 必填
            // manageStar: manageStar//星级
            id: id, //艺术品id 必填
            versionProblem: versionProblem, //版权问题 必填
            amendImage: amendImage, //需要抠图 必填
            editorLabels: _editorDescription, //小编标签 选填
            typeIds: _artTypeId, //艺术品分类ID，逗号间隔 必填
            likeStartNumber: manageStar//星级
        }
    }else{
        var data = {
            id: id, //艺术品id 必填
            versionProblem: versionProblem, //版本问题 必填
            amendImage: amendImage, //需要抠图 必填
            editorLabels: _editorDescription, //小编标签 选填
            typeIds: _artTypeId, //艺术品分类ID，逗号间隔 必填
            likeStartNumber: manageStar,//星级
            abbr:_type//分配语言标记
        }
    }
    $.ajax({
        type: "post",
        url:url,
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent("li").remove();
                var txt ="";
                if(cod==0) {
                    txt ="提交成功"
                }else{
                    txt ="分配成功"
                }
                $("body").after("<span id='stick-success'>"+txt+"</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }else if(data.code ==240003){
                $("body").after("<span id='stick-error'>"+data.result+"</span>");
                setTimeout(function(){
                    $("#stick-error").remove();
                },500);
            }
        }
    });
}
//提交灯丝圈数据
var _labels="";
var _types="";
function specialSubt(obj,id){
    var _labels = tagFun(obj,id);
    _labels = _labels.toString();

    var _types = tagFunId(obj,id);
    _types = _types.toString();

    if(_types.length ==0){
        $(obj).parent().parent("li").find(".editor-tag-fenlei,.editor-tag-shop").css(divcss);
        setTimeout(function(){
            $(obj).parent().parent("li").find(".editor-tag-fenlei,.editor-tag-shop").removeAttr("style");
        },500);
        return;
    }

    var like =$(obj).parent().parent("li").find(".art-star p >em.active").length;
    if(like ==0){
        like =="";
    }
    var data = {
        id:id, //艺术品id 必填
        labels:_labels, //小编标签 选填
        types:_types, //艺术品分类ID，逗号间隔 必填
        like:like//星级
    }
    $.ajax({
        type: "post",
        url:"/topicSocSite/topic/edit/editPublishTopic",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent("li").remove();
                $("body").after("<span id='stick-success'>数据保存成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//提交第三方商品数据
function saveEditTideProduct(obj,id){
    var _old = "";
    var _editorsDescription = tagFun(obj,id);
    _editorsDescription = _editorsDescription.toString();

    var _oldInterestTypeIds = oldxqFun(obj,id);//兴趣
    _oldInterestTypeIds = _oldInterestTypeIds.toString();

    var _artTypeId = tagFunId(obj,id);
    _artTypeId = _artTypeId.toString();

    var _newInterestTypeIds = xqFun(obj,id);//兴趣
    _newInterestTypeIds = _newInterestTypeIds.toString();

    // var newId=$(obj).parent().parent("li").find(".editor-tag-fenlei").find(".cty .ctyNew").val();
    // var oldId=$(obj).parent().parent("li").find(".editor-tag-fenlei").find(".cty .ctyOld").val();
    // var _newTideTypeIds = newId;
    // var _oldTideTypeIds = oldId;

    var twoTypeId=$(obj).parent().parent("li").find(".editor-tag-fenlei").find(".cty .twoTypeId").val();
    var oneTypeId=$(obj).parent().parent("li").find(".editor-tag-fenlei").find(".cty .oneTypeId").val();    
    
    var versionProblem =$(obj).parent().parent("li").find("i.target_status_bq").attr("cd");
    var amendImage =$(obj).parent().parent("li").find("i.target_status_kt").attr("cd");
    var manageStar =$(obj).parent().parent("li").find(".art-star p >em.active").length;

    if(manageStar ==0){
        manageStar =="";
    }
    //_old = _oldInterestTypeIds+"," + _oldTideTypeIds;//所属分类旧ID和旧兴趣ID
    var data = {
        //id:id, //艺术品id 必填
        //versionProblem:versionProblem, //版本问题 必填
        //amendImage:amendImage, //需要抠图 必填
        //editorDescription:_editorsDescription, //小编标签 选填
        //newTideTypeIds:_newTideTypeIds, //所属分类ID，逗号间隔 必填
        //oldTideTypeIds:_old, //所属分类ID和旧兴趣ID，逗号间隔 必填
        //oldInterestTypeIds:_oldInterestTypeIds, //兴趣分类ID，逗号间隔
        //newInterestTypeIds:_newInterestTypeIds, //兴趣分类ID，逗号间隔
        //tideType:oneTypeId,
        //tideType2:twoTypeId,
        //manageStar:manageStar//星级

        id: id, //艺术品id 必填
        versionProblem: versionProblem, //版权问题 必填
        amendImage: amendImage, //需要抠图 必填
        editorLabels: _editorsDescription, //小编标签 选填
        typeIds: _artTypeId, //艺术品分类ID，逗号间隔 必填
        likeStartNumber: manageStar,//星级
        tideType:oneTypeId,
        tideType2:twoTypeId,

    }
    $.ajax({
        type: "post",
        url:"/goodsSite/editor/saveEditTideProduct",
        data:data,
        dataType: "json",
        success: function (data) {
            if(data.code ==200){
                $(obj).parent().parent("li").remove();
                $("body").after("<span id='stick-success'>数据保存成功</span>");
                setTimeout(function(){
                    $("#stick-success").remove();
                },500);
            }
        }
    });
}
//获取兴趣标签值new
function xqFun(obj,id) {
    var oxqId = $(obj).parent().parent("li").find('.editor-tag a.active[name="tagK"]').map(function() {
        return $(this).attr("data-id");
    }).get().join('');
    return oxqId;
}
//获取兴趣标签值old
function oldxqFun(obj,id) {
    var oldxqId = $(obj).parent().parent("li").find('.editor-tag a').map(function() {
        return $(this).attr("data-old");
    }).get().join(',');
    return oldxqId;
}
//获取输入标签值
function tagFun(obj,id) {
    var tagVal = $(obj).parent().parent("li").find(".label").map(function() {
        return $(this).find("font").html();
    }).get().join(',');
    return tagVal;
}
//获取艺术品分类ID
function tagFunId(obj,id){
    var tagId = $(obj).parent().parent("li").find('.editor-tag a.active[name="tagK"]').map(function() {
        return $(this).attr("data-id");
    }).get().join(',');
    return tagId;
}
//获取语言分配值
function langType(obj,id) {
    var lanT = $(obj).parent().parent("li").find('.langueVal a.active[name="tagK"]').map(function() {
        return $(this).attr("type");
    }).get().join('');
    return lanT;
}
//删除数组对应额值
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
;(function($) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (!$) return;
    $.extend(String.prototype, {
    /*16进制颜色转为RGB格式 String.prototype.colorRgb = */
    colorRgb: function(){
        var sColor = this.toLowerCase();
        if(sColor && reg.test(sColor)){
            if(sColor.length === 4){
                var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for(var i=1; i<7; i+=2){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return "rgba(" + sColorChange.join(",") + ",0.3)";
        }else{
            return sColor;
        }
    },
    /*RGB颜色转换为16进制*/
    colorHex: function(){
        var that = this;
        if(/^(rgb|RGB)/.test(that)){
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
            var strHex = "#";
            for(var i=0; i<aColor.length; i++){
                var hex = Number(aColor[i]).toString(16);
                if(hex === "0"){
                    hex += hex;
                }
                strHex += hex;
            }
            if(strHex.length !== 7){
                strHex = that;
            }
            return strHex;
        }else if(reg.test(that)){
            var aNum = that.replace(/#/,"").split("");
            if(aNum.length === 6){
                return that;
            }else if(aNum.length === 3){
                var numHex = "#";
                for(var i=0; i<aNum.length; i+=1){
                    numHex += (aNum[i]+aNum[i]);
                }
                return numHex;
            }
        }else{
            return that;
        }
   }
    });
})(jQuery);
//获取浏览器参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r!=null)return  unescape(r[2]);
    return null;
}
//获取浏览器语言
function artsLanage() {
    var type = navigator.appName
    if (type == "Netscape") {
        var lang = navigator.language
    } else {
        var lang = navigator.userLanguage
    }
    //取得浏览器语言的前两个字母
    var lang = lang.substr(0, 2)
    // 英语
    if (lang == "en") {
        Alange = "cn";
    }
    // 中文 - 不分繁体和简体
    else if (lang == "zh") {
        Alange = "cn";
    }
    // 除上面所列的语言
    else {
    }
}
var soRc={
    soRcf:function(){
    //滚动事件，后期庄维护下
    var $nav=$("#index-classify");

    var fxdTop=$(".box_choice").offset().top;
    $(window).scroll(function(){
        if($(window).scrollTop()+$nav.outerHeight()>=fxdTop){
            $nav.addClass("fixed");
        }else{
            $nav.removeClass("fixed");
        }
    });
  }
}