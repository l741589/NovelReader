/**
 * Created by yangzhao.lyz on 2015/9/6.
 */
function ch(){
    return{data:"这里是中文"}
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
function cookie(){
    return{
        page:"/page/test.jsp",
        data: $.http.rawCookie()
    }
}