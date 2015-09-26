package com.bigzhao.novelreader.qddecoder;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by Roy on 15-9-25.
 */
public class DES {
    public static String a(String paramString1, String paramString2)throws Exception
    {
        IvParameterSpec localIvParameterSpec = new IvParameterSpec(new byte[8]);
        SecretKeySpec localSecretKeySpec = new SecretKeySpec(paramString2.getBytes(), "DESede");
        Cipher localCipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
        localCipher.init(1, localSecretKeySpec, localIvParameterSpec);
        return A.a(localCipher.doFinal(paramString1.getBytes()));
    }
    public static byte[] a(byte[] paramArrayOfByte, String paramString) throws Exception {
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
}
