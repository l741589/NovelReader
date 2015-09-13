<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-29
  Time: 16:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="/piece/meta.jsp"%>
    <title>${BookName}-${Author}|Z读</title>
    <%@include file="/piece/style.jsp"%>
    <script src="/js/jquery-2.1.4.min.js"></script>
    <script src="/js/ListManager.js"></script>
</head>
<body>
    <table cellspacing="0" cellpadding="0" class="match_parent" style="width: 90%;margin: 0 auto">
        <tr style="height: 64px;">
            <td>
                <%@include file="/piece/ActionBar.jsp"%>
            </td>
        </tr>
        <tr>
            <td>
                <style scoped>
                    .listitem{
                        height: 48px;
                        background-color: white;
                        color: black;
                    }
                    .listitem:active{
                        height: 48px;
                        background-color: black;
                        color: white;
                    }
                    .listitem.vol{
                        background-color: lightgray;
                        text-align: center;
                        color: black;
                    }
                    .listitem span{
                        height:48px;
                        line-height:48px;
                        overflow:hidden;
                        text-overflow: ellipsis;
                        display: inline-block;
                    }
                </style>
                <ul  class="match_parent" id="list" itemheight="48">

                </ul>
            </td>
        </tr>
        <tr style="height: 64px;">
            <td><%@include file="/piece/pager.jsp"%></td>
        </tr>
    </table>
    <script>
        ACTIONBAR.TITLE="${BookName}-${Author}";
        $(document).ready(function(){
            var ch=${Chapters};
            var vl_=${Volumes};
            var vl={};
            vl_.forEach(function(e){e.ch=[];vl[e.VolumeCode]= e; });
            ch.forEach(function(e){ vl[e.vc].ch.push(e);});
            var data=[];
            for (var i in vl){
                var e=vl[i];
                e.listItemType=1;
                data.push(e);
                e.ch.forEach(function(f){
                    f.listItemType=0;
                    data.push(f);
                });
            }
           var lm=new ListManager(data,["/piece/content_list_item.html","/piece/content_list_item.html"],function(node,d){
               if (d.listItemType==0) {
                   node.find(".title").text(d.n);
                   node.click(function(){window.location.href="/js/chapter.do?bid=${param.BookId}&cid="+ d.c});
               }else{
                   node.find(".title").text(d.VolumeName);
                   node.addClass("vol");
               }
           });
        });
    </script>
</body>
</html>
