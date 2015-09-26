package com.bigzhao.novelreader.qddecoder;

import org.apache.commons.io.FileUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.util.zip.InflaterInputStream;

public class Main {

    static long uid=116617169;

    public static void main(String[] args) {
        try {
            byte[] bs = FileUtils.readFileToByteArray(new File("E:\\IntellijWS\\QDDecoder\\88434031.qd"));
           // byte[] r=a(bs,"0821CAAD409B8402");
            //String s=com.qidian.QDReader.core.k.a.(bs);
            String s=new Decoder1(uid,3242304,88434031,"a000005573853e").decode(bs);
       //     r= Arrays.copyOfRange(r,4,r.length);
            System.out.println(s);

        }catch (Exception e){
            e.printStackTrace();
        }
    }


}
