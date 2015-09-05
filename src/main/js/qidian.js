/**
 * Created by Roy on 15-8-22.
 */
//$.load("lib.js");
$.load("ZLogin.js");
$.http.proxy("localhost",8888);
$.sysprop("file.encoding","utf-8");

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
    if ((o.ReturnCode==1|| o.ReturnCode==100)&& o.ReturnObject.length>=2){
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
        if (args.id==null) return {page:"/page/login.jsp"};
        var data = ZLogin.Login(args.id.toString(), args.pw.toString());
        if (data.return_code == -1111) return {data:{code:-1111,msg:"服务器错误"}}
        if (data.return_code == 8)  {
            return {
                data:{
                    code:8,
                    msg:"需要验证",
                    url:data.data.checkCodeUrl,
                    guid:ZLogin.Config.GUID
                }
            }
        }else {
            return {
                data: {
                    code: data.return_code,
                    msg: data.return_message
                }
            }
        }
    }catch(e){
        return {data:{code:-1111,msg:"服务器错误"}}
    }
}

function checkCodeLogin(args){
    try {
        $.log(ZLogin.Config.GUID);
        var data = ZLogin.CheckCodeLogin(args.code.toString());
        if (data.return_code == -1111)  return {data:{code:-1111,msg:"服务器错误"}}
        if (data.return_code == 8)  {
            return {
                data:{
                    code:8,
                    msg:"需要验证",
                    url:data.data.checkCodeUrl,
                    guid:ZLogin.Config.GUID
                }
            }
        }else {
            return {
                data: {
                    code: data.return_code,
                    msg: data.return_message
                }
            }
        }
    }catch(e){
        if (data.return_code == -1111)  return {data:{code:-1111,msg:"服务器错误"}}
    }
}

function scope(){
    return {
        page:"/page/test.jsp",
        data:{
            sid:$.jsexe.getScopeId(),
            sct: $.jsexe.getScopeCreateTime(),
            tid: $.jsexe.getThreadId()
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

function ch(){
    return{data:"这里是中文"}
}