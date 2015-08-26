/**
 * Created by Roy on 15-8-22.
 */
$.load("lib.js");
$.http.proxy("localhost",8888);

function search(args){
    var url="http://4g.if.qidian.com/Atom.axd/Api/Search/GetBookStore?key="+args.keyword;
    if (args.page==null) url+="&type=0";
    else url+="&pageIndex="+args.page;
    var o= $.http.get(url).exec().json("utf-8");
    return{
        page:"/page/test.jsp",
        data: o.Data
    }
}

function search2(keyword,n){
    if (n==null) n=1;
    //var ds= $.http.get("http://www.baidu.com/")
    var ds= $.http.get("http://sosu.qidian.com/ajax/search.ashx?method=Search&n="+n+"&keyword="+keyword+"")
        .header({
            Host: "sosu.qidian.com",
            Connection: "keep-alive",
            Accept: "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
            "Referer": "http://sosu.qidian.com/searchresult.aspx?keyword=" + keyword
        }).exec().json();
    ds=ds.Data.search_response.books;
    $.log(ds);
    var out=[];
    for (var i in ds){
        var b=ds[i];
        $.log(JSON.stringify(b));
        //$.log(b.coverurl)
        //$.log(encodeURIComponent(b.coverurl));
        out.push({
            title:b.bookname,
            desc:b.description,
            coverUrl:b.coverurl,
            infoUrl:b.bookurl,
            bid: b.bookid,
            contentUrl:"http://read.qidian.com/BookReader/"+b.bookid+".aspx"
        });
    }
    $.log(JSON.stringify(out));
    return out;
}
