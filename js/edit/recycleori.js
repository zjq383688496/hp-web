;var recyApp = angular.module('recykCtr', ['editorHeaderApp']);
$(function(){
	var statue = true;
	var sajaxFag = true;
	var sorFag = true;
	var recy = {
		API :{
		 	personCenter: '/goodsSite/editor/image/listEditorRecover',//原作列表
		 	recycleBinClear: '/goodsSite/goodsEditor/recycleBinClear',//回收站清除/批量清除
		 	returnBack: '/goodsSite/goodsEditor/recoverOriginalAndGoods',//回收撤回
		 	pageNo:1,
		 	recordsNumber : 0
		 },
		 init:function(){
			  var rec =this;
			  rec.getData();
			  rec.rClearVal();//清除全部
		 },
		 getData :function(callback, error){
			recy.API.pageNo =1;
			recy.recAjax.rAjaxList(function () {
				if(sorFag){
				  	sorFag = false;
				  	$.scroll({
						callback: function () {
							recy.recAjax.rAjaxList();
						}
				    });
				    $.scrollLoad($('#boxDom'));
				    $('body').scroll();
				}
				if (typeof(callback) === 'function') callback();
			});
		},
		rClearVal : function(){
		    	var $rClearVal = $('#rClearVal');
		    	$('#all').click(function(){
		    		if($(this).prop("checked")){
		    			$rClearVal.attr('disabled',false);
		    		}else{
		    			$rClearVal.attr('disabled',true);
		    		}
		    	});
		    	$rClearVal.click(function(event) {
		    		 var that = $(this);
		    		 console.log($.checkD());
		    		 recy.recAjax.clickAjax($.checkD(),recy.API.recycleBinClear,2);
		    	});
		 },
		 recAjax :{
			rAjaxList:function(callback, error){
				if(sajaxFag){
					sajaxFag = false;
					var data ={
						pageSize : 18,
						pageNo : recy.API.pageNo,
						editorId :'0',
						orderByType : '2',
						abbr : 'CN',
						recordsNumber : recy.API.recordsNumber
					}
					$.ajax({
				        type: "post",
				        url:recy.API.personCenter,
				        data:data,
				        dataType: "json",
				        success: function (data) {
				            if(data.code ==200){
				            	sajaxFag = true;
				            	var pageItems = data.result.pageItems;
								if (pageItems!=null && pageItems.length) {
									recy.API.recordsNumber = data.result.recordsNumber;
					            	$(data.result.pageItems).each(function (index, v) {
		                                var $warp =$('#boxDom');
									 	var shopDom = redom.shopDom(index, v);
		                                $warp.append(shopDom);
		                                $.Waterfall($warp.find('li'));
		                            });
		                                recy.clearFun(); //清除单个
		                                recy.recallFun(); //撤回
									$(':checkbox[name=subBox]').each(function(){
										$(this).on('click',function(){
											if($(this).prop("checked")){
												$(':checkbox[name=subBox]').removeAttr('checked'); 
												$(this).prop('checked',true); 
											}
											var lLen = $("input[name='subBox']:checked").length;
											console.log(lLen);
											if(lLen <1){
												console.log(234)
												$('#rClearVal').attr('disabled', 'disabled');
												$('#all').attr('checked',false);
											}
										}); 
									});
		                            ++recy.API.pageNo;;
									$(window).scroll();
									if (typeof(callback) === 'function') callback();
	                            }else if(pageItems == null || pageItems.length <=0){
	                            	sajaxFag = false;
	                            }else {
									sajaxFag = true;
									if (typeof(error) === 'function') error();
								}
				            }else{
				            	console.log(data.result);
				            	 sajaxFag = true;
				            }
				        },
		                error: function () {
		                    statue = true;
		                    sajaxFag = true;
		                }
				    });
			    }
			},
			clickAjax:function(gCodes,u,k){
				var t01 ="",
					t02 ="",
					t03 = "确定清除选中项吗？"
				if(k ==0){
					var data ={
						goodsCodes :gCodes
					}
					t01 = "确定清除吗?";
					t02 = "已清除";
				}else if(k ==1){
					var data ={
						originalId :gCodes
					}
					t01 = "确定要撤回吗?";
					t02 = "已撤回";
				}else if(k ==2){
					var data ={
						goodsCodes :gCodes
					}
					t01 = t03;
					t02 = "已清除";
				}
				ArtDialog.confirm({title:false,
					"ok":true,
					"msg":t01,
					"okTxt":"确定",
					"cancel":true,
					"cancelTxt":"取消",
					okCall:function(){
						$.ajax({
					        type: "post",
					        url:u,
					        data:data,
					        dataType: "json",
					        success: function (data) {
					            if(data.code ==200){
					            	statue = true;
					            	ArtDialog.toast(t02);
					            }else{
					            	 statue = true;
					            }
					        },
			                error: function () {
			                    statue = true;
			                }
					    });
					}
				});
			}
		},
		clearFun : function(){//清除
			$('.clfun').on('click',function(){
				var that = $(this);
				var dm = that.parent().parent().parent();
				var edFag = dm.find("input[name='subBox']").prop("checked");
				if(!edFag){
					ArtDialog.toast("您还没选择！");
					return;
				}else{
				  	if(statue){
				  		statue = false;
					  	var that = $(this);
					  	var _id = that.parents().attr('data-goodsCode')
						  	recy.recAjax.clickAjax(_id,recy.API.recycleBinClear,0);
					}
				}
			}); 
		},
		recallFun : function(){//回撤
			$('.recall').on('click',function(){
				var that = $(this);
				var edFag = that.parent().parent().parent().find("input[name='subBox']").prop("checked");
				if(!edFag){
					return;
				}else{
				  	if(statue){
				  		statue = false;
					  	var that = $(this);
					  	var _gcode = that.parents().attr('data-id')
						  	recy.recAjax.clickAjax(_gcode,recy.API.returnBack,1);
					}
				}
			});
		}
	}
	var redom ={
		shopDom: function(index,item){
			var dom =[];
			var ass = item.associateEditorName;//对应副主编是否显示
			(ass == null || ass =="") ? ass='' : ass='<p class="'+ass+'">对应副主编：'+item.associateEditorName+'</p>';
			var id =item.id;
			dom.push('<li>',
					'<div class="check">',
						'<label for="subList'+id+'">',
						'<input type="checkbox" value="'+id+'" id="subList'+id+'" name="subBox"/> 选中</label>',
					'</div>',
	                '<div class="art-img">',
	                    '<span class="art-span">',
	                        '<img class="load" lazyload="'+ArtJS.server.image+''+item.imagePath+'?imageView2/2/format/jpg/w/270/q/50">',
	                    '</span>',
	                '</div>',
	                '<div class="class-list">',
	                	'<p>标题：'+item.titile+'</p>',
	                	// '<p>商品名：'+item.goodsName+'</p>',
	                	// '<p>分类：{主分类}</p>',
	                	'<p>编辑人：'+item.editName+'</p>',
	                	'<p>职位：'+item.roleName+'</p>',
	                	''+ass+'',
	                	'<p>删除时间：'+item.updateDate+'</p>',
	                	'<div class="bnt" data-goodsCode="'+item.goodsCode+'" data-id="'+item.id+'">',
	                    	'<span class="clfun" data-bt="0">清 除</span>',
	                    	'<span class="recall" data-bt="1">撤 回</span>',
	                	'</div>',
	                '</div>',
	            '</li>');
			return dom.join('');
		}
	}
	recy.init();
});
function CheckAll(value,obj)  {
 var form = document.getElementsByTagName("form");
 for(var i=0;i<form.length;i++){
    for (var j=0;j<form[i].elements.length;j++){
    if(form[i].elements[j].type=="checkbox"){
	    var e = form[i].elements[j]; 
	    if (value=="selectAll"){
	    	e.checked=obj.checked;
	    }     
	    else{
	    	e.checked=!e.checked;
	    } 
       }
    }
	}
}