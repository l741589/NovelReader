/**
 * Created by Roy on 15-8-22.
 */
//$.load("lib.js");
$.load("login.js");
$.load("systest.js");
$.http.proxy("localhost",8888);

String.prototype.__trim=function(){

};

var u={
    db:$.ext.db,
    getUser:function(){
        if (this.getToken()==null) return null;
        return this.db().queryOne("user",{tokenmd5: $.util.md5(this.getToken()),token:this.getToken()});
    },
    getToken:function(){
        return $.http.cookie("cmfuToken")
    }
}

function search(args){
    var url="http://4g.if.qidian.com/Atom.axd/Api/Search/GetBookStore?key="+(args.keyword||"");
    if (args.page==null) url+="&type=0";
    else url+="&pageIndex="+args.page;
    var o= $.http.get(url).exec().json("utf-8");
    return{
        page:"/page/search.jsp",
        data: o.Data
    }
}

function content(args){
    var url="http://4g.if.qidian.com/Atom.axd/Api/Book/GetChapterList?timeStamp=0&BookId="+args.BookId;
    var o= $.http.get(url).exec().json("utf-8");
    return {
        page:"/page/content.jsp",
        data: o.Data
    }
}

function chapter2(args){
    var meid="a000005573853e";
    var s;
    if (args.vip){
        var url= $.format("http://4g.if.qidian.com/Atom.axd/Api/Book/GetVipContent?b=%s&c=%s&i=%s",args.bid.toString(),args.cid.toString(),meid);
        var o= $.http.post(url).exec().$data();
        var s=$.ext.qd.decode(u.getUser().quid,args.bid.toString(),args.cid.toString(),meid,o);
    }else{
        var url= $.format("http://4g.if.qidian.com/Atom.axd/Api/Book/GetContent?BookId=%s&ChapterId=%s",args.bid.toString(),args.cid.toString());
        var d=$.http.get(url).exec().json();
        if (d) s= d.Data;
    }
    return s+"";
}

function chapter(args){
    function getRd(){
        var a = ($.http.cookie("rc") || "1") + ($.http.cookie("rf") || "18") + ($.http.cookie("mrm") || "2") + "1";
        return a
    }
    var url= $.format("http://3g.qidian.com/ajax/reader.ashx?ajaxMethod=getchapterinfonew&bookid=%s&chapterid=%s",args.bid.toString(),args.cid.toString());
    var o= $.http.get(url).exec().json("utf-8");
    if (o.ReturnCode==1|| o.ReturnCode==100|| o.ReturnCode==-108) {
        var b = null;
        var c = null;
        if (o.ReturnObject.length >= 2) {
            b = o.ReturnObject[0];
            c = o.ReturnObject[1];
        } else {
            c = o.ReturnObject;
        }
        if (o.ReturnCode!=-108) {
            if ((c.Content == null || c.Content == "")) {
                c.Content = chapter2({bid: args.bid, cid: args.cid, vip: 1});
                if ((c.Content == null || c.Content == "") && c.MaxPageIndex > 0) {
                    var ct = ""
                    for (var i = 1; i <= c.MaxPageIndex; ++i) {
                        var a = $.format("http://vipimage.qidian.com/BookReader/ChapterImageM.aspx?bookid=%s&chapterid=%s&width=%d&page=%d&rd=%s",
                            args.bid.toString(), args.cid.toString(), 576, i, getRd());
                        ct += $.format('<img src="%s"/><br/>', a)
                    }
                    c.Content = ct;
                }
            }
        }
        try{
            if (b!=null) u.db().update("book",b);
            if (c!=null) u.db().update("chapter",c);
            if (o.ReturnObject[2]){
                o.ReturnObject[2].forEach(function(c){
                    if (c!=null) u.db().update("chapter",c);
                })
            }
            if (b!=null&&c!=null){
                var user= u.getUser();
                if (user) u.db().update("recentread",{uid:user.uid,bid: b.BookId,cid: c.ChapterId});
            }
        }catch(e){
            $.log(e);
        }
        return {
            page: "/page/chapter.jsp",
            data: {
                bookname: b ? b.BookName : "",
                author: b ? b.AuthorName : "",
                title: c.ChapterName,
                text: c.Content ? c.Content.replace(/\[\[\[CP[^\]]*?U:([^\]\|]+)[^\]]*\]\]\]/g, "\r\n<img src='$1'>") : null,
                prev: c.PreChapterId,
                next: c.NextChapterId,
                price: c.Price,
                needBuy: o.ReturnCode == -108
            }
        }
    }else {
        return null;
    }
}

function buyChapter(args){
    try {
        var d = $.http.post("http://3g.qidian.com/ajax/buychapter.ashx",{
            ajaxMethod:"buychapter",
            bookid:args.bid.toString(),
            chapterid:args.cid.toString()
        }).exec().json();
        return {data: {code: d.IsSuccess?"0":"-1",msg: d.ReturnString}}
    }catch(e){
        return{
            data:{
                ReturnCode:-1111,
                error:e
            }
        }
    }
}

function getUserInfo(){
    //IsSuccess
    //ReturnString name
    var q=$.http.rawCookie();
    if (q==null|| q.length==0){
        $.log($.jsexe.getScopeId());
        try {
            var cs = u.db().queryOne("cookiestore", {sid: $.jsexe.getScopeId()});
            if (cs != null&&new Date().getTime()-cs.time.getTime()<604800000) {
                $.http.setCookies(JSON.parse(cs.data));
            }
        }catch(e){
            $.log(e);
        }
    }
    var res=$.http.post("http://4g.if.qidian.com/Atom.axd/Api/User/Get",{gender:"0"})
        .header({QDInfo:"T18EP3wKbZTj0O++Mbj0a8yWe36CGeaoywJZoWp0wJUDp4gBNQ5n4UzQmt+Pr6bflY7rGPrWno3v2/4b39jRTqJlWQrWIw7TKd0v+vH6Y2I="})
        .exec().json("utf-8");
    if (res.Data==null) return{data:{code:-1}};
    var ret={
        name:res.Data.NickName,
        quid:res.Data.UserId,
        token: u.getToken(),
        tokenmd5: $.util.md5(u.getToken())
    };
    u.db().update("user",ret);
    u.db().update("cookiestore",{sid: $.jsexe.getScopeId(),data: JSON.stringify($.http.rawCookie())});
    ret.code=0;
    return {
        data:ret
    }
}

function recent(){
    var user= u.getUser();
    var data=null;
    if (user) {
        data=u.db().query("SELECT `BookName` AS bn,`AuthorName` AS an,`ChapterName` AS cn,`BookId` AS bid,`ChapterId` AS cid,`time` " +
            "FROM recent_chapter WHERE uid=? ORDER BY `time` DESC LIMIT 100", [user.uid]);
    }else{
        return {
            "redirect":"/js/search.do"
        }
    }
    if (data==null) data=[];
    return {
        page:"/page/recent.jsp",
        data:{
            username: user.name,
            data:data
        }
    }
}

function del_recent(args){
    var bid=args.bid.toString();
    var user= u.getUser();
    if (user==null||bid==null) return {data:{code:-1}}
    try {
        u.db().delete("recentread", {uid: user.uid, bid: bid});
        return {data:{code:0}}
    }catch(e){
        return {data:{code:-2}}
    }
}