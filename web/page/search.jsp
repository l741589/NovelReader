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
    <%@ include file="/page/style.jsp"%>
</head>
<body>
<style>
    .bookitem{
        height:96px;
        width:100%;
    }
    .bookitem table{
        height:96px;
        width:100%;
    }
    .bookitem table td{
        padding: 0;
    }
    .bookitem table img{
        height:96px;
        width:72px;
    }
    .bookitem table tr.l1{
        height: 32px;
    }
    .bookitem table tr.l2{
        height: 64px;
    }
    .bookitem table td.title{
        font-size: 24px;
        text-overflow: ellipsis;
    }
    .bookitem table td.author{
        text-align: right;
        font-size: 20px;
        text-overflow: ellipsis;
    }
    .bookitem table td.desc{
        font-size: 16px;
        height:64px;
        width: 100%;
        white-space: nowrap;
        max-width:100%;
        text-overflow: ellipsis;
    }
</style>
<table class="root" style="width: 90%;margin: 0 auto">
    <tr style="height: 64px">

    </tr>
    <tr style="height: 32px">
        <td>
            <input id="search" placeholder="输入想要搜索的关键字" style="height: 32px;width: 100%"/>
        </td>
    </tr>
    <tr >
        <td>
            <ul>
                <li class="bookitem">
                    <table cellpadding="0" cellspacing="0">
                        <tr class=".l1">
                            <td rowspan="2">
                                <img src="http://image.cmfu.com/Books/3467820/3467820.jpg"/>
                            </td>
                            <td class="title">标题</td>
                            <td class="author">作者</td>
                        </tr>
                        <tr class=".12">
                            <td colspan="2" class="desc">详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细</td>
                        </tr>
                    </table>
                </li>
            </ul>
        </td>
    </tr>
    <tr style="height:48px;">
        <td></td>
    </tr>
</table>
</body>
</html>
