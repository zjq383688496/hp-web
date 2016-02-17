;var infoApp = angular.module('uersinfo', ['modHeaderFull','mod-icon']);
infoApp.controller('infoCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		var Vflag =false;
		var toK =ArtJS.cookie.get('toKen')||'';
		if(toK){
			$timeout(function () {
				var UIL = {
					url: '/memberSite/members/getMember?',
					editMemberInfo: '/memberSite/members/editMemberInfo?',
					editPass: '/memberSite/members/editPass?'
				}
				$.fn.extend({
					vewNull: function (num) {
				        if ($(this).val() == "") {
				            return true;
				        } else {
				            return false;
				        }
				    },
				    vewHtml: function(id){
				    	$(this).html('');
				    }
				});
				var status = true;
				var scrollStatus = true;
				var falg = true;
				var falgPwd = true;
				var $pwdBox =$('#changePwdBox');
				var $boxFixed =$('.box-fixed');

				$scope.imgUrl    = ArtJS.server.image;
				$scope.qnIcon = '?imageView2/1/format/jpg/w/120/h/120/q/50';
				$scope.inforMation = [];
				$scope.LANG      = LANG;
				$scope.gender ="";
				gender =$("#gender");
				$scope.getMember = function (callback, error) {
					if (status) {
						status = false;
						$http.get(UIL.url).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								var inforMation = data.result;
								if (inforMation !=null) {
									$scope.inforMation = inforMation;
									$scope.gender =inforMation.gender;
									gender.find("label").each(function(){
					                    var checked =$(this).find('input').val();
					                    var that =$(this);
					                    if(checked ==$scope.gender){
											that.addClass('active');
					                        that.find('input').attr("checked","checked");
					                    }
					                });
								} else if (typeof(error) === 'function') error();
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
				$scope.onName =function() {
				    ///^[\w-]{2,16}$/
				    var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\"]+$/;
				    if (!reg.test($("#userName").val())) {
				        $(".sp_hint").html('用户名只能用2-30个中文、英文、数字、下划线、杠(-)的组合');
				        falg = false;
				    }
				    else if (reg.test($("#userName").val())) {
				        $(".sp_hint").html('');
				        falg = true;
				    }
				}
				//confirm
				$scope.confirm =function(){
					$scope.DATA = {
						nikeName: $("#userName").val(),
		                gender: $('label.active >input').val(),
		                description: $("#user_desc").val(),
					};
					if(falg){
						$http.get(UIL.editMemberInfo + ArtJS.json.toUrl($scope.DATA)).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								$("body").alertTips({
									"titles":"资料修改成功",
									"speed":1000,
									"closeback":function(){
										window.onbeforeunload=undefined;
										window.parent.location.reload();
									}
								});
							}
						});
					}
				}
				//
				$scope.cancel =function(){
					window.history.go(-1);
				}
				//ChangePwdBtn
				$scope.ChangePwdBtn =function(){
					$pwdBox.fadeIn();
					$boxFixed.fadeIn();
					$('body').after('')
					$('#pwdClose').click(function(event) {
						 var that =$(this).parent().parent('#changePwdBox');
						 that.find('input').val('');
						 that.fadeOut(600);
						 $boxFixed.fadeOut(600);
					});
				}
				//editPass
				$scope.ChangeEditPwd =function(){

					var $newpwd=$("#newpwd");
					var $oldpwd=$("#oldpwd");
					var $confirmpwd=$("#confirmpwd");

					$scope.DATA = {
							password: $newpwd.val(),
			                oldPassword: $oldpwd.val(),
						};
						
					if($oldpwd.vewNull()){
						$oldpwd.addClass("error");
						falgPwd =false;
					}
					else if($newpwd.vewNull()){
						$newpwd.addClass("error");
						falgPwd =false;
					}
					else if($newpwd.val().length <6){
						$newpwd.addClass("error");
						$('#newMsg').html(LANG.TITLE.PASSDUAN);
						falgPwd =false;
					}
					else if($confirmpwd.vewNull()){
						$confirmpwd.addClass("error");
						falgPwd =false;
					}
					else if($newpwd.val() != $confirmpwd.val()){
						$('#newMsg').vewHtml();
						$('#confirMsg').html(LANG.TITLE.PASSPIPEI);
						falgPwd =false;
					}
					else{
						$('#confirMsg').vewHtml();
						$(".error").removeClass("error");
						 
						$http.get(UIL.editPass + ArtJS.json.toUrl($scope.DATA)).
						success(function (data) {
							console.log(data.code+"data");
							if (data.code === CONFIG.CODE_SUCCESS) {
								 $pwdBox.hide();
		                         location.href = "/memberSite/sso/logOut";
		                         location.href =ArtJS.server.art
							}else{
								 $('#oldMsg').html(data.message);
							}
						});
					}
				}
				gender.find('label').click(function(event) {
					var that =$(this);
					that.addClass('active').siblings().removeClass('active');
				});
				$scope.getMember();
			});
	    }else{
	    	location.href =ArtJS.server.art;
	    }
	});
});