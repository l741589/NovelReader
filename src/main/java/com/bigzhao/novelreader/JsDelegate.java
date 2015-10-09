package com.bigzhao.novelreader;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bigzhao.jsexe.engine.Engine;
import com.bigzhao.jsexe.engine.net.HttpHelper;
import com.bigzhao.jsexe.util.L;
import com.bigzhao.novelreader.entity.NavStack;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ast.Comment;
import org.mozilla.javascript.ast.Scope;
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
    @Autowired NavStacker navStacker;

    @RequestMapping("/js/{method}.do")
    public ModelAndView page(HttpServletRequest req,HttpServletResponse res,@PathVariable() String method){
        Engine.scope(util.getSid(req,res));
        Scriptable s;
        util.track(req);
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
        mv.addObject("__back",navStacker.nav(req,res));
        tryAdd(mv,json,"menu","[]");
        tryAdd(mv,json,"title",null);
        return mv;
    }

    @RequestMapping("/back.do")
    public void back(HttpServletRequest req,HttpServletResponse res){
        String url=navStacker.back(req,res);
        try {
            res.setHeader("isBack","1");
            res.sendRedirect(url);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void tryAdd(ModelAndView mv,JSONObject json,String key,Object def){
        Object menu=json.get(key);
        if (menu!=null) mv.addObject("menu",menu);
        else if (def!=null) mv.addObject(key,def);
    }

    @RequestMapping(value="/js/ajax/{method}.do",produces={"application/json;charset=UTF-8"})
    public @ResponseBody String ajax(HttpServletRequest req,HttpServletResponse res,@PathVariable() String method){
        Engine.scope(util.getSid(req, res));
        util.track(req);
        Object obj=call(res,method, Engine.javaToJs(req.getParameterMap()));
        JSONObject json=(JSONObject)JSON.toJSON(obj);
        if (tryRedirect(json,res)) return null;
        return json.get("data").toString();
    }

    private boolean tryRedirect(JSONObject json,HttpServletResponse res){
        if (json==null) return false;
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
        util.track(req);
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
    public @ResponseBody String reset(HttpServletRequest req,HttpServletResponse res,@RequestParam(defaultValue = "all") String type){
        if ("js".equals(type)) {
            Engine.exit();
        }else if ("net".equals(type)) {
            HttpHelper.reset();
        }else{
            Engine.exit();
            HttpHelper.reset();
        }
        return "{code:'success'}";
    }
}
