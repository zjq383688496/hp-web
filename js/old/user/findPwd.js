/**
 * Created by Administrator on 2015/10/20.
 */
$(function() {

    var subString = SubString;

    var one = $("#step_one");
    var tow = $("#step_tow");
    var three = $("#step_three");

    //定义定时器
    var timing;

    //每1秒该值增加1
    var seed=300;

    tow.hide();
    three.hide();
    var varCode;

    //发送
    $('#send').click(function() {
        if (!checkEmail())  return;
        var params = {
            'email':$('#email').val()
        };

        $.post('/memberSite/members/sendMail',params,function(rs){
            var data = rs;
            if (data.code == 200) {
                $('#send').attr("disabled","true");
                $('#send').css({
                    "background":"#999"
                });
                $("#send").hide();
                $("#next_step").show();
                $("#mobilePhone").removeAttr("disabled");
                $("#mPsw,#oldPsw").removeAttr("disabled");
                /*$("#check_success_div").show();
                $("#time_i").val("300秒");
                timing=window.setInterval(oneSecond,1000);*/
            }else {
                alert(data.message);
            }
        })
    });
    $('#next_step').click(function() {
        var par= {
            'email':$('#email').val(),
            'code':$('#mobilePhone').val(),
            'password':$('#mPsw').val(),
            'oldPassword':$('#oldPsw').val()
        };
        $.post('/memberSite/members/editPassword',par,function(rs){
            var data = rs;
            if (data.code == 200) {
                $("#step_one").hide();
                $("#mobilePhone").removeAttr("disabled");
                $('#step_three').show();
                location.href=ArtJS.server.art+"memberSite/sso/logOut";
                //ArtJS.login.pop();
            }
        })
    });
    function oneSecond(){
        if(seed<1){
            seed=300;
            $("#send").removeAttr("disabled");
            $("#send").val(labes.send_cx);
            window.clearInterval(timing);
            return ;
        }
        seed=seed-1;
        $("#time_i").html(seed+"秒");

    }

    $("#login_email").click(
        function() {
            window.open("http://mail."+ $('#email').val().substring($('#email').val().indexOf('@') + 1,$('#email').val().length), "_blank");
        });


    function checkEmail() {
        if($('#email').val()==""){
            $('#email_check_error').hide();
            $('#email_check_success').show();
            return false;
        }
        if ($('#email').val().indexOf('@') != -1 && $('#email').val().indexOf('.') != -1) {
            $('#email_check_error').hide();
            $('#email_check_success').hide();
            return true;
        }
    }

    //邮箱失去焦点事件
    $('#email').blur(function(){
        $('#email_check_success').hide();
        $('#email_check_error').show();
        $('#email_check_no').hide();
        checkEmail();
    });
    //邮箱得到焦点事件
    $('#email').focus(function(){
        $('#email_check_error').hide();
        $('#email_check_no').hide();
        var len = $.trim($('#email').val()).length;
        if (len > 0) {
            return;
        }
        $('#email_check_success').show();
    });
    //下一步
    /*$('#next_step').click(function(){
        if($("#mobilePhone").val()==""){
            $("#TipVarCode").show();
            return false;
        }
        var params = {'user.email':$('#email').val(),'varCode':$('#mobilePhone').val()};
        $.post("/member/authenticateValidateCode.ct",params,function(rs){
            var dataResult=eval("(" + rs + ")");
            if(dataResult.code==200){
                one.hide();
                tow.show();
            }else{
                $("#f_red").show();
                $("#strVarCode").show();
                $("#TipVarCode").hide();
                $("#successVarCode").hide();
            }
        });
    });*/

    //验证码失去焦点事件
    $("#mobilePhone").blur(function(){
        $("#TipVarCode").hide();
        $("#successVarCode").hide();
        $("#strVarCode").hide();
//		checkvVarCode();
    });

    //验证码得到焦点事件
    $("#mobilePhone").focus(function(){
        var len = $.trim($('#mobilePhone').val()).length;
        if (len > 0) {
            return;
        }
        $("#TipVarCode").show();
        $("#strVarCode").hide();
        $("#successVarCode").hide();
    });

    //校验验证码
    function checkvVarCode(){
        var strVarCode = $("#mobilePhone").val();
        if ($.trim(varCode) == $.trim($('#mobilePhone').val())) {
            $("#strVarCode").hide();
            $("#TipVarCode").hide();
            $("#successVarCode").show();
            return true;
        }else{
            $("#strVarCode").show();
            $("#TipVarCode").hide();
            $("#successVarCode").hide();
            return false;
        }
    }

    //var pwdObj=$("#password");
    var pwdObj=$("#mPsw");
    var affirmObj=$("#affirm");
    //（密码6-20位 区分大小写）
    //(6-20位，可包含字母、数字。)
    pwdObj.focus(function () {
        $("#strPassword").hide();
        $("#TipPassword").show();
        pwdObj.keyup();
    })
    pwdObj.blur(function () {
        $("#TipPassword").hide();
        checkPwd();
    });

    //确定密码
    affirmObj.focus(function () {
        $("#strAffirmPassword").hide();
        $("#TipAffirmPassword").show();
    })
    affirmObj.blur(function () {
        $("#TipAffirmPassword").hide();
        checkAfPwd();
    });
    //检查确定密码
    function checkAfPwd(){
        var checkAfPwdRes=false;
        if(affirmObj.val()!=pwdObj.val()){
            $("#strAffirmPassword").show();
            checkAfPwdRes=false;
        }else{
            checkAfPwdRes=true;
        }
        return checkAfPwdRes;
    }

    //检查密码是否合法
    function checkPwd() {
        var checkPwdRes=false;
        var pwd = pwdObj.val(),
            lens = subString.byteLen(pwd);
        if (lens == 0) {
            checkPwdRes=false;
            $("#strPassword").show();
        } else {
            if (!testPwd(pwd)) {
                $("#TipPassword").hide();
                $("#strPassword").show();
                $("#password_level_div").hide();
                checkPwdRes=false;
            } else {
                checkPwdRes=true;
            }
        }
        return checkPwdRes;
    }

    //检查密码安全性
    pwdObj.keyup(function () {
        var val = pwdObj.val();
        var rp = Rate;
        var sc = 0;
        var level_span=$("#password_level_span");
        var level_text=$("#password_level_text");
        if (val.length < 21) {
            var scores = rp.RatePasswd(val);
            if (scores < 0) {
                $("#password_level_div").hide();
                $("#TipPassword").show();
            }
            else if (scores < 35) {
                sc = 0;
                $("#password_level_div").show();
                $("#TipPassword").hide();
                level_text.text("弱");
                level_span.css("background-color","red");
                level_span.css("width",scores+"%");
            }
            else if (scores < 60) {
                sc = 1;
                $("#password_level_div").show();
                $("#TipPassword").hide();
                level_text.text("中");
                level_span.css("background-color","green");
                level_span.css("width",scores+"%");
            }
            else if (scores >= 60) {
                sc = 2;
                $("#password_level_div").show();
                $("#TipPassword").hide();
                level_text.text("强");
                level_span.css("background-color","green");
                level_span.css("width",scores+"%");
            }

        }
    })

    //判断密码
    function testPwd(str) {
        var reg = /^[\a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\-\+\=\`\~\:\,\<\.\>\/\?\[\]\{\}\|]{6,20}$/;
        if (reg.test(str)) {
            return true;
        }
        return false;
    }

    //修改修改密码按钮
    $("#update_botton").click(function(){
        if(checkPwd()){
            if(checkAfPwd()){
                var updateData={
                    password:$("#email").val(),
                    password:$("#password").val(),
                    password:$("#mobilePhone").val()
                };
                $.post('/memberSite/members/editPass',updateData,function(updateResult){
                    var dataUpdateResult=eval("(" + updateResult + ")");
                    if(dataUpdateResult.code==200){
                        tow.hide();
                        three.show();
                    }else{
                        $.messager.alert('系统提示', '重设密码失败,请重试!', 'error');
                    }
                });
            }
        }
    });

    //回到首页
    $("#back_home_button").click(function(){
        location.href='/';
    })

})