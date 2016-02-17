;var goodsEditor = angular.module('goodsEditor', ['editorHeaderApp']);
$(function(){
	var statue = true,
		sorFag = true,
		sajaxFag = true;
	var exq = {
		API :{
		 	personCenter: '/goodsSite/goodsEditorSuperior/superiorGoods',//精品推荐列表
		 	delGoodsSuperior: '/goodsSite/goodsEditorSuperior/delGoodsSuperior',//取消推荐精品
		 	productCategoryId: '',//商品子类
		 	parentCategoryId : '',//商品大类
		 	interestCategoryId : '',//兴趣 
		 	pageNo :1
		},
		init : function(){
			var exq = this;
			exq.getData();
			exq.exqAjax.sAjaxlist();
		},
		getData :function(callback, error){
			exq.exqAjax.sAjaxlist(function () {
				if(sorFag){
				  	sorFag = false;
				  	$.scroll({
						callback: function () {
							exq.exqAjax.sAjaxlist();
						}
				    });
				    $.scrollLoad($('#boxDom'));
				}
				if (typeof(callback) === 'function') callback();
			});
		},
		cancelexqFun : function(){
			$('.canS').on('click',function(){
			  	if(statue){
			  		statue = false;
				  	var that = $(this);
				  	var dId = that.attr('data-id');
					exq.exqAjax.sAjax(that, dId);
				}
			});
		},
		cRemove : function(tp, tid){
			var that = tp;
			  	var _in = that.parent().parent().attr('pd');
				  	if(_in == tid){
				  		that.fadeOut(300, function() {
			                //移除父级
			                setTimeout(function(){
			                	that.parent().parent().remove();
				                $.Waterfall($('#boxDom').find('li'));
				            },1100);
			            });
						that.addClass('class_name');
				  	}
		},
		exqAjax :{
			sAjax:function(ts, tid){
				$.ajax({
			        type: "post",
			        url:exq.API.delGoodsSuperior,
			        data:{
			        	goodsId : tid
			        },
			        dataType: "json",
			        success: function (data) {
			            if(data.code ==200){
			            	statue = true;
			                ArtDialog.toast("取消成功");
			                exq.cRemove(ts, tid);
			                //window.location.reload();
			            }else{
			            	statue = true;
			            }
			        },
	                error: function () {
	                    statue = true;
	                    console.log(404);
	                }
			    });
			},
			sAjaxlist:function(callback, error){
				$.loadingShow();
				if(sajaxFag){
					sajaxFag = false;
					var data ={
						pageSize : 18,
						pageNo : exq.API.pageNo,
						//clientType : 'web',
						//abbr : 'CN',
						//customerId : 442,
						//productCategoryId :exq.API.productCategoryId,//待定
						//parentCategoryId : exq.API.parentCategoryId,//待定
						//interestCategoryId : exq.API.interestCategoryId//待定
					}
					$.ajax({
				        type: "get",
				        url:exq.API.personCenter,
				        data:data,
				        dataType: "json",
				        success: function (data) {
				            if(data.code ==200){
				            	sajaxFag = true;
				            	$.loadingHide();
				            	var resLen = data.result.pageItems;
									if (resLen.length) {
						            	$(data.result.pageItems).each(function (index, v) {
			                                 var $warp = $('#boxDom');
										 	 var shopDom = dom.shopDom(index,v);
										 	 $warp.append(shopDom);
										 	 $.Waterfall($warp.find('li'));
										 	 $.scrollLoad($warp);
			                            });
			                            exq.cancelexqFun();
			                            ++exq.API.pageNo;
			                         	$(window).scroll();
										if (typeof(callback) === 'function') callback();
										}else if(resLen == null || resLen.length <=0){
			                            	sajaxFag = false;
			                            }else{
											console.log(data.message);
											sajaxFag = true;
											if (typeof(error) === 'function') error();
										}
				            }else{
				            	 console.log(data.message);
				            }
				        },
		                error: function () {
		                     console.log(data.message);
		                }
				    });
				}
			}
		}
	}
	exq.init();
	var dom ={
		shopDom : function(index,item){
			var domArr =['<li pd="'+item.goodsId+'">',
                    '<div class="art-img">',
                        '<span class="art-span">',
                            '<img class="load" lazyload="'+ArtJS.server.image+''+item.imagePath+'?imageView2/2/format/jpg/w/270/q/50">',
                        '</span>',
                    '</div>',
                    '<div class="text">',
                        '<h2>',
                            '<span class="stores-title">'+item.goodsName+'</span>',
                            '<span class="user">',
                                '<a>',
                                    '<b><img src="'+ArtJS.server.image+''+item.createUserImage+'?imageView2/1/format/jpg/w/20/h/20/q/50"></b><font>'+item.createUserName+'</font></a>',
                            '</span>',
                        '</h2>',
                    '</div>',
                    '<div class="light-price">',
                        '<span>',
                            '<b class="iconfont icon-icon"></b>',
                            '<i>'+item.likeCount+'</i>',
                        '</span>',
                        '<span>',
                            '<font>'+item.currencySymbol+'</font>&nbsp;<font>'+item.sellPrice+'</font>',
                        '</span>',
                    '</div>'];
            var domBnt ='<div class="cbnt" in='+index+'>'
            			domBnt +='<span class="time">推荐时间：'+formatDate(item.pushSuperiorDate)+'</span>'
                    	domBnt +='<span class="bnt canS" id="canS'+index+'" data-id="'+item.goodsId+'">取消精品</span>'
	                 domBnt +='</div>'
			domArr.push(domBnt);
			return domArr.join('') +'</li>';
		}
	}

	function formatDate(time){
		// 2016/12/11 15：35
		if(time){
			return new Date(time).format("yyyy/mm/dd hh:nn");
		}
		return "";
	}
});