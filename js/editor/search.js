/**
 * Created by Administrator on 2015/9/24.
 */
//衍生品
var sVal="";
//获取浏览器参数
sVal =decodeURIComponent(GetQueryString("searchVal"));

function showGoodsList(data) {
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
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
    $(data.result.pageItems).each(function (index, v) {
        var text =$(ArtList.special(index, v, shFlag, dataArry));
        $container = $('#container');
        $container.append(text);
    });
}
// 初始化数据
function findFirstGoodsPage(sUrl, mark, pid, srckey, sVal) {
    $("#container").html('');
    dataFun(sUrl, mark, pid, srckey, sVal);
    pid =pid;
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
function dataFun(sUrl, mark, pid, srckey, sVal) {
    pageIndex = 1;
    if (mark ==2) {
        gFun = showYspList;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/goodsSite/arts/searchArts?igsType="+11;
        getGoodsUrl = sUrl + '&pageSize=' + 20+ '&searchContext=' + sVal + "&pageNo=";
        gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 3) {
        gFun = showGoodsList;
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/goodsSite/goods/searchGoods?igsType=11";
        getGoodsUrl = sUrl + '&pageSize=' + 20+'&searchContext=' + sVal+ '&pageNo=';
        gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        sUrl = "/topicSocSite/topic/searchTopic?";
        getGoodsUrl = sUrl + '&pageSize=' + 20+'&searchContext=' + sVal+ '&searchType=02&pageNo=';
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
    var _shFlag="";
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
                            if (curIndex >= totalSize || data.result.pageItems.length == 0) {
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
                                if(typeof(angular)=='object'){
                                    var appElement = document.querySelector('[ng-controller=art-details-ctr]');
                                    var $scope = angular.element(appElement).scope();
                                    $scope.setSpecial($container,text);
                                }else{
                                    $container.append(text);
                                }
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
            if (markValSrc == 3) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&category=' + pid+ '&pageSize=' + 20,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: function (data) {
                        if (data) {
                            pageIndex++;
                            var pageSize = data.result.pageSize;
                            var currentPage = data.result.pageNo;
                            if (FrameNum >= pageSize || data.result.pageItems.length == 0) {
                                tempdis = 0;
                            } else {
                                tempdis = 1;
                            }
                            $(data.result.pageItems).each(function (index, v) {
                                text = ArtList.Aartwork(index, v, shFlag);
                                $container = $('#container');
                                $container.append(text);
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
            if (markValSrc == 1) {
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&category=' + pid+'&pageSize='+20,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: function (data) {
                        if (data.code == '200') {
                            pageIndex++;
                            var totalSize = data.size;
                            var curIndex = data.curIndex;
                            if (curIndex >= totalSize || data.result.pageItems.length == 0) {
                                tempdis = 0;
                                return;
                            } else {
                                $('#stopFlg').val(1);
                                tempdis = 1;
                            }
                            $(data.result.pageItems).each(function (index, v) {
                                text = ArtList.special(index, v, shFlag);
                                $container = $('#container');
                                $container.append(text);
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
    var markId = mark();
    markId = markId.toString();

    markVal =markId;
    markValSrc =markId;

    $(".editor-nav a").each(function(){
        if($(this).hasClass("active")){
            shFlag = $(this).attr("flag");
        }
    });
    findFirstGoodsPage(sUrl, markVal, pid, srckey, sVal);
    $("#searchVal").val(sVal);
    categoryId = markVal;
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }

    //分类切换
    $("#box-menu li").click(function(){
        $("#fenlei dd").find("a").removeClass("active click");
        $(this).addClass("current").siblings().removeClass("current");
        $(this).prevAll().removeAttr("name");
        $(this).attr("name","mark");
        $(this).nextAll().removeAttr("name");
        var _markVal=$(this).find("a").attr("data-mark");
        markValSrc = _markVal;
        findFirstGoodsPage(sUrl, _markVal, pid, srckey, $("#searchVal").val());
        categoryId = _markVal;
    });
    //搜索按钮
        $("#seaVal").click(function () {
            searFun($("#searchVal").val());
        });
        $("#searchVal").keydown(function(e){
            if (e.keyCode == 13){
                searFun($(this).val());
            }
        });
        function searFun(val){
            if(val == ""){
                alert("请输入关键字！");
                return;
            }else {
                var markId = mark();
                markId = markId.toString();
                findFirstGoodsPage(sUrl, markId, pid, srckey, $("#searchVal").val());
            }
        }
    /*分类筛选*/
    if( $("#fenlei").length > 0 ) {
        $("dd a").live("click", function (event) {
            var MarkVal = "";
            $("#box-menu li").each(function(){
                if($(this).attr("class") =="current"){
                    MarkVal =$(this).find("a").attr("data-mark");
                    markValSrc =$(this).find("a").attr("data-mark");
                }
            });
            if($(this).hasClass("a active click")){
                $(this).removeClass("active click");
            }else{
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
                    //$(this).nextAll("a").addClass('click');
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
        });
    };
});
function bm() {
    var sval = $("#fenlei dd a.click").map(function() {
        return $(this).attr("data-pid");
    }).get().join(',');
    return sval;
}
//获取状态
function mark(){
    var markId = $("#box-menu li.current[name='mark']").map(function() {
        return $(this).find("a").attr("data-mark");
    }).get().join(',');
    return markId;
}