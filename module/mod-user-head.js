;var modUser = angular.module('modUserHead', ['modUserShare']);
modUser.directive('moduserhead', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-user-head.html',
		link: function () {
			$(function(){
				var slideHeight = 54; // 默认值px
				var defHeight = $('#eWrap').height();
				if(defHeight >= slideHeight){
					$('.p-more').fadeIn();
					$('#eWrap').css('height' , slideHeight + 'px');
					$('.p-more').click(function(){
						var curHeight = $('#eWrap').height();
						if(curHeight == slideHeight){
							$('#eWrap').animate({
							  height: defHeight
							}, "normal");
							$('.p-more').html('隐藏');
						}else{
							$('#eWrap').animate({
							  height: slideHeight
							}, "normal");
							$('.p-more').html('查看完整介绍');
						}
						return false;
					});		
				}
		    });
		}
	}
}).controller('userInfoController', function ($http, $scope, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var  URI= {
				 url: '/memberSite/members/homeIndex?',
				 opFollow:'/memberSite/memberFollows/opFollow?',
				 userCover:'/memberSite/userAttach_q/getByMember?'
			}
			$scope.uCover =[];
			var status = true;

        	$scope.cooid =ArtJS.cookie.get("User_id");

        	$scope.id =request('uid');

			$scope.LANG      = LANG;
        	//LANG.NAME LANG.PAGE.LIKE
        	$scope.uLike =LANG.PAGE.LIKE;
        	$scope.uFans =LANG.PAGE.FANS;
        	$scope.uFollow =LANG.PAGE.FOLLOW;
        	$scope.uCommunity =LANG.PAGE.COMMUNITY;
        	$scope.ustore =LANG.PAGE.STORE;
        	$scope.ushopmanage =LANG.PAGE.SHOPMANAGE;
        	$scope.ushare =LANG.GLOBAL.SHARE;
        	$scope.uedit =LANG.BUTTON.EDIT;
        	$scope.ufollowing =LANG.BUTTON.FOLLOWING;
        	$scope.umore = LANG.BUTTON.GAMORE;
        	$scope.COVEREIDT = LANG.BUTTON.COVEREIDT;
        	$scope.ICONED = LANG.BUTTON.ICONED;
        	if($scope.cooid !=$scope.id)$('.fileDemo,.em-editor,.u-editor,.g-editor').remove();

			$scope.DATA = {
				memberId: $scope.id
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon    = '?imageView2/1/format/jpg/w/98/h/98/q/90';
			$scope.usernav = [];
			$scope.userinfo = [];
			$scope.userId = [];

			$scope.getUser = function (callback, error) {
				if (status) {
					status = false;
					$http.get(URI.url + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var usernav = data.result;
							var userinfo = data.result.memberInfo;
							$scope.usernav = usernav;
							$scope.userinfo = userinfo;
							$scope.userId = base64encode($scope.userinfo.memberId.toString());

							// by zhuangjiaqi
							var USER_ID = location.href.getQueryValue('uid');
							$scope.USER_ID = USER_ID;

						} else {
							status = true;
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						status = true;
						if (typeof(error) === 'function') error();
					});
				}
			}
			$scope.userCover = function (callback, error) {
				$scope.UDATA = {
					userId: $scope.id
				};
				$http.get(URI.userCover + ArtJS.json.toUrl($scope.UDATA)).
				success(function (data) {
					if (data.code === CONFIG.CODE_SUCCESS) {
						var uCoverBanner = data.result;
						if(uCoverBanner !=null && uCoverBanner !=""){
							$scope.uCover = uCoverBanner.cover;
							ArtJS.cookie.set("uBanner",uCoverBanner.banner);
						}else{
							ArtJS.cookie.set("uBanner","");
						}
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					if (typeof(error) === 'function') error();
				});
			}
			$scope.init =function(){
				var uMain ={
					navInit: function () {
				        var that = this;
				        that.$navList = $('.user-nav a');
				        that.$fanFollow = $('#fansFollow a');
				        that._uid =request("uid");

				        if (that._uid) {
				            that.navEach(that.$navList);
				            that.navEach(that.$fanFollow);
				        }
				    },
				    navEach: function (list) {
				        var that = this;
				        list.each(function (i, e) {
				            var href = $(e).attr('href');
				            var baseEst=request("uid");
				            if (request("uid")) {
				                href = href + '?uid=' + base64encode(baseEst.toString());
				                $(e).attr({href: href});
				            }
				        });
				    }
				}
				uMain.navInit();
			}
			//更换用户封面
			$scope.coverFun = function(){
				var $cov = $('.u-cover');
				mask.sk();
				$cov.fadeIn();
				$cov.find('i.icon-close-b').click(function(e) {
					 $cov.fadeOut();
					 $('.cover-mark').remove();
					 $('body').removeAttr('style');
				});
			}
			//上传头像
			$scope.thumbFun = function(){
				$thbox = $('.thumb-box');
				$iThum = $('.userInformation-thumb');
				$thEm = $iThum.find('em');
				mask.sk();
				$thbox.fadeIn();
				$thEm.hide();
				$iThum.css({
					'top':'-70px',
					'z-index':'9007'
				});
				$thbox.find('i.icon-close-b').click(function(e) {
					 $thbox.fadeOut();
					 $('.cover-mark').remove();
					 $('body,.userInformation-thumb').removeAttr('style');
					 $thEm.show();
				});
			}
			//关注
			$scope.hUserFollow = function(obj,data){
				ArtJS.login.pop(function () {
					var _code =obj.target.getAttribute('code');
					$scope.FDATA = {
							memberId: $scope.cooid,
			                followingId: data.memberInfo.memberId,
			                opType: _code
						};
						$http.post(URI.opFollow + ArtJS.json.toUrl($scope.FDATA)).
							success(function (data) {
								if (data.code === CONFIG.CODE_SUCCESS) {
									if(_code ==1){
										obj.target.setAttribute("class","active");
										obj.target.setAttribute("code","0");
										obj.target.innerHTML = LANG.PAGE.FOLLOW;
									}else if(_code ==0){
										obj.target.setAttribute("class","");
										obj.target.setAttribute("code","1");
										obj.target.innerHTML =LANG.BUTTON.FOLLOWING;
									}
								}
							});
				});
			}
		    $scope.ShearUser=function(e){
		         //$('.util-share').toggle();
		    }
		    $scope.ShearUser=function(e){
		        e.stopPropagation();
		        ArtJS.login.getUser(function(userData){
		            $scope.userData=userData;
		        });
		        var nikeName=$scope.userData!=undefined?$scope.userData.nikeName:'';
		        //var summary=nikeName+" "+$scope.LANG.shear.arts+($scope.user!=undefined?$scope.user.memberInfo.nikeName:'')+" "+$scope.LANG.shear.come;
		        var summary=nikeName;
		        //var userImg = $scope.userData.userImage;
		        var userImg = $('#uplad_avater').attr('data-pic');
		        $scope.showShear({
		            id:request("uid"),
		            summary:summary,
		            pic: userImg,
		            shareType:"NEW_USER"
		        });
		    }
		    var coFag = true;
		    var $coList =$('#coverList');
		    $coList.find('span1').click(function() {
		    	if(coFag){
		    		coFag = false;
			    	var that = $(this);
			    	var coverId =that.attr('data-cover');
			    	var $mak = $('.cover-mark');
			    	$mak.css({
			    		'z-index':9005
			    	});
			    	$('body').after('<div id="addCover"><div><span id="sSave">确定</span><span id="sCancel">取消</span></div></div>');
			    	var $Ssave =$('#sSave');
			    	var $Scan =$('#sCancel');
			    	$Scan.click(function(){
			    		$('#addCover').remove();
			    		$mak.removeAttr('style');
			    		coFag = true;
			    	});
			    	$Ssave.click(function(){
			   		//$scope.COVERDATA = {
						// 	memberId:coverId
					// };
						// $http.post(URI.opFollow + ArtJS.json.toUrl($scope.COVERDATA)).
						// 	success(function (data) {
						// 		if (data.code === CONFIG.CODE_SUCCESS) {
									 //coFag = true;
						// 		}
						// 	});
			    	});
			}
		    });
			var mask ={
				sk:function(){
					$('body').after('<div class="cover-mark"></div>');
					$('body').css({
						'overflow':'hidden'
					});
				}
			}
			$scope.getUser();
			$scope.init();
			$scope.userCover();
		});
	});
});