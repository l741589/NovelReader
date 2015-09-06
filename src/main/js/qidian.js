/**
 * Created by Roy on 15-8-22.
 */
//$.load("lib.js");
$.load("login.js");
$.load("systest.js");
$.http.proxy("localhost",8888);

String.prototype.__trim=function(){

};
function search(args){
    var url="http://4g.if.qidian.com/Atom.axd/Api/Search/GetBookStore?key="+args.keyword;
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
        if ((c.Content==null|| c.Content=="")&&c.MaxPageIndex>0) {
            var ct=""
            for (var i = 1; i <= c.MaxPageIndex;++i) {
                var a = $.format("http://vipimage.qidian.com/BookReader/ChapterImageM.aspx?bookid=%s&chapterid=%s&width=%d&page=%d&rd=%s",
                    args.bid.toString(), args.cid.toString(), 576, i, getRd());
                ct += $.format('<img src="%s"/><br/>',a)
            }
            c.Content=ct;
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
    var ret=$.http.get("http://3g.qidian.com/ajax/userajax.ashx?ajaxMethod=checkuserlogin").exec().json("utf-8");
    return {
        data:ret
    }
}

function recent(){
    return {
        page:"/page/recent.jsp",
        data:{
            username:"abc"
        }
    }
}