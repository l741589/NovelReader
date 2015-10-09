/**
 * Created by Roy on 15-9-26.
 */
var GameData= {
    item: [
        {
            id: "tech1",
            name: "一号科技",
            type:"tech",
            action: [
                ["study",5]
            ]
        },
        {
            id: "tech2",
            name: "二号科技",
            type:"tech",
            action: [
               ["produce",10,["tech1"],[]]
            ]
        },
        {
            id:"item1",
            type:"item",
            name:"物品1",
            action:[
                ["produce",10,["tech1"]]
            ]
        }
    ],
    action:{
        produce:function(view) {
            var action=view.prop("action");
            var item=view.prop("item");
            var time=action[1]||action["time"]||0;
            var targetTime=Date.now()+time;
            setInterval(function(){
                view.attr("time",view.attr("time")-1);
            },1000);
        }
    }
};

function Item(gameItem){
    $.extend(this,{
        "g":typeof gameItem=="number"?GameData.item["@id"+parseInt(number)]:gameItem
    });
}

var Data={
    item:{}
};

(function(){
    GameData.item.optimize("id");
})();