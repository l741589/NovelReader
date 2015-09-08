<%--
  Created by IntelliJ IDEA.
  User: yangzhao.lyz
  Date: 2015/9/6
  Time: 11:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@include file="/piece/meta.jsp"%>
    <title>${username}-最近阅读|Z读</title>
    <%@include file="/piece/style.jsp"%>
    <script src="/js/jquery-2.1.4.min.js"></script>
</head>
<body style="position: fixed;left: 5%;width: 90%;height: 100%">
    <style scoped>
        #title{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 24px;
            height: 48px;
            line-height: 48px;
        }
        #list{
            position: absolute;
            bottom: 64px;
            top: 48px;
            width: 100%
        }

        #list li{
            height: 64px;
            width: 100%;;
            position: relative;
            border-bottom: 1px black solid;
        }

        #list li span{
            position: absolute;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        #list li span.bname{
            height: 24px;
            line-height: 24px;
            width: 100%;
            bottom: 5px;
            text-align: right;
            font-size: 20px;
        }
        #list li span.cname{
            width: 100%;
            top: 5px;
            text-align: left;
            font-size: 28px;
            height: 32px;
            line-height: 32px;
        }
    </style>
    <span id="title">${username}-最近阅读</span>
    <hr>

    <ul id="list" itemheight="64">

    </ul>
    <div style="height: 64px;position: absolute;bottom: 0;width: 100%">
        <%@include file="/piece/pager.jsp"%>
    </div>
    <script src="/js/ListManager.js"></script>

    <script>
        $(document).ready(function(){
            var lm=new ListManager(${data},"/piece/recent_list_item.html",function(n,d){
                n.mousedown(function(){
                    window.location.href="/js/chapter.do?bid="+ d.bid+"&cid="+ d.cid;
                });
                n.find(".cname").text(d.cn);
                n.find(".bname").text(d.bn);
            });
        })
    </script>
</body>
</html>
