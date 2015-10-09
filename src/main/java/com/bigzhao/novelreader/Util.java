package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.interfaces.JSInterfaceUtil;
import com.bigzhao.jsexe.engine.net.HttpHelper;
import com.bigzhao.novelreader.qddecoder.Main;
import com.sun.istack.internal.NotNull;
import org.apache.commons.lang.ArrayUtils;
import org.apache.http.cookie.ClientCookie;
import org.apache.http.cookie.SetCookie;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * Created by Roy on 15-8-22.
 */
@Component
public class Util {

    @Autowired
    private JdbcTemplate t;

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

    public void track(HttpServletRequest req){
        try {
            do {
                String s = HttpHelper.cookie("cmfuToken");
                if (s == null) break;
                String md5 = JSInterfaceUtil.md5(s);
                Map<String, Object> map=null;
                try {
                    map = t.queryForMap("select uid,quid from user where tokenmd5=? and token=?", md5, s);
                }catch (DataAccessException e){}
                if (map == null) break;
                Long uid = Long.parseLong(map.get("uid").toString());
                Long quid = Long.parseLong(map.get("quid").toString());

                if (uid == null) uid = -1l;
                if (quid == null) quid = -1l;
                t.update("insert into request_log(`token`,`uid`,`quid`,`url`,`query`,`ip`) values(?,?,?,?,?,?)", s, uid, quid, req.getRequestURL().toString(), req.getQueryString(),req.getRemoteAddr());
                return;
            }while(false);
            t.update("insert into request_log(`url`,`query`,`ip`) values(?,?,?)",req.getRequestURL().toString(),req.getQueryString(),req.getRemoteAddr());
        }catch(Exception e){
            e.printStackTrace();
        }
    }

}
