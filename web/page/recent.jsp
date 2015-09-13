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
<body style="position: fixed;height: 100%">
    <style scoped>
        #list{
            position: absolute;
            bottom: 64px;
            top: 48px;
            right: 32px;
            left:32px;
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
            text-align: left;
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
        #list li span.aname{
            height: 20px;
            line-height: 20px;
            width: 100%;
            bottom: 5px;
            text-align: right;
            font-size: 16px;
        }
        #list li input{
            position: absolute;
            right:0;
            top:8px;
            height:28px;
            font-size: 14px;
            line-height: 28px;
            border-width: 1px;
            border-radius: 4px;
            padding-top: 0;
        }
    </style>
    <%@include file="/piece/ActionBar.jsp"%>

    <ul id="list" itemheight="64">

    </ul>
    <div style="height: 64px;position: absolute;bottom: 0;left: 32px;right: 32px">
        <%@include file="/piece/pager.jsp"%>
    </div>
    <script src="/js/ListManager.js"></script>

    <script>
        ACTIONBAR.TITLE="${username}-最近阅读";
        $(document).ready(function(){
            var lm=new ListManager(${data},"/piece/recent_list_item.html",function(n,d){
                n.mousedown(function(){
                    window.location.href="/js/chapter.do?bid="+ d.bid+"&cid="+ d.cid;
                });
                n.find(".aname").text(d.an);
                n.find(".bname").text(d.bn);
                n.find(".cname").text(d.cn);
                n.find("input").mousedown(function(){
                    $.get("/js/ajax/del_recent.do?bid="+ d.bid,function(d){
                        if (d.code===0) window.location.reload();
                    });
                    return false;
                });
            });
        })
    </script>
</body>
</html>
