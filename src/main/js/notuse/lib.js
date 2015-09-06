

//array
 


// string
Object.defineProperties(String.prototype, {
    __trim: {
        enumerable: false,
        writable:false,
        value: function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    },
    __ltrim: {
        enumerable: false,
        writable:false,
        value: function () {
            return this.replace(/(^\s*)/g, "");
        }
    },
    __rtrim: {
        enumerable: false,
        writable:false,
        value: function () {
            return this.replace(/(\s*$)/g, "");
        }
    },
    __endWith: {
        enumerable: false,
        value: function (str) {
            if (str == null || str == "" || this.length == 0 || str.length > this.length)return false;
            if (this.substring(this.length - str.length) == str)return true;
            else return false;
            return true;
        }
    },
    __byteLength: {
        enumerable: false,
        value: function () {
            var len = 0;
            for (var i = 0; i < this.length; i++) {
                var length = this.charCodeAt(i);
                if (length >= 0 && length <= 128) len += 1;
                else len += 2;
            }
            return len;
        }
    },
    __startWith: {
        enumerable: false,
        value: function (str) {
            if (str == null || str == "" || this.length == 0 || str.length > this.length) return false;
            if (this.substr(0, str.length) == str)return true;
            else return false;
            return true;
        }
    },
    __format: {
        enumerable: false,
        value: function (args, callbacks) {
            return this.replace(/\\\{|{((?:[_\$a-zA-Z][\w\.]*)|(?:[\d\.]+)|\*)(?::(-?\d+))?}/g, function (ori, cap, width) {
                if (cap == "*") cap = "0";
                if (ori == '\\{') return ori;
                cap = cap.split(".");
                var obj = args;
                var cb = callbacks;
                for (var i in cap) {
                    if (this.__isLib(i)) continue;
                    if (cb != null)  cb = cb[cap[i]];
                    if (obj != null) obj = obj[cap[i]];
                    if (typeof obj == "function") obj = obj();
                }
                var ret = obj + "";
                if (cb != null) ret = cb(obj) + "";
                if (ret == null) return;
                //$.log(width)

                if (width != null) {
                    width = parseInt(width);
                    if (width > 0) {
                        while (ret.byteLength() < width) ret = " " + ret;
                    } else if (width < 0) {
                        while (ret.byteLength() < -width) ret = ret + " ";
                    }
                }
                return ret;
            });
        }
    },
    __contains: {
        enumerable: false,
        value: function (o) {
            for (var i=0;i<this.length;i++){
                if (this.charAt(i)==o) return true;
            }
            return false;
        }
    }
});

// object

Object.defineProperties(Object.prototype, {
    __map: {
        enumerable: false,
        value: function (callback) {
            //$.log("obj Map");
            var out = {};
            for (var i in this) {
                var o = callback(this[i], i);
                if (o != null) out[i] = o;
            }
            return out;
        }
    },


    __join: {
        enumerable: false,
        value: function (sp) {
            return this.__flat().join(sp);
        }
    },

    __flat: {
        enumerable: false,
        value: function () {
            var a = []
            for (var i in this) {
                if (i.toString().startWith("__")) continue;
                a.push(this[i]);
            }
            return a;
        }
    },

    __extend: {
        enumerable: false,
        value: function (b, cover) {
            var a = this.__clone();
            for (var i in b) {
                if (cover || a[i] == null) a[i] = b[i];
            }
            return a;
        }
    },

    __clone: {
        enumerable: false,
        value: function () {
            if (this.__empty()) return {};
            return {}.__extend(this);
        }
    },

    __size: {
        enumerable: false,
        value: function () {
            var x = 0;
            for (var i in this) {
                if (i.toString().startWith("__")) continue;
                ++x;
            }
            return x;
        }
    },

    __empty: {
        enumerable: false,
        value: function () {
            for (var i in this) {
                if (i.toString().startWith("__")) continue;
                return false;
            }
            return true;
        }
    },

    __isLib: {
        enumerable: false,
        value: function (i) {
            return i.toString().startWith("__");
        }
    },
    __toArray:{
        enumerable: false,
        value:function(){
            var r=[];
            for (var i in this) {
                r.push(this[i])
                $.log(this[i])
            }
            return r;
        }
    }

});
Object.defineProperties(Array.prototype,{
    __map:{
        enumerable:false,
        value:function(callback) {
            //$.log("array Map");
            //$.log(JSON.stringify(this)+callback)
            var out = [];
            for (var i in this) {
                //if (i.toString().startWith("__")) continue;
                var o = callback(this[i], i);
                if (o != null) out.push(o);
            }
            return out;
        }
    },

    __optimize: {
        enumerable: false,
        value: function () {
            var obj = {};
            var args = arguments;
            this.forEach(function (e) {
                for (var i = 0; i < args.length; ++i) {
                    var s = args[i];
                    obj[s + e[s]] = e;
                    //$.log(i+" "+s+' '+e[s]);
                }
            });
            return obj;
        }
    },

    __contains: {
        enumerable: false,
        value: function (o) {
            for (var i in this) {
                if (this[i] == o) return true;
            }
            return false;
        }
    }
});


// function
Object.defineProperties(Function.prototype, {
    getName: {
        enumerable: false,
        value: function () {
            return this.name || this.toString().match(/function\s*([^(]*)\(/)[1]
        }
    }
});
 
 
function readKey(msg,choice){
    $.log(msg);
    var c= $.readKey();
    $.log(c+":"+choice)
    if (choice!=null) {
        while (!choice.__contains(c)) {
            c = $.readKey();
        }
    }
    return c;
}
 
 
 
 
 
 
 
 // global



function loadData(name){
    try {
        $.log("load: "+name);
        return $.loadText("out2/"+name);
    } catch (e) {
        $.log("load "+name+" fail");
    }
}

function loadJson(name){
    try {
        $.log("load: "+name);
        return $.loadJson("out2/"+name);
    } catch (e) {
        $.log("load "+name+" fail: "+e);;
    }
}
 
 


