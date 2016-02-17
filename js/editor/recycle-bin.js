//衍生品
function showGoodsList(data) {
    onflg = false;
    var data = data;
    var totalSize = data.result.totalSize;
    var pageSize = data.result.pageSize;
    var currentPage = data.result.pageNo;
    pageIndex++;
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
function findFirstGoodsPage(sUrl, mark, pid, srckey, orderByType) {
    $("#container").html('');
    dataFun(sUrl, mark, pid, srckey);
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
    if (mark == 2) {
        gFun = showYspList;
        //用过url参数
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl + '&category=' + pid;
        getGoodsUrl = "/goodsSite/editor/listEditorArtworks?pageSize=20&selectedTagId="+selectedTagId+"&editorId="+editorId+"&pageNo=";
        gUrl = getGoodsUrl + gYurl;
    }
    if (mark == 1) {
        gFun = special;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl + '&category=' + pid;
        getGoodsUrl = "/topicSocSite/topic/edit/editTopicList?selectedTagId="+selectedTagId+"&editorId="+editorId+"&currPage=";
        gUrl = getGoodsUrl + gYurl + '&pageSize=' + 20;
    }
    if (mark == 3) {
        gFun = showGoodsList;
        var gYurl = pageIndex + '&abbr=' + Alange;
        gYurl = gYurl;
        getGoodsUrl = "/goodsSite/editor/listEditorGoods?delStatus=1&pageNo=";
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
                            if (data.result.pageItems == null || data.result.pageItems.length == 0) {
                                $('#stopFlg').val(0);
                                $(".loadshowcss").hide();
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
                            if (data.result.pageItems == null || data.result.pageItems.length == 0) {
                                tempdis = 0;
                                $(".loadshowcss").hide();
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
            if (markValSrc == 3) {
                console.log("衍生品");
                onflg = false;
                FrameNum++;
                $.ajax({
                    type: "GET",
                    url: getGoodsUrl + pageIndex + '&FrameNum=' + FrameNum+ '&abbr=' + Alange+ '&pageSize=' + 20,
                    dataType: "json",
                    beforeSend: LoadPushFunction,
                    success: function (data) {
                        if (data) {
                            pageIndex++;
                            var pageSize = data.result.pageSize;
                            var currentPage = data.result.pageNo;
                            if (data.result.pageItems.length == 0) {
                                stopflg = 0;
                            } else {
                                stopflg = 1;
                            }
                            $(data.result.pageItems).each(function (index, v) {
                                text = ArtList.Aartwork(index, v, shFlag);
                                $container = $('#container');
                                $container.append(text);
                            });
                        } else {
                            stopflg = 0
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
    findFirstGoodsPage(sUrl, markVal, pid, srckey, editorId);
    categoryId = markVal;
    function LoadPushFunction() {
        $(".loadshowcss").show();
    }
    $("#box-menu li").click(function () {
        $("#container").removeAttr('style');
        $(this).addClass("current").siblings().removeClass("current");
        $("#box-menu li").each(function () {
            if ($(this).attr("class") == "current") {
                sLei = $(this).attr("indexTag");
                LeiId = $(this).find("a").attr("data-classify");
                markValSrc = $(this).find("a").attr("data-mark");
                console.log(markValSrc);
                orderByType = 2;
                stopflg = 1;
            }
        });
        pid = "";
        $("#fenlei dd").find("a").removeClass("active click");
        var _markVal = $(this).find("a").attr("data-mark");
        markValSrc = _markVal;
        findFirstGoodsPage(sUrl, markValSrc, pid, srckey);
        categoryId = _markVal;
    });
});