<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-8-29
  Time: 16:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style scoped>
  #pager input{
    height:100%;
    width:100%;
  }
</style>
<table class="match_parent" cellpadding="0" cellspacing="0" id="pager">
  <tr>
    <td><input type="button" value="上一页" class="prev"/></td>
    <td style="width: 20%"><input type="button" class="page" style="border-left-width: 0;border-right-width: 0;"/></td>
    <td><input type="button" value="下一页" class="next"/></td>
  </tr>
</table>