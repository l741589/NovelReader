/**
 * Created by Roy on 15-9-27.
 */

Object.defineProperties(Array.prototype,{
    optimize:{
        enumerable:false,
        value:function(fieldName){
            for (var i=0;i<this.length;++i){
                var item=this[i];
                this["@"+fieldName+item[fieldName]]=item;
            }
        }
    }
});