/**
 * Created by Roy on 15-8-30.
 */
var AjaxDomainUrl = "http://acs.qidian.com";
var MLogin =
{
    EndPointType:4,
    Config :
    {
        AutoLogin : 1,
        AutoDays : 14,
        MAppId : "991000353",
        MAreaId : 31,
        GUID : "",
        Frames : ["#dvstatic", "#dvrnd", "#dvsafecard", "#dvsafex6", "#dvchallenge", "#dvphonelogin"],
        Domain : ".qidian.com",
        PhoneInterval : null,
        CurrentType : 0,
        FromLoginType : 1,
        TakeEnterList : [["#txtpassword", "#btnStaticLogin"], ["#txtrnd", "#btnRndLogin"], ["#txtcard3", "#btnSafeCardLogin"], ["#txtxnum4", "#btnSafeX6Login"], ["#txtchallenge", "#btnChallenge"], ["#txtphonecode", "#btnPhoneLogin"]],
        OAJumpUrl : "http://wap.m.qidian.com/logincallback.aspx",
        ReturnUrl : "",
        IsOutSite : 0
    },
    AjaxUrl :
    {
        StaticUrl : "http://acs.qidian.com/authen/staticLogin.ashx",
        AutoUrl : AjaxDomainUrl + "/authen/AutoLogin.ashx",
        CheckCodeUrl : AjaxDomainUrl + "/authen/checkcodelogin.ashx",
        LogoutUrl : AjaxDomainUrl + "/authen/logout.ashx",
        DynamicUrl : AjaxDomainUrl + "/authen/dynamicLogin.ashx",
        SinaLoginUrl : AjaxDomainUrl + "/Login/Sina/login.ashx",
        AlipayLoginUrl : AjaxDomainUrl + "/Login/Alipay/login.ashx",
        QQLoginUrl : AjaxDomainUrl + "/Login/QQ/login.ashx",
        BaiduLoginUrl : AjaxDomainUrl + "/Login/Baidu/login.ashx",
        CheckSdoTicketUrl : AjaxDomainUrl + "/Register/CheckSDOTicket.ashx",
        SendPhoneUrl : AjaxDomainUrl + "/authen/SendPhoneCheckCodeNew.ashx",
        PhoneLoginUrl : AjaxDomainUrl + "/authen/phoneCheckCodeLogin.ashx",
        CheckPhoneUrl : AjaxDomainUrl + "/authen/checkAccountType.ashx"
    },
    GetAjaxUrl : function (a)
    {
        return MLogin.AjaxUrl[a]
    },
    Ajax : function ()
    {
        $.http.ajax(
            {
                url : arguments[0] || MLogin.AjaxUrl.StaticUrl,
                data : arguments[1] || "",
                success : arguments[3] || function ()  {},
                error : arguments[4] || function ()  {},
                callbackParameter : arguments[5] || "method"

            }
        )
    },
    StaticLogin :
    {
        Index : 0,
        Login : function (username,password)
        {
            MLogin.Ajax(MLogin.GetAjaxUrl("StaticUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : MLogin.EndPointType,
                    format : "jsonp",
                    inputuserid : username,
                    password : password,
                    autologinflag : 0,
                    autologinkeeptime : MLogin.Config.AutoDays
                }, "StaticLogin", function (d)
                {
                    MLogin.LoginCallBack(d)
                }, function (d,e)
                {
                    MLogin.StaticLogin.ShowError("login failed, please retry later! ("+d+")");
                }
            )
        },
        ShowError : function (a)
        {
            $.log(a);
        },
        ResetLoading : function ()
        {
            $.log("reset loading");
        }
    },
    CheckCodeLogin :
    {
        Index : 1,
        Login : function ()
        {
            var a = $("#txtrnd").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.CheckCodeLogin.ShowError("请输入图片验证码的值！");
                return
            }
            MLogin.CheckCodeLogin.Loading();
            MLogin.Ajax(MLogin.GetAjaxUrl("CheckCodeUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : MLogin.EndPointType,
                    format : "jsonp",
                    guid : MLogin.Config.GUID,
                    password : a
                }, "CheckCodeLogin", function (b)
                {
                    MLogin.LoginCallBack(b)
                }, function (b)
                {
                    MLogin.CheckCodeLogin.ResetLoading();
                    MLogin.CheckCodeLogin.ShowError("登录失败，请稍后重试！");
                    MLogin.Log("")
                }
            )
        },
        Show : function ()
        {
            MLogin.HideAllFrame();
            MLogin.CheckCodeLogin.Init();
            $(MLogin.Config.Frames[MLogin.CheckCodeLogin.Index]).show();
            MLogin.Config.CurrentType = 1
        },
        Hide : function ()
        {
            MLogin.CheckCodeLogin.Init();
            $(MLogin.Config.Frames[MLogin.CheckCodeLogin.Index]).hide()
        },
        Init : function ()
        {
            $("#imgrnd").attr("src", "");
            $("#txtrnd").val("");
            $("#dvcheckcodemsg").hide();
            $("#dvcheckcodemsg span").html("")
        },
        Cancel : function ()
        {
            MLogin.Cancel();
            MLogin.CheckCodeLogin.Init();
            MLogin.Config.GUID = ""
        },
        ShowError : function (a)
        {
            $("#dvcheckcodemsg").show();
            $("#dvcheckcodemsg span").html(a)
        },
        Refresh : function ()
        {
            var a = $("#imgrnd").attr("src");
            if (a)
            {
                if (a.indexOf("&rnd=") > -1)
                {
                    a = a.substr(0, a.indexOf("&rnd=")) + "&rnd=" + Math.random()
                }
                else
                {
                    a = a + "&rnd=" + Math.random()
                }
            }
            $("#imgrnd").attr("src", a)
        },
        Loading : function ()
        {
            $("#btnRndLogin").val("登录中...");
            $("#btnRndLogin").attr("disabled", "disabled")
        },
        ResetLoading : function ()
        {
            $("#btnRndLogin").val("登录");
            $("#btnRndLogin").removeAttr("disabled", "disabled")
        }
    },
    AutoLogin :
    {
        AutoKey : "al",
        Login : function ()
        {
            var a = MLogin.AutoLogin.GetCookie();
            if (a == "")
            {
                return
            }
            if (Common.checkLoginByCookie())
            {
                return
            }
            MLogin.Config.CurrentType = 6;
            MLogin.Ajax(MLogin.GetAjaxUrl("AutoUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : location.href,
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp"
                }, "AutoLogin", function (b)
                {
                    MLogin.LoginCallBack(b)
                }, function (b)
                {
                    MLogin.AutoLogin.DelCookie();
                    MLogin.Log("")
                }
            )
        },
        GetCookie : function ()
        {
            var a = $.http.cookie(MLogin.AutoLogin.AutoKey);
            if (a == undefined || a == null || a.length <= 0)
            {
                return ""
            }
            return a
        },
        DelCookie : function ()
        {
            $.http.delCookie(MLogin.AutoLogin.AutoKey)
        },
        SetCookie : function ()
        {
            var a = MLogin.AutoLogin.GetCookie();
            if (a == "")
            {
                $.http.setCookie(MLogin.AutoLogin.AutoKey, 1, (new Date()).AddDays(MLogin.Config.AutoDays), "/", ".qidian.com")
            }
        }
    },
    SafeCardLogin :
    {
        Index : 2,
        Login : function ()
        {
            var c = $("#txtcard1").val();
            c = c.trim();
            if (c == null || c.length <= 0)
            {
                MLogin.SafeCardLogin.ShowError("请输入安全卡坐标对应位置的数字！");
                $("#txtcard1").focus();
                return
            }
            var b = $("#txtcard2").val();
            b = b.trim();
            if (b == null || b.length <= 0)
            {
                MLogin.SafeCardLogin.ShowError("请输入安全卡坐标对应位置的数字！");
                $("#txtcard2").focus();
                return
            }
            var a = $("#txtcard3").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.SafeCardLogin.ShowError("请输入安全卡坐标对应位置的数字！");
                $("#txtcard3").focus();
                return
            }
            MLogin.SafeCardLogin.Loading();
            MLogin.Ajax(MLogin.GetAjaxUrl("DynamicUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp",
                    guid : MLogin.Config.GUID,
                    password : c + "|" + b + "|" + a,
                    loginType : 2
                }, "SafeCardLogin", function (d)
                {
                    MLogin.LoginCallBack(d)
                }, function (d)
                {
                    MLogin.SafeCardLogin.ResetLoading();
                    MLogin.SafeCardLogin.ShowError("登录失败，请稍后重试！");
                    MLogin.Log("")
                }
            )
        },
        Show : function ()
        {
            MLogin.HideAllFrame();
            MLogin.SafeCardLogin.Reset();
            $(MLogin.Config.Frames[MLogin.SafeCardLogin.Index]).show();
            MLogin.Config.CurrentType = 2
        },
        Hide : function ()
        {
            MLogin.SafeCardLogin.Reset();
            $(MLogin.Config.Frames[MLogin.SafeCardLogin.Index]).hide()
        },
        Reset : function ()
        {
            $("#txtcard1,#txtcard2,#txtcard3").val("");
            $("#dvsafecard ul li span.red").empty()
        },
        Cancel : function ()
        {
            MLogin.Cancel();
            MLogin.SafeCardLogin.Reset();
            MLogin.Config.GUID = ""
        },
        ShowError : function (a)
        {
            $("#dvsafecardmsg").show();
            $("#dvsafecardmsg span").html(a)
        },
        ShowChallenge : function (b)
        {
            if (b)
            {
                var a = b.split("|");
                $("#dvsafecard ul li span.red").each(function (c, d)
                    {
                        $(d).html(a[c])
                    }
                )
            }
            $("#dvsafecard ul input").each(function (c, d)
                {
                    $(d).unbind("keyup").bind("keyup", function (f)
                        {
                            if (f && f.keyCode == 8)
                            {
                                if (!$(d).val() || $(d).val().length <= 0)
                                {
                                    if (c > 0)
                                    {
                                        $("#dvsafecard ul input").eq(c - 1).focus()
                                    }
                                }
                            }
                            else
                            {
                                if ($(d).val() && $(d).val().length >= 2)
                                {
                                    if (c < 2)
                                    {
                                        $("#dvsafecard ul input").eq(c + 1).focus()
                                    }
                                }
                            }
                        }
                    )
                }
            )
        },
        Loading : function ()
        {
            $("#btnSafeCardLogin").val("登录中...");
            $("#btnSafeCardLogin").attr("disabled", "disabled")
        },
        ResetLoading : function ()
        {
            $("#btnSafeCardLogin").val("登录");
            $("#btnSafeCardLogin").removeAttr("disabled", "disabled")
        }
    },
    SafeX6Login :
    {
        Index : 3,
        Login : function ()
        {
            var d = $("#txtxnum1").val();
            d = d.trim();
            if (d == null || d.length <= 0)
            {
                MLogin.SafeX6Login.ShowError("请输入密宝指定位置上的数字！");
                $("#txtxnum1").focus();
                return
            }
            var c = $("#txtxnum2").val();
            c = c.trim();
            if (c == null || c.length <= 0)
            {
                MLogin.SafeX6Login.ShowError("请输入密宝指定位置上的数字！");
                $("#txtxnum2").focus();
                return
            }
            var b = $("#txtxnum3").val();
            b = b.trim();
            if (b == null || b.length <= 0)
            {
                MLogin.SafeX6Login.ShowError("请输入密宝指定位置上的数字！");
                $("#txtxnum3").focus();
                return
            }
            var a = $("#txtxnum4").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.SafeX6Login.ShowError("请输入密宝指定位置上的数字！");
                $("#txtxnum4").focus();
                return
            }
            MLogin.SafeX6Login.Loading();
            MLogin.Ajax(MLogin.GetAjaxUrl("DynamicUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp",
                    guid : MLogin.Config.GUID,
                    password : d + c + b + a,
                    loginType : 1
                }, "SafeX6Login", function (e)
                {
                    MLogin.LoginCallBack(e)
                }, function (f)
                {
                    MLogin.SafeX6Login.ResetLoading();
                    MLogin.SafeX6Login.ShowError("登录失败，请稍后重试！");
                    MLogin.Log("")
                }
            )
        },
        Show : function ()
        {
            MLogin.HideAllFrame();
            MLogin.SafeX6Login.Reset();
            $(MLogin.Config.Frames[MLogin.SafeX6Login.Index]).show();
            MLogin.Config.CurrentType = 3
        },
        Hide : function ()
        {
            MLogin.SafeX6Login.Reset();
            $(MLogin.Config.Frames[MLogin.SafeX6Login.Index]).hide()
        },
        Reset : function ()
        {
            $("#txtxnum1,#txtxnum2,#txtxnum3,#txtxnum4").val("");
            $("#spsafex6").html("");
            $("#dvsafex6msg").hide();
            $("#dvsafex6msg span").html("")
        },
        Cancel : function ()
        {
            MLogin.Cancel();
            MLogin.SafeX6Login.Reset();
            MLogin.Config.GUID = ""
        },
        ShowError : function (a)
        {
            $("#dvsafex6msg").show();
            $("#dvsafex6msg span").html(a)
        },
        ShowChallenge : function (a)
        {
            if (a)
            {
                $("#dvsafex6 ul li span.red").each(function (b, c)
                    {
                        $(c).html(a[b])
                    }
                )
            }
            $("#dvsafex6 ul input").each(function (b, c)
                {
                    $(c).unbind("keyup").bind("keyup", function (d)
                        {
                            if (d && d.keyCode == 8)
                            {
                                if (!$(c).val() || $(c).val().length <= 0)
                                {
                                    if (b > 0)
                                    {
                                        $("#dvsafex6 ul input").eq(b - 1).focus()
                                    }
                                }
                            }
                            else
                            {
                                if ($(c).val() && $(c).val().length >= 1)
                                {
                                    if (b < 3)
                                    {
                                        $("#dvsafex6 ul input").eq(b + 1).focus()
                                    }
                                }
                            }
                        }
                    )
                }
            )
        },
        Loading : function ()
        {
            $("#btnSafeX6Login").val("登录中...");
            $("#btnSafeX6Login").attr("disabled", "disabled")
        },
        ResetLoading : function ()
        {
            $("#btnSafeX6Login").val("登录");
            $("#btnSafeX6Login").removeAttr("disabled", "disabled")
        }
    },
    ChallengeLogin :
    {
        Index : 4,
        Login : function ()
        {
            var a = $("#txtchallenge").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.ChallengeLogin.ShowError("请输入动态密码！");
                $("#txtchallenge").focus();
                return
            }
            MLogin.ChallengeLogin.Loading();
            MLogin.Ajax(MLogin.GetAjaxUrl("DynamicUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp",
                    guid : MLogin.Config.GUID,
                    password : a,
                    loginType : 1
                }, "ChallengeLogin", function (b)
                {
                    MLogin.LoginCallBack(b)
                }, function (b)
                {
                    MLogin.ChallengeLogin.ResetLoading();
                    MLogin.ChallengeLogin.ShowError("登录失败，请稍后重试！");
                    MLogin.Log("")
                }
            )
        },
        Show : function ()
        {
            MLogin.HideAllFrame();
            MLogin.ChallengeLogin.Reset();
            $(MLogin.Config.Frames[MLogin.ChallengeLogin.Index]).show();
            MLogin.Config.CurrentType = 4
        },
        Hide : function ()
        {
            MLogin.ChallengeLogin.Reset();
            $(MLogin.Config.Frames[MLogin.ChallengeLogin.Index]).hide()
        },
        Reset : function ()
        {
            $("#txtchallenge").val("");
            $("#spchallenge").html("");
            $("#dvchallengemsg").hide();
            $("#dvchallengemsg span").html("")
        },
        Cancel : function ()
        {
            MLogin.Cancel();
            MLogin.ChallengeLogin.Reset();
            MLogin.Config.GUID = ""
        },
        ShowError : function (a)
        {
            $("#dvchallengemsg").show();
            $("#dvchallengemsg span").html(a)
        },
        ShowChallenge : function (a)
        {
            if (a)
            {
                $("#spchallenge").html(a)
            }
        },
        Loading : function ()
        {
            $("#btnChallenge").val("登录中...");
            $("#btnChallenge").attr("disabled", "disabled")
        },
        ResetLoading : function ()
        {
            $("#btnChallenge").val("登录");
            $("#btnChallenge").removeAttr("disabled", "disabled")
        }
    },
    PhoneLogin :
    {
        Index : 5,
        Login : function ()
        {
            var a = $("#txtphoneaccount").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.PhoneLogin.ShowError("请输入手机号码或者绑定的帐号！");
                $("#txtphoneaccount").focus();
                return
            }
            if (MLogin.Config.GUID == "")
            {
                MLogin.PhoneLogin.ShowError("请先获取验证码！");
                return
            }
            var b = $("#txtphonecode").val();
            b = b.trim();
            if (b == null || b.length <= 0)
            {
                MLogin.PhoneLogin.ShowError("请输入短信验证码！");
                $("#txtphonecode").focus();
                return
            }
            var c = $("#chkphoneauto").attr("class") == "checked" ? 1 : 0;
            MLogin.PhoneLogin.Loading();
            MLogin.Ajax(MLogin.GetAjaxUrl("PhoneLoginUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp",
                    checkCodeSessionKey : MLogin.Config.GUID,
                    checkcode : b,
                    autoLoginFlag : c,
                    autoLoginKeepTime : MLogin.Config.AutoDays
                }, "PhoneLogin", function (d)
                {
                    MLogin.LoginCallBack(d)
                }, function (d)
                {
                    MLogin.PhoneLogin.ResetLoading();
                    MLogin.PhoneLogin.ShowError("登录失败，请稍后重试！")
                }
            )
        },
        SendMsg : function (a)
        {
            var a = $("#txtphoneaccount").val();
            a = a.trim();
            if (a == null || a.length <= 0)
            {
                MLogin.PhoneLogin.ShowError("请输入手机号码或者绑定的帐号！");
                $("#txtphoneaccount").focus();
                return
            }
            $("#btnSendMsg").val("发送中...");
            $("#btnSendMsg").attr("disabled", "disabled");
            var b = function (c)
            {
                if (c)
                {
                    if (c.return_code == 0)
                    {
                        $("#btnSendMsg").removeClass("reg_btn").addClass("reg_btn01");
                        $("#btnSendMsg").attr("disabled", "disabled");
                        $("#btnSendMsg").val("(59)重新发送");
                        if (MLogin.Config.PhoneInterval != null)
                        {
                            clearInterval(MLogin.Config.PhoneInterval);
                            MLogin.Config.PhoneInterval = null
                        }
                        var d = 59;
                        MLogin.Config.PhoneInterval = setInterval(function ()
                        {
                            d--;
                            if (d <= 0)
                            {
                                clearInterval(MLogin.Config.PhoneInterval);
                                $("#btnSendMsg").removeClass("reg_btn01").addClass("reg_btn");
                                $("#btnSendMsg").val("发送手机验证码");
                                $("#btnSendMsg").removeAttr("disabled")
                            }
                            else
                            {
                                $("#btnSendMsg").val("(" + d + ")重新发送")
                            }
                        }, 1000)
                    }
                    else
                    {
                        $("#btnSendMsg").removeClass("reg_btn01").addClass("reg_btn");
                        $("#btnSendMsg").val("发送手机验证码");
                        $("#btnSendMsg").removeAttr("disabled");
                        MLogin.PhoneLogin.ShowError(c.return_message || c.data.failReason || "短信发送失败，请稍后重试！")
                    }
                    if (c.data && c.data.checkCodeSessionKey)
                    {
                        MLogin.Config.GUID = c.data.checkCodeSessionKey
                    }
                }
                else
                {
                    $("#btnSendMsg").removeClass("reg_btn01").addClass("reg_btn");
                    $("#btnSendMsg").val("发送手机验证码");
                    $("#btnSendMsg").removeAttr("disabled");
                    MLogin.PhoneLogin.ShowError("短信发送失败!")
                }
            };
            MLogin.Ajax(MLogin.GetAjaxUrl("SendPhoneUrl"),
                {
                    appId : MLogin.Config.MAppId,
                    areaId : MLogin.Config.MAreaId,
                    serviceurl : MLogin.GetReturnUrl(),
                    frametype : 3,
                    endpointos : Common.GetEndPointType(),
                    format : "jsonp",
                    inputuserid : a,
                    checkCodeSessionKey : MLogin.Config.GUID,
                    type : 3
                }, "CheckPhoneSendMsg", function (c)
                {
                    MLogin.PhoneLogin.ShowError();
                    b(c)
                }, function (c)
                {
                    $("#btnSendMsg").removeClass("reg_btn01").addClass("reg_btn");
                    $("#btnSendMsg").val("发送手机验证码");
                    $("#btnSendMsg").removeAttr("disabled");
                    MLogin.PhoneLogin.ShowError("短信发送失败，请稍后重试！")
                }
            )
        },
        Show : function ()
        {
            MLogin.HideAllFrame();
            MLogin.PhoneLogin.Reset();
            $(MLogin.Config.Frames[MLogin.PhoneLogin.Index]).show();
            MLogin.Config.CurrentType = 5;
            MLogin.Config.FromLoginType = 0
        },
        Hide : function ()
        {
            MLogin.PhoneLogin.Reset();
            $(MLogin.Config.Frames[MLogin.PhoneLogin.Index]).hide()
        },
        Reset : function ()
        {
            $("#txtphonecode").val("");
            $("#dvphonemsg").hide();
            $("#dvphonemsg span").html("")
        },
        ShowError : function ()
        {
            var a = arguments[0] || "";
            if (a)
            {
                $("#dvphonemsg").show();
                $("#dvphonemsg span").html(a)
            }
            else
            {
                $("#dvphonemsg").hide();
                $("#dvphonemsg span").html("")
            }
        },
        Loading : function ()
        {
            $("#btnPhoneLogin").val("登录中...");
            $("#btnPhoneLogin").attr("disabled", "disabled")
        },
        ResetLoading : function ()
        {
            $("#btnPhoneLogin").val("登录");
            $("#btnPhoneLogin").removeAttr("disabled", "disabled")
        }
    },
    LoginCallBack : function (a)
    {
        a= a.replace(/^\w+\((.*)\)$/,"$1");
        if (!a)
        {
            MLogin.ShowErrorMessage("login fail!unkown error!");
            return
        }
        if (a.return_code == 0 && a.data.nextAction == 0)
        {
            if (a.data && a.data.autoLoginSessionKey && a.data.autoLoginSessionKey.length > 0)
            {
                MLogin.AutoLogin.SetCookie()
            }
            MLogin.ShowErrorMessage("");
            if (MLogin.Config.CurrentType == 6)
            {
                MLogin.LoginSuccess(a.data.ticket, (parseInt(MLogin.Config.MAreaId) * 100 + 2))
            }
            else
            {
                MLogin.LoginSuccess(a.data.ticket, (parseInt(MLogin.Config.MAreaId) * 100 + MLogin.Config.FromLoginType))
            }
        }
        else
        {
            MLogin.ResetLoading();
            if (MLogin.Config.CurrentType == 6)
            {
                if (a.return_code == -1012004)
                {
                    MLogin.AutoLogin.DelCookie()
                }
                if (location.pathname.toLowerCase() == "/mlogin.aspx")
                {
                    if (!a.data || a.data.guid == "")
                    {
                        MLogin.StaticLogin.Show();
                        MLogin.Config.GUID = "";
                        return
                    }
                }
                else
                {
                    MLogin.AutoLogin.DelCookie()
                }
            }
            if (a.data && a.data.nextAction)
            {
                switch (a.data.nextAction)
                {
                    case 2:
                        MLogin.StaticLogin.Show();
                        MLogin.Config.GUID = "";
                        break;
                    case 8:
                        MLogin.CheckCodeLogin.Show();
                        MLogin.Config.GUID = a.data.guid;
                        $("#imgrnd").attr("src", a.data.checkCodeUrl);
                        break;
                    case 13:
                        switch (a.data.deviceDisplayType)
                        {
                            case "X6":
                            case "X8":
                            case "E8":
                            case "D6":
                            default:
                                MLogin.SafeX6Login.Show();
                                MLogin.SafeX6Login.ShowChallenge(a.data.challenge);
                                break;
                            case "A8":
                            case "USB":
                                MLogin.ChallengeLogin.Show();
                                MLogin.ChallengeLogin.ShowChallenge(a.data.challenge);
                                break
                        }
                        MLogin.Config.GUID = a.data.guid;
                        break;
                    case 18:
                        MLogin.SafeCardLogin.Show();
                        MLogin.Config.GUID = a.data.guid;
                        MLogin.SafeCardLogin.ShowChallenge(a.data.challenge);
                        break;
                    default:
                        MLogin.ShowErrorMessage(a.return_message);
                        break
                }
                if (a.return_message)
                {
                    MLogin.ShowErrorMessage(a.return_message)
                }
                else
                {
                    if (a.data.failReason)
                    {
                        MLogin.ShowErrorMessage(a.data.failReason)
                    }
                }
            }
            else
            {
                switch (a.return_code)
                {
                    default:
                        if (a.return_message)
                        {
                            MLogin.ShowErrorMessage(a.return_message)
                        }
                        else
                        {
                            MLogin.ShowErrorMessage("System Error！" + a.return_code)
                        }
                        break;
                    case -10515903:
                        $("#txtrnd").val("").focus();
                        MLogin.Config.GUID = a.data.guid;
                        $("#imgrnd").attr("src", a.data.checkCodeUrl);
                        MLogin.ShowErrorMessage(a.return_message);
                        break;
                    case -10901142:
                        MLogin.CheckCodeLogin.Hide();
                        MLogin.Cancel();
                        $("#txtpassword").val("");
                        MLogin.ShowErrorMessage(a.return_message);
                        break;
                    case -10242217:
                    case -10242302:
                        MLogin.Cancel();
                        MLogin.ShowErrorMessage(a.return_message);
                        break;
                    case -10515005:
                        MLogin.AutoLogin.DelCookie();
                        break;
                    case 20753:
                        MLogin.ShowErrorMessage(a.return_message);
                        break;
                    case -1012030:
                        MLogin.ShowErrorMessage("该帐号未升级为起点帐号，请用盛大通行证登录，3秒后会为您跳转。");
                        setTimeout(function ()
                        {
                            MLogin.CopLogin.SdoLogin()
                        }, 3000);
                        break
                }
            }
        }
    },
    LoginSuccess : function (c, b)
    {
        if (MLogin.Config.IsOutSite)
        {
            var a = MLogin.GetReturnUrl();
            if (a.indexOf("?") > -1)
            {
                a += "&ticket=" + c
            }
            else
            {
                a += "?ticket=" + c
            }
            MLogin.TopRedirect(a)
        }
        else
        {
            var a = MLogin.Config.OAJumpUrl + "?appId={0}&sitetype={1}&loginfrom={4}&returnURL={2}&ticket={3}&ticketType=1".format(MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetReturnUrl()), c, b);
            MLogin.TopRedirect(a)
        }
    },
    Cancel : function ()
    {
        if (MLogin.Config.FromLoginType == 0)
        {
            MLogin.PhoneLogin.Show()
        }
        else
        {
            MLogin.StaticLogin.Show()
        }
    },
    GetSdoUpdateUrl : function ()
    {
        var c = MLogin.Config.OAJumpUrl + "?appId={0}&sitetype={1}&loginfrom=3131&returnurl={2}".format(13, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetUnionReturnUrl()));
        var a = location.origin + "/sdoupdate.aspx?returnurl={0}&backurl={1}".format(encodeURIComponent(MLogin.GetReturnUrl()), encodeURIComponent(c));
        var b = "{0}?appid={1}&areaid={2}&format={3}&serviceurl={4}&backurl={5}".format(MLogin.GetAjaxUrl("CheckSdoTicketUrl"), 13, MLogin.Config.MAreaId, "redirect", encodeURIComponent(a), encodeURIComponent(c));
        return b
    },
    GetReturnUrl : function ()
    {
        return MLogin.Config.ReturnUrl
    },
    GetUnionReturnUrl : function ()
    {
        return MLogin.GetReturnUrl()
    },
    ShowErrorMessage : function (a)
    {
        switch (MLogin.Config.CurrentType)
        {
            case 0:
            default:
                MLogin.StaticLogin.ShowError(a);
                break;
            case 1:
                MLogin.CheckCodeLogin.ShowError(a);
                break;
            case 2:
                MLogin.SafeCardLogin.ShowError(a);
                break;
            case 3:
                MLogin.SafeX6Login.ShowError(a);
                break;
            case 4:
                MLogin.ChallengeLogin.ShowError(a);
                break;
            case 5:
                MLogin.PhoneLogin.ShowError(a);
                break
        }
    },
    ResetLoading : function ()
    {
        switch (MLogin.Config.CurrentType)
        {
            case 0:
            default:
                MLogin.StaticLogin.ResetLoading();
                break;
            case 1:
                MLogin.CheckCodeLogin.ResetLoading();
                break;
            case 2:
                MLogin.SafeCardLogin.ResetLoading();
                break;
            case 3:
                MLogin.SafeX6Login.ResetLoading();
                break;
            case 4:
                MLogin.ChallengeLogin.ResetLoading();
                break;
            case 5:
                MLogin.PhoneLogin.ResetLoading();
                break
        }
    },
    HideAllFrame : function ()
    {
        $(".loginframe").hide()
    },
    CopLogin :
    {
        SinaLogin : function ()
        {
            var a = MLogin.Config.OAJumpUrl + "?appId={0}&sitetype={1}&loginfrom=12&returnURL={2}&ticketType=1".format(MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetUnionReturnUrl()));
            MLogin.TopRedirect("{0}?appid={1}&areaid={2}&serviceurl={3}&frametype=3&endpointos={4}&diaplay=1".format(MLogin.GetAjaxUrl("SinaLoginUrl"), MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(a), Common.GetEndPointType()))
        },
        AlipayLogin : function ()
        {
            var a = MLogin.Config.OAJumpUrl + "?appId={0}&sitetype={1}&loginfrom=11&returnURL={2}&ticketType=1".format(MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetUnionReturnUrl()));
            MLogin.TopRedirect("{0}?appid={1}&areaid={2}&serviceurl={3}&frametype=3&endpointos={4}&view=wap".format(MLogin.GetAjaxUrl("AlipayLoginUrl"), MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(a), Common.GetEndPointType()))
        },
        QQLogin : function ()
        {
            var a = MLogin.Config.OAJumpUrl + "?appId={0}&ticketType=1&sitetype={1}&loginfrom=13&returnURL={2}".format(MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetUnionReturnUrl()));
            MLogin.TopRedirect("{0}?appid={1}&areaid={2}&serviceurl={3}&frametype=3&endpointos={4}&g_ut=2".format(MLogin.GetAjaxUrl("QQLoginUrl"), MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(a), Common.GetEndPointType()))
        },
        BaiduLogin : function ()
        {
            var a = MLogin.Config.OAJumpUrl + "?appId={0}&ticketType=1&sitetype={1}&loginfrom=17&returnURL={2}".format(MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(MLogin.GetUnionReturnUrl()));
            MLogin.TopRedirect("{0}?appid={1}&areaid={2}&serviceurl={3}&frametype=3&endpointos={4}&display=mobile".format(MLogin.GetAjaxUrl("BaiduLoginUrl"), MLogin.Config.MAppId, MLogin.Config.MAreaId, encodeURIComponent(a), Common.GetEndPointType()))
        },
        SdoLogin : function ()
        {
            var d = location.origin + "/sdoupdateredirect.aspx?" + $.param(
                    {
                        areaid : MLogin.Config.MAreaId,
                        returnurl : MLogin.GetReturnUrl()
                    }
                );
            var c = "https://cas.sdo.com/cas/login?appid=10&areaId=31&service=" + encodeURIComponent(d);
            var a = "locationTarget=top&directTarget=1&serviceUrl=" + encodeURIComponent(c);
            var b = "http://login.sdo.com/wap?regParam=" + encodeURIComponent(a) + "&appId=10&areaId=31&autoLogin=1&returnURL=" + encodeURIComponent(d);
            MLogin.TopRedirect(b)
        }
    },
    TopRedirect : function (a)
    {
        var page=$.http.get(a);
        MLogin.onComplete();
    },
    ToPassword : function ()
    {
        var a = "/mlogin.aspx?returnurl=" + encodeURIComponent(MLogin.Config.ReturnUrl);
        a = "/profile/resetpassword.aspx?returnurl=" + encodeURIComponent(a);
        MLogin.TopRedirect(a)
    },
    AdjustIframeHeight : function ()
    {
        try
        {
            if (window.M_iframe_login_interval)
            {
                clearInterval(window.M_iframe_login_interval)
            }
            window.M_iframe_login_interval = setInterval(function ()
            {
                var b = $("body").height();
                if (b > 0)
                {
                    var c = window.M_iframe_login ? window.M_iframe_login : 0;
                    if (c != b)
                    {
                        window.M_iframe_login = b;
                        window.parent.postMessage(
                            {
                                method : "adjust-height",
                                height : b
                            }, "*")
                    }
                }
            }, 100)
        }
        catch (a)
        {}

    }
};

MLogin.Config.MAreaId = 31;
MLogin.Config.ReturnUrl = 'http://3g.qidian.com/profile/index.aspx?returnurl=http://3g.qidian.com/';