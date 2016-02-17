/**
 *   关于我们相关处理
 *   modify  2016-01-12   author eric
**/
var modHeaderFull=angular.module('mod-header-full', ['modHeaderFull']);

var loc =location.href;
		var abbr = loc.getQueryValue('abbr') || ArtJS.server.language;
		if(abbr =="US"){
			$('.about-logo i').attr('class','iconfont icon-logoS_US');
			$(".about-box.us").fadeIn();
			$(".copyright").html("");
			$("title").html("About Creative Mall");
		}else{
			$('.about-logo i').attr('class','iconfont icon-logoS_CN');
			$(".about-box.cn").fadeIn();
		}