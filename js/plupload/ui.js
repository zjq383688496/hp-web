function FileProgress(file, targetID,idx) {
    this.fileProgressID = file.id;
    this.file = file;
    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.length) {
    	//将上传的图片信息展示
        this.fileProgressWrapper = $('<tr></tr>');
        var Wrappeer = this.fileProgressWrapper;
        Wrappeer.attr('id', this.fileProgressID).attr('name', file.name).addClass('progressContainer');
        //td 1:展示图片名称
        var td_FileName = $("<td/>");
        td_FileName.attr('align', 'center');
        var td_FileName_span = $("<span/>");
        td_FileName_span.text(file.name);
        td_FileName.append(td_FileName_span);

        //td 2:展示图片的大小
        var td_FileSize = $("<td/>");
        td_FileSize.attr('align', 'center');
	    var td_FileSize_i = $("<i/>");
        var fileSize = plupload.formatSize(file.size).toUpperCase();
	    td_FileSize_i.text(fileSize);
	    td_FileSize.append(td_FileSize_i);

	    //td 3:展示图片的进程
        var td_FilePro = $("<td/>");
        td_FilePro.attr('style', 'font-size:12px;');
        //动态的进度条
        var td_FilePro_BarBox = $("<div/>");
        td_FilePro_BarBox.addClass('info');
        var td_FilePro_BarWrapper = $("<div/>");
        td_FilePro_BarWrapper.addClass("progress progress-striped");


        var td_FilePro_Bar = $("<div/>");
        td_FilePro_Bar.addClass("progress-bar progress-bar-info")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%');

        var td_FilePro_Cancel = $('<a href="javaScript:void(0);" />');
        td_FilePro_Cancel.hide().addClass('progressCancel').text('');

        var td_FilePro_Status = $('<div class="status text-center"/>');
        td_FilePro_BarBox.append(td_FilePro_Status);

        td_FilePro_BarWrapper.append(td_FilePro_Bar);
        td_FilePro_BarBox.append(td_FilePro_BarWrapper);
        td_FilePro_BarBox.append(td_FilePro_Cancel);

        td_FilePro.append(td_FilePro_BarBox);

        //添加操作
        var td_FileOp = $("<td/>");
        td_FileOp.attr("align","center");
        var td_FileOp_div = $("<div/>");
        if(typeof(idx) == "undefined"){
        	 td_FileOp_div.attr("class","delete");
        }else{
       	 	td_FileOp_div.attr("class","start");
        }

        var td_FileOp_div_a = $("<a/>");
        td_FileOp_div_a.attr("href","javaScript:delUploadImag('"+file.name+"','"+file.id+"')");
        td_FileOp_div.append(td_FileOp_div_a);
        td_FileOp.append(td_FileOp_div);

        Wrappeer.append(td_FileName);
        Wrappeer.append(td_FileSize);
        Wrappeer.append(td_FilePro);
        Wrappeer.append(td_FileOp);
        $('#' + targetID).append(Wrappeer);
    } else {
        this.reset();
    }

    this.height = this.fileProgressWrapper.offset().top;
    this.setTimer(null);
}


FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressWrapper.FP_TIMER = timer;
};

FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressWrapper.FP_TIMER || null;
};

FileProgress.prototype.reset = function() {
    this.fileProgressWrapper.attr('class', "progressContainer");
    this.fileProgressWrapper.find('td .progress .progress-bar-info').attr('aria-valuenow', 0).width('0%').find('span').text('');
    this.appear();
};

FileProgress.prototype.setChunkProgess = function(chunk_size) {
    var chunk_amount = Math.ceil(this.file.size / chunk_size);
    if (chunk_amount === 1) {
        return false;
    }

    var viewProgess = $('<button class="btn btn-default">查看分块上传进度</button>');

    var progressBarChunkTr = $('<tr class="chunk-status-tr"><td colspan=3></td></tr>');
    var progressBarChunk = $('<div/>');
    for (var i = 1; i <= chunk_amount; i++) {
        var col = $('<div class="col-md-2"/>');
        var progressBarWrapper = $('<div class="progress progress-striped"></div');

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info text-left")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%')
            .attr('id', this.file.id + '_' + i)
            .text('');

        var progressBarStatus = $('<span/>');
        progressBarStatus.addClass('chunk-status').text();

        progressBarWrapper.append(progressBar);
        progressBarWrapper.append(progressBarStatus);

        col.append(progressBarWrapper);
        progressBarChunk.append(col);
    }
    this.fileProgressWrapper.find('td>div').append(viewProgess);

    progressBarChunkTr.hide().find('td').append(progressBarChunk);

    progressBarChunkTr.insertAfter(this.fileProgressWrapper);
};

FileProgress.prototype.setProgress = function(percentage, speed, chunk_size) {
    this.fileProgressWrapper.attr('class', "progressContainer green");

    var file = this.file;

    var uploaded = file.loaded;

    var size = plupload.formatSize(uploaded).toUpperCase();
    var formatSpeed = plupload.formatSize(speed).toUpperCase();
    var progressbar = this.fileProgressWrapper.find('td .progress').find('.progress-bar-info');
    this.fileProgressWrapper.find('.status').text("已上传: " + size + " 上传速度： " + formatSpeed + "/s");
    percentage = parseInt(percentage, 10);
    if (file.status !== plupload.DONE && percentage === 100) {
        percentage = 99;
    }
    progressbar.attr('aria-valuenow', percentage).css('width', percentage + '%');

    if (chunk_size) {
        var chunk_amount = Math.ceil(file.size / chunk_size);
        if (chunk_amount === 1) {
            return false;
        }
        var current_uploading_chunk = Math.ceil(uploaded / chunk_size);
        var pre_chunk, text;

        for (var index = 0; index < current_uploading_chunk; index++) {
            pre_chunk = $('#' + file.id + "_" + index);
            pre_chunk.width('100%').removeClass().addClass('alert-success').attr('aria-valuenow', 100);
            text = "块" + index + "上传进度100%";
            pre_chunk.next().html(text);
        }

        var currentProgessBar = $('#' + file.id + "_" + current_uploading_chunk);
        var current_chunk_percent;
        if (current_uploading_chunk < chunk_amount) {
            if (uploaded % chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        } else {
            var last_chunk_size = file.size - chunk_size * (chunk_amount - 1);
            var left_file_size = file.size - uploaded;
            if (left_file_size % last_chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / last_chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        }
        currentProgessBar.width(current_chunk_percent + '%');
        currentProgessBar.attr('aria-valuenow', current_chunk_percent);
        text = "块" + current_uploading_chunk + "上传进度" + current_chunk_percent + '%';
        currentProgessBar.next().html(text);
    }

    this.appear();
};

FileProgress.prototype.setComplete = function(up, info) {
    var td = this.fileProgressWrapper.find('td:eq(2) .progress');

    var res = $.parseJSON(info);
    var url;
    if (res.url) {
        url = res.url;
        str = "<div><strong>Link:</strong><a href=" + res.url + " target='_blank' > " + res.url + "</a></div>" +
            "<div class=hash><strong>Hash:</strong>" + res.hash + "</div>";
    } else {
        var domain = up.getOption('domain');
        url = domain + encodeURI(res.key);
        var link = domain + res.key;
        str = "<div><strong>Link:</strong><a href=" + url + " target='_blank' > " + link + "</a></div>" +
            "<div class=hash><strong>Hash:</strong>" + res.hash + "</div>";
    }

    td.html(str).removeClass().next().next('.status').hide();

    var progressNameTd = this.fileProgressWrapper.find('.progressName');
    var imageView = '?imageView2/1/w/100/h/100';

    var isImage = function(url) {
        var res, suffix = "";
        var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];
        var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;

        if (!url || !suffixMatch.test(url)) {
            return false;
        }
        res = suffixMatch.exec(url);
        suffix = res[1].toLowerCase();
        for (var i = 0, l = imageSuffixes.length; i < l; i++) {
            if (suffix === imageSuffixes[i]) {
                return true;
            }
        }
        return false;
    };

    var isImg = isImage(url);

    var Wrapper = $('<div class="Wrapper"/>');
    var imgWrapper = $('<div class="imgWrapper col-md-3"/>');
    var linkWrapper = $('<a class="linkWrapper" target="_blank"/>');
    var showImg = $('<img src="loading.gif"/>');

    progressNameTd.append(Wrapper);

    if (!isImg) {
        showImg.attr('src', 'default.png');
        Wrapper.addClass('default');

        imgWrapper.append(showImg);
        Wrapper.append(imgWrapper);
    } else {
        linkWrapper.append(showImg);
        imgWrapper.append(linkWrapper);
        Wrapper.append(imgWrapper);

        var img = new Image();
        if (!/imageView/.test(url)) {
            url += imageView
        }
        $(img).attr('src', url);

        var height_space = 340;
        $(img).on('load', function() {
            showImg.attr('src', url);

            linkWrapper.attr('href', url).attr('title', '查看原图');

            function initImg(url, key, height) {
                $('#myModal-img').modal();
                var modalBody = $('#myModal-img').find('.modal-body');
                if (height <= 300) {
                    $('#myModal-img').find('.text-warning').show();
                }
                var newImg = new Image();
                modalBody.find('img').attr('src', 'loading.gif');
                newImg.onload = function() {
                    modalBody.find('img').attr('src', url).data('key', key).data('h', height);
                    modalBody.find('.modal-body-wrapper').find('a').attr('href', url);
                };
                newImg.src = url;
            }

            var infoWrapper = $('<div class="infoWrapper col-md-6"></div>');


            var fopLink = $('<a class="fopLink"/>');
            fopLink.attr('data-key', res.key).text('查看处理效果');
            infoWrapper.append(fopLink);
            fopLink.on('click', function() {
                var key = $(this).data('key');
                var height = parseInt($(this).parents('.Wrapper').find('.origin-height').text(), 10);
                if (height > $(window).height() - height_space) {
                    height = parseInt($(window).height() - height_space, 10);
                } else {
                    height = parseInt(height, 10) || 300;
                    //set a default height 300 for ie9-
                }
                var fopArr = [];
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: height,
                    q: 100,
                    format: 'png'
                });
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: 'SouthEast',
                    dx: 100,
                    dy: 100
                });
                var url = Qiniu.pipeline(fopArr, key);
                $('#myModal-img').on('hide.bs.modal', function() {
                    $('#myModal-img').find('.btn-default').removeClass('disabled');
                    $('#myModal-img').find('.text-warning').hide();
                }).on('show.bs.modal', function() {
                    $('#myModal-img').find('.imageView').find('a:eq(0)').addClass('disabled');
                    $('#myModal-img').find('.watermark').find('a:eq(3)').addClass('disabled');
                    $('#myModal-img').find('.text-warning').hide();
                });

                initImg(url, key, height);

                return false;
            });

            var ie = Qiniu.detectIEVersion();
            if (!(ie && ie <= 9)) {
                var exif = Qiniu.exif(res.key);
                if (exif) {
                    var exifLink = $('<a href="" target="_blank">查看exif</a>');
                    exifLink.attr('href', url + '?exif');
                    infoWrapper.append(exifLink);
                }

                var imageInfo = Qiniu.imageInfo(res.key);
                var infoArea = $('<div/>');
                var infoInner = '<div>格式：<span class="origin-format">' + imageInfo.format + '</span></div>' +
                    '<div>宽度：<span class="orgin-width">' + imageInfo.width + 'px</span></div>' +
                    '<div>高度：<span class="origin-height">' + imageInfo.height + 'px</span></div>';
                infoArea.html(infoInner);

                infoWrapper.append(infoArea);
            }

            Wrapper.append(infoWrapper);

        }).on('error', function() {
            showImg.attr('src', 'default.png');
            Wrapper.addClass('default');
        });
    }
};
FileProgress.prototype.setError = function() {
    this.fileProgressWrapper.find('td:eq(2)').attr('class', 'text-warning');
    this.fileProgressWrapper.find('td:eq(2) .progress').css('width', 0).hide();
    this.fileProgressWrapper.find('button').hide();
    this.fileProgressWrapper.next('.chunk-status-tr').hide();
};

FileProgress.prototype.setCancelled = function(manual) {
    var progressContainer = 'progressContainer';
    if (!manual) {
        progressContainer += ' red';
    }
    this.fileProgressWrapper.attr('class', progressContainer);
    this.fileProgressWrapper.find('td .progress .progress-bar-info').css('width', 0);
};

FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.fileProgressWrapper.find('.status').text(status).attr('class', 'status text-left');
    }
};


FileProgress.prototype.appear = function() {
    if (this.getTimer() !== null) {
        clearTimeout(this.getTimer());
        this.setTimer(null);
    }

    if (this.fileProgressWrapper[0].filters) {
        try {
            this.fileProgressWrapper[0].filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            this.fileProgressWrapper.css('filter', "progid:DXImageTransform.Microsoft.Alpha(opacity=100)");
        }
    } else {
        this.fileProgressWrapper.css('opacity', 1);
    }

    this.fileProgressWrapper.css('height', '');

    this.height = this.fileProgressWrapper.offset().top;
    this.opacity = 100;
    this.fileProgressWrapper.show();

};

//移除上傳
function delUploadImag(name,id){
    console.log(name,id);
	var delFile = uploader.getFile(name,id);
	uploader.removeFile(name);
	$("tr[name='"+name+"']").remove();
	//如果沒有需要上傳的文件則刷新
	var trTagSize = $("#fsUploadProgress tr").size();
	if(trTagSize < 2){
		window.parent.location.reload();
	}
	//如果上傳的文件都已經完成也刷新
	var rs = $("#fsUploadProgress tr .delete").size();
	if(rs == 0){
		window.parent.location.reload();
	}
}
