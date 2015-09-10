package com.bigzhao.novelreader.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Created by yangzhao.lyz on 2015/9/10.
 */
@Table(name = "navstack")
@Entity
public class NavStack {

    @EmbeddedId
    public Id id;
    public String url;
    public String referer;
    public Timestamp time;

    @Embeddable
    public static class Id implements Serializable{
        public Id(){}
        public Id(String sid,String urlmd5){
            this.sid=sid;
            this.urlmd5=urlmd5;
        }

        private String sid;
        private String urlmd5;

        public String getSid() {
            return sid;
        }

        public void setSid(String sid) {
            this.sid = sid;
        }

        public String getUrlmd5() {
            return urlmd5;
        }

        public void setUrlmd5(String urlmd5) {
            this.urlmd5 = urlmd5;
        }


    }
}
