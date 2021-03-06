<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-9-4
  Time: 17:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style scoped>
    #LoginPanelEntry{
        font-size: 20px;
        text-decoration:underline;
    }
</style>
<table id="LoginPanelMask" class="hide mask">
    <tr>
        <td style="text-align: center">
            <table id="LoginPanel" class="dialog">
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
        var guid;
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
                p.find(".cc img").attr("src", d.url)
                guid= d.guid;
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
                    code: p.find(".cc input").val(),
                    guid:guid
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
