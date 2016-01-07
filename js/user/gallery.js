;var galleryApp = angular.module('gallery', ['modHeaderFull','modUserHead','mod-icon','modUserCopyright']);
galleryApp.controller('galleryCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				url: '/goodsSite/arts/listArts?',
				del: '/goodsSite/arts/delArts?',
				artsCopyright: '/goodsSite/artsOperate/artsCopyright?',
				artsCopyrightResult: '/goodsSite/artsOperate/artsCopyrightResult?',
				copyrightProof: '/goodsSite/artsOperate/copyrightProof?'
			}
			var status = true;
			var scrollStatus = true;

			$scope.cooid =ArtJS.cookie.get("User_id");

        	$scope.id =request('uid');

			$scope.DATA = {
				pageSize: 20,
				pageNo: 1,
				artsType: 2,
				customerId:$scope.id,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.LANG      = LANG;
			$scope.galleryItems = [];

			$('.art-box,#btn-uploader').fadeIn();
			$scope.getGalleryMarket = function (callback, error) {
				status = true;
				$scope.galleryItems = [];
				$scope.DATA.pageNo = 1;
				$scope.getMarketData(function () {
					if (scrollStatus) {
						scrollStatus = false;
						ArtJS.page.ui.imageLoad.init(100);
						ArtJS.page.ui.scroll({
							callback: function () {
								$scope.getMarketData();
							}
						});
					}
					if (typeof(callback) === 'function') callback();
				}, function () {
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					//ArtJS.page.ui.loadingShow();
					status = false;
					$http.get(UIL.url + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var galleryItems = data.result.pageItems;
							if (galleryItems.length) {
								$.each(galleryItems,function(i,item){
		                        	item.esId=base64encode(item.id.toString());
		                    	});
								$scope.galleryItems = $scope.galleryItems.concat(galleryItems);
								if (galleryItems.length === $scope.DATA.pageSize) {
									++$scope.DATA.pageNo;
									status = true;
								}
								$timeout(function () {
									$(window).scroll();
									if (typeof(callback) === 'function') callback();
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

			$scope.delUserArts = function (id) {//del
				$scope.DELDATA = {
					id:id
				};
				$http.post(UIL.del + ArtJS.json.toUrl($scope.DELDATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							location.reload();
						}
					});
		    }
			// 版权保护
			var _imageId="";
		    var _cUri="";
		    $scope.artCopyright = function (id,path,copyrightStatus,copyrightNumber,imageId) {//版权保护
		        var $copyBox = $('.c-txt');
		        _cUri = path;
		        //$copyBox.html(LANGUAGE_NOW.user.check);
		        $('.copy-fist,.copy-out').show();
		        $('#copy-font').html(copyrightNumber);
		        _imageId = imageId;
		        var sflag=true;
		        if(copyrightStatus ==0 || copyrightStatus ==2) {
		                prooId = id;
		                sflag =false;
		                $http.get(UIL.artsCopyright + $.param({
		                    uri: path
		                })).success(function (rspon) {
		                    if (rspon.code == 200) {
		                        sflag =true;
		                        if (rspon.result != "") {
		                            for (var i = 0; i < rspon.result.length; i++) {
		                                if (rspon.result[i].path == "") {
		                                    $('.copy-fist').hide();
		                                    $('.copy-two').fadeIn();
		                                    $('#copy-img').attr('src', '/drift/images/copyright.gif');
		                                    $("body").css({
		                                        "overflow": "hidden"
		                                    });
		                                } else {
		                                    $("#textarea").val('');
		                                    $("#up-file").html('');

		                                    $(".zhm-xinxi span").removeAttr("style");
		                                    $("#copy-on-a").html(0);
		                                    $("#copy-on-b").html(300);

		                                    $('.copy-fist').hide();
		                                    $('.copy-three').fadeIn();
		                                    $("body").css({
		                                        "overflow": "hidden"
		                                    });
		                                    $scope.copyright = rspon.code;
		                                }
		                            }
		                        } else {
		                            if (rspon.result == "") {
		                                $('.copy-fist').hide();
		                                $('.copy-two').fadeIn();
		                                $('#copy-img').attr('src', '/drift/images/copyright.gif');
		                            } else {
		                                $("#textarea").val('');
		                                $("#up-file").html('');

		                                $(".zhm-xinxi span").removeAttr("style");
		                                $("#copy-on-a").html(0);
		                                $("#copy-on-b").html(300);

		                                $('.copy-fist').hide();
		                                $('.copy-three').fadeIn();
		                                $("body").css({
		                                    "overflow": "hidden"
		                                });
		                                $scope.copyright = rspon.code;
		                            }
		                        }
		                    } else {
		                        $('.copy-fist,.copy-out').hide();
		                    }
		                });
		        }
		        else if(copyrightStatus ==3){
		            $('.c-txt').html('');
		            $('.c-txt').html('您版权正在申请中');
		        }
		        else if(copyrightStatus ==1){
		            $('.c-txt').html('');
		            $('.c-txt').html('此图片已受版权保护');
		        }
		    }
		    /*记录版权数*/
		    $scope.copySure = function () {//版权保护
		        $http.post(UIL.artsCopyrightResult +$.param({
		            memberId:$scope.cooid,
		            imageId :_imageId,
		            proofId:prooId,
		            uri:_cUri
		        })).success(function(rspon) {
		            if(rspon.code==200){
		                $('.copy-out,.copy-two').hide();
		                $("body").alertTips({
							"titles":"申请成功",
							"speed":1000,
							"closeback":function(){
								window.onbeforeunload=undefined;
								$scope.getGalleryMarket();
							}
						});
		            }
		        });
		    }
		    $scope.proofSubt = function () {/*版权信息*/
		    	alert(proofImageUri);
		        var FileSrc = $scope.upFile();
		        FileSrc = FileSrc.toString();

		        var zmVal=$("#textarea");

		        if(zmVal.val() ==""){
		            $(".text").css({
		               "border-color":"#f00"
		            });
		            return
		        }

		        if(proofImageUri ==""){
		            $("#up-file-div").css({
		                "border-color":"#f00"
		            });
		            return
		        }
		        var FileId = JSON.stringify(proofImageUri);

		        $http.post(UIL.copyrightProof +$.param({
		            proofId:prooId,
		            proofInfo:$("#textarea").val(),
		            imageId:_imageId,
		            proofImageUri:FileId
		        })).success(function(rspon) {
		            if(rspon.code==200){
		                $(".copy-three,.copy-out").hide();
		                $scope.copyright =rspon.code;//证明保存成功
		                $scope.getGallery();
		            }
		        });
		    }
		    $scope.fontLength =function($event) {
		        if($("#textarea").val().length >0){
		           $("div.text").removeAttr('style');
		        }
		        $(".text font#copy-on-a").html($("#textarea").val().length);
		    }
		    
		    /*字符串取值*/
		    $scope.upFile =function() {
		        var upFileSrc = $('#up-file span').find("img").map(function () {
		            return $(this).attr("data-src");
		        }).get().join(',');
		        return upFileSrc;
		    }
		    $(".copy-fist #colse,.copy-two #colse,.copy-three #colse,.cancel").click(function(){
		        proofImageUri.splice(0,proofImageUri.length);
		        $(".copy-fist,.copy-two,.copy-three,.copy-out").fadeOut();
		        $("body").removeAttr('style');
		    });
			$scope.getGalleryMarket();
		});
	});
});