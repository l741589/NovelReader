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
    }
</style>
<script>
    var ProgressBar= {
        init: function () {
            var div = document.createElement("div");
            div.id="ProgressBar";
            div.className = "ProgressBar"
            document.body.appendChild(div);
            var _this=this;
            window.onscroll = function () {
                var per = document.body.scrollTop / (document.body.scrollHeight - document.body.clientHeight);
                div.style.height = (document.body.clientHeight - 4) * per;
                if (_this.onScroll) _this.onScroll(per);
            }
        },
        onScroll:null
    };

    ProgressBar.init();
</script>
