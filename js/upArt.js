$(function(){
		var bucket_url="";
		var domain_url = "";
		var userId = ArtJS.cookie.get("User_id");
		var imagePathPrefix = "";
		$.ajax({
    		url : '/goodsSite/artsOperate/getConfigurationUrl',
    		async : false,
    		type : "get",
    		dataType : "json",
    		success : function(result) {
    			bucket_url = result.bucketUrl;
    			domain_url = result.imagDomainUrl;
    			imagePathPrefix = result.imagNamePrefix;
    		}
    	});

		var currtImgaCount = 0;
		var imageTotal = 0;
		var uploadImagInfo = new Array();
		var result = document.getElementById("previews");
		uploader = Qiniu.uploader({
		    runtimes: 'html5,flash,html4', //上传模式,依次退化
		    browse_button: 'pickfiles',//上传按钮的ID
		    container: 'btn-uploader',//上传按钮的上级元素ID
		    drop_element: 'btn-uploader',
		    max_file_size: '300mb',//最大文件限制
		    flash_swf_url: '/drift/dist/js/plupload/Moxie.swf',//引入flash,相对路径
		    dragdrop: false, //开启可拖曳上传
		    uptoken_url:'/goodsSite/artsOperate/getUploadToken',//设置请求qiniu-token的url
		    unique_names: false ,
		    save_key: false,
		    domain: bucket_url,//自己的七牛云存储空间域名
			multi_selection: false,//是否多张上传
		    //文件类型过滤，这里限制为图片类型
		    filters: {
		      mime_types : [
		        {title : "Image files", extensions: "jpg,jpeg,png"}//gif
		      ]
		    },
		    auto_start: true,
		    init: {
		    	'FilesAdded': function(up, files) {
		    		// 文件添加进队列后,处理相关的事情
		    		imageTotal = files.length;
		    		currtImgaCount = 0;
                    for (var i=0; i<imageTotal; i++){
		            	var progress = new FileProgress(files[i], 'fsUploadProgress',i);
	                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
	                    if (up.runtime === 'html5' && chunk_size) {
	                      	progress.setChunkProgess(chunk_size);
	                    }
	                    $("#show_uploadImg,.copy-out").show();
						$("#fsUploadProgress").html('');
		    		}
	            },
	            'BeforeUpload': function(up, file) {
		    		//console.log("========BeforeUpload==========="+file.name);
	            	uploadImagInfo = new Array();
	            	$("#fsUploadProgress tr[name='"+file.name+"'] .start").attr("class","delete");
	            	var progress = new FileProgress(file, 'fsUploadProgress');
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    if (up.runtime === 'html5' && chunk_size) {
                      progress.setChunkProgess(chunk_size);
                    } $("#show_uploadImg").show();
            		$(".lable_file ").hide();
            		$(".my_shop_null").hide();
	            },
	            'FilesRemoved': function(up,files){
	            	imageTotal = imageTotal-1;
	            },
	            'UploadProgress': function(up, file) {
	            	   var progress = new FileProgress(file, 'fsUploadProgress');
	                   var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
	                   progress.setProgress(file.percent + "%", file.speed, chunk_size);
	            },
	            'FileUploaded': function(up, file, info) {
	            	var SuccessDiv=$("#fsUploadProgress tr[name='"+file.name+"'] .delete")
	            	SuccessDiv.attr("class","Success loading").html("处理中").find("a").remove();
	            	var res = eval('('+info+')');
	            	var origSize = file.origSize;//计算后的值;
					var imgSize = plupload.formatSize(file.size).toUpperCase();//实际值;
	            	var imagName = res.key;
	            	var imageInfoUrl = domain_url+imagName+"?imageInfo";
	            	var imageWidth;
	            	var imageHight ;
	            	$.ajax({
	            		url : imageInfoUrl,
	            		async : false,
	            		type : "POST",
	            		dataType : "json",
	            		success : function(result) {
	            			imageWidth = result.width;
		            		imageHight = result.height;
		            		var imgUriP =  imagName.substring(imagePathPrefix.length,imagName.length);
		            		var str = '';
		            		str+= '<input type="hidden" name="uri" value="'+imgUriP+'"/>';
		            		str+= '<input type="hidden" name="width" value="'+imageWidth+'"/>';
		            		str+= '<input type="hidden" name="height" value="'+imageHight+'"/>';
		            		str+= '<input type="hidden" name="customerId" value="'+userId+'"/>';
		            		str+= '<input type="hidden" name="diskSpace" value="'+origSize+'"/>';
		            		str+= '<input type="hidden" name="imageName" value="'+imgUriP+'"/>';
		            		$("#uploadSaveInfo").html(str);
                            if(imageTotal <50) {
                                $('#uploadSaveInfo').ajaxSubmit(function (data) {
									var _cod = data.code;
									if(_cod == 200) {
										$("#uploadSaveInfo").html("");
										setTimeout(function () {
											currtImgaCount++;
											SuccessDiv.removeClass("loading").html('');
											if (currtImgaCount == imageTotal) {
												//window.parent.location.reload();
											}
										}, 5000);
									}else{
										$("body").alertTips({
											"titles":LANGUAGE_NOW.new001.t0141,
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
	            	});
	            },
	            'Error': function(up, err, errTip) {
	                $('table').show();
	                var progress = new FileProgress(err.file, 'fsUploadProgress');
	                progress.setError();
	                progress.setStatus(errTip);
	            },
	            'Key': function(up, file) {
	            	 var fileName = file.name;
	            	 fileNamePreFix = fileName.substring(fileName.lastIndexOf("."),fileName.length);
	            	 var key = imagePathPrefix+"artsrelease/"+userId+"/"+file.id+fileNamePreFix;
	                 return key
	             }
	        }
		});
	});
