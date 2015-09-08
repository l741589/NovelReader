/**
 * Created by yangzhao.lyz on 2015/8/28.
 */

function ListManager(data,itePieceUrl,itemUpdate){
    var _this=this;
    this.data=data;
    this.list=$("#list");
    this.list.prop("listManager",this);
    this.itemCount=this.data.length;
    var h=this.list.prop("clientHeight");
    this.pageItemCount=Math.floor(h/this.list.attr("itemHeight"));
    this.pageCount=Math.ceil(data.length/this.pageItemCount);
    this.page=0;
    this.sysPage=1;
    this.autoAppendUrl=false;
    var appending=false;
    //console.log(this.pageCount+","+this.itemCount+","+this.pageItemCount);
    var url=itePieceUrl;
    if (typeof url=="object") {
        var done=0;
        for (var i in url){
            _this.piece=new Array();
            (function() {
                var ii=i;
                $.get(url[ii], function (piece) {
                    _this.piece[ii] = piece;
                    ++done;
                    if (done>=url.length){
                        _this.setPage(0);
                        _this.bindEvent();
                    }
                });

            })();
        }
    }else {
        $.get(url, function (piece) {
            _this.piece = [piece];
            _this.setPage(0);
            _this.bindEvent();
        });
    }
    this.setPage=function(page){
        if (_this.piece==null) return;
        if (page>=this.pageCount) page=this.pageCount-1;
        if (page<0) page=0;
        _this.page=page;
        _this.list.empty();
        var baseIndex=this.page*this.pageItemCount;
        _this.updatePage();
        for (var i=0;i<this.pageItemCount;++i){
            if (baseIndex+i>=_this.itemCount) break;
            var d=data[baseIndex+i];
            var node=$(_this.piece[d.listItemType||0]);
            _this.list.append(node);

            itemUpdate(node,d);

            if (_this.autoAppendUrl&&!appending&&_this.page==_this.pageCount-1){
                appending=true;
                var targetPage=_this.sysPage+1;
                $.get(_this.autoAppendUrl+targetPage,function(data){
                    if (typeof data=="string") data=JSON.parse(data);
                    if (data==null||data.length==0) _this.autoAppendUrl=false;
                    else {
                        _this.append(data,targetPage);
                    }
                    appending=false;
                }).error(function(){ appending=false; });
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
        if (_this.eventBinded) return;
        _this.eventBinded=true;
        var pager=_this.getPager()
        if (pager.length==0) return false;
        pager.find(".prev").mousedown(this.prevPage);
        pager.find(".next").mousedown(this.nextPage);
    };

    this.getPager=function(){
        if (_this.pager==null||_this.pager.length==0){
            _this.pager=$("#pager");
        }
        return _this.pager;
    };

    this.updatePage=function(){
        _this.getPager().find(".page").val((_this.page+1)+"/"+_this.pageCount);
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