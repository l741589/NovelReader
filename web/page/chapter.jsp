<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-30
  Time: 13:20
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="/piece/meta.jsp"%>
    <title>${title}-${bookname}-${author}|Z读</title>
    <%@include file="/piece/style.jsp"%>
</head>
<body style="width: 90%;margin: 0 auto">
    <style scoped>
        .nav{
            position: relative;
            width: 100%;
            height: 64px
        }
        .nav a{
            position: absolute;
            top: 8px;
            bottom: 8px;
            font-size: 20px;
            text-align: center;
            line-height: 40px;
        }
    </style>
    <div style="padding-top:8px">
        <span style="font-size: 48px;margin-top: 8px;margin-bottom: 8px">${title}</span>
        <hr>
    </div>
    <div class="nav">
        <a class="input" style="width: 33%;left: 0" href="?bid=${param.bid}&cid=${prev}">上一章</a>
        <a class="input" style="left: 33%;right: 33%" href="/js/content.do?BookId=${param.bid}">目录</a>
        <a class="input" style="width: 33%;right: 0" href="?bid=${param.bid}&cid=${next}">下一章</a>
    </div>
    <div>
        <style scoped>
            img {
                max-width: 100%;
            }
            pre{
                font-size: 32px;
                word-break: break-all;
                word-wrap: break-word;
                white-space: pre-wrap;
            }
        </style>
        <pre style="width: 100%">${text}</pre>
    </div>
    <div class="nav">
        <a class="input" style="width: 33%;left: 0" href="?bid=${param.bid}&cid=${prev}">上一章</a>
        <a class="input" style="left: 33%;right: 33%" href="/js/content.do?BookId=${param.bid}">目录</a>
        <a class="input" style="width: 33%;right: 0" href="?bid=${param.bid}&cid=${next}">下一章</a>
    </div>
    <div id="smalltitle" style="position: fixed;width: 16px;word-break: break-all;word-wrap: break-word;top: 0;left: 0">
        ${title}
    </div>
    <%@include file="/piece/ProgressBar.jsp"%>
    <script>
        ProgressBar.onScroll=function(per){
            console.log("per:"+per);
            if (per<0.01) document.getElementById("smalltitle").className="hide";
            else document.getElementById("smalltitle").className="";
        }
    </script>
</body>
</html>
