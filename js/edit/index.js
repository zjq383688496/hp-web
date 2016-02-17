$(function(){
	var editFun={
		//初始化
		init:function(){
			this.bindTabEvent();
		},
		//绑定tab事件
		bindTabEvent:function(){
			$(".tab").on("click","li",function(){
				var data_code=$(this).attr("data-code");
				$(".tab .active").removeClass("active");
				$(this).addClass("active");				
				$(".tabList").addClass("hide");
				$("."+data_code).removeClass("hide");
			});
		}
	}


	$(document).ready(function(){
		editFun.init();
	});
});