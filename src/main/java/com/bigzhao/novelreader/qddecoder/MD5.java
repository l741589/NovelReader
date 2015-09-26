package com.bigzhao.novelreader.qddecoder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/* compiled from: MD5 */
/* renamed from: com.qidian.QDReader.core.k.g */
public final class MD5 {
    private static char[] f6474a;

    static {
        f6474a = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'};
    }

    private static byte[] m7585b(byte[] bArr) throws NoSuchAlgorithmException {
            MessageDigest instance = MessageDigest.getInstance("MD5");
            instance.update(bArr);
            return instance.digest();
    }

    public static String m7583a(String str, String str2) throws NoSuchAlgorithmException {
        int i;
        int length;
        int i2 = 0;
        byte[] bytes = str.getBytes();
        byte[] bytes2 = str2.getBytes();
        byte[] bArr = new byte[64];
        byte[] bArr2 = new byte[64];
        for (i = 0; i < 64; i++) {
            bArr[i] = (byte) 54;
            bArr2[i] = (byte) 92;
        }
        byte[] bArr3 = new byte[64];
        if (bytes.length > 64) {
            bytes = MD5.m7585b(bytes);
        }
        for (i = 0; i < bytes.length; i++) {
            bArr3[i] = bytes[i];
        }
        if (bytes.length < 64) {
            for (length = bytes.length; length < bArr3.length; length++) {
                bArr3[length] = (byte) 0;
            }
        }
        byte[] bArr4 = new byte[64];
        for (length = 0; length < 64; length++) {
            bArr4[length] = (byte) (bArr3[length] ^ bArr[length]);
        }
        bArr = new byte[(bArr4.length + bytes2.length)];
        for (length = 0; length < bArr4.length; length++) {
            bArr[length] = bArr4[length];
        }
        for (length = 0; length < bytes2.length; length++) {
            bArr[bArr3.length + length] = bytes2[length];
        }
        bArr4 = MD5.m7585b(bArr);
        bytes2 = new byte[64];
        for (length = 0; length < 64; length++) {
            bytes2[length] = (byte) (bArr3[length] ^ bArr2[length]);
        }
        bArr = new byte[(bytes2.length + bArr4.length)];
        for (length = 0; length < bytes2.length; length++) {
            bArr[length] = bytes2[length];
        }
        for (length = 0; length < bArr4.length; length++) {
            bArr[bArr3.length + length] = bArr4[length];
        }
        bytes = MD5.m7585b(bArr);
        StringBuffer stringBuffer = new StringBuffer();
        int length2 = bytes.length;
        while (i2 < length2) {
            int i3 = i2 + 1;
            int i4 = bytes[i2] & 255;
            if (i3 == length2) {
                stringBuffer.append(f6474a[i4 >>> 2]);
                stringBuffer.append(f6474a[(i4 & 3) << 4]);
                stringBuffer.append("==");
                break;
            }
            int i5 = i3 + 1;
            i3 = bytes[i3] & 255;
            if (i5 == length2) {
                stringBuffer.append(f6474a[i4 >>> 2]);
                stringBuffer.append(f6474a[((i4 & 3) << 4) | ((i3 & 240) >>> 4)]);
                stringBuffer.append(f6474a[(i3 & 15) << 2]);
                stringBuffer.append("=");
                break;
            }
            i2 = i5 + 1;
            i5 = bytes[i5] & 255;
            stringBuffer.append(f6474a[i4 >>> 2]);
            stringBuffer.append(f6474a[((i4 & 3) << 4) | ((i3 & 240) >>> 4)]);
            stringBuffer.append(f6474a[((i3 & 15) << 2) | ((i5 & 192) >>> 6)]);
            stringBuffer.append(f6474a[i5 & 63]);
        }
        return stringBuffer.toString();
    }

    public static final String m7584a(byte[] bArr) {
        int i = 0;
        char[] cArr = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
        try {
            MessageDigest instance = MessageDigest.getInstance("MD5");
            instance.update(bArr);
            byte[] digest = instance.digest();
            int length = digest.length;
            char[] cArr2 = new char[(length * 2)];
            int i2 = 0;
            while (i < length) {
                byte b = digest[i];
                int i3 = i2 + 1;
                cArr2[i2] = cArr[(b >>> 4) & 15];
                i2 = i3 + 1;
                cArr2[i3] = cArr[b & 15];
                i++;
            }
            return new String(cArr2);
        } catch (Exception e) {
            return null;
        }
    }
}
