;var galleryApp = angular.module('gallery', ['modHeaderFull','modUserHead','mod-icon','modUserCopyright']);
galleryApp.controller('galleryCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				//url: '/goodsSite/arts/listArts?',
				storeManage: '/goodsSite/personCenter/storeManage?',
				deleteOriginal: '/goodsSite/personCenter/deleteOriginal?',
				artsCopyright: '/goodsSite/goodsCopyRight/validate?',//版权验证
				artsCopyrightResult: '/goodsSite/goodsCopyRight/opResult?',//
				copyrightProof: '/goodsSite/goodsCopyRight/copyrightProof?'//上传版权证明
			}
			var status = true;
			var scrollStatus = true,
				cfag = true;

			$scope.cooid =ArtJS.cookie.get("User_id");
        	$scope.id = request('uid');
        	var $bfont = $('#a04');
        	var uid=location.search.getQueryValue("uid");

			$scope.DATA = {
				pageSize: 18,
				pageNo: 1,
				customerId:$scope.id,
				storeType:'',
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.LANG      = LANG;
			$scope.galleryItems = [];
			$scope.worksup =LANG.BUTTON.WORKSUP;
			$scope.worksrestrict =LANG.BUTTON.RESTRICT;
			$scope.imgmanage =LANG.BUTTON.IMGMANAGE;
			$scope.SHOPMANAGE =LANG.PAGE.SHOPMANAGE;
			$scope.MSHOP =LANG.BUTTON.MSHOP;
			$scope.COPYRIGHT = LANG.BUTTON.COPYRIGHT;
			$scope.DELIMG 	= LANG.BUTTON.DELIMG;
			$scope.PUSHSHOP 	= LANG.BUTTON.PUSHSHOP;
			$scope.DELIMGSHOP 	= LANG.BUTTON.DELIMGSHOP;

			$('.gallery-box,#btn-uploader,.ga-right').fadeIn();
			$('#nav06').addClass('active');
			$scope.getGalleryMarket = function (callback, error) {
				$('.data-not').hide();
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
					 if (!$scope.galleryItems.length) $('.data-not').show();
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					//ArtJS.page.ui.loadingShow();
					status = false;
					$http.get(UIL.storeManage + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							cfag = true;
							var galleryItems = data.result.pageItems;
							if (galleryItems.length) {
								$.each(galleryItems,function(i,item){
		                        	item.esId=base64encode(item.id.toString());
		                    	});
								$scope.galleryItems = $scope.galleryItems.concat(galleryItems);
								if (galleryItems.length === $scope.DATA.pageSize) {
									++$scope.DATA.pageNo;
									status = true;
									cfag = true;
								}
								$timeout(function () {
									$(window).scroll();
									if (typeof(callback) === 'function') callback();
								});
							} else if (typeof(error) === 'function') error();
						} else {
							status = true;
							cfag = true;
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						status = true;
						if (typeof(error) === 'function') error();
					});
				}
			}

			$scope.delUserArts = function (data,inx) {//del
				var sId = inx;
				$scope.DELDATA = {
					originalId:data.id
				};
				$http.post(UIL.deleteOriginal + ArtJS.json.toUrl($scope.DELDATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							//location.reload();
							var $bxo = $('.gallery-box').find('li');
							console.log($bfont.html()+"pVal");
								$bfont.html($bfont.html() -1);
							$bxo.each(function(i, e) {
								var that = $(this),
									tInx = that.attr('data-index');
								console.log(tInx,sId);
								if(sId == tInx){
									$("body").alertTips({
										"titles":LANG.ALERT.A020,
										"speed":1000,
										"closeback":function(){
											window.onbeforeunload=undefined;
											that.slideDown(300, function() {
									            //移除父级
									            that.remove();
									        });
										}
									});
								}
							});
						}
					});
		    }
		    //tagFun
		    $scope.tagFun = function(){
				$scope.DATA.cid =11;
				$scope.getGalleryMarket();
		    }
		    // 商品详情
			$scope.ugoodsInfo = function (item) {
				//ArtJS.goods.detail(item.id);
			}
			// 版权保护
			var _imageId="";
		    var _cUri="";
		    $scope.artCopyright = function (id,path,copyrightStatus,imageId) {//版权保护
		        var $copyBox = $('.c-txt');
		        _cUri = path;
		        var copyrightNumber =ArtJS.cookie.get("copyrightNumber");
		        //copyrightNumber  版权保护数量
		        //$copyBox.html(LANGUAGE_NOW.user.check);
		        $("body").after('<div class="ga-mark"></div>');
		        $('.copy-fist').show();
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
		                        $('.copy-fist,.ga-mark').hide();
		                    }
		                });
		        }
		        else if(copyrightStatus ==3){
		            $('.c-txt').html('');
		            $('.c-txt').html(LANG.ALERT.A011);
		        }
		        else if(copyrightStatus ==1){
		            $('.c-txt').html('');
		            $('.c-txt').html(LANG.ALERT.A012);
		        }
		    }
		    /*记录版权数*/
		    $scope.copySure = function () {//版权保护
		        $http.post(UIL.artsCopyrightResult +$.param({
		            memberId:$scope.cooid,
		            //imageId :_imageId,
		            imageId :prooId,
		            proofId:prooId,
		            uri:_cUri
		        })).success(function(rspon) {
		            if(rspon.code==200){
		                $('.copy-out,.copy-two,.ga-mark').hide();
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
		            imageId:prooId,
		            proofImageUri:FileId
		        })).success(function(rspon) {
		            if(rspon.code==200){
		                $(".copy-three,.copy-out,.ga-mark").hide();
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
		        $(".copy-fist,.copy-two,.copy-three,.ga-mark").fadeOut();
		        $("body").removeAttr('style');
		    });
		    //shop-nav
		    $('.p1').hover(function(){
		    	$('.p2').fadeIn();
		    	var TimeFn = null;
		    	$('.shop-nav .p2 span').on('click',function(){
		    		if(cfag){
		    			cfag = false;
			    		$(this).addClass('active').siblings().removeClass('active');
			    		$('.p1 >span').html($(this).html());
			    		clearTimeout(TimeFn);
				    	$scope.DATA.storeType =$(this).attr('datatype');
				    	setTimeout(function(){
				    		$scope.getGalleryMarket();
				    	},300);
		    		}
			    });
		    },function(){$('.p2').fadeOut();});
		    //滚动事件
			$(window).scroll(function(){
				var boxFind = $('.user-nav-box');
				var gaL = $('.ga-box');
				var gaR = $('.ga-right');
				var fxdTop = boxFind.offset().top + 30;
	            if($(window).scrollTop() + boxFind.outerHeight()>=fxdTop){
					gaL.addClass("fixed");
					gaR.css({
						'left':'130px'
					});
					gaL.animate({top:"56px"},2);
				}else{
					gaL.removeClass("fixed");
					gaR.css({
						'left':'0'
					});
					gaL.css({top:"0"},2);
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
			$scope.getGalleryMarket();
		});
	});
});