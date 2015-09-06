package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.interfaces.JSInterfaceHelper;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

/**
 * Created by yangzhao.lyz on 2015/9/6.
 */
public class GlobalListener implements ApplicationListener<ContextRefreshedEvent>{

    private Object ext;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("----------------------------------initialized----------------");
        JSInterfaceHelper.registerJsInterfaceExt("db",ext);
    }
}
