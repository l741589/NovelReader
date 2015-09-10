package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.interfaces.JSInterfaceUtil;
import com.bigzhao.novelreader.entity.NavStack;
import jdk.nashorn.internal.ir.RuntimeNode;
import org.apache.commons.lang.StringUtils;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by yangzhao.lyz on 2015/9/10.
 */
@Component
public class NavStacker {

    @Autowired
    Util util;

    @Autowired
    SessionFactory sf;

    private ConcurrentHashMap<String,LinkedList<String>> stacks=new ConcurrentHashMap<>();

    private final String TABLE="navstack";
    private final String home="/js/search.do";

    public void nav(HttpServletRequest req,HttpServletResponse res){
        String sid=util.getSid(req, res);
        String refer=util.getCookieValue(req, "Referer");
        String url=req.getRequestURL().toString();
        String md5= JSInterfaceUtil.md5(url);
        String rmd5= JSInterfaceUtil.md5(refer);
        if (StringUtils.equals(url,refer)) return;
        NavStack ns=(NavStack)sf.getCurrentSession().get(NavStack.class, new NavStack.Id(sid, rmd5));
        if (ns==null) {
            sf.getCurrentSession().createQuery("delete from NavStack where id.sid=?").setString(0,sid).executeUpdate();
            ns=new NavStack();
            ns.id=new NavStack.Id(sid,md5);
            ns.url=url;
            ns.referer=home;
            sf.getCurrentSession().saveOrUpdate(ns);
        }else{

        }
    }
}
