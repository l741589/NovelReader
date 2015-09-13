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
        border:0;
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
    #ActionBar .popup{
        position: absolute;
        top:48px;
        right: 0;
        background-color: white;
        border: 4px black solid;
    }
    #ActionBar .popup li{
        height: 48px;
        line-height: 48px;
        color: black;
        font-size: 24px;
        padding-left: 16px;
        padding-right: 16px;
    }

    #ActionBar .popup li input{
        border:0;
        width: 100%;
        height: 100%;
    }

    #ActionBar .popup li:active{
        color: white;
        background: black;
    }
</style>
<div id="ActionBar">
    <input type="button" class="back hide" onmousedown="javascript:window.location.href='${__back}'">
    <span class="title"></span>
    <input class="menu hide" type="button">
    <li class="popup hide"></li>
</div>
<script>
    ACTIONBAR={
        TITLE:"${title}",
        MENU:${menu},
        BACK:"${__back}"
    };

    $(document).ready(function(){
        var bar=$("#ActionBar");
        bar.find(".title").text(ACTIONBAR.TITLE);
        if (ACTIONBAR.BACK) bar.find(".back").removeClass("hide");
        if (ACTIONBAR.MENU&&ACTIONBAR.MENU.length) {
            var menu=bar.find(".menu");
            var popup=bar.find(".popup");
            menu.removeClass("hide");
            menu.mousedown(function(){
                if (popup.hasClass("hide")) popup.removeClass("hide");
                else popup.addClass("hide");
            });
            ACTIONBAR.MENU.forEach(function(e){
                var li="<li>"+e.name+"</li>";
                var $li=$(li)
                popup.append($li);
                $li.mousedown(function(){
                    e.action($li);
                    popup.addClass("hide");
                });
            });
        }
    })
</script>
