<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-22
  Time: 22:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Z读</title>
    <meta name="viewport" content="width=640"/>
    <script src="/js/jquery-2.1.4.min.js"></script>
    <%@ include file="/page/style.jsp"%>
</head>
<body>
    <style type="text/css" scoped>
    .bookitem{
        height:112px;
        width:100%;
    }
    .bookitem table{
        table-layout: fixed;
        height:112px;
        width:100%;
        padding-top: 8px;
        padding-bottom: 8px;
        border-top:black 1px solid;
    }
    .bookitem table td{
        padding: 0;
    }
    .bookitem table img{
        height:100%;;
        width:72px;
    }
    .bookitem table td{
        overflow: hidden;
    }
    .bookitem table tr.l1{
        height: 32px;
    }
    .bookitem table tr.l2{
        height: 64px;
    }
    .bookitem table td.img{
        width: 80px;
        height: 96px;
        align-content: flex-start;
    }
    .bookitem table td.title{
        height: 100%;
        width: 100%;
        font-size: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .bookitem table td.author{
        text-align: right;
        font-size: 20px;
        height: 100%;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .bookitem table td.desc p{
        font-size: 16px;
        height:64px;
        width: 100%;
        text-overflow: ellipsis;
    }

        #pager input{
            height:100%;
            width:100%;
        }
    </style>

    <table class="root" style="width: 90%;margin: 0 auto">
        <tr style="height: 64px">

        </tr>
        <tr style="height: 48px">
            <td colspan="2">
                <input id="search" placeholder="输入想要搜索的关键字" style="height: 48px;width: 100%;font-size: 24px"/>
            </td>
        </tr>
        <tr >
            <td colspan="2">
                <ul class="match_parent" id="list" itemheight="112">

                </ul>
            </td>
        </tr>
        <tr style="height:48px;" id="pager">
            <td><input type="button" value="上一页" class="prev"/></td>
            <td><input type="button" value="下一页" class="next"/></td>
        </tr>
    </table>
    <script src="/js/ListManager.js"></script>
    <script>
        $(document).ready(function(){
            var lm=new ListManager(${data},"/piece/search_list_item.html",function(node,d){
                node.find(".desc p").text(d.Description);
                node.find(".author").text(d.Author);
                node.find(".title").text(d.BookName);
                node.find("img").attr("src","http://image.cmfu.com/Books/"+ d.BookId+"/"+ d.BookId+".jpg");
                node.find("img").attr("onerror","this.src='http://image.cmfu.com/Books/1.jpg'");
            });
            lm.autoAppend(window.location.href.replace("/js","/js/ajax")+"&page=");
        });
    </script>
</body>
</html>
