<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-9-4
  Time: 17:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style scoped>
    #LoginPanelMask {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }

    #LoginPanel {
        display: inline-block;
        border: 4px black solid;
        border-radius: 4px;
        background-color: white;
    }

    #LoginPanelEntry{
        font-size: 20px;
        text-decoration:underline;
    }
</style>
<span id="LoginPanelEntry">点击登录</span>
<table id="LoginPanelMask" class="hide">
    <tr>
        <td style="text-align: center">
            <table id="LoginPanel">
                <tr class="title">
                    <td>登录起点</td>
                </tr>
                <tr class="id">
                    <td><input placeholder="账号"></td>
                </tr>
                <tr class="pw">
                    <td><input placeholder="密码" type="password"></td>
                </tr>
                <tr class="cc">
                    <td><img alt="验证码"></td>
                </tr>
                <tr class="cc">
                    <td><input placeholder="验证码"></td>
                </tr>
                <tr class="submit" style="text-align: center">
                    <td>
                        <input class="login" type="button" value="登录">
                        <input class="cancel"type="button" value="取消">
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<script>
    $(document).ready(function () {
        var p=$("#LoginPanel");

        function setStatus(status){
            p.attr("status",status);
            if (status==0){
                p.find(".cc").addClass("hide");
                p.find(".pw").removeClass("hide");
                p.find(".id").removeClass("hide");
                p.find(".title td").text("登录起点");
            }else{
                p.find(".cc").removeClass("hide");
                p.find(".pw").addClass("hide");
                p.find(".id").addClass("hide");
                p.find(".title td").text("请输入验证码");
            }
        }

        setStatus(0);

        function handleResponse(d){
            p.removeAttr("disabled");
            if (d.code==0){
                window.location.reload();
                p.addClass("hide");
                setStatus(0);
            }else if (d.code==8){
                setStatus(1);
                p.find(".cc img").attr("src", d.url+"&x="+Math.random())
            }else{
                setStatus(0);
                p.find(".title td").text(d.msg);

            }

        }
        p.find(".submit input.cancel").mousedown(function(){
            $("#LoginPanelMask").addClass("hide");
            setStatus(0);
        });

        p.find(".submit input.login").mousedown(function(){
            if (p.attr("status")=="0"){
                $.post("/js/ajax/login.do",{
                    id: p.find(".id input").val(),
                    pw: p.find(".pw input").val()
                },handleResponse);
                p.attr("disabled","disabled");
            }else{
                $.post("/js/ajax/checkCodeLogin.do",{
                    code: p.find(".cc input").val()
                },handleResponse);
            }
        });

        $("#LoginPanelEntry").mousedown(function(){
            $("#LoginPanelMask").removeClass("hide");
        });

        $.get("/js/ajax/getUserInfo.do",function(d){
            $("#LoginPanelEntry").text(d.code==0? d.name:"点击登录");
        })
    });
</script>
