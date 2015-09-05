package com.bigzhao.novelreader;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bigzhao.jsexe.engine.Engine;
import com.bigzhao.jsexe.engine.net.HttpHelper;
import com.bigzhao.jsexe.util.L;
import org.mozilla.javascript.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.stream.StreamSupport;

/**
 * Created by Roy on 15-8-22.
 */
@Controller
public class JsDelegate {
    @Autowired Util util;

    @RequestMapping("/js/{method}.do")
    public ModelAndView page(HttpServletRequest req,HttpServletResponse res,@PathVariable() String method){
        Engine.scope(util.getSid(req,res));
        Object obj=call(res,method, Engine.javaToJs(req.getParameterMap()));

        JSONObject json=(JSONObject)JSON.toJSON(obj);
        if (tryRedirect(json,res)) return null;
        ModelAndView mv=new ModelAndView(json.getString("page"));
        String charset=json.getString("charset");
        if (charset==null) charset="utf-8";
        mv.addObject("charset",charset);
        Object data=json.get("data");
        if (data!=null) {
            if (data instanceof JSONArray) {
                mv.addObject("data", data.toString());
            } else if (data instanceof JSONObject) {
                JSONObject j = (JSONObject) data;
                JSONArray a = new JSONArray();
                for (String key : j.keySet()) a.add(key);
                mv.addObject("data", j.toString());
                mv.addAllObjects(j);
            } else {
                mv.addObject("data", data.toString());
            }
        }
        return mv;
    }

    @RequestMapping(value="/js/ajax/{method}.do",produces={"application/json;charset=UTF-8"})
    public @ResponseBody String ajax(HttpServletRequest req,HttpServletResponse res,@PathVariable() String method){
        Engine.scope(util.getSid(req, res));
        Object obj=call(res,method, Engine.javaToJs(req.getParameterMap()));
        JSONObject json=(JSONObject)JSON.toJSON(obj);
        if (tryRedirect(json,res)) return null;
        return json.get("data").toString();
    }

    private boolean tryRedirect(JSONObject json,HttpServletResponse res){
        if (json.getString("redirect")!=null) {
            try {
                res.sendRedirect(json.getString("redirect"));
                return true;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    @RequestMapping(value="/js/ajaxraw/{method}.do",produces={"application/json;charset=UTF-8"})
    public @ResponseBody String ajaxraw(HttpServletRequest req,HttpServletResponse res,@PathVariable() String method){
        Engine.scope(util.getSid(req,res));
        Object obj=call(res,method, Engine.javaToJs(req.getParameterMap()));
        JSONObject json=(JSONObject)JSON.toJSON(obj);
        return json.toString();
    }

    public Object call(HttpServletResponse res,String func,Object...args){
        URL url=Thread.currentThread().getContextClassLoader().getResource("qidian.js");
        Engine.load(url.getFile());
        Object obj=Engine.jsToJava(Engine.call(func, args));
        if (obj==null) {
            try {
                res.sendError(404);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
        return obj;
    }

    @RequestMapping("/reset.do")
    public @ResponseBody String reset(HttpServletRequest req,HttpServletResponse res){
        Engine.exit();
        HttpHelper.reset();
        return "{code:'success'}";
    }
}
