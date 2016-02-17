/***
*  小编页处理
**/
;(function(){
	'use strict';
	var normalEditor = angular.module("normalEditor", ["editorHeaderApp","editorNavApp","editorSelectorApp","editorGoodsListApp"]);

	//导航模块
	normalEditor.controller("normalContoller",function ($scope,$http,$timeout) {
	ArtJS.load(['header'], function () {
	$timeout(function () {
		var URL={
			typeUrl:"/topicSocSite/topic/getTypeBasesByPage?",//获取基本类型URL
			// typeUrl:"/",//获取基本类型URL
			listUrl:"/goodsSite/editor/listEditorArtworks?",//获取商品列表URL
			// listUrl:"/",//获取商品列表URL
		};

		$scope.loading="loading";
		$scope.goodsList=[];//商品列表
		$scope.imgUrl= ArtJS.server.image;
		$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/70';
		$scope.qnIcon= '?imageView2/2/format/jpg/w/20/q/50';
		$scope.qn850= '?imageView2/2/format/jpg/w/850/q/60';

		var goodsStatus=false;//商品加载状态  防止多次加载

		loadNavData();

		loadTypeList({abbr:ArtJS.server.language,source:"web",page:"index",indexTag:5});
		// $scope.typeActive="";
		//pageSize=20&selectedTagId=2&orderByType=2&edited=0&editorId=0&category=&pageNo=1&abbr=US
		var scrollStatus=true;
		loadGoodsList({pageSize:20,
			selectedTagId:2,
			orderByType:2,
			edited:0,
			editorId:0,
			category:"",
			pageNo:1,
			abbr:ArtJS.server.language,
			callback:function(){
				if (scrollStatus) {
					scrollStatus = false;
					ArtJS.page.ui.imageLoad.init(100);				
					ArtJS.page.ui.scroll({
						callback: function () {
							loadGoodsList({pageSize:20,
											selectedTagId:2,
											orderByType:2,
											edited:0,
											editorId:0,
											category:"",
											pageNo:1,
											abbr:ArtJS.server.language});
						}
					});
				}
			}
		});

		$scope.typeClick=function(type,item){
			var id=item?item.id:"";
			type.typeActive=id;//设置当前选中代码为点击的ID
		};

		//加载选择类型列表
		function loadTypeList(options){
			var error=options.error;
			$http.get(URL.typeUrl + ArtJS.json.toUrl(options)).
				success(function (data) {
					// if (data.code === CONFIG.CODE_SUCCESS) {
						data={"code":"200","message":"success!","hiddenMsg":null,"result":[{"id":105,"parentId":null,"typeName":"媒介","icon":"icon/category/105.png","children":[{"id":154,"parentId":105,"typeName":"油画","icon":"icon/category/154.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":156,"parentId":105,"typeName":"绘画","icon":"icon/category/156.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":159,"parentId":105,"typeName":"版画","icon":"icon/category/159.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":160,"parentId":105,"typeName":"水墨","icon":"icon/category/160.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":163,"parentId":105,"typeName":"综合材料","icon":"icon/category/163.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":155,"parentId":105,"typeName":"雕塑装置","icon":"icon/category/155.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":401,"parentId":105,"typeName":"插画","icon":"icon/category/401.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":158,"parentId":105,"typeName":"摄影","icon":"icon/category/158.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":403,"parentId":105,"typeName":"影视","icon":"icon/category/403.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":157,"parentId":105,"typeName":"动漫","icon":"icon/category/157.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":405,"parentId":105,"typeName":"游戏","icon":"icon/category/405.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":343,"parentId":105,"typeName":"设计","icon":"icon/category/343.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":170,"parentId":105,"typeName":"手工艺","icon":"icon/category/170.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":171,"parentId":105,"typeName":"创意品","icon":"icon/category/171.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false}],"levelVal":null,"type":"#3#","page":null,"interestList":null,"haveRight":false},{"id":465,"parentId":null,"typeName":"语言","icon":"icon/category/465.png","children":[{"id":491,"parentId":465,"typeName":"综合","icon":"icon/category/491.png","children":null,"levelVal":null,"type":null,"page":"","interestList":null,"haveRight":false},{"id":467,"parentId":465,"typeName":"英语","icon":"icon/category/467.png","children":null,"levelVal":null,"type":"US","page":"","interestList":null,"haveRight":false},{"id":469,"parentId":465,"typeName":"汉语","icon":"icon/category/469.png","children":null,"levelVal":null,"type":"CN","page":"","interestList":null,"haveRight":false},{"id":471,"parentId":465,"typeName":"意大利语","icon":"icon/category/471.png","children":null,"levelVal":null,"type":"IT","page":"","interestList":null,"haveRight":false},{"id":473,"parentId":465,"typeName":"西班牙语","icon":"icon/category/473.png","children":null,"levelVal":null,"type":"ES","page":"","interestList":null,"haveRight":false},{"id":475,"parentId":465,"typeName":"德语","icon":"icon/category/475.png","children":null,"levelVal":null,"type":"DE","page":"","interestList":null,"haveRight":false},{"id":477,"parentId":465,"typeName":"法语","icon":"icon/category/477.png","children":null,"levelVal":null,"type":"FR","page":"","interestList":null,"haveRight":false},{"id":479,"parentId":465,"typeName":"日语","icon":"icon/category/479.png","children":null,"levelVal":null,"type":"JP","page":"","interestList":null,"haveRight":false},{"id":481,"parentId":465,"typeName":"韩语","icon":"icon/category/481.png","children":null,"levelVal":null,"type":"KP","page":"","interestList":null,"haveRight":false},{"id":483,"parentId":465,"typeName":"俄语","icon":"icon/category/483.png","children":null,"levelVal":null,"type":"RU","page":"","interestList":null,"haveRight":false},{"id":485,"parentId":465,"typeName":"阿拉伯语","icon":"icon/category/485.png","children":null,"levelVal":null,"type":"SA","page":"","interestList":null,"haveRight":false},{"id":487,"parentId":465,"typeName":"葡萄牙语","icon":"icon/category/487.png","children":null,"levelVal":null,"type":"PT","page":"","interestList":null,"haveRight":false},{"id":489,"parentId":465,"typeName":"越南语","icon":"icon/category/489.png","children":null,"levelVal":null,"type":"VN","page":"","interestList":null,"haveRight":false}],"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":2,"parentId":null,"typeName":"大标签","icon":"icon/category/2.png","children":[{"id":44,"parentId":2,"typeName":"风景","icon":"icon/category/44.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":46,"parentId":2,"typeName":"幽默","icon":"icon/category/46.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":206,"parentId":2,"typeName":"可爱","icon":"icon/category/206.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":47,"parentId":2,"typeName":"励志","icon":"icon/category/47.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":48,"parentId":2,"typeName":"爱情","icon":"icon/category/48.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":495,"parentId":2,"typeName":"机械","icon":null,"children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":497,"parentId":2,"typeName":"文字","icon":null,"children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":499,"parentId":2,"typeName":"儿童","icon":null,"children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":411,"parentId":2,"typeName":"复古","icon":"icon/category/411.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":45,"parentId":2,"typeName":"抽象","icon":"icon/category/45.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":43,"parentId":2,"typeName":"人物","icon":"icon/category/43.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":95,"parentId":2,"typeName":"动物","icon":"icon/category/95.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":96,"parentId":2,"typeName":"大自然","icon":"icon/category/96.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":99,"parentId":2,"typeName":"美食","icon":"icon/category/99.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":100,"parentId":2,"typeName":"宗教","icon":"icon/category/100.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":349,"parentId":2,"typeName":"科技","icon":"icon/category/349.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":415,"parentId":2,"typeName":"商业","icon":"icon/category/415.png","children":null,"levelVal":null,"type":null,"page":null,"interestList":null,"haveRight":false},{"id":98,"parentId":2,"typeName":"运动","icon":"icon/category/98.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false},{"id":51,"parentId":2,"typeName":"其它","icon":"icon/category/51.png","children":null,"levelVal":null,"type":"","page":null,"interestList":null,"haveRight":false}],"levelVal":null,"type":"#2#","page":null,"interestList":null,"haveRight":false}]};
						var result=data.result;
						if(result&&result.length>0){
							for(var i in result){
								result[i].typeActive="";
							}
						}
						$scope.typeList= result;
					// } else {
					// 	if (typeof(error) === 'function') error();
					// }
				}).
				error(function (data) {
					if (typeof(error) === 'function') error();
				});
			//是否显示管理相关衍生品按钮  true为显示  false不显示
			$scope.navSelector={derivativeBtn:false};
		}

		//加载商品列表
		function loadGoodsList(options){
			if(goodsStatus){
				return;
			}
			goodsStatus=true;
			var error=options.error;
			var callback=options.callback;
			$http.get(URL.listUrl + ArtJS.json.toUrl(options)).
				success(function (data) {
					goodsStatus=false;
					// if (data.code === CONFIG.CODE_SUCCESS) {
						data={"code":"200","message":"success!","hiddenMsg":null,"result":{"pageNo":1,"pageSize":20,"pagesAvailable":0,"recordsNumber":23288,"orderBy":null,"abbr":null,"pageItems":[{"id":186131,"goodsCode":null,"goodsName":"111","describe":null,"typeIds":"208,351,154,46","labels":"12,123,111","hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"212","likeStartNumber":0,"editorUserId":442,"userName":"优雅的猪","userIcon":"319819/14503466718951253798.png","editorName":"admin","userAbbr":"CN","imagePath":"artsrelease/319819/o_1a9ht67egv8do88ii51oinphu9.jpg","imageWidth":null,"imageHeight":null,"publishUserId":319819,"likeTotal":5,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":169859,"goodsCode":null,"goodsName":"仙境","describe":null,"typeIds":"158,211,491","labels":"黄山,宏村,风景,摄影","hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":null,"likeStartNumber":0,"editorUserId":0,"userName":"鸭子大王","userIcon":"319479/14500654855253216701.jpg","editorName":null,"userAbbr":"CN","imagePath":"319479/o_1a6o6g2f313j21j571m797q29q9.jpg","imageWidth":null,"imageHeight":null,"publishUserId":319479,"likeTotal":0,"versionProblem":0,"amendImage":0,"tideType":null,"tideType2":null},{"id":179885,"goodsCode":null,"goodsName":"《西昌田园》","describe":null,"typeIds":"154,208,351,491","labels":"写生,风景,油画","hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":null,"likeStartNumber":0,"editorUserId":0,"userName":"莫书强","userIcon":"321155/145023761999591496.jpg","editorName":null,"userAbbr":"CN","imagePath":"artsrelease/321155/o_1a7qveat1m0rmid1sqim40142ve.jpg","imageWidth":null,"imageHeight":null,"publishUserId":321155,"likeTotal":0,"versionProblem":0,"amendImage":0,"tideType":null,"tideType2":null},{"id":180787,"goodsCode":null,"goodsName":"没有个性的人之二","describe":null,"typeIds":"160,208,354,491","labels":"实验水墨,新水墨,当代水墨","hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":null,"likeStartNumber":0,"editorUserId":0,"userName":"游离","userIcon":"321289/14517254180002054009.jpg","editorName":null,"userAbbr":"CN","imagePath":"artsrelease/321289/o_1a85vmelp3ivhdo19vn1e8611fjj.jpg","imageWidth":null,"imageHeight":null,"publishUserId":321289,"likeTotal":0,"versionProblem":0,"amendImage":0,"tideType":null,"tideType2":null},{"id":165929,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,411,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"GILLAvery","userIcon":"icon/655cab7f9b5026568fa9d7047766d44b.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4643/o_1a49vp8pf8nhjkf1vjorfr15bbe.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4643,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165921,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,352,156,495,98","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"JACOBSAlan","userIcon":"icon/063017ee5aa4d3e2f53c9fdd4ef7122f.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4629/o_1a49un54567c1k8e1mst1lstt8sm.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4629,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165923,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,352,156,495,98","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"JACOBSAlan","userIcon":"icon/063017ee5aa4d3e2f53c9fdd4ef7122f.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4629/o_1a49un545jhmuog2f97bp186ln.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4629,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165925,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,352,156,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"SKINNERBoyd","userIcon":"icon/4f1ba64990affcd8ce0fe4405471d56e.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4591/o_1a49vbgo61jqt1vk5el0dm61f9k9.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4591,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165927,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"212,343,95,96","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"TODDBerg","userIcon":"icon/ef05c34877c6925731b49c44b421b3f5.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4631/o_1a49vnp14l6bcur8185mn1dldf.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4631,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165865,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,411,43,100","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"LUCASAaron","userIcon":"touxiang/4547_e0451708c8164344890ba87145537771.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4547/o_1a47suimp16e313fv1q3j1csq5rel.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4547,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165867,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,411,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"LUCASAaron","userIcon":"touxiang/4547_e0451708c8164344890ba87145537771.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4547/o_1a47suimpt361q9t1np31jcu4odm.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4547,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165869,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,411,43,100","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"LUCASAaron","userIcon":"touxiang/4547_e0451708c8164344890ba87145537771.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4547/o_1a47suimp15bj17t3bn1vchvqpn.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4547,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165871,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,411,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"LUCASAaron","userIcon":"touxiang/4547_e0451708c8164344890ba87145537771.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4547/o_1a47suimpcs1l841v9ct2a1r8lo.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4547,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165855,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"DELGADOArthur","userIcon":"icon/1c4eab214db2dd38644340d657ea26b1.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4545/o_1a47n1gg45vi14vf8ftdlf13meo.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4545,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165857,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"DELGADOArthur","userIcon":"icon/1c4eab214db2dd38644340d657ea26b1.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4545/o_1a47n1gg41vj510l81baroh0fdup.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4545,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165863,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"LUCASAaron","userIcon":"touxiang/4547_e0451708c8164344890ba87145537771.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4547/o_1a47suimp1ifk1k3fv4912do1d6ak.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4547,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165849,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43,100","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"DELGADOArthur","userIcon":"icon/1c4eab214db2dd38644340d657ea26b1.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4545/o_1a47n1gg31r4srgs1bhb1b9t12eak.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4545,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165851,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"DELGADOArthur","userIcon":"icon/1c4eab214db2dd38644340d657ea26b1.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4545/o_1a47n1gg3k2312vpbhr16622pm.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4545,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":165853,"goodsCode":null,"goodsName":"null","describe":null,"typeIds":"208,351,154,43,100","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"","likeStartNumber":0,"editorUserId":4513,"userName":"DELGADOArthur","userIcon":"icon/1c4eab214db2dd38644340d657ea26b1.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"4545/o_1a47n1gg3hs61u2pqmq131t11mpn.jpg","imageWidth":null,"imageHeight":null,"publishUserId":4545,"likeTotal":0,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null},{"id":161533,"goodsCode":null,"goodsName":"Cascade","describe":null,"typeIds":"208,352,156,44","labels":null,"hotWordIds":"梅西,乔丹,F1,广州恒大,马刺队,高尔夫,冬歇期,特里,过人,帽子戏法","editorLabels":"landscape paintings,fall paintings,autumn paintings,paintings,fall tree paintings,creek,river","likeStartNumber":0,"editorUserId":4513,"userName":"Brian_Simons","userIcon":"icon/fa97f36a411e777de389d2fb46912d2a.jpg","editorName":"PRATTArvin","userAbbr":"US","imagePath":"/ftrame/189/1-cascade-brian-simons.jpg","imageWidth":null,"imageHeight":null,"publishUserId":319092,"likeTotal":159,"versionProblem":null,"amendImage":null,"tideType":null,"tideType2":null}]}};
						var result=data.result;						
						// $scope.result=result;
						$scope.goodsList =$scope.goodsList.concat(result.pageItems);
						// if()
						$scope.recordsNumber= result.recordsNumber;
					// } else {
					// 	if (typeof(error) === 'function') error();
					// }
					$scope.loading="";
					if(callback){
						callback();
					}
				}).
				error(function (data) {
					goodsStatus=false;
					if (typeof(error) === 'function') error();
					$scope.loading="";
				});
		}
		//删除商品
		$scope.delGoods=function(item){
			ArtDialog.confirm({title:false,
				"ok":true,
				"msg":"您确定要删除吗？这将删除该图片及该图片的所有衍生品。",
				"okTxt":"确定",
				"cancel":true,
				"cancelTxt":"取消",
				okCall:function(){
					$scope.result.pageItems.remove(item);
				}
			});
		};

		//商品提交
		$scope.submitGoods=function(item){
			if(!item.mediaArr||item.mediaArr.length<1){//未选择媒介
				item.mediaActive=true;//未选择媒介的外框状态 
			}
			if(!item.languageArr||item.languageArr.length<1){//未选择语言
				item.languageActive=true;
			}
			if(!item.bigTagArr||item.bigTagArr.length<1){//未选择主题
				item.bigTagActive=true;
			}
			// if(!item.bigTagArr||item.bigTagArr.length<1){//未选择主题

			// }
			ArtDialog.toast("提交成功");
		}
		/**
		 * 显示全文
		**/
		$scope.showFullText=function(){
			var msg="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.";
			ArtDialog.toast({"msg":msg,"close":false,icoCss:{"color":"#000"},dialogCss:{background:"#fff",color:"#000"},bodyCss:{color:"#000"}});
		};

		/**
		下载图片
		*/
		$scope.saveImage=function(imgURL){
		  	/*var  oPop=window.open(imgURL,"","width=1,height=1,top=5000,left=5000");
		  	for(;oPop.document.readyState!="complete";){
				if(oPop.document.readyState   ==   "complete")break;
		  	}
		  	oPop.document.execCommand("saveAs");
		  	oPop.close();*/
		};
		/**
		加载评分结果
		**/
		$scope.loadTagScore=function(item){
			var labelStr=item.labels;
			var score=100;
			if(labelStr){
				var labels=labelStr.split(",");
				var len=labels.length;
				for(var i=0;i<len;i++){
					score-=15;
				}
			}
			if(score<0){
				score=0;
			}
			return score;
		};

		//加载是否选中
		$scope.loadLiTag=function(item,ids,typeId,id){
			// switch(type.id){
			// 	case: 105://|5  媒介

			// 	break;
			// 	case: 465://语言
			// 	break;
			// 	case: 2://大标签
			// 	break;
			// 	default:

			// }
			// return false;
			var activeId=getTagActiveStatus(ids,typeId,id);
			if(activeId==""){				
				return false;
			}else{
				if(typeId==2||typeId==465||typeId==105){//多选   105:|5  媒介 465:语言  2:大标签
					if(typeId==105){
						item.mediaArr=[id];
						item.mediaActive=false;
					}else if (typeId==465){
						item.languageArr=[id];
						item.languageActive=false;
					}else if(typeId==2){
						if(!item.bigTagArr){
							item.bigTagArr=[];
						}
						item.bigTagArr.push(id);
						item.bigTagActive=false;
						item.bigTagArr=item.bigTagArr.unique();
					}
				}
				return true;
			}
		};

		// $scope.tagMultClick=function(item,id){
		// 	if(id==2){//多选

		// 	}

		// };

		$scope.tagClick=function(item,type,id){
			var typeId=type.id;
			if(typeId==2||typeId==465||typeId==105){//多选   105:|5  媒介 465:语言  2:大标签
				var flag=false;
				
				var typeIdStr=item.typeIds;
				var typeIds=[];
				var count=0;
				if(typeIdStr){
					typeIds=typeIdStr.split(",");
					var len=typeIds.length;
					for(var i=0;i<len;i++){
						if(id==typeIds[i]){							
							// typeIds.remove(id);
							flag=true;
							break;
						}
					}
				}

				if(flag){//取消选中
					if(typeId==105){
						// if(!item.mediaArr){
							item.mediaArr=[];
						// }
						// mediaCount++;
					}else if (typeId==465){
						// if(!item.languageArr){
							item.languageArr=[];
						// }
						// languageCount++;					
					}else if(typeId==2){
						if(!item.bigTagArr){
							item.bigTagArr=[];
						}						
						item.bigTagArr.remove(id);
					}					
				}else{//选中
					if(typeId==105){
						// if(!item.mediaArr){
							item.mediaArr=[id];
						// }
						// mediaCount++;
					}else if (typeId==465){
						// if(!item.languageArr){
							item.languageArr=[id];
						// }
						// languageCount++;					
					}else if(typeId==2){
						if(!item.bigTagArr){
							item.bigTagArr=[];
						}
						var bigTagCount=item.bigTagArr.length;
						if(bigTagCount<2){
							item.bigTagArr.push(id);
						}else{
							ArtDialog.toast("主题最多可选择两项，选择后再次点击反选");
						}
					}
				}
				var tempArr=[].concat(item.mediaArr,item.languageArr,item.bigTagArr);
				item.typeIds=tempArr.join(",");
			}
		};

		//审核不通过事件
		$scope.verifyNoPass=function(){
			var template='<div style="line-height:30px;padding:10px 30px 0;"><input type="checkbox" >标签描述不匹配<br><input type="checkbox" >违反法律法规<br><input type="checkbox" >侵权嫌疑</div>';
			ArtDialog.confirm({title:false,
				"ok":true,
				"msg":template,
				"okTxt":"确定",
				"cancel":true,
				"cancelTxt":"取消",
				okCall:function(){
					// $scope.result.pageItems.remove(item);
					ArtDialog.closeConfirm();
					ArtDialog.toast("审核成功");
				}
			});
		};

		//标签删除
		$scope.deleteTag=function($event,item,tag){
			var tags=item.labels.split(",");
			tags.remove(tag);
			if(tags.length>0){
				item.labels=tags.join(",");
			}else{
				item.labels=null;
			}
		};

		//标签添加
		$scope.addTag=function($event,item,type){
			var tagContent=item.tagContent;
			if(!tagContent){
				return;
			}
			var tags=tagContent.split(",");
			if(type=="blur"){
				if(!item.tags){
					item.tags=[];
				}
				// item.tags=item.tags.concat(tags);
				// item.tags=addUniqueTags(item.tags,tags);
				item.labels=addUniqueTags(item.labels,tags);
				item.tagContent="";
			}else if(type==="keyup"){
				if ($event.keyCode == 13 ||$event.keyCode == 188) { // enter 键 逗号键
					if(!item.tags){
						item.tags=[];
					}
					// item.tags=item.tags.concat(tags);
					item.labels=addUniqueTags(item.labels,tags);
					item.tagContent="";
				}
			}
		};

		function getTagActiveStatus(ids,typeId,id){			
			if(ids){
				var typeIds=ids.split(",");
				// console
				var len=0;
				if(typeIds){
					len=typeIds.length;
				}
				for(var i=0;i<len;i++){
					if(id==typeIds[i]){
						return id;
					}
				}
			}
			return "";	
		}

		//过滤重复值
		function addUniqueTags(dest,src){
			if(!dest){
				dest=[];
			}else{
				dest=dest.split(",");
			}
			if(src){
				var slen=src.length,dlen=dest.length;
				for(var i=0;i<slen;i++){
					var flag=false;
					if(!src[i]){
						break;
					}
					for(var j=0;j<dlen;j++){
						if(src[i]==dest[j]){
							flag=true;
							break;
						}
					}
					if(!flag){
						dest.push(src[i]);
					}
				}
			}
			return dest.join(",");
		}

		//上传处理
		$scope.uploadPic=function(){
			ArtDialog.toast("上传成功");
		};
		//加载广告图
		$scope.loadAdvert=function(){
			var options={
				imgs:["/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif"
				],
				callback:function(){
					var slider=new Slider({"id":"slider",width:500,"scrollEnd":function(index){
					}});
					var $ico_prev=$(".art-img-prev");
					$ico_prev.click(function(){
						slider.prev();
					});
					var $ico_next=$(".art-img-next");
					$ico_next.click(function(){
						slider.next();
					});
				}
			};
			/**
			* 图片预览
			*/
			ArtDialog.imgPreview(options);
		};

		//加载导航数据
		function loadNavData(){
			$scope.nav={"active":"goodList"};
			$scope.nav.navList=[{code:"goodList",name:"图片"},
			{code:"workList",name:"原作"},
			// {code:"blogList",name:"博客"},
			// {code:"otherList",name:"第三方商品"}
			];

			$scope.actions={noedit:false,recycle:true};//动作指令显示
		}

	});
	});

	});

	/*normalEditor.controller('editorNavController', function ($scope,$http,$timeout) {
		//导航Tab显示
		$scope.nav={"active":"goodList"};
		$scope.nav.navList=[{code:"goodList",name:"图片"},
		{code:"workList",name:"原作"},
		{code:"blogList",name:"博客"},
		{code:"otherList",name:"第三方商品"}];

		$scope.actions={noedit:true,recycle:true};//动作指令显示
	});*/
})();