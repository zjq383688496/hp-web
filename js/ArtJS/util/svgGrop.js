if (typeof svgGop == "undefined") var svgGop = {};
//重组计算svg
svgGop.recombineSvg=function(options){
    var that=this;
    that.options = {
        svg:null,
        panles:null,
        p_w:0,
        p_h:0,
        s_w:0,
        s_h:0,
        bar:0,
        mouseStar:true,
        quality:90,                    //质量
        changeCallback:function(){}
    };
    for (var i in options) {
        that.options[i] = options[i];
    }
    var opt=that.options;
    opt.svg=$("<div>"+opt.svg+"</div>").find("svg");
    if(opt.svg.length<=0){
        return undefined;
    }
    opt.s_w=parseFloat(opt.svg[0].getAttribute("width"));
    opt.s_h=parseFloat(opt.svg[0].getAttribute("height"));

    if(opt.svg[0].getAttribute("data-width")==undefined){
        opt.svg[0].setAttribute("data-width",opt.s_w);
    }
    if(opt.svg[0].getAttribute("data-height")==undefined){
        opt.svg[0].setAttribute("data-height",opt.s_h);
    }
    opt.bar=opt.p_w/opt.s_w;
    opt.svg[0].setAttribute("width",opt.s_w*opt.bar);
    opt.svg[0].setAttribute("height",opt.s_h*opt.bar);
    opt.svg[0].removeAttribute('viewBox');
    
    var randoms=parseInt(Math.random()*10000);
    var cssStr=$("<style type='text/css'>.frame_"+randoms+"{mask:url('"+window.location.href+"#frame_"+randoms+"_mask');}</style>");
    opt.svg[0].setAttribute("data-style",opt.svg.find("defs").html());
    opt.svg.find("defs style").remove();
    opt.svg.find("defs").append(cssStr);
    
    opt.svg.find("*").each(function(){
        var that=this,
            i_w=that.getAttribute("width"),
            i_h=that.getAttribute("height"),
            img_src=that.getAttribute("xlink:href"),
            idStr=that.getAttribute("id");
       
        if(idStr!=null){
            if(idStr.indexOf("frame_") >= 0 && idStr.indexOf("_face")<0 && idStr.indexOf("_mask")<0){
                that.setAttribute("class","frame_"+randoms);
            }else if(idStr.indexOf("_mask")>=0){
                that.setAttribute("data-id",idStr);
                that.setAttribute("id","frame_"+randoms+"_mask");
            }
        }

        if(i_w!=null){
            that.setAttribute("width",i_w*opt.bar);
        }
        if(i_h!=null){
            that.setAttribute("height",i_h*opt.bar);
        }
        if(img_src!=null){
            if(that.getAttribute("data-src")==undefined){
                that.setAttribute("data-src",img_src);
            }else{
                img_src=that.getAttribute("data-src");
            }
            that.setAttribute("xlink:href",img_src+"?imageView2/2/w/"+parseInt(i_w*opt.bar)+"/q/"+opt.quality);
        }

        var transformVar = that.getAttribute("transform");
        
        if(transformVar!=null && transformVar!=undefined && transformVar!=""){
            var prosTrArr=svgGop.processTransform(transformVar);
            var transform='translate(' + (prosTrArr.translateArr[0]*opt.bar) + ',' + (prosTrArr.translateArr[1]*opt.bar) + ')';
            if(transformVar.indexOf('scale')>=0){
                transform+=' scale(' + prosTrArr.scaleArr[0] + ',' + prosTrArr.scaleArr[1] + ')';
            }
            that.setAttributeNS(null, 'transform', transform);
        }
    });
    opt.svg[0].removeAttribute("onload","");
    opt.svg[0].removeAttribute("onmousedown","");
    opt.svg[0].removeAttribute("onmouseup","");
    opt.svg[0].removeAttribute("onmousemove","");
    if(opt.mouseStar){
        opt.svg[0].setAttribute("onclick","svgGop.clicks(evt,this,"+opt.changeCallback+")");
        opt.svg[0].addEventListener("load",function(e){
            svgGop.init(e,this,opt.changeCallback);
            this.removeAttribute("onclick");
        });
    }
    return opt;
}

//反转svg
svgGop.reversalSvg=function(options){
    var that=this;
    that.options = {
        svg:null,
        bar:0
    };
    for (var i in options) {
        that.options[i] = options[i];
    }
    var opt=that.options;
    opt.svg=$("<div>"+opt.svg+"</div>").find("svg");
    if(opt.svg.length<=0){
        return undefined;
    }
    opt.svg[0].removeAttribute("style");
    var s_w=parseFloat(opt.svg[0].getAttribute("width"));
    var s_h=parseFloat(opt.svg[0].getAttribute("height"));
    var p_w=parseFloat(opt.svg[0].getAttribute("data-width"));
    var p_h=parseFloat(opt.svg[0].getAttribute("data-height"));
    opt.bar=p_w/s_w;
    opt.svg[0].setAttribute("width",p_w);
    opt.svg[0].setAttribute("height",p_h);

    opt.svg.find("defs style").remove();
    opt.svg.find("defs").append(opt.svg[0].getAttribute("data-style"));
    opt.svg.find("*").each(function(){
        var that=this,
            i_w=that.getAttribute("width"),
            i_h=that.getAttribute("height"),
            img_src=that.getAttribute("xlink:href"),
            idStr=that.getAttribute("id");
       
        if(idStr!=null){
            if(idStr.indexOf("frame_") >= 0 && idStr.indexOf("_face")<0 && idStr.indexOf("_mask")<0){
                that.removeAttribute("class");
            }else if(idStr.indexOf("_mask")>=0){
                that.setAttribute("id",that.getAttribute("data-id"));
            }
            that.removeAttribute("data-id");
        }
        
        if(i_w!=null){
            that.setAttribute("width",i_w*opt.bar);
        }
        if(i_h!=null){
            that.setAttribute("height",i_h*opt.bar);
        }
        if(img_src!=null){
            that.setAttribute("xlink:href",that.getAttribute("data-src"));
            that.removeAttribute("data-src");
        }
        var transformVar = that.getAttribute("transform");
        
        if(transformVar!=null && transformVar!=undefined && transformVar!=""){
            var prosTrArr=svgGop.processTransform(transformVar);
            var transform='translate(' + (prosTrArr.translateArr[0]*opt.bar) + ',' + (prosTrArr.translateArr[1]*opt.bar) + ')';

            if(transformVar.indexOf('scale')>=0){
                transform+=' scale(' + prosTrArr.scaleArr[0] + ',' + prosTrArr.scaleArr[1] + ')';
            }
            that.setAttributeNS(null, 'transform', transform);
        }
        that.removeAttribute("style");
        that.removeAttribute("pointer-events");
    });
    opt.svg[0].removeAttribute("onclick");
    opt.svg[0].removeAttribute("data-style");
    opt.svg[0].removeAttribute("data-width");
    opt.svg[0].removeAttribute("data-height");
    opt.svg=$("<div/>").append(opt.svg).html();
    return opt.svg;
}

svgGop.clicks=function(evt, t ,changeCallback) {
    svgGop.init(evt,t,changeCallback);
    t.removeAttribute("onclick");
}
//svg初始化方法
svgGop.init=function(evt, t ,changeCallback) {
    var SVGRoot = t;
    var DragTarget=null;
    var TrueCoords = SVGRoot.createSVGPoint();
    var GrabPoint = SVGRoot.createSVGPoint();
    var SourcePoint = SVGRoot.createSVGPoint();
    var face="";

    $(SVGRoot).find("*").each(function(){
        var that=this,
            idStr=that.getAttribute("id");
       
        if(idStr!=null){
            if(idStr.indexOf("_face")>=0){
                face=$(that).find("image")[0];
            }
        }
    });

    var grabx = null;
    var graby = null;

    var mouseStar=false;
    var prosTrArr;
    var transformVar;
    SVGRoot.addEventListener("mousedown",function(e){
        grabx=e.pageX;
        graby=e.pageY;
        transformVar = face.getAttribute("transform");
        face.setAttributeNS(null, 'style', 'cursor:move');
        if(transformVar==null){
            transformVar="translate(0,0)";
        }
        prosTrArr = svgGop.processTransform(transformVar);
        mouseStar=true;
    }, false);
    SVGRoot.addEventListener("mouseup",function(e){
        mouseStar=false;
    }, false);

    $("body").mousemove(function(e){
        e.preventDefault();
    });
    SVGRoot.addEventListener("mousemove",function(e){
        if (e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnvalue = false;
        }
        if(mouseStar){
            var newX = (e.pageX - grabx + Number(prosTrArr.translateArr[0]));
            var newY = (e.pageY - graby +Number(prosTrArr.translateArr[1]));
            var transform='translate(' + newX + ',' + newY + ')';
            if(transform==null){
                return;
            }
            if(transformVar.indexOf('scale')>=0){
                transform+=' scale(' + prosTrArr.scaleArr[0] + ',' + prosTrArr.scaleArr[1] + ')';
            }
            face.setAttributeNS(null, 'transform', transform);
            if(changeCallback) changeCallback(face);
        }
    }, false);
}
svgGop.processTransform=function(transform) {
    var translateArrStar = [0,0],
        scaleArrStar = [0,0];
    if (null != transform && undefined != transform) {
        var transformArr = transform.split(" ")
        if (transformArr.length == 1) {
            if (transformArr[0].indexOf("translate") != -1) {
                translateArrStar = svgGop.processTranslate(transformArr[0]);
                scaleArrStar = [1, 1];
            }
            if (transformArr[0].indexOf("scale") != -1) {
                translateArrStar = [0, 0];
                scaleArrStar = svgGop.processScale(transformArr[0]);
            }
        } else if (transformArr.length == 2) {
            if (transformArr[0].indexOf("translate") != -1) {
                translateArrStar = svgGop.processTranslate(transformArr[0]);
                scaleArrStar = svgGop.processScale(transformArr[1]);
            } else {
                translateArrStar = svgGop.processTranslate(transformArr[1]);
                scaleArrStar = svgGop.processScale(transformArr[0]);
            }
        }
        
    } else {
        translateArrStar = [0, 0];
        scaleArrStar = [1, 1];
    }
    return {
        translateArr: translateArrStar,
        scaleArr: scaleArrStar
    }
}
svgGop.processTranslate=function(translate) {
    if (null != translate && undefined != translate) {
        translate = translate.replace("translate(", "");
        translate = translate.replace(")", "");
        var transform = translate.split(",");
        return transform;
    }
    return [0, 0];
}
svgGop.processScale=function(scale) {
    if (null != scale && undefined != scale) {
        scale = scale.replace("scale(", "");
        scale = scale.replace(")", "");
        var tempScaleArr = scale.split(",");
        return tempScaleArr;
    }
    return [1, 1];
}