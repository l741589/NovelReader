/**
 * Created by Roy on 15-8-22.
 */
//$.load("lib.js");
$.load("ZLogin.js");
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
    var url= $.format("http://3g.qidian.com/ajax/reader.ashx?ajaxMethod=getchapterinfonew&bookid=%s&chapterid=%s",args.bid.toString(),args.cid.toString());
    var o= $.http.get(url).exec().json("utf-8");
    if (o.ReturnCode==1&& o.ReturnObject.length>=2){
        var b=o.ReturnObject[0];
        var c=o.ReturnObject[1];
        return {
            page:"/page/chapter.jsp",
            data: {
                bookname: b.BookName,
                author: b.AuthorName,
                title: c.ChapterName,
                text: c.Content.replace(/\[\[\[CP[^\]]*?U:([^\]\|]+)[^\]]*\]\]\]/g,"\r\n<img src='$1'>"),
                prev: c.PreChapterId,
                next: c.NextChapterId
            }
        }
    }else{
        return null;
    }
}

function loginError(data){
    data.error={
        "message":data.error["message"],
        "fileName":data.error["fileName"],
        "lineNumber":data.error["lineNumber"],
        "stack":data.error["stack"],
        "rhinoException":data.error["rhinoException"]
    }
    return {data:data}
}

function login(args){
    try {
        var data = ZLogin.Login(args.id.toString(), args.pw.toString());
        if (data.return_code == -1111) return loginError(data);
        var s=data.data.checkCodeUrl;
        $.log(s);
        if (data.return_code == 8) return { redirect:"/js/checkCodeLogin.do?url="+encodeURIComponent(s),data:data};
        return data
    }catch(e){
        if (data.return_code == -1111) return loginError({error:e});
    }
}

function checkCodeLogin(args){
    if (args.code==null){
        return {
            page:"/page/checkCode.jsp"
        }
    }else{
        return {
            page: "/"

        }
    }
}