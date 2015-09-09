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
        <td style="width: 20%">
            <input type="button" class="page" style="border-left-width: 0;border-right-width: 0;"/>
            <style>
                #pager .jumper{
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    left:0;
                    top: 0;
                    background-color: rgba(0,0,0,0.5);
                }
                #pager .jumperdlg{
                    padding-left: 16px;
                    padding-right: 16px;
                    padding-top: 8px;
                    padding-bottom: 8px;
                    border: 4px black solid;
                    display: inline-block;
                    background-color: white;
                    font-size: 20px;
                }
                #pager .jumperdlg input.pagenum{
                    width: 64px;
                    height:32px;
                    display: inline-block;
                    text-align: right;
                }

                #pager .jumperdlg input[type=button]{
                    width: 80px;
                    height:32px;
                }

                #pager .jumperdlg .max{
                    display: inline-block;
                    text-align: right;
                }
            </style>
            <table class="jumper hide">
                <tr>
                    <td style="text-align: center">
                        <table class="jumperdlg" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="text-align: right"><input class="pagenum" value="1"></td>
                                <td>/</td>
                                <td><span class="max">10</span></td>
                            </tr>
                            <tr>
                                <td style="height: 8px;text-align: center" colspan="3">
                                    <span class="msg hide" style="display: inline-block"></span>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <input type="button" class="cancel" style="display: inline-block" value="取消">
                                </td>
                                <td></td>
                                <td style="text-align: center">
                                    <input type="button" class="ok" style="display: inline-block" value="确定">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <script>
                $(document).ready(function(){
                    var opg=$("#pager");
                    var pg=opg.find(".jumper");
                    var pd=pg.find(".jumperdlg");
                    var msg=pd.find(".msg");
                    var lm;
                    opg.find(".page").mousedown(function(){
                        lm=$("#list").prop("listManager");
                        if (lm==null) return;
                        msg.addClass("hide");
                        pg.removeClass("hide");
                        pg.find(".max").text(lm.pageCount);
                        pg.find(".pagenum").val(lm.page+1);
                    });
                    pd.find("input.cancel").mousedown(function(){pg.addClass("hide")});
                    pd.find("input.ok").mousedown(function(){
                        if (lm==null) return;
                        var x=parseInt(pd.find(".pagenum").val());
                        console.log("x="+x);
                        if (isNaN(x)||x==null) {
                            msg.text("请输入合法的整数");
                            msg.removeClass("hide");
                        }else if (x>lm.pageCount){
                            msg.text("页码不能大于"+lm.pageCount);
                            msg.removeClass("hide");
                        }else if (x<=0){
                            msg.text("页码必须大于0");
                            msg.removeClass("hide");
                        }else{
                            lm.setPage(x-1);
                            pg.addClass("hide")
                        }
                    });
                });
            </script>
        </td>
        <td><input type="button" value="下一页" class="next"/></td>
    </tr>
</table>