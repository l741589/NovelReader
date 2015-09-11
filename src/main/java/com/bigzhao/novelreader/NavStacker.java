package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.interfaces.JSInterfaceUtil;
import com.bigzhao.novelreader.entity.NavStack;
import com.opensymphony.oscache.base.NeedsRefreshException;
import com.opensymphony.oscache.general.GeneralCacheAdministrator;
import jdk.nashorn.internal.ir.RuntimeNode;
import org.apache.commons.lang.StringUtils;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by yangzhao.lyz on 2015/9/10.
 */
@Component
public class NavStacker extends GeneralCacheAdministrator{

    @Autowired
    Util util;

    private final String prefix="Z_NavStacker_";
    private final String TABLE="navstack";
    private final String home="/js/search.do";
    private final int refreshPeriod=3600*24;

    public void nav(HttpServletRequest req,HttpServletResponse res){
        String sid=util.getSid(req, res);
        String refer=req.getHeader("Referer");
        String url=req.getRequestURL().toString();
        if (url.equals(refer)) return;
        LinkedList<String> list=getList(sid);
        if (refer==null){
            list.clear();
            list.addLast(home);
            if (url.endsWith(home)) list.add(url);
        }else  {
            while(list.size()>0&&!refer.equals(list.getLast())){
                list.removeLast();
            }
            if (list.size()==0) {
                list.addLast(home);
                list.addLast(refer);
            }
            list.add(url);
        }
        put(sid,list);
    }

    public String back(HttpServletRequest req,HttpServletResponse res){
        String sid=util.getSid(req,res);
        LinkedList<String> s=getList(sid);
        if (s.isEmpty()) return home;
        s.removeLast();
        if (s.isEmpty()) return home;
        return s.getLast();
    }

    public String get(HttpServletRequest req,HttpServletResponse res){
        if (!"1".equals(req.getHeader("isBack"))) nav(req,res);
        LinkedList<String> s=getList(util.getSid(req,res));
        LinkedList<String> tmp=null;
        if (s.isEmpty()) return home;
        String ret=s.getLast();
        while (!s.isEmpty()&&req.getRequestURL().toString().equals(ret)){
            if (tmp==null) tmp=new LinkedList<>();
            tmp.addLast(s.pollLast());
            ret=s.getLast();
        }
        if (ret==null) ret=home;

        if (tmp!=null) while(!tmp.isEmpty()) s.addLast(tmp.pollLast());
        return ret;
    }

    private void put(String sid,LinkedList<String> list){
        String key=prefix+"sid"+sid;
        putInCache(key,list);
    }

    @SuppressWarnings("unchecked")
    private LinkedList<String> getList(String sid){
        String key=prefix+"sid"+sid;
        LinkedList<String> list=null;
        try {
            return list=(LinkedList<String>)getFromCache(key,refreshPeriod);
        } catch (NeedsRefreshException e) {
            putInCache(key,list=new LinkedList<>());
            return list;
        }finally {
            if (list==null) cancelUpdate(key);
        }
    }

}
