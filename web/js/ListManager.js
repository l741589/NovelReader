/**
 * Created by yangzhao.lyz on 2015/8/28.
 */

function ListManager(data,itempieceUrl,itemUpdate){
    var _this=this;
    this.data=data;
    this.list=$("#list");
    this.itemCount=this.data.length;
    var h=this.list.prop("clientHeight");
    this.pageItemCount=Math.floor(h/this.list.attr("itemHeight"));
    this.pageCount=Math.ceil(data.length/this.pageItemCount);
    this.page=0;
    this.sysPage=1;
    this.autoAppendUrl=false;
    var appending=false;
    console.log(this.pageCount+","+this.itemCount+","+this.pageItemCount);
    $.get(itempieceUrl,function(piece){
        _this.piece=piece;
        _this.setPage(0);
        _this.bindEvent();
    });
    this.setPage=function(page){
        if (page>=this.pageCount) page=this.pageCount-1;
        if (page<0) page=0;
        _this.page=page;
        _this.list.empty();
        var baseIndex=this.page*this.pageItemCount;
        for (var i=0;i<this.pageItemCount;++i){
            if (baseIndex+i>=_this.itemCount) break;
            var node=$(_this.piece);
            _this.list.append(node);
            var d=data[baseIndex+i];
            itemUpdate(node,d);

            if (_this.autoAppendUrl&&!appending&&_this.page==_this.pageCount-1){
                appending=true;
                var targetPage=_this.sysPage+1;
                $.get(_this.autoAppendUrl+targetPage,function(data){
                    appending=false;
                    if (typeof data=="string") data=JSON.parse(data);
                    if (data==null||data.length==0) _this.autoAppendUrl=false;
                    else {
                        _this.append(data,targetPage);
                    }
                });
            }
        }
    };
    this.nextPage=function(){
        _this.setPage(_this.page+1);
    };

    this.prevPage=function(){
        _this.setPage(_this.page-1);
    };

    this.bindEvent=function(){
        var pager=$("#pager");
        if (pager.length==0) return false;
        pager.find(".prev").mousedown(this.prevPage);
        pager.find(".next").mousedown(this.nextPage);
    };

    this.refresh=function(){
        this.itemCount=this.data.length;
        this.pageCount=Math.ceil(data.length/this.pageItemCount);
        _this.setPage(_this.page);
    };

    this.append=function(data,page){
        for (var i in data) _this.data.push(data[i]);
        _this.sysPage=page;
        _this.refresh();
    };

    this.autoAppend=function(url){
        this.autoAppendUrl=url;
        _this.refresh();
    }
}