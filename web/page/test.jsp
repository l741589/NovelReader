<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-23
  Time: 15:51
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>test</title>
    <meta http-equiv="Content-Type" content="text/html; charset=${charset}">
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
    <script src="/js/jquery-2.1.4.min.js"></script>
</head>
<body>
    <p style="width: 100%">
        <c:out value="${data}"/>
    </p>
</body>
</html>
