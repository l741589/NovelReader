package com.bigzhao.novelreader.qddecoder;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;

/**
 * Created by Roy on 15-9-25.
 */
public class Decoder1 {

    //b=3242304&c=88434031&i=a000005573853e

    private long uid;
    private int bid;
    private int cid;
    private String aid;

    public Decoder1(long uid,int bid,int cid,String aid){
        this.uid=uid;
        this.bid=bid;
        this.cid=cid;
        this.aid=aid;
    }

    private byte[][] m6106f(InputStream is) {
        try {
            byte[] bArr;
            byte[] bArr2;
            InputStream fileInputStream = is;
            if (fileInputStream.available() > 0) {
                int a = QDFileUtil.litterEndian(fileInputStream);
                if (a>500000||a<0) {
                    return null;
                }
                bArr = new byte[a];
                fileInputStream.read(bArr, 0, a);
                a = QDFileUtil.litterEndian(fileInputStream);
                byte[] bArr3 = new byte[a];
                fileInputStream.read(bArr3, 0, a);
                bArr2 = bArr;
                bArr = bArr3;
            } else {
                bArr = null;
                bArr2 = null;
            }
            fileInputStream.close();
            return new byte[][]{bArr2, bArr};
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String decode(byte[] bs){
        return m6104e(bs);
    }

    public String m6104e(byte[] bs){
        byte[][] f = m6106f(new ByteArrayInputStream(bs));
        if (f==null) {
            f=new byte[][]{new byte[0],bs};
        }
        if (f == null || f.length < 2) {
            return null;
        }
        byte[] bArr = f[0];
        byte[] bArr2 = f[1];
        long a = m6094a(bArr);
        if (a != 0 && a < System.currentTimeMillis()) {
            return null;
        }
        bArr2 = m6098b(bArr2);
        if (bArr2 != null) {
            return m6101c(bArr2);
        }
        return null;
    }

    public static byte[] m7582a(byte[] paramArrayOfByte, String paramString) throws Exception {
        IvParameterSpec localIvParameterSpec = new IvParameterSpec(new byte[8]);
        SecretKeySpec localSecretKeySpec = new SecretKeySpec(paramString.getBytes(), "DESede");
        Cipher localCipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
        localCipher.init(2, localSecretKeySpec, localIvParameterSpec);
        try
        {
            byte[] arrayOfByte = localCipher.doFinal(paramArrayOfByte);
            return arrayOfByte;
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
            int i = 0;
            if (paramArrayOfByte != null) {
                i = paramArrayOfByte.length;
            }
            System.out.println("decryptDESÊ§°Ü£º" + paramString + "," + i);
        }
        return null;
    }

    private static long m6094a(byte[] bArr) {
        long j = 0;
        if (!(bArr == null || bArr.length == 0)) {
            try {
                String str = new String(m7582a(bArr, "0821CAAD409B8402"), "UTF-8");
                if (str.length() != 0) {
                    String[] split = str.split(",");
                    j = Long.parseLong(split[split.length - 1]);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return j;
    }

    private byte[] m6098b(byte[] bArr) {
        int length;
        byte[] b;
        int i = 0;
        if (bArr != null) {
            length = bArr.length;
        } else {
            length = 0;
        }
        try {
            b = C0000b.b(bid, cid, bArr, uid, aid);
            if (b != null) {
                return b;
            }
        } catch (Exception e) {
            e.printStackTrace();
            //QDLog.d("VIP\u89e3\u5bc6\u9519\u8bef\uff01\uff01\uff01\uff01\uff01" + this.f5086b + "," + this.f5087c + "," + length + "," + QDUserManager.getInstance().m7117b() + "," + AppInfo.m7286a().m7305m());
        }
        /*try {
            *//*List e2 = QDConfig.getInstance().m7324e();
            if (e2 != null && e2.size() > 0) {
                while (i < e2.size()) {
                    b = C0000b.m0b(bid, cid, bArr, aid, (String) e2.get(i));
                    if (b != null) {
                        return b;
                    }
                    i++;
                }
            }*//*
        } catch (Exception e3) {
            e3.printStackTrace();
           // QDLog.d("IMEIList\u4e5fVIP\u89e3\u5bc6\u9519\u8bef\uff01\uff01\uff01\uff01\uff01" + this.f5086b + "," + this.f5087c + "," + length + "," + QDUserManager.getInstance().m7117b() + "," + AppInfo.m7286a().m7305m());
        }*/
        return null;
    }

    private static String m6101c(byte[] bArr) {
        try {
            return new String(bArr, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
