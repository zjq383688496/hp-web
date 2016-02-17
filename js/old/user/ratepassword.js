/**
 * Created by Administrator on 2015/10/20.
 */

Rate={

    RatePasswd:function (passwd, config){
        var self = this;
        config = {
            'minLen': 6 // 密码最小长度
        };
        //判断密码强度
        var len = passwd.length, scores;
        if(len >= config.minLen){
            scores = checkStrong(passwd);
        }else if(len > 0){
            scores = 0;
        }else{
            scores = -1;
        }
        return scores/4*100;
        //计算出当前密码当中一共有多少种模式
        function bitTotal(num){
            var modes = 0;
            for(var i = 0;i < 4;i++){
                if(num & 1){modes++;}
                num >>>= 1;
            }
            return modes;
        }
        //字符类型
        function charMode(content){
            if(content >= 48 && content <= 57){ // 0-9
                return 1;
            }else if(content >= 65 && content <= 90){ // A-Z
                return 2;
            }else if(content >= 97 && content <= 122){ // a-z
                return 4;
            }else{ // 其它
                return 8;
            }
        }
        //密码强度
        function checkStrong(content){
            var modes = 0, len = content.length;
            if(len < config.minChar){
                return modes;
            }
            for(var i = 0;i < len; i++){
                modes |= charMode(content.charCodeAt(i));
            }
            return bitTotal(modes);
        }
    }
};

var SubString = {

    byteLen: function(c) {
        for (var d = 0,
                 a = 0,
                 b = c.length,
                 e; a < b; a++) {
            e = c.charCodeAt(a);
            d += e > 127 ? 2 : 1
        }
        return d
    },
    subStr: function(c, d, a) {
        var b = 0,
            e = 0,
            f, g = "",
            h = c.length;
        f = this.byteLen(c);
        if (d < 0) d = f + d;
        if (a < 0 || !i.isNumber(a)) a = ~~a + f;
        else a += d;
        for (; b < h; b++) {
            if (e >= d) break;
            f = c.charCodeAt(b);
            e += f > 127 ? 2 : 1
        }
        for (; b < h; b++) {
            f = c.charCodeAt(b);
            e += f > 127 ? 2 : 1;
            if (e > a) break;
            g += c.charAt(b)
        }
        return g
    }
};
