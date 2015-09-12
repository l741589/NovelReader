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
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
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

    public String nav(HttpServletRequest req,HttpServletResponse res){
        String sid=util.getSid(req, res);
        String refer=req.getHeader("Referer");
        String url=req.getRequestURL()+"?"+req.getQueryString();

        LinkedList<String> list=getList(sid);

        if (refer==null){
            list.clear();
            list.addLast(home);
            list.add(url);
            refer=home;
        }else{
            Iterator<String> i=list.iterator();
            boolean eqs=false;
            while(i.hasNext()){
                String s=i.next();
                if (eq(s,url)) {
                    eqs=true;
                    break;
                }
            }
            if (eqs) i.remove();
            while(i.hasNext()){
                i.next();
                i.remove();
            }
            if (eq(list.getLast(),refer)){
                list.removeLast();
                list.add(refer);
            }else{
                refer=list.getLast();
            }
            list.add(url);
        }
        put(sid,list);
        return refer;
    }

    public boolean eq(String s1,String s2){
        if (s1==null||s2==null) return false;
        return getUrlWithoutQueryString(s1).equals(getUrlWithoutQueryString(s2));
    }

    public String getUrlWithoutQueryString(String s){
        int x=s.indexOf('?');
        if (x==-1) return s;
        return s.substring(0,x);
    }

    public String back(HttpServletRequest req,HttpServletResponse res){
        String sid=util.getSid(req,res);
        LinkedList<String> s=getList(sid);
        if (s.isEmpty()) return home;
        s.removeLast();
        if (s.isEmpty()) return home;
        return s.getLast();
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
            list=new LinkedList<>();
            list.add(home);
            putInCache(key, list);
            return list;
        }finally {
            if (list==null) cancelUpdate(key);
        }
    }

}
