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

    #LoginPanel[status="0"] .cc{
        display: none;
    }
    #LoginPanel[status="1"] .id,#LoginPanel[status="1"] .pw{
        display: none;
    }
</style>
<span id="LoginPanelEntry">点击登录</span>
<table id="LoginPanelMask" class="hide">
    <tr>
        <td style="text-align: center">
            <table id="LoginPanel" status="0">
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
                    <td><input type="button" value="登录"></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<script>
    $(document).ready(function () {
        var p=$("#LoginPanel");

        function handleResponse(d){
            p.removeAttr("disabled");
            if (d.code==0){
                window.location.reload();
                p.attr("status",0);
            }else if (d.code==8){
                p.attr("status",1);
                p.find(".cc img").attr("src", d.url+"&x="+Math.random())
            }else{
                p.find(".title td").text(d.msg);
                p.attr("status",0);
            }

        }

        p.find(".submit input").click(function(){
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
        })

        $("#LoginPanelEntry").click(function(){
            $("#LoginPanelMask").removeClass("hide");
        })

        $.get("/js/ajax/getUserInfo.do",function(d){
            $("#LoginPanelEntry").text(d.IsSuccess? d.ReturnString:"点击登录");
        })
    });
</script>
