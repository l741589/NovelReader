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
    <script src="/js/jquery-2.1.4.min.js"></script>
    <script src="/js/jquery.cookie.js"></script>
</head>
<body>
    <style scoped>
        body{
            background-color: #ffffff;
        }
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

        #title{
            margin-top: 8px;
            font-size: 48px;
        }
        #clock{
            font-size: 16px;
            position: fixed;
            right: 0;
            bottom: 0;
        }

        #contentBox{
            position: fixed;
            top:52px;
            bottom: 0;
            left:32px;
            right: 32px;
            overflow-y: scroll;
        }
        ::-webkit-scrollbar{width: 0}
    </style>
    <div style="height: 64px">
        <%@include file="/piece/ActionBar.jsp"%>
    </div>
    <div id="contentBox">
    <div id="title">
        <span>${title}</span>
    </div>
    <div class="nav">
        <a class="input prev" style="width: 33%;left: 0" href="?bid=${param.bid}&cid=${prev}">上一章</a>
        <a class="input" style="left: 33%;right: 33%" href="/js/content.do?BookId=${param.bid}">目录</a>
        <a class="input next" style="width: 33%;right: 0" href="?bid=${param.bid}&cid=${next}">下一章</a>
    </div>
    <div>
        <style scoped>
            img {
                max-width: 100%;
            }
            pre{
                font-size: 32px;
                line-height: 40px;
                word-break: break-all;
                word-wrap: break-word;
                white-space: pre-wrap;
            }
            #buy{
                height: 48px;
                width: 100%;
                font-size: 20px;;
            }
        </style>
        <pre id="content" style="width: 100%">${text}</pre>
        <input id="buy" type="button" value="购买" class="hide"/>
    </div>
    <div class="nav">
        <a class="input prev" style="width: 33%;left: 0" href="?bid=${param.bid}&cid=${prev}">上一章</a>
        <a class="input" style="left: 33%;right: 33%" href="/js/content.do?BookId=${param.bid}">目录</a>
        <a class="input next" style="width: 33%;right: 0" href="?bid=${param.bid}&cid=${next}">下一章</a>
    </div>
    <span id="clock"></span>
    <%@include file="/piece/ProgressBar.jsp"%>
    <%@include file="/piece/ReaderConfig.jsp"%>
    <%@include file="/piece/LoginPanel.jsp"%>
    <script>
        ProgressBar.onScroll=function(per){
            //console.log("per:"+per);
            if (per<0.01) $("#smalltitle").addClass("hide");
            else $("#smalltitle").removeClass("hide")
            var d=new Date();
            $("#clock").text(d.getHours()+":"+d.getMinutes());
        };
        ACTIONBAR.MENU=[
            {
                name:'<span id="LoginPanelEntry" style="width: 100%;display: inline-block;text-align: center;font-size: inherit">点击登录</span>',
                action:function(){}
            },
            {
                name:"阅读设置",
                action:function(){
                    if (cfg) cfg.show();
                }
            }
        ];
        $(document).ready(function(){
            var d=new Date();
            $("#clock").text(d.getHours()+":"+d.getMinutes());
            if (${needBuy}){
                $("#content").text("还未订阅当前章节，需要花费${price}起点币");
                var p=$("#buy");
                p.removeClass("hide");
                p.mousedown(function(){
                    $.get("/js/ajax/buyChapter.do?bid=${param.bid}&cid=${param.cid}",function(d){
                        console.log(d);
                        if (d.code==0){
                            window.location.reload();
                        }else{
                            p.val("订阅失败，点击重试");
                        }
                    });
                });
            }
            $("body").mousedown(function(e){
                if (e.target.tagName=="A") return;
                if (e.clientX>document.body.clientWidth/2){
                    var cb=document.getElementById("contentBox");
                    cb.scrollTop+=cb.clientHeight-cfg["line-height"].replace("px","");
                }else{
                    var cb=document.getElementById("contentBox");
                    cb.scrollTop-=cb.clientHeight-cfg["line-height"].replace("px","");
                }
            });
            ProgressBar.init(document.getElementById("contentBox"));
            if ((${prev})<=0){
                var p=$(".nav .prev");
                p.text("到头了");
                p.removeAttr("href");
            }
            if ((${next})<=0){
                var p=$(".nav .next");
                p.text("到尾了");
                p.removeAttr("href");
            }
        });
    </script>
    </div>
</body>
</html>
