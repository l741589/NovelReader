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
    <title>${BookName}-${Author}|Z读</title>
    <%@include file="/piece/style.jsp"%>
    <script src="/js/jquery-2.1.4.min.js"></script>
    <script src="/js/ListManager.js"></script>
</head>
<body>
    <table cellspacing="0" cellpadding="0" class="match_parent" style="width: 90%;margin: 0 auto">
        <tr style="height: 64px;">
            <td>
                <style scoped>
                    #header{
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                    #header span{
                        height:64px;
                        line-height:64px;
                        display:inline-block;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space:nowrap;
                        font-size: 28px;
                        position: absolute;
                        right: 100px;
                        left: 0;
                    }
                    #header a{
                        height:64px;
                        line-height:64px;
                        white-space:nowrap;
                        display:inline-block;
                        font-size: 20px;
                        position: absolute;
                        right: 0;
                    }
                    #header hr{
                        position: absolute;
                        width: 100%;
                        bottom: 2px;
                    }
                </style>
                <div id="header">
                    <span>${BookName}-${Author}</span>
                    <a href="/js/search.do?keyword=${BookName}">回到主页</a>
                    <hr>
                </div>
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
