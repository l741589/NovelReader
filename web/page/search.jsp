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
</style>
<table class="root" style="width: 90%;margin: 0 auto">
    <tr style="height: 64px">

    </tr>
    <tr style="height: 48px">
        <td>
            <input id="search" placeholder="输入想要搜索的关键字" style="height: 48px;width: 100%"/>
        </td>
    </tr>
    <tr >
        <td>
            <ul>
                <li class="bookitem">
                    <table cellpadding="0" cellspacing="0">
                        <tr class=".l1" height="32px">
                            <td rowspan="2" class="img">
                                <img src="http://image.cmfu.com/Books/3467820/3467820.jpg"/>
                            </td>
                            <td class="title">标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</td>
                            <td class="author">作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者</td>
                        </tr>
                        <tr class=".12">
                            <td colspan="2" class="desc" height="64px"><p>详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细详细</p></td>
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
