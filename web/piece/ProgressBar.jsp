<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 14-12-5
  Time: 15:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style>
    .ProgressBar{
        width: 4px;
        top:2px;
        right:2px;
        height:0px;
        background-color: black;
        position: fixed;
        z-index: 100;
    }
</style>
<script>
    var ProgressBar= {
        init: function (view) {
            var div = document.createElement("div");
            div.id="ProgressBar";
            div.className = "ProgressBar"
            document.body.appendChild(div);
            var _this=this;
            view.onscroll = function () {
                var per = view.scrollTop / (view.scrollHeight - view.clientHeight);
                div.style.height = (view.clientHeight - 4) * per;
                if (_this.onScroll) _this.onScroll(per);
            }
            div.style.top=view.offsetTop;
        },
        onScroll:null
    };
</script>
