;var stickyApp = angular.module('stickCtr', ['editorHeaderApp']);
$(function(){
	var statue = true;
	var sajaxFag = true;
	var sorFag = true
		tuifag = "";
var stick = {
	API :{
		Sc:'',
	 	Stop: '/goodsSite/goods/top',
	 	level:0,
	 	personCenter: '/goodsSite/goodsEditorSuperior/getIndexMarket',//商品列表
	 	getTypeBasesByPage: '/topicSocSite/topic/getTypeBasesByPage',
	 	saveGoodsSuperior: '/goodsSite/goodsEditorSuperior/saveGoodsSuperior',//推荐精品
	 	delGoodsSuperior: '/goodsSite/goodsEditorSuperior/delGoodsSuperior',//取消推荐精品
	 	// productTypeId: '',//商品子类
	 	// category : '',//商品大类
	 	// interestTypeId : '',//兴趣
	 	productCategoryId: '',//商品子类
	 	parentCategoryId : '',//商品大类
	 	interestCategoryId : '',//兴趣 
	 	pageNo:1,
	 	recordsNumber:0
	},
	tip :{
		t01 :'推荐到精品',
		t02 :'已置于精品库中',
		t03 :'取消推荐到精品',
		t04 :'当前分类置顶',
		t05 :'置顶成功！',
		t06 :'取消当前分类置顶',
		t07 :'取消置顶成功！',
		t08 :'取消推荐成功'
	},
	init : function(){
		var sme = this;
		sme.getData();
		sme.stickAjax.ByBasesAjax(2);
	},
	getData :function(callback, error){
		stick.API.pageNo =1;
		stick.stickAjax.sAjaxlist(function () {
			if(sorFag){
			  	sorFag = false;
			  	$.scroll({
					callback: function () {
						stick.stickAjax.sAjaxlist();
					}
			    });
			    $.scrollLoad($('#boxDom'));
			    $('body').scroll();
			}
			if (typeof(callback) === 'function') callback();
		});
	},
	cancelFun : function(){//推荐
		$('.sa').on('click',function(){
			var that = $(this);
			tuifag =that.attr('data-fag');
			var stc = '';
			if(tuifag !='true'){
				stick.API.Sc = stick.API.saveGoodsSuperior;
				stc = stick.tip.t02;
			}else{
				stick.API.Sc = stick.API.delGoodsSuperior;
				stc = stick.tip.t08;
			}
		  	if(statue){
		  		statue = false;
			  	var _id = that.parents().attr('data-id');
			  	var _tip = that.attr('tip');
			  	var _btis = that.attr('data-bou');
			  	var goodsType = that.attr('goodsType');
			  		var sdata ={
						goodsId : _id,
						goodsType:goodsType,
						source:2410
					}
					if(_btis ==1){
						stc =stick.tip.t02;
					}
				  	stick.stickAjax.sAjax($(this),stick.API.level,sdata,stc,_tip);
			}
		});
	},
	StickFun : function(){//置顶
		$('.sc').click(function(){
			if(statue){
				statue = false;
			  	var that = $(this);
			  	var _id = that.parents().attr('data-id');
			  	var _tip = that.attr('tip');
			  	var _tis = that.attr('data-s');
			  	var st = stick.tip.t05;
			  		stick.API.Sc = stick.API.Stop;
			  		var vdata ={
						goodsId : _id,
						level :stick.API.level,
						topType :_tis
					}
					if(_tis==1){
						st =stick.tip.t07;
					}
				  	stick.stickAjax.sAjax($(this),stick.API.level,vdata,st,_tip,_tis);
			}
		});
	},
	stickAjax :{
		sAjax:function(obj,le,data,txt,tip,tis){
			$.ajax({
		        type: "post",
		        url:stick.API.Sc,
		        data:data,
		        dataType: "json",
		        success: function (data) {
		            if(data.code ==200){
		            	 ArtDialog.toast(txt);
		            	 if(tip ==1){
			            	 // setTimeout(function(){
			            	 // 	window.location.reload();
			            	 // },500);
							// var topStatus=1;
							if(tis==1){
								obj.html(stick.tip.t04);
								obj.attr('data-s',0);				
							}else{
								obj.html(stick.tip.t06);
								obj.attr('data-s',1);							
							}
		            	 }else{
		            	 	var sD = obj.attr('data-fag');
		            	 	if(sD =='true'){
		            	 		obj.attr('data-fag',false);
		            	 		obj.html(stick.tip.t01);
		            	 	}else{
		            	 		obj.attr('data-fag',true);
		            	 		obj.html(stick.tip.t03);
		            	 	}
		            	 }
		            	 statue = true;
		            }else{
		            	console.log(data.message);
		            }
		        },
                error: function () {
                    statue = true;
                }
		    });
		},
		sAjaxlist:function(callback, error){
			$.loadingShow();
			if(sajaxFag){
				sajaxFag = false;
				var data ={
					pageSize : 18,
					pageNo : stick.API.pageNo,
					clientType : 'web',
					abbr : 'CN',
					customerId : '' || ArtJS.cookie.get("User_id"),
					//imagePixels :'90',
					targetType :'',
					recordsNumber: stick.API.recordsNumber,
					productCategoryId :stick.API.productCategoryId,
					parentCategoryId : stick.API.parentCategoryId,
					interestTypeId : stick.API.interestTypeId
				}
				$.ajax({
			        type: "get",
			        url:stick.API.personCenter,
			        data:data,
			        dataType: "json",
			        success: function (data) {
			            if(data.code ==200){
			            	sajaxFag = true;
			            	$.loadingHide();
			            	var pageItems = data.result.pageItems;
							if (pageItems.length) {
								$(data.result.pageItems).each(function (index, v) {
	                                 var $warp = $('#boxDom');
								 	 var shopDom = dom.shopDom(index,v);
								 	 $warp.append(shopDom);
								 	 $.Waterfall($warp.find('li'));
	                            });
								 	 stick.cancelFun();
								 	 stick.StickFun();
	                         ++stick.API.pageNo;
	                         $(window).scroll();
								if (typeof(callback) === 'function') callback();
							}else if(pageItems == null || pageItems.length <=0){
                            	sajaxFag = false;
                            }else{
								console.log(data.message);
								sajaxFag = true;
								if (typeof(error) === 'function') error();
							}
			            }else{
			            	sajaxFag = true;
			            	console.log(data.message);
			            }
			        },
	                error: function () {
	                     console.log(data.message);
	                     sajaxFag = true;
	                }
			    });
			}
		},
		ByBasesAjax:function(indexTag){
			var data = {
				indexTag :indexTag,
				abbr : 'CN',
				page : 'index',
				source : 'web'
			}
			$.ajax({
		        type: "GET",
		        url:stick.API.getTypeBasesByPage,
		        data:data,
		        dataType: "json",
		        success: function (data) {
		            if(data.code ==200){
		            	 $(data.result).each(function (index, v) {
                             var $warp =$('#navDom');
                             var _id = v.id;
                             if(_id == 4){
							 	 var navDom = dom.navDom(index,v);
							 	 $warp.append(navDom);
							 	 stick.navTag();
                             }
                        });
		            }else{
		            	console.log(data.message);
		            }
		        },
                error: function () {
                    statue = true;
                }
		    });
		},
	},
	navTag : function(){
		var $nav = $('#shopClass');
		$nav.find('a').click(function() {
             var that = $(this);
             var type = that.attr('data-type');
             var tId = that.attr('data-id');
             	if(type ==1){
             		if(that.hasClass('active')){
             			that.removeClass('active');
             			that.next().find('a').removeClass('active');
             			stick.API.productCategoryId = '';
             			stick.API.parentCategoryId = '';//大类
             			$('#bigClass,#smallClass').html('');
             			stick.API.level =0;
             		}else{
             			that.parents().find('a').removeClass('active');
             			that.addClass('active');
             			stick.API.productCategoryId = '';
             			stick.API.parentCategoryId = tId;//大类
             			$('#bigClass').html(that.html());
             			$('#smallClass').html('');
             			stick.API.level =1;
             		}
             	}else if(type ==2){
             		if(that.hasClass('active')){
             			that.removeClass('active');
             			stick.API.productCategoryId = '';
             			stick.API.parentCategoryId = that.parent().prev().attr('data-id');//大类
             			$('#bigClass,#smallClass').html('');
             			stick.API.level =0;
             		}else{
             			that.parents().find('a').removeClass('active');
             			that.addClass('active');
             			that.parent().prev().addClass('active');
             			stick.API.productCategoryId = tId;
             			stick.API.parentCategoryId = that.parent().prev().attr('data-id');//大类
             			$('#bigClass').html(that.parent().prev().html());
             			$('#smallClass').html(that.html());
             			stick.API.level =2;
             		}	                 		
				 	//interestTypeId : ''//兴趣 
             	}
             	$('#boxDom').empty();
             	stick.getData();
		});
	}
}
stick.init();
var dom ={
	shopDom : function(index,item){
		var dom =[];
		var boutique = item.boutique;//是否是精品
		var bou = 0
			fag = true;
		(boutique == true) ? bou='1' : bou='0';
		(boutique == true) ? fag='true' : fag='false';
		(boutique == true) ? boutique=stick.tip.t03 : boutique=stick.tip.t01;

		var topStatus = item.topStatus;//置顶级别
		var tops =0;
		(topStatus == -1) ? tops='0' : tops='1';
		(topStatus == -1) ? topStatus=stick.tip.t04 : topStatus=stick.tip.t06;

		var domArr =['<li>',
                '<div class="art-img">',
                    '<span class="art-span">',
                        '<img class="load" lazyload="'+ArtJS.server.image+''+item.imagePath+'?imageView2/2/format/jpg/w/270/q/90">',
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
        var domBnt ='<div class="Gifbnt" data-id='+item.goodsId+'>'
        			domBnt +='<span class="sa" tip="0" data-bou="'+bou+'" goodsType="'+item.type+'" data-fag="'+fag+'">'+boutique+'</span>'
                	domBnt +='<span class="sc" tip="1" data-s="'+tops+'">'+topStatus+'</span>'
                 domBnt +='</div>'
		domArr.push(domBnt);
		return domArr.join('') +'</li>';
	},
	navDom : function(i,item){
		var str ='';
		var children = item.children;
		var Len = children.length;
			for(var i=0; i<Len; i++){
				var node = children[i];
				str +="<li><a data-type='1' data-id='"+node.id+"'><tt>"+node.typeName+"</tt></a><div>"
				if(node.children !=null || node.children ==""){
					var sLen = node.children.length;
					for(var j=0; j<sLen; j++){
						var sVal = node.children[j]
						str+="<a data-type='2' data-id='"+sVal.id+"'><tt>"+sVal.typeName+"</tt></a>"
					}
				}
			}				       
	      str +="</div></li>"
	    return str;
	}
}
});