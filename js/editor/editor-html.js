/**
 * Created by Administrator on 2015/9/18.
 */
var srcImg="http://image.cmall.com/imgsrv/";
var httpImg=ArtJS.server.art;
var dataArryLei="",xlei="",cTagBy="",lang="",dsq ="",dsqName="",xingqu="";
var StaraTxt="";
var Stara="";
var typeName="",typexName="",typelName="",xingquName=[];
var ArtList={
    //衍生品
    Aartwork :function(index,v, shFlag){
        var likes = v.light;
        var cId = v.ownerId;
        var pId = v.id;
        var cls = likes? 'ico-likes': '';
        var code = likes? '2': '1';
        //var onw = cId == User_id? "style='display: none;": "onclick='artsLike(this,"+pId+", 1)'";
        var onw ="";
        var vis="";
        var viss="";
        var classText="",delText="",classNone="";
        if(shFlag ==3){
            classText = "none";
            viss ="vis";
        }
        if(shFlag == 4){
            classText = "none";
            vis ="";
        }
        if(shFlag == 5){
            delText = "none";
            vis ="vis";
            viss ="none";
        }
        var _tit=v.goodsName || v.goodsName;
        var str = ""
            + "<li>"
            + "<div class='art_img Aartwork' style='background-image: url("+srcImg+""+v.imagePath+"?imageView2/2/w/270/q/90)'>"
            + "<i onclick='deleDerivative(this,"+v.id+")' class='delete_status "+viss+"'>删除</i>"
            + "<i onclick='recoverDerivative(this,"+v.id+")' class='delete_status_restore "+classNone+" "+classText+"'>恢复</i>"
            + "</div>"
            + "<div class='text'>"
            + "<h2><a>"+_tit+"</a></h2>"
            + "<span class='user'><a><b>"+ArtList.imgR(v.userIcon)+"</b>" +ArtList.nameR(v)+"</a></span>"
            + "<div class='del'><span><b class='"+cls+"' id='likes_"+pId+"' "+onw+" name='like_"+pId+"' data-code='"+code+"'></b><i id='like_light_"+pId+"'>"+v.likeTotal+"</i></span>"
            //+"<span>"+ v.currencySymbol+""+v.currencySymbol+"</span></div>"
            + " </div>"
            + "<div class='tag-div'>标签</div>"
            + "<div class='tag-input'><input type='text' placeholder='回车或者逗号键入标签'></div>"
        if(shFlag == 5){
            str +="";
        }else{
           //str +="<div class='art-editor-sut "+viss+"'><input type='button' onclick='aartworkAjax(this,"+v.id+")' value='提交'></div>"
            str +="<div class='art-editor span'>"
            if(shFlag ==4){
                str +=""
            }else{
                str +="<span onclick='artStick(this,"+v.id+","+v.influxGoodsflag+")' class='span-stick zd' code='0'><i>置顶</i></span>"
            }
              //+ "<span onclick='artRecommend(this,"+v.id+")' class='span-stick rem "+vis+"' code='0'><i>特别推荐</i></span>"
            + "</div>"
        }
            str+="</li>";
        return str;
    },
    //艺术品
    Aworks :function(index, v, shFlag, sKm, dataArry){
        var taglist = shFlag != 4? ArtList.taglist(dataArry, v.typeIds): '';
        var taglistxx = shFlag != 4? ArtList.taglistxx(dataArry, v.typeIds): '';
        var taglistlangue = shFlag != 4? ArtList.taglistlangue(dataArry, v.typeIds): '';

        var tagBy = shFlag != 4? ArtList.tagBy(dataArry, v.typeIds): '';

        var xingqu = shFlag != 4? ArtList.xingqu(dataArry, v.typeIds): '';

        var _name=v.customerName || v.memberName;
        var light = v.light? 'ico-likes': '';
        var code = v.light? '2': '1';
        var picture = v.picture || '',
            img = v.imagePath,
            cId = v.customerId;//艺术品名字以及价格
        var price ="";//? price + v.price: "<em onclick='inquire("+v.id+")'>点击询价</em>";
        if(v.ifSales ==1 && v.showSellPrice ==1){
            price = v.price;
        }
        var des = v.userName+ "的艺术品";
        picture = picture == ''? '/drift/images/profile_avatar_default@2x.png': picture;
        picture = picture.substr(0,4) == 'http' || picture.substr(0,6) == 'images'? picture: srcImg + picture;
        //img = img.substr(0,4) == 'http'? img: srcImg + img;
        img =srcImg + img;
        //var onw = cId == User_id? "style='display: none;": "onclick='artsLike(this,"+v.id+", 0)'";
        var onw ="";


        var tideType=v.tideType;
        (tideType == null) ? tideType="" : tideType;

        var tideType2=v.tideType2;
        (tideType2 == null) ? tideType2="" : tideType2;

        var sLei= tideType +"> "+tideType2;//所属分类
        (v.tideType == "" && v.tideType2 =="") ? sLei="" : sLei+"sss";

        var artLabel=v.labels;
        (artLabel == null) ? artLabel="" : artLabel;

        //小编标签 editorDescription
        var assignedEditorNameTxt="";
        var NameVal="";
        if(typeof(v.editorLabels) !="undefined" && v.editorLabels !="" && v.editorLabels !=null) {
            var assignedEditorNameVal = v.editorLabels.split(",");
            if (assignedEditorNameVal != null && assignedEditorNameVal != "") {
                NameVal = assignedEditorNameVal;
                for (var b = 0; b < NameVal.length; b++) {
                    if(NameVal[b] !="") {
                        /*if(shFlag ==2){
                            assignedEditorNameTxt += "&nbsp<div class='label mp'>"
                                + "<font class='ng-binding' name='token'>" + NameVal[b] + "</font>"
                                + "</div>"
                        }else {*/
                            assignedEditorNameTxt += "&nbsp<div class='label'>"
                                + "<font class='ng-binding' name='token'>" + NameVal[b] + "</font>"
                                + "<i class='iconfont icon-close-b'></i>"
                                + "</div>"
                        //}
                    }
                }
            }
        }else{
            assignedEditorNameTxt ="<span class='none'></span>";
        }

        var classNone="",delText="",vm="";

        var m="art-tag-m";

        var s="art-star";

        var g="editor-tag";

        var bor="";
        var vis="";
        var viss="";
        var classText="";
        if(shFlag ==1){
            classNone = "none";
            bor = "bor-T";
        }
        if(shFlag ==2){
            vis ="vis";
            classNone = "none";
             /*m="art-tag-ms";

             s="art-stars";

             g="editor-tags";*/

        }
        if(shFlag ==3){
            classText = "none";
            viss ="vis";
        }
        if(shFlag == 4 || shFlag == 6){
            vm = "none";
        }
        if(shFlag == 5){
            delText = "none";
        }
        ArtList.startFun(v.likeStartNumber);//星
        // 版权问题 ||需要扣图
        var zhuangtai1=v.versionProblem;
        (zhuangtai1 == 1) ? zhuangtai1="active" : zhuangtai1="";

        var zhuangtai2=v.amendImage;
        (zhuangtai2 == 1) ? zhuangtai2="active" : zhuangtai2="";

        // 编辑人
        var editorName=v.editorName;
        (editorName == null) ? editorName="" : editorName=editorName;

        // 作者
        var userName=v.userName;
        (userName == null) ? userName="" : userName=userName;

        // 国别
        var userAbbr=v.userAbbr;
        (userAbbr == null) ? userAbbr="" : userAbbr=userAbbr;

        var str = ""
            + "<li id='" + v.id + "' style='background: #fff'>"
            + "<div class='art_img' data-id='"+v.id+"' style='background-image: url("+img+"?imageView2/2/w/270/q/90)'>"
            + "<i onclick='deleAworks(this,"+v.id+")' class='delete_status "+delText+"'>删除</i>"
            + "<i onclick='recoverArtwork(this,"+v.id+")' class='delete_status_restore "+classNone+" "+classText+" "+vm+"'>恢复</i>"
            + "<div class='edit-bg'><a class='edit ed_bm'></a></div>"
            + "</div>"
            + "<div class='text "+classNone+"'>"
            if(shFlag == 1 || shFlag == 2) {
                str +=""
            }else{
                str +="<h2><a class='des'>" + des + "</a></h2>"
                    + "<span class='user'><a><b><img src='" + picture + "' class='fixcss3'/></b>" + v.userName + "</a></span>"
                    + "<div class='del'><span><b class='" + light + "' " + onw + " data-code='" + code + "'></b><i>" + v.likeTotal + "</i></span><span>" + price + "</span></div>"
            }
          str +="</div>"
        if(shFlag ==3 || shFlag ==4 || shFlag == 5) {
            str +="";
           }else{
            str += "<div class='"+m+" bor-L bor-L bor-R " + bor + "'>"
                + "<i class='target_status_bq "+zhuangtai1+"'>版权问题</i>"
                + "<i class='target_status_kt "+zhuangtai2+"'>需要扣图</i>"
                + "</div>"//版权问题||需要扣图
                + "<div class='"+s+" bor-L bor-L bor-R'><p>"+StaraTxt+"</p></div>"//星级
                //标签编辑
                + "<div class='"+g+" bor-L bor-L bor-R  bor-B'>"//分类
                    + "<div class='editor-tag-fenlei Aworks'>"
                        if(sKm ==7) {
                            str+="<p>所属分类 :<br><span class='cty'><span>"+ sLei+"</span>"
                                +"<input type='hidden' class='ctyNew' />"
                                +"<input type='hidden' class='twoTypeId' />"
                                +"<input type='hidden' class='oneTypeId' />"
                                +"<input type='hidden' class='ctyOld' value='"+ v.twoTypeId+","+ v.oneTypeId+"'></span>"
                                +"<span class='s_box_sel'>修改</span>"
                                +"</p>"
                            str+="<div class='edBox clearfix'>"
                                +"<div class='edLeft'>"+tagBy+"</div>"
                                +"<div class='edSmall'></div>"
                                +"</div>"
                            str+="<p class='xqVal'>"+xingquName+" :<span>"+xingqu+"</span></p>"
                        }
                        str+="<p class='langueVal'>"+typelName+":<span>" + taglistlangue + "</span></p>"
                        str+="<p class='xqVal'>"+typeName+" :<span>"+taglist+"</span></p>"
                        if(sKm !=7){
                            str+="<p class='qtVal'>"+typexName+" :<span>"+taglistxx+"</span></p>"
                        }
                 str+="</div>"//分类
                + "<p class='editor-tag-biaoq'>标签 :<c>"+artLabel+"</c></p>"//标签
                + "<div class='editor-tag-xbianbiaoq'>小编标签 :<div class='e-bord'><div class='div-label'>"+assignedEditorNameTxt+""
                + "</div>"
                + "<div class='text-input'>"
                /*if(shFlag ==2){
                    str += ""
                }else{*/
                    str += "<input type='text' class='tag' placeholder='添加相关标签，用逗号或回车分隔' maxlength='20' onkeydown='tagDown(this)' onblur='tagBlur(this)'>"
                //}
                str += "</div>"
                + "</div>"
                + "</div>"//小编标签
                + "<p class='editor-tag-pos'>编辑人 :<c>"+editorName+"</c></p>"//编辑人
                + "<p class='editor-tag-pos'>作者 :<c>"+userName+"</c></p>"//编辑人
                + "<p class='editor-tag-pos'>国家 :<c>"+userAbbr+"</c></p>"//编辑人
                + "</div>"
            if(shFlag == 9) {
                str += ""
            }else{
                if(sKm ==7){
                    str += "<div class='art-editor-sut'><input type='button' onclick='saveEditTideProduct(this," + v.id + ")' value='提交'></div>"
                }else {
                    str += "<div class='art-editor-sut'>"
                        if(shFlag ==1 || shFlag ==2) {
                            str += "<input type='button' onclick='artAllot(this," + v.id + ")' value='分配'>"
                            str += "<input type='button' onclick='artSubt(this," + v.id + ")' value='提交'>"
                        }else{
                            str += "<input type='button' onclick='artSubt(this," + v.id + ")' value='提交'>"
                        }
                    str += "</div>"
                }
            }
        }
        if(shFlag == 1 || shFlag == 5 || shFlag == 6||shFlag == 2 ){
            str +="";
        }else {
            str += "<div class='art-editor del'>"
                    if(shFlag ==4){
                        str +=""
                    }else{
                        str +="<span onclick='artStick(this," + v.id + ")' class='span-stick " + vis + "' code='0'><i>置顶</i></span>"
                    }
            str +="<span onclick='artworkBackToEdit(this," + v.id + ")' class='span-stick del " + viss + "' code='0'><i>退回修改</i></span>"
                + "</div>"
        }
        str +="</li>";
        return str;
    },
    //礼品店
    giftShop :function(index,v, shFlag, dataArry){
        //艺术品:0  //衍生品:2
        var light = v.light? 'ico-likes': '';
        var type = v.type < 2? '0': '1';

        var s_type=v.type;//退回修改
        (s_type == 0) ? s_type="" :s_type="style='display: none;";

        var code = v.light? '2': '1';//灯泡
        var picture = v.createUserImage || '',
            img = v.imagePath,
            cId = v.customerId;//艺术品名字以及价格
        var price = v.currencySymbol + v.sellPrice;

        var s_title=v.goodsName;
        (s_title == null || s_title =="") ? s_title=" " :s_title ;

        picture = picture == ''? httpImg+'drift/images/profile_avatar_default@2x.png':srcImg+ picture;
        img =srcImg + img;
        var onw ="";

        var str = ""
            + "<li id='" + v.goodsId + "'>"
            + "<div class='art_img' data-id='"+v.goodsId+"'>"
            + "<div style='background-image: url("+img+"?imageView2/2/w/270/q/90)' class='img'>"
                + "<i type='"+v.type+"' onclick='deleGift(this,"+v.goodsId+")' class='delete_status'>删除</i>"
                + "<div class='edit-bg'><a class='edit ed_bm'></a></div>"
            + "</div>"
            + "</div>"
            + "<div class='text'>"
                +"<h2><a class='des'>" + s_title + "</a></h2>"
                + "<span class='user'><a><b><img src='" + picture + "' class='fixcss3' /></b>" + v.createUserName + "</a></span>"
                + "<div class='del'><span><b class='" + light + "' " + onw + "></b><i>" + v.likeCount + "</i></span><span>" + price + "</span></div>"
            + "</div>"
            + "<div class='art-editor del'>"
            + "<span onclick='giftStick(this," + v.goodsId + "," + v.type + ")' class='span-stick' code='0'><i>置顶</i></span>"
            + "<span onclick='artworkBackToEdit(this," + v.goodsId + ", "+v.type+")' class='span-stick del' code='0' "+s_type+"><i>退回修改</i></span>"
            + "</div>"
            + "</li>";
        return str;
    },
    //灯丝圈
    special :function (index,v, shFlag, dataArry){

        var dsqlist = shFlag != 4? ArtList.dsqlist(dataArry, v.types): '';

        var currency ="￥";
        var des=v.description,price=v.look || v.lookCount || '0',picture=srcImg+v.memberPic+"?imageView2/1/w/270/h/270/q/90" || srcImg+v.ownerHead+"?imageView2/1/w/270/h/270/q/90";//艺术品名字以及价格
        var cover=v.cover || v.topicCover;
        var title=v.title || v.topicTitle || '';
        var dsqId= v.id || v.topicId;
        var memberName= v.memberName || v.ownerName || '';
        var like= v.likeCount || v.like;
        like == undefined? "0": like;
        var memberId= v.memberId || v.ownerMemberId;
        var light = v.light? 'ico-likes': '';
        var code = v.light? '2': '1';
        var id = v.id || v.topicId;
        //var onw ="onclick='artsLike(this,"+id+", 2)'";
        var onw ="";
        var classNone="",dd="",classN="";
        var Stara="",Starb="",Starc="";
        var classText="";
        var viss="",vis="";
        if(shFlag ==1){
            classNone ="none";
        }
        var m="art-tag-m";

        var s="art-star";

        var g="editor-tag";
        var none="";

        if(shFlag ==2){
            vis ="vis";
            classNone = "none";
            dd="ddc";

            m="art-tag-ms";

            s="art-stars";

            g="editor-tags";

            none="display:none;"

        }

        if(shFlag ==3 || shFlag ==4  || shFlag ==6){
            classText = "none";
            viss ="";
        }
        if(shFlag ==5){
            classN ="none"
        }

        ArtList.startFun(v.status);

        //editLabels显示输入的标签
        var labels=v.labels;
        (labels == null) ? labels="" : labels;

        // 编辑人
        var memberName=v.memberName;
        (memberName == null) ? memberName="" : memberName=memberName;

        var editLabelsTxt="";
        if(typeof(v.editorLabels) !="undefined" && v.editorLabels !="" && v.editorLabels !=null) {
            var editorLabelsVal = v.editorLabels.split("<br>") || v.editorLabels.split("<br />") || v.editorLabels.split(",");
                for (var b = 0; b < editorLabelsVal.length; b++) {
                    if(shFlag ==2){
                        editorLabelsTxt += "&nbsp<div class='label mp'>"
                            + "<font class='ng-binding' name='token'>" + editorLabelsVal[b] + "</font>"
                            + "</div>"
                    }else {
                        editorLabelsTxt += "&nbsp<div class='label'>"
                            + "<font class='ng-binding' name='token'>" + editorLabelsVal[b] + "</font>"
                            + "<i class='iconfont icon-close-b'></i>"
                            + "</div>"
                    }
                }
        }else{
            editorLabelsTxt ="<span class='none'></span>";
        }
        var str =""
            + "<li>"
            + "<div class='art_img special' style='background-image: url("+cover+"?imageView2/1/w/270/h/270/q/90)'>"
            + "<i onclick='deleSpecial(this,"+ v.id+")' class='delete_status "+classN+"'>删除</i>"
            + "<i onclick='restoreTaskArtwork(this,"+v.id+")' class='delete_status_restore "+classNone+" "+classText+"'>恢复</i>"
            + "<a href='/detail.html?id="+v.id+"' target='_blank'></a>"
            + "<span class='special'>&nbsp;" + title + "</span>"
            + "</div>"
        if(shFlag == 2) {
            str +="";
        }
        else {
            //str +="<h2 class='special'><a>&nbsp;" + title + "</a></h2>"
            str +="<div class='text'><span class='user'><a><b><img src='" + picture + "' /></b>" + memberName + "</a></span>"
            + "<div class='del'><span><b class='" + light + "' data-code='" + code + "'></b><i>" + like + "</i></span>"
            + "<span><i><img src='/drift/images/spe_ico.jpg'></i>" + (v.look == undefined ? "0" : v.look) + "</span>"
            + "</div>"
        }
        str +="</div>"
            if(shFlag ==3 || shFlag ==4 || shFlag ==5) {
                str += "";
            }else{
                str += "<div class='"+s+" bor-L bor-L bor-R "+dd+"'><p>"+StaraTxt+"</p></div>"//星级
                    //标签编辑
                    + "<div class='"+g+" del bor-L bor-L bor-R  bor-B'>"
                    + "<p class='editor-tag-fenlei special'>"+dsqName+" :<span>" + dsqlist + "</span></p>"//兴趣
                    + "<p class='editor-tag-biaoq'>标签 :&nbsp&nbsp"+labels+"</p>"//标签
                    + "<div class='editor-tag-xbianbiaoq'>小编标签 :<div class='e-bord'><div class='div-label'>"+editorLabelsTxt+""
                    + "</div>"
                    + "<div class='text-input'>"
                    + "<input type='text' style='"+none+"' class='tag' placeholder='添加相关标签，用逗号或回车分隔' maxlength='20' onkeydown='tagDown(this)' onblur='tagBlur(this)'>"
                    + "</div>"
                    + "</div>"
                    + "</div>"//小编标签
                    + "<p class='editor-tag-pos'>编辑人 :<c>"+memberName+"</c></p>"//编辑人
                    + "</div>"
                if(shFlag ==2) {
                    str += ""
                }else{
                    str += "<div class='art-editor-sut'><input type='button' onclick='specialSubt(this," + v.id + ")' value='提交'></div>"
                }
            }
        if(shFlag == 1|| shFlag == 5|| shFlag == 6){
            str +="";
        }else {
            str += "<div class='art-editor del bor-L bor-L bor-R'>"
            str +="<span onclick='artStick(this," + v.id + ")' class='span-stick "+vis+"' code='0'><i>置顶</i></span>"
                +"<span onclick='SeditBack(this," + v.id + ")' class='span-stick del " + viss + "' code='0'><i>退回修改</i></span>"
                + "</div>"
        }
        str +="</li>";
        return str;
    },
    nameR :function(v){
        var str = "";
        if(v.userName == null || v.userName==""){
            str = '';
        }else{
            str = v.userName;
        }
        return str;
    },
    imgR:function(v){
        var str = "";
        if(v == null || v==""){
            str = "<img class='fixcss3' src='/drift/images/tips01.png'>";
        }else{
            var sv=srcImg+v;
            str = "<img class='fixcss3' src='"+sv+"'>";
        }
        return str;
    },
    //分类
    NavFL :function(index,v,sLei) {
        var str = "";
            str += "<dd class='clearfix' data-dtId='pid_id_" + v.id + "'><a href='javascript:void(0)' data-pid='' flg='true'>不限</a>"
            for (var i = 0; i < v.children.length; i++) {
                var nId =v.children[i].id;
                if(sLei ==5) {
                    if (nId == 218 || nId == 345) {
                        str += "";
                    } else {
                        str += "<a href='javascript:void(0)' data-pid=" + v.children[i].id + " class='a' flg='true'>" + v.children[i].typeName + "</a>";
                    }
                }else{
                    str += "<a href='javascript:void(0)' data-pid=" + v.children[i].id + " class='a' flg='true'>" + v.children[i].typeName + "</a>";
                }
            }
            str += "</dd>"
            if (v.id == 1) {
                str += "<b class='morebtn'><c>更多筛选</c><i class='cor corg6' id='flipCor'></i></b>"
            }
            str += "<div class='clear'></div>"
        return str;
    },
    startFun:function(startVal){
        if (startVal == 1) {
            Stara = "active";
            StaraTxt ="<em class='"+Stara+"'></em><em></em><em></em>";
        }
        if (startVal == 2) {
            Stara = "active";
            StaraTxt ="<em class='"+Stara+"'></em><em class='"+Stara+"'></em><em></em>";
        }
        if (startVal == 3) {
            Stara = "active";
            StaraTxt ="<em class='"+Stara+"'></em><em class='"+Stara+"'></em><em class='"+Stara+"'></em>";
        }
        if (startVal ==0 || startVal =="" || startVal ==null) {
            StaraTxt ="<em></em><em></em><em></em>";
        }
    },
    ztLei:function(index, v){//兴趣
        dataArryLei =v;
        typeName =v.typeName;
    },
    dsq:function(index, v){//兴趣
        dsq = v;
        dsqName = v.typeName;
    },
    dsqlist:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];

        var txtShop="";
        if(dsq !="") {
            var children = dsq.children;
            var len = children.length
            for (var m = 0; m < len; m++) {
                var node = children[m];
                var xactive = "";
                var xname = "";
                var oldId = "";
                var cid = children[m].id;
                //if (xartId.length) {
                for (var x = 0; x < xartId.length; x++) {
                    var xid = ~~(xartId[x]);
                    if (xid == cid) {
                        xactive = "active";
                        xname = "tagK";
                        oldId = "data-old='"+node.id+"'";
                    }
                }
                txtZhuti.push('<a '+oldId+' data-id="' + node.id + '" class="' + xactive + '" name="' + xname + '">' + node.typeName + '</a>');
            }
            return txtZhuti.join('');
        }
    },
    xxLei:function(index, v){//207
        xlei=v;
        typexName= v.typeName;
    },
    lang:function(index, v){//465
        lang = v;
        typelName= v.typeName;
    },
    ByPage:function(index, v){//所属分类
        cTagBy =v;
    },
    Byxinqu:function(index, v){//兴趣分类
        xingqu =v;
        xingquName.push(v.typeName);
    },
    tagBy:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];
        var txtShop="";
        if(cTagBy !="") {
            var children = cTagBy;
            var len = children.length;
            var sBn="";
            for (var m = 1; m < len; m++) {
                var node = children[m];
                if(m==0){
                    sBn="active";
                }else{
                    sBn="";
                }
                var xactive = "";
                var xname = "";
                var cid = children[m].id;
                /*for (var x = 0; x < xartId.length; x++) {
                    var xid = ~~(xartId[x]);
                    if (xid == cid) {
                        xactive = "active";
                        xname = "tagK";
                    }
                }*/
                txtZhuti.push('<a type="1" data-id="' + node.id + '" class="' + xactive + ''+sBn+'" name="' + xname + '"><span>' + node.typeName + '</span><font></font></a>');
            }
            return txtZhuti.join('');
        }
    },
    taglist:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];

        var txtShop="";
        if(dataArryLei !="") {
            var children = dataArryLei.children;
            var len = children.length
            for (var m = 0; m < len; m++) {
                var node = children[m];
                var xactive = "";
                var xname = "";
                var oldId = "";
                var cid = children[m].id;
                //if (xartId.length) {
                    for (var x = 0; x < xartId.length; x++) {
                        var xid = ~~(xartId[x]);
                        if (xid == cid) {
                            xactive = "active";
                            xname = "tagK";
                            oldId = "data-old='"+node.id+"'";
                        }
                    }
                    txtZhuti.push('<a '+oldId+' data-id="' + node.id + '" class="' + xactive + '" name="' + xname + '">' + node.typeName + '</a>');
            }
            return txtZhuti.join('');
        }
    },
    taglistxx:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];

        var txtShop="";
        if(xlei !="") {
            var children = xlei.children;
            var len = children.length
            for (var m = 0; m < len; m++) {
                var node = children[m];
                var xactive = "";
                var xname = "";
                var cid = children[m].id;
                for (var x = 0; x < xartId.length; x++) {
                    var xid = ~~(xartId[x]);
                    if (xid == cid) {
                        xactive = "active";
                        xname = "tagK";
                    }
                }
                txtZhuti.push('<a data-id="' + node.id + '" class="' + xactive + '" name="' + xname + '">' + node.typeName + '</a>');
            }
            return txtZhuti.join('');
        }
    },
    taglistlangue:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];

        var txtShop="";
        if(lang !="") {
            var children = lang.children;
            var len = children.length
            for (var m = 0; m < len; m++) {
                var node = children[m];
                var xactive = "";
                var xname = "";
                var cid = children[m].id;
                for (var x = 0; x < xartId.length; x++) {
                    var xid = ~~(xartId[x]);
                    if (xid == cid) {
                        xactive = "active";
                        xname = "tagK";
                    }
                }
                var nType =node.type;
                if(nType ==null){
                    nType ="";
                }
                txtZhuti.push('<a type="'+nType+'" data-id="' + node.id + '" class="' + xactive + '" name="' + xname + '">' + node.typeName + '</a>');
            }
            return txtZhuti.join('');
        }
    },
    xingqu:function(dat,artId){
        var xartId='';//选中的id
        if(artId !=null && artId !="") {
            xartId = artId.split(",");
        }
        var txtZhuti=[];
        var txtShop="";
        if(xingqu !="") {
            var children = xingqu;
            var len = children.length
            for (var m = 0; m < len; m++) {
                var node = children[m];
                var xactive = "";
                var xname = "";
                var oldId = "";
                var cid = children[m].id;
                //if (xartId.length) {
                    for (var x = 0; x < xartId.length; x++) {
                        var xid = ~~(xartId[x]);
                        if (xid == cid) {
                            xactive = "active";
                            xname = "tagK";
                            oldId = "data-old='"+node.id+"'";
                        }
                    }
                    txtZhuti.push('<a '+oldId+' data-id="' + node.id + '" class="' + xactive + '" name="' + xname + '">' + node.typeName + '</a>');
            }
            return txtZhuti.join('');
        }
    },
    // 分类(灯丝圈)
    NavSpecial: function (amrk,index,v) {
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
        }
        if (v.id == 207) {
            var chd = v.children;
            var len = chd.length;
            if (len) {
                var arr = ['<div><a data-name="推荐" data-sort="3" data-pid=""><em class="iconfont icon-xq-all"></em><i>推荐</i></a>'];
                for (var i = 0; i < len; i++) {
                    var node = chd[i];
                    var ob = obj[node.id];
                    if (node.id == 345) {
                        if (amrk ==1) arr.push('<a data-name="'+node.typeName+'" typeId="28005002" data-pid="'+node.id+'" act-no="acti" tag="0" data-sort="3"><em class="iconfont icon-xq-'+ob+'"></em><i>'+node.typeName+'</i></a>');
                    } else if (node.id == 218){
                        if (amrk ==1) arr.push('<a data-name="'+node.typeName+'" typeId="28005001" data-pid="'+node.id+'" act-no="acti" tag="0"><em class="iconfont icon-xq-'+ob+'" data-sort="3"></em><i>'+node.typeName+'</i></a>');
                    } else {
                        arr.push('<a data-name="' + node.typeName + '" data-pid="' + node.id + '" data-sort="3"><em class="iconfont icon-xq-'+ob+'"></em><i>'+node.typeName+'</i></a>');
                    }
                }
                str += arr.join('') + '</div>';
            }
        }
        return str;
    },
    NavInter: function (v) {
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
        }
            var chd = v;
            var len = chd.length;
            if (len) {
                var arr = ['<div><a data-name="推荐" data-sort="3" data-pid=""><em class="iconfont icon-xq-all"></em><i>推荐</i></a>'];
                for (var i = 0; i < len; i++) {
                    var node = chd[i];
                    var ob = obj[node.id];
                         arr.push('<a data-name="' + node.typeName + '" data-pid="' + node.id + '" data-sort="3"><em class="iconfont icon-xq-'+ob+'"></em><i>'+node.typeName+'</i></a>');
                }
                str += arr.join('') + '</div>';
            }
        return str;
    },
    //分类indexClass
    indexClass :function(index,v,sLei) {
        var str = "";
        var strs=v.type && v.type.split("#"); //字符分割
        var cls="class='active'";
        var wid= ArtJS.server.language =='US'?'us-w':'cn-w';
        var leiNone="";
        if(v.id == 4){
            var str = ''
            v.typeName = typeof(v.typeName) == 'string'? v.typeName: v.typeName;
            str +="<dd class='clearfix liwu "+wid+"' data-dtId='pid_id_"+ v.id+"'>"
                +"<div class='mune-L clearfix'><ul>"
            for (var i = 0; i < v.children.length; i++) {
                var node = v.children[i];
                leiNone = node.children;
                var nodeId =node.id;
                node.typeName = typeof(node.typeName) == 'string'? node.typeName: node.typeName;
                var _nm = node.typeName;
                str += "<li>"
                    +"<a classId='"+node.id+"' data-pid='"+nodeId+"' data-sort='1'><tt>"
                    + _nm + "</tt>"
                    +"</a>"
                        if(nodeId ==350 || nodeId==437){
                            str +="<div style='display:none!important;'>"
                        }else{
                            str +="<div>"
                        }
                // 增加容错 by zhuangjiaqi
                if (node.children && node.children.length) {
                    for(var j = 0, leg = node.children.length; j < leg; j++){
                        var nod=node.children[j];
                        var icon=ArtJS.server.image + nod.icon;
                        var _noName=nod.typeName;
                        str += "<a data-pid='"+nod.id+"' data-sort='2'><tt>"+_noName+"</tt></a>"
                    }
                }
                str +="</div>"
                    +"</li>";
            }
            str +="</ul></div>"
            "</dd>";
        }
        return str;
    },
    setCookie:function(c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    gotoTop: function (min_height,id){
    //预定义返回顶部的html代码，它的css样式默认为不显示
    var gotoTop_html = '<div id="gotoTop">返回顶部</div>';
    $("#"+id).click(//定义返回顶部点击向上滚动的动画
        function(){$('html,body').animate({scrollTop:0},700);
        }).hover(//为返回顶部增加鼠标进入的反馈效果，用添加删除css类实现
        function(){$(this).addClass("hover");},
        function(){$(this).removeClass("hover");
        });
    //获取页面的最小高度，无传入值则默认为600像素  min_height
    //为窗口的scroll事件绑定处理函数
    $(window).scroll(function(){
        //获取窗口的滚动条的垂直位置
        var s = $(window).scrollTop();
        //当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
        if( s > min_height){
            $("#"+id).fadeIn(100);
        }else{
            $("#"+id).fadeOut(200);
        };
    });
},
    ramColor: function() {//随机色
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    }
}