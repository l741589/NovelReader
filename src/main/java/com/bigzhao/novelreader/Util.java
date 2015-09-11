package com.bigzhao.novelreader;

import com.sun.istack.internal.NotNull;
import org.apache.commons.lang.ArrayUtils;
import org.apache.http.cookie.ClientCookie;
import org.apache.http.cookie.SetCookie;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Roy on 15-8-22.
 */
@Component
public class Util {
    public <T> T getBean(Class<T> t){
        return ContextLoader.getCurrentWebApplicationContext().getBean(t);
    }

    public String getSid(HttpServletRequest req,HttpServletResponse res){
        String sid=getCookieValue(req,"z_sid");
        if (sid!=null) return sid;
        sid=req.getSession().getId();
        addCookie(res,"z_sid",sid);
        return sid;
    }

    public javax.servlet.http.Cookie addCookie(HttpServletResponse res,String name,String val){
        javax.servlet.http.Cookie c=new javax.servlet.http.Cookie(name,val);
        c.setPath("/");
        res.addCookie(c);
        return c;
    }

    public String getCookieValue(HttpServletRequest req,String name){
        Cookie[] cs=req.getCookies();
        return getCookieValue(cs,name);
    }

    public String getCookieValue(Cookie[] cs,String name){
        if (cs!=null) {
            for (Cookie c : cs) {
                if (name.equals(c.getName())) return c.getValue();
            }
        }
        return null;
    }

}
