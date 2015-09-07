package com.bigzhao.novelreader;

import com.bigzhao.jsexe.engine.Engine;
import org.apache.commons.lang.StringUtils;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.orm.hibernate4.support.HibernateDaoSupport;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by yangzhao.lyz on 2015/9/6.
 */
@Component
public class TemplateDao {

    @Autowired
    private JdbcTemplate t;

    private static class ArgsBuilder{

        ArrayList<Object> args=new ArrayList<>();
        public String s1;
        public String s2;

        private void build1(Scriptable obj, String separator, String separatorEach) {
            StringBuilder sb = new StringBuilder();
            Object[] ids = obj.getIds();
            int len=ids==null?0:ids.length;
            boolean start = true;
            for (int i = 0; i < len; ++i){
                if (start) start=false;
                else sb.append(separator);
                sb.append('`');
                sb.append(ids[i]);
                sb.append('`');
                sb.append(separatorEach);
                sb.append('?');
                Object val=ScriptableObject.getProperty(obj, ids[i].toString());
                args.add(val);
            }
            s1=sb.toString();
        }

        private void build2(Scriptable obj, String separator, String separator2) {
            StringBuilder sb = new StringBuilder();
            StringBuilder sb2 = new StringBuilder();
            Object[] ids = obj.getIds();
            int len=ids==null?0:ids.length;
            boolean start = true;
            for (int i = 0; i < len; ++i){
                if (start) start=false;
                else {
                    sb.append(separator);
                    sb2.append(separator2);
                }
                sb.append('`');
                sb.append(ids[i]);
                sb.append('`');

                sb2.append('?');
                Object val=ScriptableObject.getProperty(obj, ids[i].toString());
                args.add(val);
            }
            s1=sb.toString();
            s2=sb2.toString();
        }
    }



    public Object query(String sql,Scriptable args){
        Object[] as=null;
        if (!sql.contains(" ")){
            sql="SELECT * FROM `"+sql+"`";
        }
        if (args!=null){
            if (args instanceof NativeObject){
                ArgsBuilder ab=new ArgsBuilder();
                ab.build1(args, " AND ", "=");
                sql+=" WHERE "+ab.s1;
                as=ab.args.toArray();
            }else if (args instanceof NativeArray){
                int len=((NativeArray)args).size();
                as=new Object[len];
                for (int i=0;i<len;++i) as[i]= Engine.jsToJava(ScriptableObject.getProperty(args,i));
            }
        }
        System.out.println(sql);
        List<Map<String,Object>> list=t.queryForList(sql, as);
        return Engine.javaToJs(list);
    }

    public Object queryOne(String sql,Scriptable args){
        Object[] as=null;
        if (!sql.contains(" ")) sql="SELECT * FROM `"+sql+"`";
        if (args!=null){
            if (args instanceof NativeObject){
                ArgsBuilder ab=new ArgsBuilder();
                ab.build1(args," AND ","=");
                sql+=" WHERE "+ab.s1;
                as=ab.args.toArray();
            }else if (args instanceof NativeArray){
                int len=((NativeArray)args).size();
                as=new Object[len];
                for (int i=0;i<len;++i) as[i]= Engine.jsToJava(ScriptableObject.getProperty(args,i));
            }else{
                throw new IllegalArgumentException("args must be Array or Object");
            }
        }
        System.out.println(sql);
        Map<String,Object> map=t.queryForMap(sql, as);
        return Engine.javaToJs(map);
    }

    public Object update(String sql,Scriptable args){
        if (args==null) throw new IllegalArgumentException("args cannot be null");
        Object[] as=null;
        if (!sql.contains(" ")) sql="INSERT INTO `"+sql+"` (%s) VALUES(%s) ON DUPLICATE KEY UPDATE %s";
        if (args instanceof NativeObject) {
            ArgsBuilder ab = new ArgsBuilder();
            ab.build2(args, ",", ",");
            ArgsBuilder ab2 = new ArgsBuilder();
            ab2.build1(args, ",", "=");
            sql = String.format(sql, ab.s1, ab.s2, ab2.s1);
            ab.args.addAll(ab2.args);
            as=ab.args.toArray();
        }else if (args instanceof NativeArray) {
            int len = ((NativeArray) args).size();
            as = new Object[len];
            for (int i = 0; i < len; ++i) as[i] = Engine.jsToJava(ScriptableObject.getProperty(args, i));
        }else{
            throw new IllegalArgumentException("args must be Array or Object");
        }
        KeyHolder kh = new GeneratedKeyHolder();
        t.update(sql, as);
        return Engine.javaToJs(kh.getKeys());
    }

    public Object delete(String sql,Scriptable args){
        if (args==null) throw new IllegalArgumentException("args cannot be null");
        Object[] as=null;
        if (!sql.contains(" ")) sql="DELETE FROM `"+sql+"`";
        if (args instanceof NativeObject){
            ArgsBuilder ab=new ArgsBuilder();
            ab.build1(args, " AND ", "=");
            sql+=" WHERE "+ab.s1;
            as=ab.args.toArray();
        }else if (args instanceof NativeArray){
            int len=((NativeArray)args).size();
            as=new Object[len];
            for (int i=0;i<len;++i) as[i]= Engine.jsToJava(ScriptableObject.getProperty(args,i));
        }else{
            throw new IllegalArgumentException("args must be Array or Object");
        }
        KeyHolder kh = new GeneratedKeyHolder();
        t.update(sql, as);
        return Engine.javaToJs(kh.getKeys());
    }
}
