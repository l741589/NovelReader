package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.Engine;
import com.bigzhao.jsexe.engine.interfaces.JSInterfaceHelper;
import com.bigzhao.novelreader.qddecoder.QDDecoder;
import org.hibernate.SessionFactory;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.web.context.ContextLoader;

/**
 * Created by yangzhao.lyz on 2015/9/6.
 */
public class GlobalListener implements ApplicationListener<ContextRefreshedEvent>{

    private Object ext;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        try {
            System.out.println("----------------------------------initialized----------------");
            JSInterfaceHelper.registerJsInterfaceFunction("jt", getClass().getMethod("jt"));
            JSInterfaceHelper.registerJsInterfaceFunction("sf",getClass().getMethod("sf"));
            JSInterfaceHelper.registerJsInterfaceFunction("db",getClass().getMethod("db"));
            JSInterfaceHelper.registerJsInterfaceExt("qd",new QDDecoder());
            Engine.scopeStrategy= Engine.ScopeStrategy.THREAD_LOCAL;
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    public static SessionFactory sf(){
        return ContextLoader.getCurrentWebApplicationContext().getBean(SessionFactory.class);
    }

    public static JdbcTemplate jt(){
        return ContextLoader.getCurrentWebApplicationContext().getBean(JdbcTemplate.class);
    }

    public static TemplateDao db(){
        return ContextLoader.getCurrentWebApplicationContext().getBean(TemplateDao.class);
    }
}
