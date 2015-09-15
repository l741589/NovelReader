<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-22
  Time: 13:19
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="/piece/meta.jsp"%>
    <title>大钊的主页</title>
    <script src="/js/jquery-2.1.4.min.js"></script>
    <link type="text/css" rel="stylesheet" href="/css/home.css"/>
</head>
<body>
    <table id="root">
        <tr>
            <td class="title"><h1>大钊的主页</h1></td>
        </tr>
        <tr>
            <td class="col">
                <p>鹅加密</p>
            </td>
            <td class="col">
                <p>我的库</p>
            </td>
            <td class="col"><a href="/js/search.do">
                <p>小说阅读</p></a>
            </td>
        </tr>

    </table>
</body>
</html>
