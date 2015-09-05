/**
 * Created by Roy on 15-9-5.
 */
var BookReader =
{
    Data :
    {
        chapterAjaxUrl : "/ajax/reader.ashx",
        buyAjaxUrl : "/ajax/buychapter.ashx",
        vipChapterUrl : "http://vipimage.qidian.com/BookReader/ChapterImageM.aspx",
        readStyleDomain : ".qidian.com"
    },
    Ajax : function (b, d, e, a, c)
    {
        c = $.extend(
            {
                url : b,
                type : "POST",
                cache : false,
                dataType : "json",
                data : d,
                success : e,
                error : a,
                timeout : BookReader.Options.Config.timeOutSecond
            }, c);
        $.ajax(c)
    },
    ChapterList :
    {
        BookInfo : null,
        Chapters : null,
        Init : function ()
        {
            BookReader.ChapterList.Chapters = new Array()
        },
        GetBookInfo : function ()
        {
            if (BookReader.ChapterList.BookInfo != null)
            {
                return BookReader.ChapterList.BookInfo
            }
            return BookReader.Storage.GetBookInfoFromStorage()
        },
        Add : function (a)
        {
            if (a != null && a.ChapterId > 0)
            {
                if (BookReader.ChapterList.Chapters == null)
                {
                    BookReader.ChapterList.Chapters = new Array()
                }
                else
                {
                    if (BookReader.Options.Config.readMode == 3)
                    {
                        if (BookReader.ChapterList.GetChapterIndex(a.ChapterId) < 0)
                        {
                            BookReader.ChapterList.Chapters.push(a)
                        }
                    }
                    else
                    {
                        if (BookReader.Options.Config.readMode != 3 && BookReader.ChapterList.Chapters.length >= BookReader.Options.Config.maxChapterCache)
                        {
                            BookReader.ChapterList.Chapters.shift();
                            if (BookReader.ChapterList.GetChapterIndex(a.ChapterId) < 0)
                            {
                                BookReader.ChapterList.Chapters.push(a)
                            }
                            else
                            {
                                var b = BookReader.ChapterList.GetChapterById(a.ChapterId);
                                if (b != null)
                                {
                                    b = a
                                }
                            }
                        }
                        else
                        {
                            if (BookReader.ChapterList.GetChapterIndex(a.ChapterId) < 0)
                            {
                                BookReader.ChapterList.Chapters.push(a)
                            }
                            else
                            {
                                var b = BookReader.ChapterList.GetChapterById(a.ChapterId);
                                if (b != null)
                                {
                                    b = a
                                }
                            }
                        }
                    }
                }
            }
        },
        GetChapterIndex : function (c)
        {
            var a = -1;
            if (BookReader.ChapterList.Chapters != null && BookReader.ChapterList.Chapters.length > 0)
            {
                for (var b = 0; b < BookReader.ChapterList.Chapters.length; b++)
                {
                    if (BookReader.ChapterList.Chapters[b] && c == BookReader.ChapterList.Chapters[b].ChapterId)
                    {
                        a = b;
                        break
                    }
                }
            }
            return a
        },
        GetChapterById : function (b)
        {
            var a = BookReader.ChapterList.GetChapterByIdFromCache(b);
            if (a != null)
            {
                return a
            }
            return BookReader.Storage.GetChapterFromStorage(b)
        },
        GetChapterByIdFromCache : function (b)
        {
            if (BookReader.ChapterList.Chapters != null && BookReader.ChapterList.Chapters.length > 0)
            {
                for (var a = 0; a < BookReader.ChapterList.Chapters.length; a++)
                {
                    if (BookReader.ChapterList.Chapters[a] && b == BookReader.ChapterList.Chapters[a].ChapterId)
                    {
                        return BookReader.ChapterList.Chapters[a]
                    }
                }
            }
            return null
        },
        LoadChapterById : function ()
        {
            var f = arguments[0] || 0;
            var c = arguments[1] || 0;
            var b = 1;
            if (arguments != null && arguments.length >= 3)
            {
                b = arguments[2]
            }
            BookReader.Display.CloseDialog();
            if (f <= 0)
            {
                BookReader.Display.ShowMessage("无效的书号！", "提示信息：", true);
                return
            }
            var e = BookReader.ChapterList.GetChapterById(c);
            if (e != null)
            {
                BookReader.ChapterList.BookInfo = BookReader.ChapterList.GetBookInfo();
                BookReader.Display.ShowChapter(c, b);
                return
            }
            if ((arguments != null && arguments.length == 2) || b == -1)
            {
                BookReader.Display.ShowDialogLoading()
            }
            else
            {
                if (b == 0)
                {
                    if ($(BookReader.Display.Containers.PrevMsgId).length > 0)
                    {
                        return
                    }
                    BookReader.Display.ShowPrevNextLoading(b)
                }
                else
                {
                    if ($(BookReader.Display.Containers.NextMsgId).length > 0)
                    {
                        return
                    }
                    BookReader.Display.ShowPrevNextLoading(b)
                }
            }
            var d =
            {
                ajaxMethod : "getchapterinfonew",
                bookid : f,
                chapterid : c
            };
            var g = function (h)
            {
                BookReader.ChapterList.LoadChapterCallBack(f, c, h, b)
            };
            var a = function (j, i)
            {
                $(BookReader.Display.Containers.PrevMsgId).remove();
                $(BookReader.Display.Containers.NextMsgId).remove();
                var h = '<a href="javascript:BookReader.ChapterList.LoadChapterById(' + f + "," + c + "," + b + ');">章节加载失败，点击重新加载</a>';
                if (BookReader.Options.Config.readMode == 3)
                {
                    BookReader.Display.ShowMessage("章节加载失败，请稍后重试！", "提示信息：", true, function ()
                        {
                            BookReader.ScrollReader.BindScroll();
                            BookReader.Display.CloseDialog()
                        }
                    )
                }
                else
                {
                    BookReader.Display.ShowMessage(h, "提示信息：", true)
                }
            };
            BookReader.Ajax(BookReader.Data.chapterAjaxUrl, d, g, a)
        },
        GetVipChapterContent : function ()
        {
            var l = arguments[0] || 0;
            var h = arguments[1] || 0;
            var j = arguments[2] || 0;
            if (l <= 0 || h <= 0)
            {
                return ""
            }
            var b = ' onerror="BookReader.Display.ImgLoadError(this);" ';
            if (BookReader.ChapterList.GetBookInfo() != null)
            {
                if (BookReader.ChapterList.GetBookInfo().IsCartoon)
                {
                    return '<img src="/book/DmVIPImgShow.aspx?bookid=' + l + "&chapterid=" + h + '" style="width:' + BookReader.Options.Config.vipImgWidth + 'px;" onload="BookReader.Other.FixImg(this);" ' + b + " />"
                }
            }
            var e = BookReader.Options.Config.vipImgWidth;
            var g = "";
            var k = "";
            var c = "";
            if (j > 0)
            {
                k = ' style="text-align:center;min-height:' + ($(window).height() + 50) + 'px;" '
            }
            for (var f = 0; f <= j; f++)
            {
                var d = "img_" + h + "_" + f;
                var a = BookReader.ReadSetting.getVipChapterRnd();
                c = "{0}?bookid={1}&chapterid={2}&width={3}&page={4}&rd={5}".format(BookReader.Data.vipChapterUrl, l, h, e, f, a);
                g += '<div class="xdiv" {0}>'.format(k);
                g += '<img id="{0}" src="{1}" style="filter: chroma(color=#ffffff);" {2}/>'.format(d, c, b);
                g += "</div>";
                c = ""
            }
            return g
        },
        LoadChapterCallBack : function (h, g, a)
        {
            var f = 1;
            if (arguments != null && arguments.length >= 4)
            {
                f = arguments[3]
            }
            if (a && a.IsSuccess)
            {
                if (BookReader.ChapterList.Chapters.length > 0)
                {
                    BookReader.Other.Tracker()
                }
                var d = a.ReturnObject[1];
                var c = a.ReturnObject[2];
                var b = false;
                if (BookReader.ChapterList.BookInfo == null)
                {
                    BookReader.ChapterList.BookInfo = a.ReturnObject[0]
                }
                if (a.ReturnCode && a.ReturnCode == 1)
                {}

                else
                {
                    if (a.ReturnCode && (a.ReturnCode == 100 || a.ReturnCode == 200))
                    {
                        b = true;
                        if (a.ReturnCode == 200)
                        {
                            d.Content = '<img src="/book/DmVIPImgShow.aspx?bookid=' + h + "&chapterid=" + g + '" style="width:300px;" onload="BookReader.Other.FixImg(this);"/>'
                        }
                        else
                        {
                            if (a.ReturnCode == 100)
                            {
                                BookReader.Options.Config.checkInState = a.ReturnObject[3];
                                BookReader.Other.ShowCheckInImg()
                            }
                        }
                    }
                }
                if (d != null)
                {
                    BookReader.ChapterList.Add(d);
                    BookReader.Display.ShowChapter(d.ChapterId, f);
                    BookReader.Display.PendHideCurrent(d);
                    if (c != null && c.length > 0)
                    {
                        for (var e = 0; e < c.length; e++)
                        {
                            BookReader.ChapterList.Add(c[e])
                        }
                        BookReader.Display.PendHideNext(c)
                    }
                }
            }
            else
            {
                BookReader.Display.ShowErrorChapter(a, h, g, f)
            }
        },
        BuyChapterById : function ()
        {
            var f = arguments[0] || 0;
            var d = arguments[1] || 0;
            var b = 1;
            if (arguments != null && arguments.length >= 3)
            {
                b = arguments[2]
            }
            if (f <= 0)
            {
                BookReader.Display.ShowMessage("无效的书号！", "提示信息：", true);
                return
            }
            if (d <= 0)
            {
                BookReader.Display.ShowMessage("无效的章节号！", "提示信息：", true);
                return
            }
            if ($("#chbAuto").length > 0)
            {
                if ($("#chbAuto").is(":checked"))
                {
                    BookReader.ReadSetting.SetAutoBuy(1)
                }
                else
                {
                    BookReader.ReadSetting.SetAutoBuy(0)
                }
            }
            BookReader.Display.CloseDialog();
            var c = '<img src="/images/ajax-loader_1.gif" style="border: 0;vertical-align: middle;" alt="请稍候..." />正在为您订阅，请稍候！';
            if (BookReader.Options.Config.readMode == 3)
            {
                BookReader.Display.ShowPrevNextMsg(b, c)
            }
            else
            {
                BookReader.Display.ShowMessage(c, "章节订阅：", false)
            }
            var e =
            {
                ajaxMethod : "buychapter",
                bookid : f,
                chapterid : d
            };
            var g = function (h)
            {
                if (h.IsSuccess)
                {
                    BookReader.CheckVipLevelCallBack(function ()
                        {
                            BookReader.ChapterList.BuyChapterCallBack(f, d, h, b)
                        }
                    )
                }
                else
                {
                    BookReader.ChapterList.BuyChapterCallBack(f, d, h, b)
                }
            };
            var a = function (k, h)
            {
                if (h == "timeout")
                {
                    var i = '<a href="javascript:BookReader.ChapterList.BuyChapterById(' + f + "," + d + "," + b + ');">好像网络有点问题哦，点我重试！</a>';
                    var j = function ()
                    {
                        BookReader.Display.CloseDialog();
                        if (BookReader.Options.Config.readMode == 3)
                        {
                            $(".chaptermsg,.chapterloading").remove();
                            BookReader.ScrollReader.BindScroll()
                        }
                        BookReader.ChapterList.LoadChapterById(BookReader.Options.Config.bookId, BookReader.Options.Config.currentChapterId, b)
                    };
                    BookReader.Display.ShowMessage(i, "订阅提示", true, j)
                }
                else
                {
                    var i = '<a href="javascript:BookReader.ChapterList.BuyChapterById(' + f + "," + d + "," + b + ');">章节订阅失败，请点击重试！</a>';
                    var j = function ()
                    {
                        BookReader.Display.CloseDialog();
                        if (BookReader.Options.Config.readMode == 3)
                        {
                            BookReader.ScrollReader.BindScroll()
                        }
                    };
                    BookReader.Display.ShowMessage(i, "订阅提示", true, j)
                }
            };
            BookReader.Ajax(BookReader.Data.buyAjaxUrl, e, g, a)
        },
        BuyChapterCallBack : function (f, e, a)
        {
            var c = 1;
            if (arguments != null && arguments.length >= 4)
            {
                c = arguments[3]
            }
            if (a.IsSuccess)
            {
                var d = BookReader.ChapterList.GetChapterIndex(e);
                if (d >= 0)
                {
                    BookReader.ChapterList.Chapters.splice(d, 1)
                }
                if (!BookReader.ReadSetting.GetAutoBuy())
                {
                    BookReader.Display.ShowMessage("订阅成功!", "订阅提示", true)
                }
                if (BookReader.Options.Config.readMode == 3)
                {
                    if (c == 0)
                    {
                        $(BookReader.Display.Containers.PrevMsgId).remove()
                    }
                    else
                    {
                        $(BookReader.Display.Containers.NextMsgId).remove()
                    }
                }
                BookReader.ChapterList.LoadChapterById(f, e, c);
                if (a.checkin)
                {
                    BookReader.Options.Config.checkInState = 1;
                    BookReader.Other.ShowCheckInImg()
                }
                return
            }
            else
            {
                var b = a.ReturnString;
                var g = function ()
                {
                    BookReader.Display.CloseDialog();
                    if ($(".chapter").length == 0)
                    {
                        BookReader.Display.ShowBuyMsg(f, e, c)
                    }
                    else
                    {
                        if (BookReader.Options.Config.readMode == 3)
                        {
                            BookReader.Display.ShowBuyMsg(f, e, c)
                        }
                    }
                };
                if (a.ReturnCode == -1001)
                {
                    BookReader.Display.ShowConfirm("您还没有登录，现在去登录？", "提示信息", function ()
                    {
                        BookReader.Other.GoToLogin()
                    }, g)
                }
                else
                {
                    if (a.ReturnCode == "-2001")
                    {
                        BookReader.Display.CloseDialog();
                        new($.dialog)(
                            {
                                content : b,
                                title : "订阅提示",
                                yesBtnText : "立即充值",
                                yesCallBack : function ()
                                {
                                    BookReader.Other.GoToCharge()
                                },
                                cancelBtnText : "取消",
                                cancelCallBack : function ()
                                {
                                    BookReader.Display.CloseDialog();
                                    BookReader.Display.ShowBuyMsg(f, e)
                                }
                            }
                        ).open()
                    }
                    else
                    {
                        BookReader.Display.ShowMessage(b, "订阅提示", true, function ()
                            {
                                BookReader.Display.CloseDialog();
                                BookReader.Display.ShowBuyMsg(f, e, c)
                            }
                        )
                    }
                }
            }
        }
    },
    AutoMark : function ()
    {
        var g = arguments[0] || 0;
        var d = arguments[1] || 0;
        var a = 0;
        if (arguments != null && arguments.length >= 3)
        {
            a = arguments[2]
        }
        var h = arguments[3] || "";
        var c = BookReader.Storage.GetChapterFromStorage(d);
        if (c != null)
        {
            return
        }
        try
        {
            var b = "http://afav.if.qidian.com/ajax.ashx?opName=autoBookmark&bookId=" + g + "&isvip=" + (a == 1 ? "1" : "0") + "&chapterid=" + d + "&chapterName=" + encodeURIComponent(h);
            BookReader.Ajax(b, {}, function ()  {}, function ()  {},
                {
                    type : "GET",
                    cache : false,
                    dataType : "jsonp"
                }
            )
        }
        catch (f)
        {}

    },
    AddReadingProcess : function (h, e, g, d, a, b)
    {
        if (!Common.checkLoginByCookie())
        {
            return
        }
        var c =
        {
            ajaxMethod : "addreadingprocess",
            bookid : h,
            chapterid : e,
            chaptername : g,
            position : d,
            isvip : a,
            updatetime : b
        };
        var i = function ()  {};
        var f = function ()  {};
        BookReader.Ajax("/ajax/reader.ashx", c, i, f)
    },
    RefreshTitle : function ()
    {
        var b = 1;
        if (arguments != null && arguments.length >= 1)
        {
            b = arguments[0]
        }
        var a = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
        if (a != null)
        {
            var d = BookReader.ChapterList.GetBookInfo().BookName + "-" + BookReader.ChapterList.GetBookInfo().AuthorName + " 著-" + a.ChapterName;
            if (document.title != d)
            {
                document.title = d;
                BookReader.Other.PushState(
                    {
                        chapterId : BookReader.Options.Config.currentChapterId
                    }, d, "/book/bookreader.aspx?bookid=" + BookReader.Options.Config.bookId + "&chapterid=" + BookReader.Options.Config.currentChapterId);
                BookReader.AutoMark(BookReader.Options.Config.bookId, BookReader.Options.Config.currentChapterId, a.IsVip == 1 ? 1 : 0, a.ChapterName);
                BookReader.AddReadingProcess(BookReader.Options.Config.bookId, BookReader.Options.Config.currentChapterId, a.ChapterName, 0, a.IsVip == 1 ? 1 : 0, a.LastUpdateTime);
                BookReader.Other.SetBookMark()
            }
            var c = "/book/bookchapterlist.aspx?bookid={0}&chapterid={1}".format(BookReader.Options.Config.bookId, a.ChapterId);
            $("#fundir a").attr("href", c);
            $("#btndir").attr("href", c);
            $("#ahudong").attr("href", "/book/interaction.aspx?bookid={0}&chapterid={1}&reader=1&action=4".format(BookReader.Options.Config.bookId, a.ChapterId))
        }
        setTimeout(function ()
        {
            BookReader.Other.InitHelpBox()
        }, 100)
    },
    PagePrev : function ()
    {
        switch (BookReader.Options.Config.readMode)
        {
            case 1:
            default:
                BookReader.AjaxReader.Prev();
                break;
            case 3:
                BookReader.ScrollReader.Config.scrollOrPager = 1;
                BookReader.ScrollReader.Prev();
                break
        }
    },
    PageNext : function ()
    {
        switch (BookReader.Options.Config.readMode)
        {
            case 1:
            default:
                BookReader.AjaxReader.Next();
                break;
            case 3:
                BookReader.ScrollReader.Config.scrollOrPager = 1;
                BookReader.ScrollReader.Next();
                break
        }
    },
    Options :
    {
        Config :
        {
            bookId : 0,
            chapterId : 0,
            domainUrl : "http://m.qidian.com",
            currentChapterId : 0,
            maxChapterCache : 10,
            readMode : 1,
            vipImgWidth : 320,
            maxShowChapterCnt : 20,
            lineHeightRate : 2,
            timeOutSecond : 10000,
            checkInState : 0,
            firstVipChapterId : 0
        }
    },
    Initialize : function (c)
    {
        var a = true;
        if (arguments != null && arguments.length >= 2)
        {
            a = arguments[1]
        }
        BookReader.Other.InitContextMenu();
        if (a)
        {
            BookReader.ChapterList.Init()
        }
        BookReader.Options.Config.domainUrl = location.origin;
        BookReader.Storage.Init(c.bookId);
        BookReader.ReadMode.InitReadMode();
        $(BookReader.Display.Containers.ChapterDivId).empty();
        BookReader.ScrollReader.UnBindScroll();
        if (c.bookId)
        {
            BookReader.Options.Config.bookId = c.bookId
        }
        if (!c.chapterId)
        {
            c.chapterId = 0
        }
        BookReader.Options.Config.chapterId = c.chapterId;
        BookReader.Options.Config.currentChapterId = c.chapterId;
        BookReader.ChapterList.LoadChapterById(c.bookId, c.chapterId);
        var f = Common.query();
        if (f && f.checkin === "1")
        {
            BookReader.Options.Config.checkInState = 1
        }
        BookReader.ReadSetting.InitUserStyle();
        BookReader.Options.Config.vipImgWidth = $(window).width() - 20;
        BookReader.Interaction.Init();
        $("#funshang").off("click").click(function ()
            {
                BookReader.Interaction.ToggleShang()
            }
        );
        $("#afeedback").off("click").click(function ()
            {
                BookReader.Other.ToFeedBack()
            }
        );
        $("#funfont").off("click").click(function ()
            {
                BookReader.ReadSetting.ToggleFontSize()
            }
        );
        $("#funbgcolor").off("click").click(function ()
            {
                BookReader.ReadSetting.ToggleBgColor()
            }
        );
        $("#funlight").off("click").click(function ()
            {
                BookReader.ReadSetting.SetLight()
            }
        );
        $("#funlocal").off("click").click(function ()
            {
                BookReader.Storage.ShowStorage()
            }
        );
        $("#funmode").off("click").click(function ()
            {
                BookReader.ReadSetting.ToggleMode()
            }
        );
        $("#funprev,#btnPre").off("click").click(function ()
            {
                BookReader.PagePrev()
            }
        );
        $("#funmark").off("click").click(function ()
            {
                BookReader.Other.AddBookMark()
            }
        );
        $("#funnext,#btnNext").off("click").click(function ()
            {
                BookReader.PageNext()
            }
        );
        $("#btnShelf").off("click").click(function ()
            {
                BookReader.Other.addToBookshelf($(this).attr("bookid"))
            }
        );
        $("#btnmorebook").off("click").click(function ()
            {
                BookReader.Other.toggleThBooks($(this).attr("bookid"))
            }
        );
        try
        {
            var b = "onorientationchange" in window,
                d = b ? "orientationchange" : "resize";
            window.addEventListener(d, function ()
            {
                setTimeout(function ()
                {
                    BookReader.Options.Config.vipImgWidth = $(window).width() - 20;
                    BookReader.Display.Resize()
                }, 200)
            }, false)
        }
        catch (g)
        {}

    },
    AjaxReader :
    {
        Next : function ()
        {
            var b = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
            if (b)
            {
                var c = b.NextChapterId;
                if (c > 0)
                {
                    var a = BookReader.ChapterList.GetChapterById(c);
                    if (a)
                    {
                        if (a.Price > 0)
                        {
                            BookReader.Display.ShowErrorChapter(
                                {
                                    IsSuccess : false,
                                    ReturnCode : -108,
                                    ReturnString : "该章节没有订阅！",
                                    ReturnObject : a
                                }, BookReader.Options.Config.bookId, a.ChapterId)
                        }
                        else
                        {
                            BookReader.AjaxReader.ShowChapter(c)
                        }
                    }
                    else
                    {
                        BookReader.ChapterList.LoadChapterById(BookReader.Options.Config.bookId, c)
                    }
                }
                else
                {
                    if (BookReader.ChapterList.BookInfo.IsYunChengBook)
                    {
                        Common.toast("已经是最后一章了！")
                    }
                    else
                    {
                        BookReader.Other.GoToLastPage()
                    }
                }
            }
        },
        Prev : function ()
        {
            var b = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
            if (b)
            {
                var c = b.PreChapterId;
                if (c > 0)
                {
                    var a = BookReader.ChapterList.GetChapterById(c);
                    if (a)
                    {
                        if (a.Price > 0)
                        {
                            BookReader.Display.ShowErrorChapter(
                                {
                                    IsSuccess : false,
                                    ReturnCode : -108,
                                    ReturnString : "该章节没有订阅！",
                                    ReturnObject : a
                                }, BookReader.Options.Config.bookId, a.ChapterId)
                        }
                        else
                        {
                            BookReader.AjaxReader.ShowChapter(c)
                        }
                    }
                    else
                    {
                        BookReader.ChapterList.LoadChapterById(BookReader.Options.Config.bookId, c)
                    }
                }
                else
                {
                    Common.toast("已经是第一章了！")
                }
            }
        },
        ShowChapter : function (d)
        {
            var b = BookReader.ChapterList.GetChapterById(d);
            if (b != null)
            {
                BookReader.Display.CloseDialog();
                scroll(0, 0);
                var c = BookReader.Display.GetChapterHTML(d);
                $(BookReader.Display.Containers.ChapterDivId).html(c);
                var a = false;
                var e = BookReader.ChapterList.GetBookInfo();
                if (e != null)
                {
                    a = e.IsCartoon
                }
                if (b.IsVip != 1 && !a)
                {
                    BookReader.Display.LoadBookChapterPic(BookReader.Display.Containers.ChapterDiv)
                }
            }
            BookReader.Options.Config.currentChapterId = d;
            BookReader.RefreshTitle();
            BookReader.Other.freshAd()
        }
    },
    ScrollReader :
    {
        Config :
        {
            scrollOrPager : 1,
            SupportsTouches : typeof(window.ontouchstart) != "undefined"
        },
        UnBindScroll : function ()
        {
            $(document).unbind("scroll")
        },
        BindScroll : function ()
        {
            BookReader.ScrollReader.UnBindScroll();
            $(document).bind("scroll", function ()
                {
                    BookReader.ScrollReader.ScrollFun();
                    BookReader.ScrollReader.ScrollHistoryState()
                }
            )
        },
        ScrollFun : function ()
        {
            if (BookReader.Other.GetScrollTop() < 20)
            {
                if ($(".chapter").length >= BookReader.Options.Config.maxShowChapterCnt)
                {
                    if ($(BookReader.Display.Containers.PrevMaxDivId).length <= 0)
                    {
                        $("#dvprechapter").remove();
                        var c = 0;
                        var a = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
                        if (a)
                        {
                            c = a.PreChapterId
                        }
                        BookReader.Display.ShowPrevNextMax(0, '<a href="/book/bookreader.aspx?bookid={0}&chapterid={1}">点击阅读上一章</a>'.format(BookReader.Options.Config.bookId, c))
                    }
                }
                else
                {
                    if ($("#dvprechapter").length <= 0 && $(BookReader.Display.Containers.PrevMsgId).length <= 0)
                    {
                        var b = '<div class="chapterloading" id="dvprechapter" onclick="BookReader.ScrollReader.Prev();"><a href="javascript:void(0);" style="color:#ffffff;">点击加载上一章</a></div>';
                        $(BookReader.Display.Containers.ChapterDivId).prepend(b);
                        BookReader.ScrollReader.Config.PageOrScroll = 1
                    }
                }
            }
            else
            {
                if (BookReader.Other.GetScrollTop() + $(window).height() >= $(document.body).height() - 100)
                {
                    BookReader.ScrollReader.Config.scrollOrPager = 0;
                    if ($(BookReader.Display.Containers.NextMaxDivId).length > 0 || $(BookReader.Display.Containers.NextMsgId).length > 0)
                    {}

                    else
                    {
                        BookReader.ScrollReader.Next()
                    }
                }
            }
        },
        ScrollHistoryState : function ()
        {
            var b = 0;
            $(BookReader.Display.Containers.ChapterDivId + " .chapter").each(function (c, d)
                {
                    if ($(d).height() < $(window).height() && $(d).offset().top >= BookReader.Other.GetScrollTop() && ($(d).offset().top + $(d).height()) <= (BookReader.Other.GetScrollTop() + $(window).height()))
                    {
                        b = $(d).attr("chapterid");
                        return false
                    }
                    else
                    {
                        if ($(d).height() > $(window).height() && $(d).offset().top <= BookReader.Other.GetScrollTop() && (($(d).offset().top + $(d).height()) >= BookReader.Other.GetScrollTop() + $(window).height()))
                        {
                            b = $(d).attr("chapterid");
                            return false
                        }
                        else
                        {
                            if ($(d).offset().top >= BookReader.Other.GetScrollTop() && $(d).offset().top <= BookReader.Other.GetScrollTop() + $(window).height())
                            {
                                b = $(d).attr("chapterid");
                                return false
                            }
                        }
                    }
                }
            );
            if (b != BookReader.Options.Config.currentChapterId)
            {
                var a = BookReader.ChapterList.GetChapterById(b);
                if (a == null)
                {
                    return
                }
                BookReader.Options.Config.currentChapterId = b;
                BookReader.RefreshTitle()
            }
        },
        Next : function ()
        {
            var c = 0;
            var b = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
            if (b)
            {
                c = b.NextChapterId
            }
            if ($(BookReader.Display.Containers.NextMsgId).length > 0)
            {
                if ($(".chapter").length >= BookReader.Options.Config.maxShowChapterCnt)
                {
                    if (c > 0)
                    {
                        BookReader.ScrollReader.ScrollToChapter(c)
                    }
                    else
                    {
                        BookReader.ScrollReader.ScrollToBottom()
                    }
                }
                else
                {
                    if ($("#dv" + c).length > 0)
                    {
                        BookReader.ScrollReader.ScrollToChapter(c)
                    }
                    else
                    {
                        BookReader.ScrollReader.ScrollToBottom()
                    }
                }
            }
            else
            {
                if (c > 0)
                {
                    BookReader.ScrollReader.UnBindScroll();
                    var a = BookReader.ChapterList.GetChapterById(c);
                    if (a)
                    {
                        if (a.Price > 0)
                        {
                            BookReader.Display.ShowErrorChapter(
                                {
                                    IsSuccess : false,
                                    ReturnCode : -108,
                                    ReturnString : "该章节没有订阅！",
                                    ReturnObject : a
                                }, BookReader.Options.Config.bookId, a.ChapterId)
                        }
                        else
                        {
                            BookReader.ScrollReader.ShowChapter(c, 1)
                        }
                    }
                    else
                    {
                        if ($(BookReader.Display.Containers.NextMaxDivId).length > 0)
                        {
                            BookReader.ScrollReader.ScrollToBottom()
                        }
                        else
                        {
                            if ($(".chapter").length >= BookReader.Options.Config.maxShowChapterCnt)
                            {
                                BookReader.Display.ShowPrevNextMax(1, '<a href="/book/bookreader.aspx?bookid={0}&chapterid={1}">点击阅读下一章</a>'.format(BookReader.Options.Config.bookId, c));
                                BookReader.ScrollReader.BindScroll()
                            }
                            else
                            {
                                BookReader.ChapterList.LoadChapterById(BookReader.Options.Config.bookId, c, 1)
                            }
                        }
                    }
                }
                else
                {
                    BookReader.Display.ShowPrevNextMsg(1, '<a href="/book/lastpage.aspx?bookid={0}&chapterid={1}">已经是最后一章了！</a>'.format(BookReader.Options.Config.bookId, BookReader.Options.Config.currentChapterId))
                }
            }
        },
        Prev : function ()
        {
            var c = 0;
            var b = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
            if (b)
            {
                c = b.PreChapterId
            }
            if ($("#dv" + c).length > 0)
            {
                BookReader.ScrollReader.ScrollToChapter(c)
            }
            else
            {
                if (c > 0)
                {
                    BookReader.ScrollReader.UnBindScroll();
                    var a = BookReader.ChapterList.GetChapterById(c);
                    if (a)
                    {
                        if (a.Price > 0)
                        {
                            BookReader.Display.ShowErrorChapter(
                                {
                                    IsSuccess : false,
                                    ReturnCode : -108,
                                    ReturnString : "该章节没有订阅！",
                                    ReturnObject : a
                                }, BookReader.Options.Config.bookId, a.ChapterId)
                        }
                        else
                        {
                            $("#dvprechapter").remove();
                            BookReader.ScrollReader.ShowChapter(c, 0)
                        }
                    }
                    else
                    {
                        if ($(BookReader.Display.Containers.PrevMaxDivId).length > 0)
                        {
                            BookReader.ScrollReader.ScrollToTop()
                        }
                        else
                        {
                            if ($(".chapter").length >= BookReader.Options.Config.maxShowChapterCnt)
                            {
                                $("#dvprechapter").remove();
                                BookReader.Display.ShowPrevNextMax(0, '<a href="/book/bookreader.aspx?bookid={0}&chapterid={1}">点击阅读上一章</a>'.format(BookReader.Options.Config.bookId, c));
                                BookReader.ScrollReader.BindScroll()
                            }
                            else
                            {
                                $("#dvprechapter").remove();
                                BookReader.ChapterList.LoadChapterById(BookReader.Options.Config.bookId, c, 0)
                            }
                        }
                    }
                }
                else
                {
                    if ($("#dvprechapter").length > 0)
                    {
                        $("#dvprechapter").remove();
                        BookReader.Display.ShowPrevNextMsg(0, "已经是第一章了！")
                    }
                    else
                    {
                        BookReader.ScrollReader.ScrollToTop()
                    }
                }
            }
        },
        ShowChapter : function (e)
        {
            var c = 1;
            if (arguments != null && arguments.length >= 2)
            {
                c = arguments[1]
            }
            BookReader.ScrollReader.UnBindScroll();
            var b = BookReader.ChapterList.GetChapterById(e);
            if (b != null)
            {
                BookReader.Display.CloseDialog();
                if (c == 0)
                {
                    $(BookReader.Display.Containers.PrevMsgId).remove()
                }
                else
                {
                    $(BookReader.Display.Containers.NextMsgId).remove()
                }
                var d = BookReader.Display.GetChapterHTML(e);
                if (c == -1)
                {
                    $(BookReader.Display.Containers.ChapterDivId).empty()
                }
                if ($("#dv" + e).length <= 0)
                {
                    if (c == 0)
                    {
                        $(BookReader.Display.Containers.ChapterDivId).prepend(d)
                    }
                    else
                    {
                        if (c == 1)
                        {
                            $(BookReader.Display.Containers.ChapterDivId).append(d)
                        }
                        else
                        {
                            $(BookReader.Display.Containers.ChapterDivId).html(d)
                        }
                    }
                    var a = false;
                    var f = BookReader.ChapterList.GetBookInfo();
                    if (f != null)
                    {
                        a = f.IsCartoon
                    }
                    if (b.IsVip != 1 && !a)
                    {
                        BookReader.Display.LoadBookChapterPic(BookReader.Display.Containers.ChapterDiv)
                    }
                }
            }
            BookReader.Options.Config.currentChapterId = e;
            BookReader.RefreshTitle();
            BookReader.Other.freshAd();
            if (c == 1 && BookReader.ScrollReader.Config.scrollOrPager == 0)
            {
                BookReader.ScrollReader.BindScroll();
                BookReader.Display.CloseTools()
            }
            else
            {
                BookReader.Other.Animate($("#dv" + e).offset().top + 30, function ()
                    {
                        setTimeout(function ()
                        {
                            BookReader.ScrollReader.BindScroll();
                            BookReader.Display.CloseTools()
                        }, 200)
                    }
                )
            }
        },
        ScrollToChapter : function (a)
        {
            BookReader.ScrollReader.UnBindScroll();
            BookReader.Options.Config.currentChapterId = a;
            BookReader.RefreshTitle();
            BookReader.Other.Animate($("#dv" + a).offset().top + 30, function ()
                {
                    setTimeout(function ()
                    {
                        BookReader.ScrollReader.BindScroll();
                        BookReader.Display.CloseTools()
                    }, 200)
                }
            )
        },
        ScrollToTop : function ()
        {
            BookReader.ScrollReader.UnBindScroll();
            scroll(0, 0);
            setTimeout(function ()
            {
                BookReader.ScrollReader.BindScroll();
                BookReader.Display.CloseTools()
            }, 200)
        },
        ScrollToBottom : function ()
        {
            BookReader.ScrollReader.UnBindScroll();
            BookReader.Other.Animate($(document).height(), function ()
                {
                    setTimeout(function ()
                    {
                        BookReader.ScrollReader.BindScroll();
                        BookReader.Display.CloseTools()
                    }, 200)
                }
            )
        },
        GetUserAgent : function ()
        {
            return navigator.userAgent["toLowerCase"]()
        },
        IsUCWeb : function ()
        {
            var a = BookReader.ScrollReader.GetUserAgent();
            return a.indexOf("ucweb") > -1 || a.indexOf("ucbrowser") > -1
        }
    },
    Display :
    {
        Containers :
        {
            ChapterDiv : "readercontainer",
            ChapterDivId : "#readercontainer",
            PrevMsgId : "#prevmsg",
            NextMsgId : "#nextmsg",
            PrevMsgDiv : "prevmsg",
            NextMsgDiv : "nextmsg",
            PrevMaxDivId : "#prevmax",
            NextMaxDivId : "#nextmax",
            PrevMaxDiv : "prevmax",
            NextMaxDiv : "nextmax"
        },
        ShowChapter : function (b)
        {
            var a = 1;
            if (arguments != null && arguments.length >= 2)
            {
                a = arguments[1]
            }
            switch (BookReader.Options.Config.readMode)
            {
                case 1:
                default:
                    BookReader.AjaxReader.ShowChapter(b);
                    break;
                case 3:
                    BookReader.ScrollReader.ShowChapter(b, a);
                    break
            }
        },
        GetChapterHTML : function (e)
        {
            var a = BookReader.ChapterList.GetChapterById(e);
            var b = "";
            var c = "";
            if (a != null)
            {
                c = ' style="min-height:{0}px;" '.format($(window).height() + 50);
                var d = a.Content;
                if (a.IsVip == 1)
                {
                    if (a.Content == "")
                    {
                        d = BookReader.ChapterList.GetVipChapterContent(a.BookId, e, a.MaxPageIndex)
                    }
                    else
                    {
                        d = a.Content
                    }
                }
                b = '<div class="chapter" chapterid="{0}" id="dv{0}" {3}><h3>{1}</h3>{2}</div>'.format(e, a.ChapterName, d, c)
            }
            return b
        },
        ShowErrorChapter : function (a, d, c)
        {
            if (!a)
            {
                return
            }
            var b = 1;
            if (arguments != null && arguments.length >= 4)
            {
                b = arguments[3]
            }
            if (a && a.ReturnCode && a.ReturnCode == -1001)
            {
                BookReader.Display.CloseDialog();
                if (BookReader.Options.Config.readMode == 3)
                {
                    if (b == 0)
                    {
                        $(BookReader.Display.Containers.PrevMsgId).remove();
                        BookReader.Display.ShowPrevNextMsg(b, 'VIP章节，请 <a href="javascript:BookReader.Other.GoToLogin(' + d + "," + c + ');">登录</a> 后继续浏览！')
                    }
                    else
                    {
                        $(BookReader.Display.Containers.NextMsgId).remove();
                        BookReader.Display.ShowPrevNextMsg(b, 'VIP章节，请 <a href="javascript:BookReader.Other.GoToLogin(' + d + "," + c + ');">登录</a> 后继续浏览！')
                    }
                }
                else
                {
                    BookReader.Other.GoToLogin()
                }
                return
            }
            else
            {
                if (a && a.ReturnCode && a.ReturnCode == -108)
                {
                    if (BookReader.ReadSetting.GetAutoBuy())
                    {
                        BookReader.ChapterList.BuyChapterById(d, c, b)
                    }
                    else
                    {
                        if (BookReader.Options.Config.readMode == 1)
                        {
                            location.replace("/book/buyvipchapter.aspx?bookid={0}&chapterId={1}".format(d, c))
                        }
                        else
                        {
                            BookReader.Display.ShowBuyChapter(d, c, a, b)
                        }
                    }
                    return
                }
                else
                {
                    if (a && a.ReturnCode && a.ReturnCode == -107)
                    {
                        location.replace("/book/buyvipchapter.aspx?bookid={0}&chapterId={1}".format(d, c));
                        return
                    }
                }
            }
            if (a && a.ReturnString)
            {
                BookReader.Display.CloseDialog();
                BookReader.Display.ShowMessage(a.ReturnString, "提示信息：", true)
            }
        },
        ShowBuyChapter : function (f, e, a)
        {
            var c = 1;
            if (arguments != null && arguments.length >= 4)
            {
                c = arguments[3]
            }
            var d = "<div style='text-align:left;font-size:14px;padding:10px;line-height:20px;'>您尚未订阅本章节，确认要订阅吗？";
            var b = a.ReturnObject;
            if (b == null)
            {
                BookReader.Display.CloseDialog();
                location.replace("/book/buyvipchapter.aspx?bookid=" + f + "&chapterid=" + e)
            }
            else
            {
                if (b != null)
                {
                    d += "<br/>章节名：" + b.ChapterName;
                    d += "<br/>价格：" + b.Price + "起点币";
                    if (b.RebatePrice < b.Price)
                    {
                        d += "<br/>折扣价：" + b.RebatePrice + "起点币"
                    }
                    d += "<br/><input type='checkbox' " + (BookReader.ReadSetting.GetAutoBuy() ? "checked='checked'" : "") + " id='chbAuto'/><label for='chbAuto'>开启自动订阅后一章</label>"
                }
                d += "</div>";
                var g = function ()
                {
                    BookReader.Display.CloseDialog();
                    if (BookReader.Options.Config.readMode == 3)
                    {
                        BookReader.Display.ShowBuyMsg(f, e, c)
                    }
                };
                BookReader.Display.ShowConfirm(d, "提示信息", function ()
                {
                    BookReader.ChapterList.BuyChapterById(f, e, c)
                }, g)
            }
        },
        ShowBuyMsg : function (d, c)
        {
            var b = 1;
            if (arguments != null && arguments.length >= 3)
            {
                b = arguments[2]
            }
            var a = '您尚未订阅本章节,<a href="javascript:BookReader.ChapterList.BuyChapterById(' + d + "," + c + "," + b + ');">点击订阅</a>';
            if (BookReader.Options.Config.readMode == 3)
            {
                if ($(".chapter").length == 0)
                {
                    location.replace("/book/buyvipchapter.aspx?bookid=" + d + "&chapterid=" + c)
                }
                else
                {
                    if (b == 0)
                    {
                        if ($(BookReader.Display.Containers.PrevMsgId).length > 0)
                        {
                            $(BookReader.Display.Containers.PrevMsgId).html(a)
                        }
                        else
                        {
                            BookReader.Display.ShowPrevNextMsg(b, a)
                        }
                    }
                    else
                    {
                        if ($(BookReader.Display.Containers.NextMsgId).length > 0)
                        {
                            $(BookReader.Display.Containers.NextMsgId).html(a)
                        }
                        else
                        {
                            BookReader.Display.ShowPrevNextMsg(b, a)
                        }
                    }
                    BookReader.ScrollReader.BindScroll()
                }
            }
            else
            {
                location.replace("/book/buyvipchapter.aspx?bookid=" + d + "&chapterid=" + c)
            }
        },
        PendHideCurrent : function (b)
        {
            if (b != null && b.IsVip == 1 && b.Content == "")
            {
                var d = "";
                if (BookReader.ChapterList.GetBookInfo() != null)
                {
                    if (BookReader.ChapterList.GetBookInfo().IsCartoon)
                    {
                        d = '<img src="/book/DmVIPImgShow.aspx?bookid=' + b.BookId + "&chapterid=" + b.ChapterId + '" />'
                    }
                    else
                    {
                        for (var c = 1; c <= b.MaxPageIndex; c++)
                        {
                            var a = "{0}?bookid={1}&chapterid={2}&width={3}&page={4}&rd={5}".format(BookReader.Data.vipChapterUrl, b.BookId, b.ChapterId, BookReader.Options.Config.vipImgWidth, c, BookReader.ReadSetting.getVipChapterRnd());
                            d += '<img style="display:none;" src="{0}"}/>'.format(a)
                        }
                    }
                }
                var e = "dv_chapter_hide_next";
                if ($("#" + e).length > 0)
                {
                    $("#" + e).empty();
                    $("#" + e).html(d)
                }
                else
                {
                    $(document.body).append('<div id="{0}" style="display:none;">{1}</div>'.format(e, d))
                }
            }
        },
        PendHideNext : function (e)
        {
            if (e == null || e.length <= 0)
            {
                return
            }
            for (var c = 0; c < e.length; c++)
            {
                var b = e[c];
                if (b != null && b.IsVip == 1 && b.Content == "")
                {
                    var d = "";
                    if (BookReader.ChapterList.GetBookInfo() != null)
                    {
                        if (BookReader.ChapterList.GetBookInfo().IsCartoon)
                        {
                            d = '<img src="/book/DmVIPImgShow.aspx?bookid=' + b.BookId + "&chapterid=" + b.ChapterId + '" />'
                        }
                        else
                        {
                            for (var c = 0; c <= b.MaxPageIndex; c++)
                            {
                                var a = "{0}?bookid={1}&chapterid={2}&width={3}&page={4}&rd={5}".format(BookReader.Data.vipChapterUrl, b.BookId, b.ChapterId, BookReader.Options.Config.vipImgWidth, c, BookReader.ReadSetting.getVipChapterRnd());
                                d += '<img style="display:none;" src="{0}"}/>'.format(a)
                            }
                        }
                    }
                    var f = "dv_chapter_hide_next";
                    if ($("#" + f).length > 0)
                    {
                        $("#" + f).append(d)
                    }
                    else
                    {
                        $(document.body).append('<div id="{0}" style="display:none;">{1}</div>'.format(f, d))
                    }
                }
            }
        },
        ShowDialogLoading : function ()
        {
            var a = arguments[0] || "提示：";
            BookReader.Display.ShowMessage('<img src="/images/ajax-loader_1.gif" />&nbsp;正在加载请稍候...', a, false)
        },
        ShowMessage : function ()
        {
            BookReader.Display.CloseDialog();
            var a = arguments[0] || "";
            var d = arguments[1] || "";
            var b = true;
            if (arguments.length >= 3)
            {
                b = arguments[2]
            }
            var c = function ()
            {
                BookReader.Display.CloseDialog()
            };
            if (arguments.length >= 4)
            {
                c = arguments[3]
            }
            new($.dialog)(
                {
                    content : a,
                    title : d,
                    showButtons : true,
                    showCancelBtn : false,
                    showCloseBtn : b,
                    yesCallBack : c,
                    closeCallBack : c
                }
            ).open()
        },
        ShowConfirm : function ()
        {
            BookReader.Display.CloseDialog();
            var a = arguments[0] || "";
            var c = arguments[1] || "";
            var b = arguments[2] || function ()  {};
            var d = arguments[3] || function ()  {};
            new($.dialog)(
                {
                    content : a,
                    title : c,
                    yesCallBack : b,
                    yesBtnText : "确定",
                    cancelCallBack : d,
                    cancelBtnText : "取消"
                }
            ).open()
        },
        CloseDialog : function ()
        {
            Common.closeDialog();
            $(".showts").hide()
        },
        ShowChapterLoading : function (b)
        {
            var a = '<div id="' + BookReader.Display.Containers.PrevMsgDiv + '" class="chapterloading"><img src="/images/ajax-loader_1.gif" style="border: 0;vertical-align: middle;" alt="请稍候..." />正在为您加载上一章...</div>';
            if (b == 0)
            {
                if ($(BookReader.Display.Containers.PrevMsgId).length > 0)
                {
                    $(BookReader.Display.Containers.PrevMsgId).remove()
                }
                $(BookReader.Display.Containers.ChapterDivId).prepend(a)
            }
            else
            {
                if ($(BookReader.Display.Containers.NextMsgId).length > 0)
                {
                    $(BookReader.Display.Containers.NextMsgId).remove()
                }
                a = '<div id="' + BookReader.Display.Containers.NextMsgDiv + '" class="chapterloading"><img src="/images/ajax-loader_1.gif" style="border: 0;vertical-align: middle;" alt="请稍候..." />正在为您加载下一章...</div>';
                $(BookReader.Display.Containers.ChapterDivId).append(a)
            }
        },
        ShowPrevNextLoading : function (a)
        {
            if (a == 0)
            {
                $(BookReader.Display.Containers.ChapterDivId).prepend('<div id="' + BookReader.Display.Containers.PrevMsgDiv + '" class="chapterloading"><img src="/images/ajax-loader_1.gif" style="border: 0; vertical-align: middle;" alt="请稍候..." />正在为您加载上一章...</div>')
            }
            else
            {
                $(BookReader.Display.Containers.ChapterDivId).append('<div id="' + BookReader.Display.Containers.NextMsgDiv + '" class="chapterloading"><img src="/images/ajax-loader_1.gif" style="border: 0; vertical-align: middle;" alt="请稍候..." />正在为您加载下一章...</div>')
            }
        },
        ShowPrevNextMsg : function (a, b)
        {
            if (a == 0)
            {
                if ($(BookReader.Display.Containers.PrevMsgId).length > 0)
                {
                    $(BookReader.Display.Containers.PrevMsgId).html(b)
                }
                else
                {
                    $(BookReader.Display.Containers.ChapterDivId).prepend('<div id="' + BookReader.Display.Containers.PrevMsgDiv + '" class="chaptermsg">' + b + "</div>")
                }
            }
            else
            {
                if ($(BookReader.Display.Containers.NextMsgId).length > 0)
                {
                    $(BookReader.Display.Containers.NextMsgId).html(b)
                }
                else
                {
                    $(BookReader.Display.Containers.ChapterDivId).append('<div id="' + BookReader.Display.Containers.NextMsgDiv + '" class="chaptermsg">' + b + "</div>")
                }
            }
        },
        ShowPrevNextMax : function (a, b)
        {
            if (a == 0)
            {
                $(BookReader.Display.Containers.ChapterDivId).prepend('<div id="' + BookReader.Display.Containers.PrevMaxDiv + '" class="chaptermsg">' + b + "</div>")
            }
            else
            {
                $(BookReader.Display.Containers.ChapterDivId).append('<div id="' + BookReader.Display.Containers.NextMaxDiv + '" class="chaptermsg">' + b + "</div>")
            }
        },
        LoadBookChapterPic : function (a)
        {
            $("#" + a).html(BookReader.Display.FixChapterContent($("#" + a).html(), "/Images/cs-1.gif"));
            $("#" + a).html(BookReader.Display.ReplaceBookHref($("#" + a).html()))
        },
        iStartsWith : function (a, b)
        {
            return a.substr(0, b.length).toLowerCase() == b.toLowerCase()
        },
        ReplaceBookHref : function (d)
        {
            var c = '<a style="color:#0000ff" href="/book/showbook.aspx?bookid=$1" target="_blank">$2</a>';
            var a = /\[\s*bookid\s*=\s*(\d*)\s*,\s*bookname\s*=\s*(《[^》]*》)]/i;
            var b = a.exec(d);
            while (b != null)
            {
                if (b[1] == "77374" || b[1] == "1139417" || b[1] == "1037447" || b[1] == "173373" || b[1] == "128373" || b[1] == "96705" || b[1] == "40537")
                {
                    d = d.replace(a, "")
                }
                else
                {
                    d = d.replace(a, c.format(b[1], b[2]))
                }
                b = a.exec(d)
            }
            return d
        },
        FixChapterContent : function (g, m)
        {
            var c = /\s*\[\[\[CP\|W:(\d+)\|H:(\d+)\|A:(C|L|R|N)(\|U:([^\s\]]*))?\]\]\]/igm;
            var j = null;
            while ((j = c.exec(g)) != null)
            {
                var a = j[1];
                var l = j[2];
                var b = $(window).width() - 20;
                if (a > b)
                {
                    a = b;
                    l = parseInt((l * b) / a)
                }
                var e = j[3];
                var f = (e == "R") ? "right" : ((e == "C") ? "center" : ((e == "C") ? "left" : ""));
                var i = (j[5] == "" || j[5] == undefined) ? m : j[5];
                var k = (j[5] != "" && j[5] != undefined) ? true : false;
                if (i != null && i != "" && !BookReader.Display.iStartsWith(i, "http://") && BookReader.Display.iStartsWith(i, "/"))
                {
                    i = readChapterData.cpLogoImageUrl + i
                }
                if (k)
                {
                    if (f == "")
                    {
                        g = g.replace(c, "<img src='" + i + "' style='width:" + a + "px;height:" + l + "px;'>")
                    }
                    else
                    {
                        g = g.replace(c, "<p align='" + f + "'><img src='" + i + "' style='width:" + a + "px;height:" + l + "px;'></p><P>　　")
                    }
                }
                else
                {
                    g = g.replace(c, "<p align='center'><img src='" + i + "' style='width:250px;height:190px'></p><P>　　")
                }
            }
            var n = /\[sp=([^\]]+)]/img;
            var h = null;
            while ((h = n.exec(g)) != null)
            {
                var d = (h[1] == "" || h[1] == undefined) ? "" : h[1];
                g = g.replace(h[0], "<p align='center'><embed src='" + d + "' quality='high'  width='414px' height='305px' align='middle' allowScriptAccess='always' allowFullScreen='true' type='application/x-shockwave-flash' flashvars=''></embed></p><P> ")
            }
            g = g.replace(new RegExp(/(－)/g), "-");
            return g
        },
        ImgLoadError : function (a)
        {
            if (a)
            {
                if (a.src && a.src.indexOf("&err=") < 0)
                {
                    a.src = a.src += "&err=1"
                }
            }
        },
        Resize : function ()
        {
            if (BookReader.ChapterList.GetBookInfo() != null)
            {
                if (BookReader.ChapterList.GetBookInfo().IsCartoon)
                {
                    $(BookReader.Display.Containers.ChapterDivId + " img").each(function ()
                        {
                            BookReader.Other.FixImg($(this).get(0))
                        }
                    )
                }
                else
                {
                    var a = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
                    if (a != null && a.IsVip == 1)
                    {
                        scroll(0, 0);
                        BookReader.Display.ShowChapter(BookReader.Options.Config.currentChapterId, -1)
                    }
                }
            }
        },
        CloseTools : function ()
        {
            $("#tool_top,#tool_btm1,#tool_btm2,#dvdir,#dvfeedback,#dvshang,#dvbgcolor,#dvfont,#dvbgcolor,#dvmode,#dvzan,#dvstorage,.arrow_upa,.arrow_down").hide()
        },
        CloseMenus : function ()
        {
            var b = -1;
            if (arguments != null && arguments.length >= 1)
            {
                b = arguments[0]
            }
            var a = ["#dvfont", "#dvshang", "#dvzan", "#dvstorage", "#dvbgcolor", "#dvmode", ".arrow_upa", ".arrow_down"];
            for (var c = 0; c < a.length; c++)
            {
                if (c == b)
                {
                    continue
                }
                $(a[c]).hide()
            }
        }
    },
    Other :
    {
        freshAd : function ()
        {
            try
            {
                if ($("#bd_banner").length > 0)
                {
                    if (BookReader.ReadMode.GetReadMode() == 1)
                    {
                        var a = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
                        if (a && a.IsVip != 1)
                        {
                            $("#bd_banner").show().css("opacity", "1")
                        }
                        else
                        {
                            $("#bd_banner").hide()
                        }
                    }
                    else
                    {
                        $("#bd_banner").hide()
                    }
                }
            }
            catch (b)
            {}

        },
        GoToLastPage : function ()
        {
            location.href = "/book/lastpage.aspx?bookid=" + BookReader.Options.Config.bookId
        },
        Showmenuie5 : function (a)
        {
            a = a ? a : (window.event ? window.event : null);
            return false
        },
        OnSelectText : function (a)
        {
            return false
        },
        InitContextMenu : function ()
        {
            if (document.all)
            {
                document.oncontextmenu = BookReader.Other.Showmenuie5;
                document.onselectstart = BookReader.Other.OnSelectText
            }
            else
            {
                document.oncontextmenu = function (a)
                {
                    return BookReader.Other.Showmenuie5(a)
                };
                document.onselectstart = function (a)
                {
                    return BookReader.Other.OnSelectText(a)
                };
                if (navigator.userAgent.toLowerCase().indexOf("opera") > -1)
                {
                    document.onmousedown = function (a)
                    {
                        return BookReader.Other.OnSelectText(a)
                    }
                }
            }
        },
        ReLoad : function ()
        {
            location.href = location.href
        },
        FixImg : function (c)
        {
            var b = new Image();
            b.src = c.src;
            var d = null;
            var a = function (g, i)
            {
                if (g.complete)
                {
                    var h = BookReader.Options.Config.vipImgWidth;
                    var e = h;
                    var f = h;
                    if (g.width >= h)
                    {
                        e = (g.width > h ? h : g.width);
                        f = Math.round((e * g.height) / g.width)
                    }
                    else
                    {
                        e = g.width;
                        f = g.height
                    }
                    i.style.width = e + "px";
                    i.style.height = f + "px";
                    return true
                }
                return false
            };
            if (!a(b, c))
            {
                d = setInterval(function ()
                {
                    if (d != null && a(b, c))
                    {
                        clearInterval(d);
                        d = null
                    }
                }, 100)
            }
        },
        Tracker : function ()
        {
            try
            {
                CmfuTracker()
            }
            catch (a)
            {}

        },
        PushState : function ()
        {
            try
            {
                var b = arguments[0];
                var d = arguments[1];
                var a = arguments[2];
                history.pushState(b, d, a)
            }
            catch (c)
            {}

        },
        ReplaceState : function ()
        {
            try
            {
                var b = arguments[0];
                var d = arguments[1];
                var a = arguments[2];
                history.replaceState(b, d, a)
            }
            catch (c)
            {}

        },
        GoToLogin : function ()
        {
            var b = arguments[0] || "";
            var a = arguments[1] || "";
            if (b == "" || a == "")
            {
                location.href = "/mlogin.aspx?returnurl=" + encodeURIComponent(location.href)
            }
            else
            {
                location.href = "/mlogin.aspx?returnurl=" + encodeURIComponent(BookReader.Options.Config.domainUrl + "/book/bookreader.aspx?bookid=" + b + "&chapterid=" + a)
            }
        },
        AddBookMark : function ()
        {
            var b = BookReader.ChapterList.GetChapterById(BookReader.Options.Config.currentChapterId);
            if (b)
            {
                var c =
                {
                    ajaxMethod : "addbookmark",
                    bookid : BookReader.Options.Config.bookId,
                    chapterid : BookReader.Options.Config.currentChapterId,
                    chaptername : b.ChapterName,
                    isvip : BookReader.ChapterList.GetBookInfo() && BookReader.ChapterList.GetBookInfo().IsVip == 1 ? 1 : 0
                };
                var d = function (e)
                {
                    if (e && e.IsSuccess)
                    {
                        Common.toast(e.ReturnString)
                    }
                    else
                    {
                        if (e.ReturnCode == -1)
                        {
                            BookReader.Display.ShowConfirm("您还没有登录，现在去登录？", "提示信息：", function ()
                                {
                                    BookReader.Other.GoToLogin()
                                }, function ()
                                {
                                    BookReader.Display.CloseDialog()
                                }
                            )
                        }
                        else
                        {
                            Common.toast(e.ReturnString)
                        }
                    }
                };
                var a = function (g, f)
                {
                    if (f == "timeout")
                    {
                        Common.toast("好像网络有点问题哦...")
                    }
                    else
                    {
                        Common.toast("加入书签错误，请稍候重试！")
                    }
                };
                BookReader.Ajax(BookReader.Data.chapterAjaxUrl, c, d, a)
            }
            else
            {
                Common.toast("添加书签失败！")
            }
        },
        toggleThBooks : function (a)
        {
            if ($("#dvthbooks").css("display") == "none")
            {
                $("#dvthbooks").show();
                $(".book_tl .arrow_box em").removeClass("close").addClass("open");
                if ($("#dvthbooks div").length <= 0)
                {
                    BookReader.Other.getTHBooks(a)
                }
            }
            else
            {
                $("#dvthbooks").hide();
                $(".book_tl .arrow_box em").removeClass("open").addClass("close")
            }
        },
        getTHBooks : function (b)
        {
            $("#dvthbooks").html('<div style="text-align:center; padding:10px;"><img src="/images/ajax-loader_1.gif"/>正在加载...</div>');
            var c =
            {
                ajaxMethod : "getreaderthbooks",
                bookid : b
            };
            var d = function (h)
            {
                if (h && h.IsSuccess)
                {
                    $("#dvthbooks").empty();
                    var g = h.ReturnObject;
                    for (var f = 0; f < g.length; f++)
                    {
                        var e = g[f];
                        var j = new StringBuilder();
                        j.append('<div class="book_tl_list" onclick="location.href=\'/book/showbook.aspx?bookid={0}\';">'.format(e.BookId));
                        j.append("<dl>");
                        j.append('<dt><a href="/book/showbook.aspx?bookid={0}">《{1}》</a></dt>'.format(e.BookId, e.BookName));
                        j.append("<dd>");
                        j.append('<span>作者：{0}</span><span>有<font class="reda">{1}</font>人正在阅读</span></dd>'.format(e.AuthorName, e.VoteWeek));
                        j.append("<dd>推荐理由：{0}</dd>".format(e.Description));
                        j.append("</dl>");
                        j.append("</div>");
                        $("#dvthbooks").append(j.toString())
                    }
                }
                else
                {
                    $("#dvthbooks").html('<div style="text-align:center; padding:10px;"><a href="javascript:BookReader.getTHBooks(' + b + ')">很抱歉，加载失败，请点击重试！</a></div>')
                }
            };
            var a = function (e)
            {
                $("#dvthbooks").html('<div style="text-align:center; padding:10px;"><a href="javascript:BookReader.getTHBooks(' + b + ')">很抱歉，加载失败，请点击重试！</a></div>')
            };
            BookReader.Ajax("/ajax/index.ashx", c, d, a,
                {
                    type : "GET"
                }
            )
        },
        InitHelpBox : function ()
        {
            var a = false;
            var b = Common.localStorage.get("help");
            if (b == null || b == "")
            {
                a = true
            }
            else
            {
                a = false
            }
            if (a)
            {
                var c = typeof(window.ontouchstart) != "undefined";
                var d = c ? "touchstart" : "click";
                $(".helpbox").show();
                $(".helpbox").bind(d, function ()
                    {
                        $(".helpbox").hide();
                        Common.localStorage.set("help", 1)
                    }
                )
            }
        },
        getPosition : function (d)
        {
            var b = BookReader.ScrollReader.Config.SupportsTouches ? (d.touches ? d.touches[0] : (d.originalEvent ? d.originalEvent.touches[0] : d)) : d;
            var c = b.clientX < 0 ? (b.pageX - ($(document.body).scrollLeft() || $(document.documentElement).scrollLeft() || 0)) : b.clientX;
            var a = b.clientY < 0 ? (b.pageY - BookReader.Other.GetScrollTop()) : b.clientY;
            return{
                x : c,
                y : a
            }
        },
        FixEndY : function (b)
        {
            var a = b;
            if ($(document.body).scrollTop() == 0)
            {
                b = b - BookReader.Other.GetScrollTop()
            }
            if (b < 0)
            {
                b = a
            }
            return b
        },
        GetScrollTop : function ()
        {
            return $(document.body).scrollTop() || $(document.documentElement).scrollTop() || 0
        },
        SlideScreen : function (a)
        {
            var b = BookReader.Other.GetScrollTop();
            if (a > 0)
            {
                BookReader.Other.Animate($(window).height() + BookReader.Other.GetScrollTop())
            }
            else
            {
                BookReader.Other.Animate(BookReader.Other.GetScrollTop() - $(window).height())
            }
        },
        GoToCharge : function ()
        {
            location.href = "/recharge/rechargecenter.aspx?returnurl=" + encodeURIComponent(location.href)
        },
        Animate : function ()
        {
            var c = arguments[0] || 0;
            var b = arguments[1] || function ()  {};
            var a = BookReader.Other.GetScrollTop();
            $(document.body).animate(
                {
                    scrollTop : c
                }, 100, function ()
                {
                    var d = BookReader.Other.GetScrollTop();
                    if (Math.abs(a - d) < 10)
                    {
                        $(document.documentElement).animate(
                            {
                                scrollTop : c
                            }, 100, function ()
                            {
                                b.call()
                            }
                        )
                    }
                    else
                    {
                        b.call()
                    }
                }
            )
        },
        ShowCheckInImg : function ()
        {
            if (BookReader.Options.Config.checkInState == 1)
            {
                $("#buycheckin").show();
                setTimeout(function ()
                {
                    BookReader.Options.Config.checkInState = 0;
                    $("#buycheckin").hide()
                }, 6000)
            }
        },
        addToBookshelf : function (d)
        {
            var b = this;
            var c =
            {
                ajaxMethod : "addtobookshelf",
                bookId : d
            };
            var e = function (f)
            {
                if (f.isSuccess === 2)
                {
                    Common.login()
                }
                else
                {
                    Common.toast(f.msg)
                }
            };
            var a = function (f)  {};
            BookReader.Ajax("/ajax/bookex.ashx", c, e, a,
                {
                    type : "GET"
                }
            )
        },
        SetBookMark : function ()
        {
            var l = BookReader.Options.Config.bookId;
            var f = BookReader.Options.Config.currentChapterId;
            var h = "rcapter";
            var e = Common.getCookie(h);
            var k = 10;
            var b = new Array();
            var g = new Array();
            b.push(l);
            g.push(f);
            if (e)
            {
                var d = e.split("&");
                if (d && d.length > 0)
                {
                    for (var c = 0; c < d.length; c++)
                    {
                        var j = d[c].split("=");
                        if (j != null && j.length == 2)
                        {
                            if (j[0] != l && b.length < k)
                            {
                                b.push(j[0]);
                                g.push(j[1])
                            }
                        }
                    }
                }
            }
            var a = "";
            if (b.length == g.length)
            {
                for (var c = 0; c < b.length; c++)
                {
                    if (c == b.length - 1)
                    {
                        a += b[c] + "=" + g[c]
                    }
                    else
                    {
                        a += b[c] + "=" + g[c] + "&"
                    }
                }
            }
            document.cookie = h + "=" + a + "; expires=" + (new Date()).AddDays(365).toGMTString() + "; path=/; domain=" + BookReader.Data.readStyleDomain
        },
        ToFeedBack : function ()
        {
            location.href = "/feedback.aspx?returnurl=" + encodeURIComponent("/book/bookreader.aspx?bookid={0}&chapterid={1}".format(BookReader.Options.Config.bookId, BookReader.Options.Config.currentChapterId))
        }
    },
    ReadSetting :
    {
        InitUserStyle : function ()
        {
            var a = BookReader.ReadSetting.GetFontSize();
            $(BookReader.Display.Containers.ChapterDivId).removeClass();
            $(BookReader.Display.Containers.ChapterDivId).addClass("rdcontent" + a);
            var b = BookReader.ReadSetting.GetBgColorIndex();
            BookReader.ReadSetting.SetBgColorStyle(b);
            Common.setCookie("rc", b, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain);
            var c = BookReader.ReadSetting.GetAutoBuy();
            BookReader.ReadSetting.SetAutoBuy(c ? 1 : 0);
            $("#dvfont ul li").each(function (d, e)
                {
                    $(e).off("click").click(function ()
                        {
                            BookReader.ReadSetting.SetFontSize($(e).attr("fontSize"));
                            $("#dvfont ul li").removeClass("hover");
                            $(e).addClass("hover")
                        }
                    )
                }
            );
            $("#dvbgcolor ul li").each(function (d, e)
                {
                    $(e).off("click").click(function ()
                        {
                            var f = $(e).attr("index");
                            BookReader.ReadSetting.SetBgColor(parseInt(f))
                        }
                    )
                }
            )
        },
        SetFontSize : function (a)
        {
            a = parseInt(a);
            a = a + BookReader.ReadSetting.GetFontSize();
            if (a > 24)
            {
                Common.toast("已经是最大了...");
                a = 24
            }
            if (a < 16)
            {
                Common.toast("已经是最小了...");
                a = 16
            }
            Common.setCookie("rf", a, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain);
            $(BookReader.Display.Containers.ChapterDivId).removeClass();
            $(BookReader.Display.Containers.ChapterDivId).addClass("rdcontent" + a)
        },
        GetFontSize : function ()
        {
            var a = parseInt(Common.getCookie("rf") || "18");
            if (a > 24)
            {
                a = 24
            }
            if (a < 16)
            {
                a = 16
            }
            return a
        },
        GetLineHight : function ()
        {
            var a = BookReader.ReadSetting.GetFontSize();
            return a * BookReader.Options.Config.lineHeightRate
        },
        ToggleFontSize : function ()
        {
            BookReader.Display.CloseMenus(0);
            if ($("#dvfont").css("display") != "none")
            {
                $("#dvfont").hide();
                $("#funfont .arrow_down").hide()
            }
            else
            {
                $("#dvfont").show();
                $("#funfont .arrow_down").css("display", "block")
            }
        },
        ToggleBgColor : function ()
        {
            BookReader.Display.CloseMenus(4);
            if ($("#dvbgcolor").css("display") != "none")
            {
                $("#dvbgcolor").hide();
                $("#funbgcolor .arrow_down").hide()
            }
            else
            {
                $("#dvbgcolor").show();
                $("#funbgcolor .arrow_down").show()
            }
        },
        ToggleMode : function ()
        {
            BookReader.Display.CloseMenus(5);
            if ($("#dvmode").css("display") == "none")
            {
                $("#dvmode").show();
                $("#funmode .arrow_down").show()
            }
            else
            {
                $("#dvmode").hide();
                $("#funmode .arrow_down").hide()
            }
        },
        getVipChapterRnd : function ()
        {
            var a = (Common.getCookie("rc") || "1") + (Common.getCookie("rf") || "18") + (Common.getCookie("mrm") || "2") + (Common.localStorage.get("mlight") || "1");
            return a
        },
        SetBgColor : function (a)
        {
            BookReader.ReadSetting.SetBgColorStyle(a);
            Common.setCookie("rc", a, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain);
            if (a != 0)
            {
                $("#funlight font").text("关灯");
                Common.localStorage.set("mlight", a)
            }
            else
            {
                $("#funlight font").text("开灯")
            }
        },
        SetBgColorStyle : function (a)
        {
            $("body").css("background-color", "");
            $("body").css("background-image", "");
            $("body").css("background-attachment", "");
            $("body").css("background-size", "");
            $("body").removeClass();
            $("#footer").css("background", "none");
            $("body").css("background", "none");
            switch (a)
            {
                case 0:
                    $("#funlight font").text("开灯");
                    $("body").css("background-image", "");
                    $("body").css("background-color", "#000000");
                    $("#readercontainer,#footer").css("color", "#6f6f6f");
                    $(".book_tl h2").css("color", "#6f6f6f");
                    break;
                case 1:
                    $("body").css("background-color", "#ffffff");
                    $("#readercontainer,#footer").css("color", "#000000");
                    $(".book_tl h2").css("color", "#000000");
                    break;
                case 2:
                default:
                    $("body").css("background-image", "url(/images/readbg1.jpg)");
                    $("body").css("background-size", "100%");
                    $("#readercontainer,#footer").css("color", "#000000");
                    $(".book_tl h2").css("color", "#000000");
                    break;
                case 3:
                    $("body").css("background-color", "#eefaee");
                    $("#readercontainer,#footer").css("color", "#000000");
                    $(".book_tl h2").css("color", "#000000");
                    break;
                case 4:
                    $("body").css("background-color", "#fcefff");
                    $("#readercontainer,#footer").css("color", "#000000");
                    $(".book_tl h2").css("color", "#000000");
                    break;
                case 5:
                    $("body").css("background-color", "#e9faff");
                    $("#readercontainer,#footer").css("color", "#000000");
                    $(".book_tl h2").css("color", "#000000");
                    break
            }
            $("#dvbgcolor .read_bg li").removeClass("hover");
            $("#dvbgcolor .read_bg li").eq(a - 1).addClass("hover")
        },
        GetBgColorIndex : function ()
        {
            var a = parseInt(Common.getCookie("rc") || "2");
            return a
        },
        SetLight : function ()
        {
            BookReader.Display.CloseMenus();
            var a = BookReader.ReadSetting.GetBgColorIndex();
            if (a == 0)
            {
                a = BookReader.ReadSetting.GetLight();
                if (a < 1)
                {
                    a = 2
                }
            }
            else
            {
                a = 0
            }
            BookReader.ReadSetting.SetBgColor(parseInt(a))
        },
        GetLight : function ()
        {
            var a = Common.localStorage.get("mlight");
            return a
        },
        GetAutoBuy : function ()
        {
            var a = parseInt(Common.getCookie("mab") || "0");
            if (a == 1)
            {
                return true
            }
            return false
        },
        SetAutoBuy : function (a)
        {
            if (a != 0 && a != 1)
            {
                a = 0
            }
            Common.setCookie("mab", a, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain);
            $("#dvmode .buy_read li").removeClass("hover");
            $("#dvmode .buy_read li:eq(" + a + ")").addClass("hover")
        }
    },
    ReadMode :
    {
        InitReadMode : function ()
        {
            try
            {
                var b = BookReader.ReadMode.GetReadMode();
                if (b == 3)
                {
                    $(".book_switch,.vote_box,.book_tl,#footer,#dvthbooks,#downappbox,#dv_chapter_btm,#bd_banner").hide();
                    $(BookReader.Display.Containers.ChapterDivId).removeClass("ofhidden");
                    $(BookReader.Display.Containers.ChapterDivId).css(
                        {
                            width : "auto",
                            height : "auto",
                            position : "static"
                        }
                    )
                }
                else
                {
                    if (b == 2)
                    {
                        b = 1
                    }
                    $(".book_switch,.vote_box,.book_tl,#footer,#dv_chapter_btm,#bd_banner").show();
                    $(BookReader.Display.Containers.ChapterDivId).removeClass("ofhidden");
                    $(BookReader.Display.Containers.ChapterDivId).css(
                        {
                            width : "auto",
                            height : "auto",
                            position : "static"
                        }
                    )
                }
                BookReader.Options.Config.readMode = b;
                try
                {
                    Common.setCookie("mrm", b, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain)
                }
                catch (a)
                {
                    alert(a)
                }
                $("#dvmode .read_mode li").removeClass("hover");
                $("#dvmode .read_mode li[mode=" + b + "]").addClass("hover");
                $("#dvmode .buy_read li").each(function (d, e)
                    {
                        $(e).off("click").click(function ()
                            {
                                BookReader.ReadSetting.SetAutoBuy(parseInt($(e).attr("mode")))
                            }
                        )
                    }
                );
                $("#dvmode .read_mode li").each(function (d, e)
                    {
                        $(e).off("click").click(function ()
                            {
                                BookReader.ReadMode.SetReadMode(parseInt($(e).attr("mode")))
                            }
                        )
                    }
                )
            }
            catch (c)
            {}

        },
        SetReadMode : function (a)
        {
            BookReader.Options.Config.readMode = a;
            Common.setCookie("mrm", a, (new Date()).AddDays(365), "/", BookReader.Data.readStyleDomain);
            $("#dvmode .read_mode li").removeClass("hover");
            $("#dvmode .read_mode li[mode=" + a + "]").addClass("hover");
            switch (a)
            {
                case 1:
                default:
                    BookReader.Initialize(
                        {
                            bookId : BookReader.Options.Config.bookId,
                            chapterId : BookReader.Options.Config.currentChapterId
                        }, false);
                    break;
                case 3:
                    BookReader.Initialize(
                        {
                            bookId : BookReader.Options.Config.bookId,
                            chapterId : BookReader.Options.Config.currentChapterId
                        }, false);
                    break
            }
        },
        GetReadMode : function ()
        {
            var a = Common.getCookie("mrm");
            if (a == null)
            {
                a = 3;
                if (Common.checkLoginByCookie())
                {
                    a = 3
                }
                else
                {
                    if ($("#bd_banner").length > 0)
                    {
                        a = 1
                    }
                }
            }
            return parseInt(a)
        }
    },
    Interaction :
    {
        Config :
        {
            ZanLoading : 0
        },
        Init : function ()
        {
            $("#dvshang ul li").each(function (a, b)
                {
                    $(b).off("click").click(function ()
                        {
                            $("#dvshang ul li").removeClass("hover");
                            $(b).addClass("hover")
                        }
                    )
                }
            );
            $("#btnpostshang").off("click").click(function ()
                {
                    BookReader.Interaction.ConfirmShang()
                }
            );
            $("#btncancelshang").off("click").click(function ()
                {
                    BookReader.Interaction.ToggleShang()
                }
            )
        },
        ToggleShang : function ()
        {
            if (BookReader.ChapterList.BookInfo.IsHaveShang != 1)
            {
                Common.toast("本书不支持打赏！");
                return
            }
            BookReader.Display.CloseMenus(1);
            if ($("#dvshang").css("display") == "none")
            {
                if (BookReader.ChapterList.BookInfo.IsHaveShangTicket == 1)
                {
                    $("#dvshang .ds_num span.ypnum").show();
                    $("#ypwxts").show()
                }
                else
                {
                    $("#dvshang .ds_num span.ypnum").hide();
                    $("#ypwxts").hide()
                }
                $("#dvshang").show();
                $("#funshang .arrow_upa").css("display", "block");
                $("#tool_top,#tool_btm1,#tool_btm2").addClass("z1000")
            }
            else
            {
                $("#dvshang").hide();
                $("#funshang .arrow_upa").css("display", "none");
                $("#tool_top,#tool_btm1,#tool_btm2").removeClass("z1000")
            }
        },
        ConfirmShang : function ()
        {
            if (BookReader.ChapterList.BookInfo.IsHaveShang != 1)
            {
                Common.toast("本书不支持打赏！");
                return
            }
            var a = 2;
            $("#dvshang ul li").each(function (c, d)
                {
                    if ($(d).attr("class") == "hover")
                    {
                        a = c;
                        return false
                    }
                }
            );
            var b = [100, 588, 10000, 100000];
            BookReader.Display.ShowConfirm("为保障你的账户安全，请确认是否打赏该作品？", "打赏提示：", function ()
                {
                    BookReader.Interaction.PostShang(b[a])
                }, function ()
                {
                    BookReader.Display.CloseDialog()
                }
            )
        },
        PostShang : function (f)
        {
            var b = 0;
            if (f == 10000)
            {
                b = 1
            }
            else
            {
                if (f == 100000)
                {
                    b = 10
                }
            }
            Common.toast("正在打赏，请稍候...");
            var c = "这本书太棒了！犒劳一下，希望后续更精彩！";
            var d =
            {
                ajaxMethod : "DaShangBook",
                bookid : BookReader.Options.Config.bookId,
                moneyType : f,
                des : c,
                voteTicket : b
            };
            var e = function (g)
            {
                if (g.IsSuccess)
                {
                    BookReader.Display.CloseDialog();
                    Common.toast(g.ReturnString);
                    setTimeout(function ()
                    {
                        BookReader.CheckVipLevelCallBack(function ()
                            {
                                Common.closeDialog()
                            }
                        )
                    }, 1000)
                }
                else
                {
                    if (!g.IsSuccess && g.ReturnCode == -1001)
                    {
                        BookReader.Display.ShowConfirm("您还没有登录，现在去登录？", "提示信息", function ()
                            {
                                BookReader.Other.GoToLogin()
                            }, function ()
                            {
                                BookReader.Display.CloseDialog()
                            }
                        )
                    }
                    else
                    {
                        if (!g.IsSuccess && g.ReturnCode == -2001)
                        {
                            BookReader.Display.CloseDialog();
                            new($.dialog)(
                                {
                                    content : '<h4 style="text-align: center;">可用起点币余额不足</h4>' + g.ReturnString + '<br><span class="ts_txt1">请充值后再打赏。赠币仅限订阅使用。</span>',
                                    title : "",
                                    yesBtnText : "立即充值",
                                    yesCallBack : function ()
                                    {
                                        BookReader.Other.GoToCharge()
                                    },
                                    cancelBtnText : "取消",
                                    cancelCallBack : function ()
                                    {
                                        BookReader.Display.CloseDialog()
                                    }
                                }
                            ).open()
                        }
                        else
                        {
                            BookReader.Display.CloseDialog();
                            Common.toast(g.ReturnString)
                        }
                    }
                }
            };
            var a = function (g)
            {
                if (status == "timeout")
                {
                    BookReader.Display.CloseDialog();
                    Common.toast("好像网络有点问题哦...")
                }
                else
                {
                    BookReader.Display.CloseDialog();
                    Common.toast("打赏失败，请稍后重试！")
                }
            };
            BookReader.Ajax("/ajax/BookInteraction.ashx", d, e, a)
        }
    },
    CheckVipLevelCallBack : function (d)
    {
        var b =
        {
            ajaxMethod : "checkconsumeupgrade"
        };
        var c = function (f)
        {
            var e = function ()
            {
                Common.closeDialog()
            };
            if (d)
            {
                e = function ()
                {
                    Common.closeDialog();
                    d()
                }
            }
            if (f.ReturnCode == 0)
            {
                Common.closeDialog();
                new($.dialog)(
                    {
                        title : "提示",
                        content : f.ReturnString,
                        cancelBtnText : "我知道了",
                        cancelCallBack : function ()
                        {
                            e()
                        },
                        showCloseBtn : false,
                        showYesBtn : false
                    }
                ).open()
            }
            else
            {
                e()
            }
        };
        var a = function (f, e)  {};
        BookReader.Ajax("/Ajax/Account.ashx", b, c, a)
    },
    Storage :
    {
        Config :
        {
            Loading : 0,
            chapterKey : "m_qidian_chapters",
            bookKey : "m_qidian_book"
        },
        Init : function ()
        {
            if (!window.localStorage)
            {
                return
            }
            var c = arguments[0] || 0;
            var b = Common.localStorage.get(BookReader.Storage.Config.chapterKey);
            var a = BookReader.Storage.GetBookInfoFromStorage();
            if ((b == null && a != null) || (b != null && a == null))
            {
                Common.localStorage.remove(BookReader.Storage.Config.chapterKey);
                Common.localStorage.remove(BookReader.Storage.Config.bookKey)
            }
            else
            {
                if (a != null && a.BookId != c)
                {
                    $("#storagedesc").text("您还没有预读章节！")
                }
                else
                {
                    if (b != null)
                    {
                        b = JSON.parse(b);
                        $("#storagedesc").text(b.length + "个章节已预读。");
                        if (b.length <= 10)
                        {
                            $("#dvstorage .yd_chapter ul li").removeClass("hover");
                            $("#liten").addClass("hover")
                        }
                        else
                        {
                            $("#dvstorage .yd_chapter ul li").removeClass("hover");
                            $("#litwenty").addClass("hover")
                        }
                    }
                }
            }
            $("#dvstorage .yd_chapter ul li").each(function (d, e)
                {
                    $(e).off("click").click(function ()
                        {
                            $("#dvstorage .yd_chapter ul li").removeClass("hover");
                            $(e).addClass("hover")
                        }
                    )
                }
            );
            $("#downchapter").off("click").click(function ()
                {
                    BookReader.Storage.DownloadChapeters()
                }
            )
        },
        ShowStorage : function (a)
        {
            if (!window.localStorage)
            {
                Common.toast("您的浏览器不支持预读！");
                return
            }
            if (BookReader.ChapterList.BookInfo.IsYunChengBook == 1)
            {
                Common.toast("该作品暂不能预读！");
                return
            }
            BookReader.Display.CloseMenus(3);
            var a = 0;
            if (arguments != null && arguments.length >= 1)
            {
                a = arguments[0]
            }
            else
            {
                a = $("#dvstorage").css("display") == "none" ? 1 : 0
            }
            if (a)
            {
                $("#dvstorage").show();
                $("#funlocal .arrow_down").show()
            }
            else
            {
                $("#dvstorage").hide();
                $("#funlocal .arrow_down").hide()
            }
        },
        DownloadChapeters : function ()
        {
            if (!window.localStorage)
            {
                return
            }
            var b = 10;
            if (BookReader.Storage.Config.Loading == 1)
            {
                Common.toast("正在预读，请稍候...");
                return
            }
            BookReader.Storage.Config.Loading = 1;
            var c =
            {
                ajaxMethod : "downloadchapters",
                bookId : BookReader.Options.Config.bookId,
                chapterId : BookReader.Options.Config.currentChapterId,
                cnt : b
            };
            var d = function (e)
            {
                BookReader.Storage.Config.Loading = 0;
                BookReader.Storage.ShowStorage(0);
                if (e)
                {
                    if (e.IsSuccess)
                    {
                        BookReader.Storage.DoneChapters(e.ReturnObject);
                        Common.toast(e.ReturnString);
                        $("#storagedesc").text(e.ReturnString);
                        BookReader.Other.Tracker()
                    }
                    else
                    {
                        Common.toast(e.ReturnString)
                    }
                }
                else
                {
                    Common.toast("预读错误！")
                }
            };
            var a = function (f, e)
            {
                BookReader.Storage.Config.Loading = 0;
                if (e == "timeout")
                {
                    Common.toast("好像网络有点问题哦...")
                }
                else
                {
                    Common.toast("预读失败，请稍后重试！")
                }
            };
            BookReader.Ajax(BookReader.Data.chapterAjaxUrl, c, d, a)
        },
        DoneChapters : function (c)
        {
            if (c)
            {
                var a = c[0];
                var b = c[1];
                Common.localStorage.remove(BookReader.Storage.Config.chapterKey);
                Common.localStorage.remove(BookReader.Storage.Config.bookKey);
                Common.localStorage.set(BookReader.Storage.Config.chapterKey, JSON.stringify(b));
                Common.localStorage.set(BookReader.Storage.Config.bookKey, JSON.stringify(a))
            }
        },
        GetChapterFromStorage : function (b)
        {
            if (!window.localStorage)
            {
                return null
            }
            var c = Common.localStorage.get(BookReader.Storage.Config.chapterKey);
            if (c == null || c == "")
            {
                return null
            }
            c = JSON.parse(c);
            for (var a = 0; a < c.length; a++)
            {
                if (c[a].ChapterId == b)
                {
                    return c[a]
                }
            }
        },
        GetBookInfoFromStorage : function ()
        {
            if (!window.localStorage)
            {
                return null
            }
            var a = Common.localStorage.get(BookReader.Storage.Config.bookKey);
            if (a == null || a == "")
            {
                return null
            }
            return JSON.parse(a)
        }
    }
};
$(document).ready(function ()
    {
        var e = 0,
            c = 0;
        if (Common.query())
        {
            e = Common.query().bookid;
            c = Common.query().chapterid
        }
        BookReader.Initialize(
            {
                bookId : e,
                chapterId : c
            }
        );
        var f = typeof(window.ontouchstart) != "undefined";
        var g = "touchstart";
        var h = "touchmove";
        var a = f ? "touchend" : "click";
        var b = false;
        var d = -1;
        $(BookReader.Display.Containers.ChapterDivId).bind(g, function (i)
            {
                b = false;
                d = BookReader.Other.getPosition(i).y
            }
        );
        $(BookReader.Display.Containers.ChapterDivId).bind(h, function (i)
            {
                if (f)
                {
                    b = true;
                    if ($("#tool_top").css("display") != "none")
                    {
                        BookReader.Display.CloseTools()
                    }
                    d = BookReader.Other.getPosition(i).y
                }
            }
        );
        $(BookReader.Display.Containers.ChapterDivId).bind(a, function (k)
            {
                if (!f)
                {
                    d = BookReader.Other.getPosition(k).y
                }
                if (k && k.target)
                {
                    d = BookReader.Other.FixEndY(d);
                    if (!b)
                    {
                        if (k && k.target && (k.target.tagName == "A" || k.target.tagName == "INPUT"))
                        {}

                        else
                        {
                            var j = 3;
                            var i = parseInt($(window).height() / j);
                            if (d >= 0 && d < i)
                            {
                                BookReader.Other.SlideScreen(-1);
                                BookReader.Display.CloseTools()
                            }
                            else
                            {
                                if (d >= 0 && d > (i * (j - 1)))
                                {
                                    BookReader.Other.SlideScreen(1);
                                    BookReader.Display.CloseTools()
                                }
                                else
                                {
                                    if ($("#tool_top").css("display") == "none")
                                    {
                                        BookReader.Display.CloseTools();
                                        $("#tool_top,#tool_btm1,#tool_btm2").show()
                                    }
                                    else
                                    {
                                        BookReader.Display.CloseTools()
                                    }
                                }
                            }
                        }
                        b = false
                    }
                }
            }
        );
        BookReader.Other.ShowCheckInImg();
        $("#buycheckin a").click(function ()
            {
                location.href = "/ploy/20150306/index.aspx?returnurl=" + location.href
            }
        )
    }
);
