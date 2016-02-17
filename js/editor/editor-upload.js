(function(win){
	'use strict';
	var ArtUploader={
		init:function(options){
			if(!options){
				options={};
			}
			initUploader(options);
		}
	};

	function initUploader(options){
		var bucket_url="";
		var domain_url = "";
		var userId = ArtJS.cookie.get("User_id");
		var updateImgUrl="/goodsSite/original/editOriginalImage";
		var imagePathPrefix = "";
		var fileImgPath="";
		$.ajax({
    		url : '/goodsSite/qiNiu/getConfigurationUrl',
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
		// var result = document.getElementById("previews");
		ArtUploader.uploader = Qiniu.uploader({
		    runtimes: 'html5,flash,html4', //上传模式,依次退化
		    browse_button: 'editor_upload_btn',//上传按钮的ID
		    container: 'editor_upload_container',//上传按钮的上级元素ID
		    drop_element: 'editor_upload_container',
		    max_file_size: '300mb',//最大文件限制
		    flash_swf_url: '/drift/dist/js/plupload/Moxie.swf',//引入flash,相对路径
		    dragdrop: false, //开启可拖曳上传
		    uptoken_url:'/goodsSite/qiNiu/getUploadToken',//设置请求qiniu-token的url
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
		    auto_start: false,
		    init: {
		    	'FilesAdded': function(up, files) {
		    		// 文件添加进队列后,处理相关的事情
		    		var imageTotal = files.length;
		    		// currtImgaCount = 0;
		    		var fileNames=[];
                    for (var i=0; i<imageTotal; i++){
                    	fileNames.push(files[i].name);
		    		}
		    		$(".editor-file-txt").val(fileNames.join(","));
	            },
	            'BeforeUpload': function(up, file) {
	            },
	            'FilesRemoved': function(up,files){
	            	console.log(up+files);
	            	// imageTotal = imageTotal-1;
	            },
	            'UploadProgress': function(up, file) {
	            	console.log(up+file);
	            },
	            'FileUploaded': function(up, file, info) {
	            	// console.log(up+file);
	            	if(typeof(info)==="string"){
	            		info=(new Function("return "+info))();
	            	}
	            	$.ajax({
	            		url : updateImgUrl,
	            		// async : false,
	            		data:{originalId:options.originalId,imgPath:fileImgPath},
	            		type : "POST",
	            		dataType : "json",
	            		success : function(data) {
	            			if (data.code === CONFIG.CODE_SUCCESS) {
		            			if(options.callback){
		            				options.callback(fileImgPath);
		            			}	            				
	            			}
	            		},error:function(){
	            			if(options.errorFunc){
	            				options.errorFunc();
	            			}
	            		}
	            	});
	            },
	            'Error': function(up, err, errTip) {
	            	console.log(up+err);
	                if(options.errorFunc){
        				options.errorFunc();
        			}
	            },
	            'Key': function(up, file) {
	            	console.log(up+file          );
	            	 var fileName = file.name;
	            	 var fileNamePreFix = fileName.substring(fileName.lastIndexOf("."),fileName.length);
	            	 fileImgPath="artsrelease/"+userId+"/"+file.id+fileNamePreFix;
	            	 var key = imagePathPrefix+fileImgPath;
	                 return key
	             }
	        }
		});
	}
	win["ArtUploader"]=ArtUploader;
})(window);
