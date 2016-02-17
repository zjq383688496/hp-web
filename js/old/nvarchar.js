/*DOTO 域名配置*/
var srcImg=ArtJS.server.image;
var httpImg=ArtJS.server.art;
var HOST_URL = ArtJS.server.art;
var User_code ="",User_id="",iconUrl="",nickName="",user_key="";//用户是否存在
var ArtList={
    //艺术衍生品(合并)
    AartworkNew :function(index,v){
        var type = v.type < 2? '0': '1';
        var likes = v.light;
        var cId = v.createUserId;
        var nName= v.createUserName;
        var pId = v.goodsId;
        var cls = likes? 'ico-likes': '';
        var code = likes? '2': '1';
        var price = ~~(v.sellStatus)? (v.currencySymbol||'')+(v.sellPrice||0): '<em class="not-sell">'+LANGUAGE_NOW.goods.sellout+'</em>';
        var onw ="onclick='artsLike(this,"+pId+", "+v.light+")'";
        var str = ""
            + "<li>"
            + "<div class='art_img' data-id='"+v.goodsId+"' style='background-image: url("+srcImg+v.imagePath+"?imageView2/2/w/260/q/90);'><a></a></div>"
            + "<div class='text'>"
                + "<h2><a title='"+(v.goodsName || '')+"'>"+(v.goodsName || '&nbsp')+"</a></h2>"
                + "<span class='user'><a href='/page/"+ArtJS.server.language+"/user/gallery.html?proprietorId="+ cId +"'><b>"+ArtList.imgR(v.createUserImage)+"</b>" +nName+"</a></span>"
                + "<div class='del'><span><b class='"+cls+"' id='likes_"+pId+"' "+onw+" name='like_"+pId+"' data-code='"+code+"'></b><i id='like_light_"+pId+"'>"+v.likeCount+"</i></span><span>"+price+"</span></div>"
            + " </div>"
            + "</li>";
        return str;
    },
	//衍生品
	Aartwork :function(index,v){
        var likes = v.light;
        var cId = v.createUserId;
        var pId = v.goodsId;
        var cls = likes? 'ico-likes': '';
        var code = likes? '2': '1';
        var onw ="onclick='artsLike(this,"+pId+", "+v.light+")'";
		var str = ""
			+ "<li>"
			+ "<div class='art_img' data-id='"+pId+"' style='background-image: url("+srcImg+v.imagePath+"?imageView2/2/w/260/q/90);'><a></a></div>"
			+ "<div class='text'>"
				+ "<h2><a title='"+(v.goodsName || '')+"'>"+(v.goodsName || '&nbsp')+"</a></h2>"
				+ "<span class='user'><a href='/page/"+ArtJS.server.language+"/user/gallery.html?proprietorId="+ cId +"'><b>"+ArtList.imgR(v.createUserImage)+"</b>" +v.createUserName+"</a></span>"
				+ "<div class='del'><span><b class='"+cls+"' id='likes_"+pId+"' "+onw+" name='like_"+pId+"' data-code='"+code+"'></b><i id='like_light_"+pId+"'>"+v.likeCount+"</i></span><span>"+v.currencySymbol+""+v.sellPrice+"</span></div>"
		   + " </div>"
			+ "</li>";
		return str;
	},
	//艺术品
	Aworks :function(index,v){
        var light = v.light? 'ico-likes': '';
        var code = v.light? '2': '1';
        var img = v.imagePath||"",
            cId = v.goodsId;//艺术品名字以及价格
        var picture=v.createUserImage;
        (picture == "") ? picture="/images/tips01.png" : picture=srcImg + v.createUserImage;
        var price = v.sellPrice==null?0:v.sellPrice;
        // if (v.ifSales == 1 && v.showSellPrice == 1) {
        //     price = v.sellPrice;
        // }
        var des = v.goodsName? v.goodsName: v.createUserName + "的艺术品";

        img = img.substr(0,4) == 'http'? img: srcImg + img;
        var onw ="onclick='artsLike(this,"+v.goodsId+", "+v.light+")'";
	    var str = ""
			+ "<li>"
			+ "<div class='art_img' data-id='"+v.goodsId+"' style='background-image: url("+img+"?imageView2/2/w/260/q/90);'></div>"
			+ "<div class='text'>"
				+ "<h2><a class='des' title='"+des+"'>"+des+"</a></h2>"
				+ "<span class='user'><a target='_blank' href='/page/"+ArtJS.server.language+"/user/gallery.html?proprietorId="+cId+"'><b><img src='"+picture+"?imageView2/1/w/201/h/20/q/90' class='fixcss3'/></b>" +v.createUserName+"</a></span>"
				+ "<div class='del'><span><b class='"+light+"' "+onw+" data-code='"+code+"'></b><i>"+v.likeCount+"</i></span><span>"+v.currencySymbol+price+"</span></div>"
			+ "</div>"
			+ "</li>";
		return str;
	},
	//灯丝圈
	special :function (index,v){
        var currency ="￥";
        var des=v.description,price=v.look || v.lookCount || '0',picture=v.memberPic || v.ownerHead;//艺术品名字以及价格
        var cover=v.cover || v.topicCover || '';
        if (cover) {
            if(cover.indexOf('http') <0){
                cover=ArtJS.server.image+cover;
            }
            cover = cover.indexOf('mmbiz') > -1? cover: cover + '?imageView2/1/w/270/h/270/q/90';
        }
        var title=v.title || v.topicTitle || '';

        var dsqId= base64encode(v.id.toString());

        var memberName= v.memberName || v.ownerName || '';
        var like= v.likeCount || v.like;
        like == undefined? "0": like;
        var memberId= v.memberId || v.ownerMemberId;
        var light = v.light? 'ico-likes': '';
        var code = v.light? '2': '1';

        var id = v.id;

        var onw ="onclick='artsLike(this,"+id+", 2)'";
        var _href=(memberId==User_id? "subject-editor2.html?id="+dsqId : "/page/"+ArtJS.server.language+"/detail.html?id="+dsqId);
        var picture=v.memberPic;
        (picture == "") ? picture="/images/tips01.png" : picture=srcImg + v.memberPic;

        var str =""
          + "<li>"
            + "<div class='art_img' style='background-image: url("+cover+");'>"+(memberId==User_id?"<div class='mask'><a class='edit' target='_blank' href='"+_href+"' data-special='"+id+"'>"+(memberId==User_id?"点击编辑":"")+"</a><a class='del'>×</a><a class='look iconfont' target='_blank' href='/detail.html?id="+dsqId+"'>&#xe621;</a></div>":"<a class='edit' target='_blank' href='"+_href+"' data-special='"+id+"'></a>")+"</div>"
            + "<div class='text'>"
            + "<h2 class='special'><a target='_blank' href='/page/"+ArtJS.server.language+"/detail.html?id="+dsqId+"'>&nbsp;"+title+"</a></h2>"
            + "<span class='user'><a target='_blank' href='/page/"+ArtJS.server.language+"/user/gallery.html?proprietorId="+memberId+"'><b><img src='"+picture+"?imageView2/1/w/20/h/20/q/90'/></b>"+memberName+"</a></span>"
            + "</div>"
          + "</li>";
        return str;
	},
    //艺术家HTML
    Artists :function(index,v){
        artworkCount ="";//Pings
        fansCount ="";//Followers
        var uId = v.artistsId;
        var isFollowed = v.isFollowed;
        var dataCode = isFollowed==true? 1: 0;
        //var act = isFollowed? " active": '';
        var act = isFollowed==true?'active':'';
        var text =  isFollowed? 'Follow cancel': 'Follow';
        var Follow = isFollowed==true? LANGUAGE_NOW.goods.following: LANGUAGE_NOW.goods.follow;
        if(v.artworkCount == null || v.fansCount == null){
            artworkCount="0";
            fansCount="0";
        }else{
            artworkCount =v.artworkCount;
            fansCount = v.fansCount;
        }

        var onw = uId == User_id? "style='display: none;'": "onclick='doFollowArtist(this, "+uId+")'"
        var str= ""
        str +="<div class='list-box'>"
            +"<div class='f-u-info'>"
            +"<div class='f-btn'>"
            +"<a class='btn-follow "+act+"' "+onw+" data-code='"+dataCode+"' href='javascript:;' id='"+ uId+"_clikcFollow'>"+Follow+"</a></div>"
            //+"<div class='f-btn'><a class='btn-follow' "+onw+" data-code='"+dataCode+"' href='javascript:;' id='"+ uId+"_clikcFollow'>"+Follow+"</a></div>"
            +"<div class='u-tx'><a href='/page/"+ArtJS.server.language+"/user/gallery.html?uid="+uId+"'><img src='"+srcImg+""+ v.artistsHead+"'onerror=\"javascript:this.src='/images/tips01.png'\"></a></div>"
            +"<div class='u-name'><span><a href='/page/"+ArtJS.server.language+"/user/gallery.html?uid="+uId+"'>"+ v.artistsName+"</a></span><br>"
            +"  "+ artworkCount+" Pings·"+fansCount+" Followers</div>"
            +"</div>"
            +"<ul>"
            if(v.artsUrl ==null){
                str += "<li><a href='javascript:void(0)' title=''><div><img src=''></div></a></li>";
            }else {
                for (var n = 0; n < v.artsUrl.length; n++) {
                    str += "<li><a href='javascript:void(0)' title=''><div><img src='"+srcImg+"" + v.artsUrl[n] + "?imageView2/1/w/150/h/150/q/90'></div></a></li>";
                }
            }
            +"</ul></div>"
        return str;
    },
    //分类
    NavFL :function(index,v,sLei) {
        var str = "";
        var strs = v.type && v.type.split("#"); //字符分割
        var cls = "class='active'";
        var wid = ArtJS.server.language =='US'?'us-w':'cn-w';
        var leiNone="";
        if (v.id == 4) {
            //零时解决方案
            var tmpl = {
                list:  '<dl class="fenlei-product"><dt ontouchstart="hover(this)">{title}</dt><dd>{child}</dd></dl>',
                child: '<a id="{id}" data-pid="{id}" data-type="{type}" onclick="typeBases.product(this);" {targetType}><span>{typeName}</span></a>'
            };
            var arr1 = [];
            var su = true;
            for (var i = 0; i < v.children.length; i++) {
                var li    = v.children[i];
                var child = li.children;
                var arr2  = [];
                li.type = 1;
                for (var j = 0; j < li.children.length; j++){
                    var chd = li.children[j];
                    chd.type = 2;
                    if (chd.id == 439) {        // 精品推荐
                        chd.id = 'jingpin';
                    } else if (chd.id == 441) { // 人气最高
                        chd.id = 'renqi';
                    } else if (chd.id == 443) { // 最新上架
                        chd.id = 'zuixin';
                    }
                    arr2.push(tmpl.child.substitute(chd));
                }
                if (li.id == 437) li.id = '';
                arr1.push(tmpl.list.substitute({
                    title: tmpl.child.substitute(li),
                    child: arr2.join('')
                }));

                if (i == 0) arr1[0] = arr1[0].replace(/(typeBases.product)/g, 'typeBases.product3');
            }
            str = arr1.join('');
        }else{
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (!isAndroid && !isiOS && v.id==207) {
                return;
            }
            var str = '<dl>';
            v.typeName = typeof(v.typeName) == 'string'? v.typeName: v.typeName[ArtJS.server.language];
            str += "<dt id='pid_id_"+ v.id+"' class='shx' ontouchstart='hover(this)'><font></font><span>" + v.typeName + "</span></dt><dd class='clearfix shaixuan' data-dtId='pid_id_"+ v.id+"'>"
            str += "<a data-name='"+v.typeName+"' data-pid=''>"+LANGUAGE_NOW.cart.all+"</a>"
            for (var i = 0; i < v.children.length; i++) {
                var node = v.children[i];
                node.typeName = typeof(node.typeName) == 'string'? node.typeName: node.typeName[ArtJS.server.language];
                //str += "<a data-name='"+node.typeName+"' data-pid=" + node.id + " class='a'>" + node.typeName + "<i class='iconfont icon-check'></i></a>";
                str += "<a data-name='"+node.typeName+"' data-pid=" + node.id + " class='a'>" + node.typeName + "</a>";
            }
            str += "</dd></dl>";
        }
        return str;
    },
    //分类interest
    interestClassify :function(index,v) {
        var str = "";
        str +="<div class='interest-box'></div>"
            +"<div class='interest' id='interest'>"
            +"<div class='Shaer_colse_out'></div>"
            +"<div class='w-400'>"+LANGUAGE_NOW.new001.t0064+"</div>"
            +"<div class='w-tag'>"
            +"<ul>"
                if (v.id == 207) {
                    var len =v.children.length;
                    str += "<li>"
                    for (var i = 0; i <len; i++) {
                        if(v.children[i].id!=218 && v.children[i].id!=345){
                            var icon =v.children[i].icon;
                            str += "<div class='list-box'>"
                                +"<i style='background-image: url("+srcImg+""+icon+"?imageView2/1/w/86/h/86/q/90)'></i>"
                                +"<em class='iconfont icon-check'></em>"
                                +"<span ClassifyId=" + v.children[i].id + ">" + v.children[i].typeName + "</span>"
                                +"</div>";
                        }
                    }
                    str += "</li>"
                }
        str += "</ul>"
            +"</div>"
            +"<div class='w-but'>"
            +"<input type='button' id='i-w-but' value='"+LANGUAGE_NOW.title.enter+"' onClick='interestFun(this)'>"
        +"</div>"
        +"</div>"
        return str;
    },
    // 分类(灯丝圈)
    NavSpecial: function (v) {
        var str = '';
        if (v.id == 207) {
            this.interestName = v.typeName;
            str += this.NavSpecialMod(v.children);
        }
        return str;
    },
    NavSpecialMod: function (list) {
        $('#fenleiSpecial').remove();
        var str = '';
        var obj = {
            '208': 'art',        // 艺术新语
            '209': 'master',     // 大师作品
            '210': 'anime',      // 插画动漫
            '211': 'photo',      // 摄影摄像
            '212': 'design',     // 平面设计
            '213': 'handwork',   // 手工艺品
            '214': 'anime',      // 生活创意
            '215': 'quotations', // 文艺语录
            '216': 'movie',      // 影视音乐
            '217': 'game',       // 游戏人物
            '218': 'public',     // 爱心公益
            '345': 'activity',   // 艺术新语
            '395': 'comic',      // 动漫
            '397': 'charity'     // 古董收藏
        };
        var len = list.length;
        var tmpl = {
            main: [
                '<dl id="fenleiSpecial" class="fenlei-special">',
                    '<dt class="shopSx" ontouchstart="hover(this)"><font></font><span>{typeName}</span></dt>',
                    '<dd>{child}</dd>',
                '</dl>'
            ].join(''),
            child: '<a data-name="{typeName}" typeId="{typeId}" data-pid="{id}" data-type="3" onclick="typeBases.interest(this);"><em class="iconfont icon-xq-{cls}"></em><span>{typeName}</span></a>'
        };
        var chd0 = {
            typeName: LANGUAGE_NOW.cart.recommend,
            cls: 'all'
        };
        var arr = [tmpl.child.substitute(chd0)];
        if (len) {
            for (var i = 0; i < len; i++) {
                var node = list[i];
                node.cls = obj[node.id];
                if (node.id == 345) {
                    node.typeId = '28005002';
                    if (sLei != '1' || ArtJS.server.language == 'US') arr.push(tmpl.child.substitute(node));
                } else if (node.id == 218) {
                    node.typeId = '28005001';
                    if (sLei != '1') arr.push(tmpl.child.substitute(node));
                } else {
                    arr.push(tmpl.child.substitute(node));
                }
            }
        }
        str += tmpl.main.substitute({
            typeName: this.interestName,
            child: arr.join('')
        });
        return str;
    },
    /*DOTO 获取浏览参数*/
    GetQueryString:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if(r!=null)return  unescape(r[2]);
        return null;
    },
    //修改地址栏参数
    changeURLPar:function (destiny, par, par_value)
        {
            var pattern = par+'=([^&]*)';
            var replaceText = par+'='+par_value;
            if (destiny.match(pattern))
            {
                var tmp = '/\\'+par+'=[^&]*/';
                tmp = destiny.replace(eval(tmp), replaceText);
                return (tmp);
            }
            else
            {
                if (destiny.match('[\?]'))
                {
                    return destiny+'&'+ replaceText;
                }
                else
                {
                    return destiny+'?'+replaceText;
                }
            }
            return destiny+'\n'+par+'\n'+par_value;
        },
	 /**
	* 通过id获取DOM对象
	*
	* @param string str
	* @return object|undefined
	*/
	 $:function(nodeId){
		return document.getElementById(nodeId);
	 },
   nameR :function(v){
		var str = "";
		if(v.ownerNickName == null || v.ownerNickName==""){
			str = v.ownerNickName;
		}else{
			str = v.ownerNickName;
		}
		return str;
	   },
    imgR:function(v){
		var str = "";
		if(v == null || v==""){
			str = "<img class='fixcss3' src='/images/tips01.png'>";
		}else{
			str = "<img class='fixcss3' src='"+srcImg+v+"?imageView2/1/w/20/h/20/q/90'>";
		}
		return str;
	},
  //DOTO 获取cookie值
  getCookie:function(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1) c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	},
  getCookieDecodeURIComponent:function(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        var c_name = decodeURIComponent(document.cookie.substring(c_start, c_end))
        return c_name;
      }
    }
    return ""
  },
  setCookie:function(c_name, value, expiredays) {
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value) +
	((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
   },
  delCookie:function(c_name){//删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=ArtList.getCookie(c_name);
    if(cval!=null) document.cookie= c_name + "="+cval+";expires="+exp.toGMTString();
  },
  filterYH: function (text) {
    return text.replace(/(^["])|(["]$)/g, '');
  },
  idxStart: function (txt, con) {
    return txt.indexOf(String(con)) == 0;
  }
}
User_code = parseInt(ArtList.getCookie("User_code"));
User_id = parseInt(ArtList.getCookie("User_id"));
iconUrl = ArtList.filterYH(ArtList.getCookie("iconUrl"));
iconUrl = iconUrl.indexOf('imgs') == 0? ArtJS.server.image + iconUrl: iconUrl;
nickName = ArtList.filterYH(ArtList.getCookieDecodeURIComponent("nickName"));//用户是否存在
user_key = ArtList.getCookie('toKen');
