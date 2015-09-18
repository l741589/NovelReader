/**
 * Created by yangzhao.lyz on 2015/9/6.
 */
$.load("ZLogin.js");

function loginError(e){
    return {
        "message":e["message"],
        "fileName":e["fileName"],
        "lineNumber":e["lineNumber"],
        "stack":e["stack"],
        "rhinoException":e["rhinoException"]
    }
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
        return {data:{code:-1111 ,error:loginError(e), msg:"服务器错误"}}
    }
}

function checkCodeLogin(args,guid){
    try {
        $.log(guid);
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
        return {data:{code:-1111,error:loginError(e),msg:"服务器错误"}}
    }
}