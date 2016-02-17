/**
 * Created by Administrator on 2015/10/27.
 */
var proofImageUri=[];
var lenKey="";
if (!window.IMAGEUP) window.IMAGEUP = {};
;var headIcon = angular.module('mod-icon', []);
headIcon.directive("upfileimg", ['$http','$timeout',function($http,$timeout,$scope){
    return {
        restrict:'AE',
        replace: true,
        link: function (scope, element, attributes) {
            var upfile=$(element).find(".fileDemo");
            var mark = $(element).find(".fileDemo").attr("mark");
            var pCop = $('#up-file-div');
            var prooId="";

            upfile.bind("change", function (changeEvent) {
                var prooLen = proofImageUri.length;
                 if(lenKey >=3 || prooLen >=3){
                     pCop.css({
                         "border-color":"#f00"
                     });
                     return;
                 }else {
                    setTimeout(function () {
                        upfile.fileUp({
                            ajaxUrl: "http://upload.qiniu.com",
                            fload: function (el) {
                                var imgSrc = el.domain + "imgsrv/" + el.key;
                                var artUrl = ArtJS.server.art;//域名url
                                IMAGEUP._image = el.key;
                                upfile.val("");
                                if(mark == 18){
                                    $(element).attr("style", "background-image:url(" + imgSrc + "?imageView2/1/w/170/h/240/q/90)");
                                }else if(mark ==3){
                                    proofImageUri.push("imgsrv/" + el.key);
                                    $("#up-file-div").removeAttr('style');
                                     $(element).parent().find("#up-file").append("<span><img data-src='" + "imgsrv/" + el.key + "' src='" + imgSrc + "?imageView2/1/w/96/h/96/q/90' /></span>");
                                }else if(mark ==19){//用户封面
                                    $('.u-mark').attr("style", "background-image:url(" + imgSrc + "?imageView2/1/w/1000/h/300/q/90)");
                                    $('.u-cover').fadeOut();
                                    $('.cover-mark').remove();
                                    $http.get("/memberSite/userAttach_q/editCover?" + $.param({
                                        //memberId: ArtJS.cookie.get('User_id'),
                                        cover: el.key//"imgsrv/"+
                                    })).success(function (rspon) {});
                                }else if(mark ==20){//专卖店封面
                                    $('.store-bg p').attr("style", "background-image:url(" + imgSrc + "?imageView2/1/w/850/h/240/q/90)");
                                    $http.get("/memberSite/userAttach_q/editBanner?" + $.param({
                                        //memberId: ArtJS.cookie.get('User_id'),
                                        banner: el.key//"imgsrv/"+
                                    })).success(function (rspon) {
                                        ArtJS.cookie.set("uBanner",el.key);
                                    });
                                }else {
                                    $("#uplad_avater").attr("style", "background-image:url(" + imgSrc + "?imageView2/1/w/60/h/60/q/90)");
                                    $(".user-icon").attr("style", "background-image:url(" + imgSrc + "?imageView2/2/w/24/q/90)");
                                    $("#scorllUserHeadImg").attr("style", "background-image:url(" + imgSrc + "?imageView2/2/w/32/q/90)");
                                    $(".info-pic-thumb").attr("style", "background-image:url(" + imgSrc + "?imageView2/1/w/120/h/120/q/90)");
                                    //上传头像成功
                                    $http.get("/memberSite/members/editMemberInfo?" + $.param({
                                        memberId: ArtJS.cookie.get('User_id'),
                                        imageUrl: el.key//"imgsrv/"+
                                    })).success(function (rspon) {
                                        $('.thumb-box').fadeOut();
                                        $('.userInformation-thumb em').fadeIn();
                                        //$('body,.userInformation-thumb').removeAttr('style');
                                    });
                                }
                            },
                            ferror: function () {
                                $(element).pop({
                                    title: LANGUAGE_NOW.withdraw.Suggestions,
                                    classn: "text-center",
                                    content: LANGUAGE_NOW.withdraw.failed
                                });
                            },
                            progress: function (el, p) {
                                $('#coverPar').show();
                                $('#sUp input,.cover-up input,.box-span input').css({
                                    'display':'none'
                                });
                                $('#gaProgress em,#coverPar em').css({
                                    'width':p+'%'
                                });
                                if(p ==100){ 
                                    $('.ga-cover-editor').fadeOut();
                                    $('.cover-mark').remove();
                                    $('#gaProgress em,body').removeAttr('style');
                                    $('#sUp input,.cover-up input,.box-span input').removeAttr('style');
                                    $('#coverPar').hide();
                                }
                            }
                        });
                    }, 100);
                }
            });
        }
    }
}]);
function handleFiles(files){
    lenKey =files.length;
}