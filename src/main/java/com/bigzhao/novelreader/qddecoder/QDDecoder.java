package com.bigzhao.novelreader.qddecoder;

/**
 * Created by Roy on 15-9-26.
 */
public class QDDecoder {
    public static String decode(long uid,int bid,int cid,String meid,byte[] buf){
        return new Decoder1(uid,bid,cid,meid).decode(buf);
    }
}
