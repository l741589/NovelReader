<%--
  Created by IntelliJ IDEA.
  User: yangzhao.lyz
  Date: 2015/9/11
  Time: 15:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style scoped>
    #ActionBar{
        position: absolute;
        border-bottom: 4px black solid;
        height:48px;
        top:0;
        left: 0;
        width: 100%;
    }
    #ActionBar .menu{
        position: absolute;
        right: 0;
        top:8px;
        height: 32px;
        width: 40px;
        background: url("/img/menu.png") no-repeat center;
        background-size: contain;
        border-left: 1px black solid;
    }
    #ActionBar .menu:active{
        background-color: black;
    }
    #ActionBar .back{
        border: 0;
        position: absolute;
        left: 0;
        top:8px;
        height: 32px;
        width: 40px;
        background: url("/img/back.png") no-repeat center;
        background-size: contain;
        border-right: 1px black solid;
    }
    #ActionBar .back:active{
        background-color: black;
    }
    #ActionBar .title{
        position: absolute;
        font-size: 20px;
        left: 48px;
        right: 48px;
        height: 48px;
        line-height: 48px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
<div id="ActionBar">
    <input type="button" class="back" onmousedown="javascript:window.location.href='${__back}'">
    <span class="title"></span>
    <div class="menu"></div>
</div>
<script>
    TITLE="${title}";
    MENU=${menu};
    BACK="${__back}"
    $(document).ready(function(){
        var bar=$("#ActionBar");
        bar.find(".title").text(TITLE);
        if (!BACK) bar.find(".back").addClass("hide");
        if (!(MENU&&MENU.length)) bar.find(".menu").addClass("hide");
    })
</script>
