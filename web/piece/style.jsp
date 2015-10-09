<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-23
  Time: 19:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style>
    html,body,.root{
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    input,.input{
        border:black 4px solid;
        background-color: white;
        color: black;
        text-decoration: none;
    }
    input[type=button]:active,.input:active{
        background-color: black;
        color:white;
    }
    input[type=submit]:active{
        background-color: black;
        color:white;
    }
    ul,li{
        list-style-type:none;
        margin: 0;
        padding: 0;
    }
    p {
        margin: 0;
        padding: 0;
    }

    hr{
        height:0;
        border:1px black solid;
        margin:0;
    }
    .match_parent{
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    .match_parent_width{
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        width: 100%;
    }
    .match_parent_height{
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        height: 100%;
    }
    .hide{
        display: none !important;
    }

    .cfghide{
        display: none !important;
    }

    .mask{
         position: fixed;
         left: 0;
         right: 0;
         top: 0;
         bottom: 0;
         width: 100%;
         height: 100%;
         background-color: rgba(0,0,0,0.5);
     }

    .mask > tr > td, .mask > tbody > tr > td {
        text-align: center;
    }

    .dialog{
        display: inline-block;
        border: 4px black solid;
        border-radius: 4px;
        background-color: white;
    }

    input[type=checkbox]{
        display: none !important;
    }

    input[type=checkbox] + label{
        width: 32px;
        height: 32px;
        border: 4px black solid;
        background: white;
        display: inline-block;
    }
    input[type=checkbox]:checked + label{
        background: black;
    }

    *:not(input),input[type="button"]{
        moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
</style>
<script>

</script>