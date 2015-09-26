package com.bigzhao.novelreader.qddecoder;


import java.security.NoSuchAlgorithmException;

/* renamed from: a.b */
public class C0000b {
    //public static native byte[] m0b(int i, int i2, byte[] bArr, long j, String str);

    static {
        //System.loadLibrary("load-jni");
    }

    public static byte[] b(int bid,int cid,byte[] bs,long uid,String aid){
        String salt1=""+uid+aid+cid+"2EEE1433A152E84B3756301D8FA3E69A";
        String secrect1=s(aid,salt1);
        if (secrect1.length()>24) secrect1=secrect1.substring(0,24);
        String salt2=secrect1+aid;
        String secrect2=m(uid+"",salt2);
        if (secrect2.length()>24) secrect2=secrect2.substring(0,24);
        bs=d(bs,secrect2);
        return d(bs,secrect1);
    }
    public static String s(String str, String str2) {
        return SHA1.m7598a(str, str2);
    }

    public static String m(String str, String str2) {
        String str3 = null;
        try {
            str3 = MD5.m7583a(str, str2);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return str3;
    }

    public static byte[] d(byte[] bArr, String str) {
        byte[] bArr2 = null;
        try {
            bArr2 = DES.a(bArr, str);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bArr2;
    }
}
