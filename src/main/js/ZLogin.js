/**
 * Created by Roy on 15-9-3.
 */
var AjaxDomainUrl = "http://acs.qidian.com";
var ZLogin =
{
    EndPointType: 4,
    Config: {
        AutoLogin: 1,
        AutoDays: 14,
        MAppId: "991000353",
        MAreaId: 31,
        GUID: "",
        Frames: ["#dvstatic", "#dvrnd", "#dvsafecard", "#dvsafex6", "#dvchallenge", "#dvphonelogin"],
        Domain: ".qidian.com",
        PhoneInterval: null,
        CurrentType: 0,
        FromLoginType: 1,
        TakeEnterList: [["#txtpassword", "#btnStaticLogin"], ["#txtrnd", "#btnRndLogin"], ["#txtcard3", "#btnSafeCardLogin"], ["#txtxnum4", "#btnSafeX6Login"], ["#txtchallenge", "#btnChallenge"], ["#txtphonecode", "#btnPhoneLogin"]],
        OAJumpUrl: "http://wap.m.qidian.com/logincallback.aspx",
        ReturnUrl: "http://3g.qidian.com/profile/index.aspx?returnurl=http://3g.qidian.com/",
        IsOutSite: 0
    },
    AjaxUrl: {
        StaticUrl: "http://acs.qidian.com/authen/staticLogin.ashx",
        AutoUrl: AjaxDomainUrl + "/authen/AutoLogin.ashx",
        CheckCodeUrl: AjaxDomainUrl + "/authen/checkcodelogin.ashx",
        LogoutUrl: AjaxDomainUrl + "/authen/logout.ashx",
        DynamicUrl: AjaxDomainUrl + "/authen/dynamicLogin.ashx",
        SinaLoginUrl: AjaxDomainUrl + "/Login/Sina/login.ashx",
        AlipayLoginUrl: AjaxDomainUrl + "/Login/Alipay/login.ashx",
        QQLoginUrl: AjaxDomainUrl + "/Login/QQ/login.ashx",
        BaiduLoginUrl: AjaxDomainUrl + "/Login/Baidu/login.ashx",
        CheckSdoTicketUrl: AjaxDomainUrl + "/Register/CheckSDOTicket.ashx",
        SendPhoneUrl: AjaxDomainUrl + "/authen/SendPhoneCheckCodeNew.ashx",
        PhoneLoginUrl: AjaxDomainUrl + "/authen/phoneCheckCodeLogin.ashx",
        CheckPhoneUrl: AjaxDomainUrl + "/authen/checkAccountType.ashx"
    },
    Login: function (username, password) {
        try {
            var d=$.http.get("http://acs.qidian.com/authen/staticLogin.ashx", {
                appId: ZLogin.Config.MAppId,
                areaId: ZLogin.Config.MAreaId,
                serviceurl: ZLogin.Config.ReturnUrl,
                frametype: 3,
                endpointos: ZLogin.EndPointType,
                format: "jsonp",
                inputuserid: username,
                password: password,
                autologinflag: 0,
                autologinkeeptime: ZLogin.Config.AutoDays
            }).exec().body()+"";
            return ZLogin.LoginCallBack(d)
        } catch (e) {
            return {"return_code": -1111, msg: "exeption occured", error: e}
        }
    },
    LoginCallBack: function (a) {
        //$.log(a);
        a = JSON.parse(a.replace(/^\w+\((.*)\)$/, "$1"));
        if (!a) return {"return_code": -1110, msg: "login fail!unkown error!"}
        if (a.return_code == 0 && a.data.nextAction == 0) {
            if (ZLogin.Config.CurrentType == 6) ZLogin.LoginSuccess(a.data.ticket, (parseInt(ZLogin.Config.MAreaId) * 100 + 2))
            else ZLogin.LoginSuccess(a.data.ticket, (parseInt(ZLogin.Config.MAreaId) * 100 + ZLogin.Config.FromLoginType))
        } else {
            if (a.data && a.data.nextAction) {
                switch (a.data.nextAction) {
                    case 2:
                        ZLogin.Config.GUID = "";
                        return {"return_code": 2, msg: "static login!", data: a.data}
                        break;
                    case 8:
                        ZLogin.Config.GUID = a.data.guid;
                        return {"return_code": 8, msg: "check code login!", data: a.data}
                        break;
                    default:
                        return {"return_code": a.data.nextAction, msg: a.return_message, data: a.data}
                        break
                }
            } else {
                return a;
            }
        }
    },
    LoginSuccess: function (c, b) {
        if (ZLogin.Config.IsOutSite) {
            var a = ZLogin.Config.ReturnUrl;
            if (a.indexOf("?") > -1) a += "&ticket=" + c
            else a += "?ticket=" + c;
            var page=$.http.get(a);
            return {"return_code":0,"data":page}
            //ZLogin.TopRedirect(a)
        } else {
            var a = ZLogin.Config.OAJumpUrl +
                $.format("?appId=%s&sitetype=%s&returnURL=%s&ticket=%s&ticketType=1&loginfrom=%s",
                    ZLogin.Config.MAppId,
                    ZLogin.Config.MAreaId, encodeURIComponent(ZLogin.Config.ReturnUrl),
                    c,b);
            var page=$.http.get(a);
            return {"return_code":0,"data":page}
        }
    }
};