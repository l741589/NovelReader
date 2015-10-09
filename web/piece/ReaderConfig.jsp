<%--
  Created by IntelliJ IDEA.
  User: Roy
  Date: 15-9-13.
  Time: 15:26
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style>
    #ReaderConfig input[type="button"]{
        width: 80px;
        font-size: 20px;
        height: 40px;
        float: right;
        margin-right: 8px;
    }
    #ReaderConfig td{

    }
</style>
<table id="ReaderConfigMask" class="mask hide">
    <tr>
        <td>
            <table id="ReaderConfig" class="dialog">
                <tr>
                    <td colspan="2">阅读设置</td>
                </tr>
                <tr>
                    <td>字号：</td>
                    <td><input name="font-size"></td>
                </tr>
                <tr>
                    <td>行高：</td>
                    <td><input name="line-height"></td>
                </tr>
                <tr class="hide">
                    <td>显示浮动标题：</td>
                    <td>
                        <input id="readercfg-show-smalltitle" name="show-smalltitle" type="checkbox">
                        <label for="readercfg-show-smalltitle"></label>
                    </td>
                </tr>
                <tr>
                    <td>显示进度条：</td>
                    <td>
                        <input id="readercfg-show-progress" name="show-progress" type="checkbox">
                        <label for="readercfg-show-progress"></label>
                    </td>
                </tr>
                <tr>
                    <td>显示时间：</td>
                    <td>
                        <input id="readercfg-show-clock" name="show-clock" type="checkbox">
                        <label for="readercfg-show-clock"></label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="button" value="确定" class="ok">
                        <input type="button" value="取消" class="cancel">
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<script>
function ReaderConfig(){
    this.seperator="!";
    var raw= $.cookie("rc");
    var ss=raw?raw.split(this.seperator):[0];
    var _this=this;
    this.version=ss[0];
    this.version="0";

    $.extend(this,{
        version:ss[0],
        decoder:{
            "0":function(){
                _this["font-size"]=ss[1]||32;
                _this["line-height"]=ss[2]||48;
                _this["show-smalltitle"]=ss[3]===undefined?true:(ss[3]=="true"||ss[3]==true);
                _this["show-progress"]=ss[4]===undefined?true:(ss[4]=="true"||ss[4]==true);
                _this["show-clock"]=ss[5]===undefined?true:(ss[5]=="true"||ss[5]==true);
            }
        },
        encoder:{
            "0":function(){
                return [0,
                    _this["font-size"],
                    _this["line-height"],
                    false,
                    _this["show-progress"],
                    _this["show-clock"]
                ].join(_this.seperator);
            }
        },
        load: function () {
            if (_this.decoder[_this.version]) _this.decoder[_this.version]();
        },
        apply:function(){
            var pre=$("pre#content");
            var table=$("#ReaderConfig");
            function px(s,def){
                if (s.slice(-2)=="px") s= s.slice(0,-2);
                var x=parseFloat(s);
                if (isNaN(x)) return def;
                return x+"px";
            }
            function setv(s){
                var input=table.find('input[name="'+s+'"]');
                var x;
                if (input.attr("type")=="checkbox"){
                    x=input.is(":checked");
                }else {
                    x = px(input.val());
                }
                if (x!==undefined) _this[s] = x;
                return _this[s];
            }
            function show(selector,b){
                var s=$(selector);
                if (b) s.removeClass("cfghide");
                else s.addClass("cfghide");
            }

            pre.css("font-size",setv("font-size"));
            pre.css("line-height",setv("line-height"));
            //show("#smalltitle",setv("show-smalltitle"));
            show("#ProgressBar",setv("show-progress"));
            show("#clock",setv("show-clock"));
        },
        update:function(){
            var d=$("#ReaderConfig");
            var ds=d.find("input[name]")
            for (var i=0;i<ds.length;++i){
                var input=ds[i];
                if (input.type=="checkbox") {
                    if (_this[input.name]) input.checked=true; else delete input.checked;
                }else{
                    input.value=_this[input.name];
                }
            }
        },
        save:function () {
            if (_this.encoder[_this.version]==null) {
                var s = _this.encoder[0](_this);
                $.cookie("rc", s, {path: "/"});
            }else {
                var s = _this.encoder[_this.version](_this);
                $.cookie("rc", s, {path: "/"});
            }
        },
        page2data:function(){
            var pre=$("pre#content");
            _this["font-size"]=pre.css("font-size");
            _this["line-height"]=pre.css("line-height");
            //_this["show-smalltitle"]=!$("#smalltitle").hasClass("cfghide");
            _this["show-progress"]=!$("#ProgressBar").hasClass("cfghide");
            _this["show-clock"]=!$("#clock").hasClass("cfghide");
        },
        show:function(){
            $("#ReaderConfigMask").removeClass("hide");
            _this.page2data();
            _this.update();
        }
    });
    this.load();
    this.update();
    this.apply();
}
    var cfg;

    $(document).ready(function(){
        cfg=new ReaderConfig();
        var rc=$("#ReaderConfig");
        rc.find(".ok").mousedown(function(){
            if (cfg){
                cfg.apply();
                cfg.save();
                $("#ReaderConfigMask").addClass("hide");
            }
        });
        rc.find(".cancel").mousedown(function(){
            $("#ReaderConfigMask").addClass("hide");
        });
    });
</script>