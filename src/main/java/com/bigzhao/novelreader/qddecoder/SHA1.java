package com.bigzhao.novelreader.qddecoder;


/* compiled from: SHA1 */
/* renamed from: com.qidian.QDReader.core.k.n */
public abstract class SHA1 {
    public static String m7598a(String str, String str2) {
        int[] iArr;
        int[] iArr2;
        int i;
        if (str == null) {
            str = "";
        }
        if (str2 == null) {
            str2 ="";
        }
        int[] b = SHA1.m7602b(str);
        if (b.length >= 16) {
            iArr = b;
        } else {
            iArr2 = new int[(16 - b.length)];
            for (int i2 = 0; i2 < iArr2.length; i2++) {
                iArr2[i2] = 0;
            }
            iArr = SHA1.m7600a(b, iArr2);
        }
        if (iArr.length > 16) {
            iArr = SHA1.m7599a(iArr, str.length() * 8);
        }
        iArr2 = new int[16];
        int[] iArr3 = new int[16];
        for (i = 0; i < 16; i++) {
            iArr2[i] = 0;
            iArr3[i] = 0;
        }
        for (i = 0; i < 16; i++) {
            iArr2[i] = iArr[i] ^ 909522486;
            iArr3[i] = iArr[i] ^ 1549556828;
        }
        b = SHA1.m7599a(SHA1.m7600a(iArr3, SHA1.m7599a(SHA1.m7600a(iArr2, SHA1.m7602b(str2)), (str2.length() * 8) + 512)), 672);
        String str3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        String str4 = "";
        int[] b2 = SHA1.m7603b(b, b.length * 4);
        i = 0;
        while (i < b2.length * 4) {
            int i3 = ((((b2[i >> 2] >> ((3 - (i % 4)) * 8)) & 255) << 16) | (((b2[(i + 1) >> 2] >> ((3 - ((i + 1) % 4)) * 8)) & 255) << 8)) | ((b2[(i + 2) >> 2] >> ((3 - ((i + 2) % 4)) * 8)) & 255);
            int i4 = 0;
            String str5 = str4;
            while (i4 < 4) {
                str4 = (i * 8) + (i4 * 6) > b2.length * 32 ? str5 + "=" : str5 + str3.charAt((i3 >> ((3 - i4) * 6)) & 63);
                i4++;
                str5 = str4;
            }
            i += 3;
            str4 = str5;
        }
        return SHA1.m7597a(str4);
    }

    private static String m7597a(String str) {
        if (str == null) {
            str = "";
        }
        int length = str.length();
        if (length <= 1) {
            return str;
        }
        char charAt = str.charAt(length - 1);
        String str2 = "";
        length--;
        while (length >= 0 && str.charAt(length) == charAt) {
            str2 = str2 + str.charAt(length);
            length--;
        }
        return str.substring(0, str.indexOf(str2));
    }

    private static int[] m7600a(int[] iArr, int[] iArr2) {
        int[] iArr3 = new int[(iArr.length + iArr2.length)];
        for (int i = 0; i < iArr.length + iArr2.length; i++) {
            if (i < iArr.length) {
                iArr3[i] = iArr[i];
            } else {
                iArr3[i] = iArr2[i - iArr.length];
            }
        }
        return iArr3;
    }

    private static int[] m7599a(int[] iArr, int i) {
        int i2 = i >> 5;
        int[] b = SHA1.m7603b(iArr, i2);
        b[i2] = b[i2] | (128 << (24 - (i % 32)));
        i2 = (((i + 64) >> 9) << 4) + 15;
        int[] b2 = SHA1.m7603b(b, i2);
        b2[i2] = i;
        int[] iArr2 = new int[80];
        int i3 = 1732584193;
        int i4 = -271733879;
        int i5 = -1732584194;
        int i6 = 271733878;
        int i7 = -1009589776;
        for (i2 = 0; i2 < b2.length; i2 += 16) {
            int i8 = 0;
            int i9 = i7;
            int i10 = i6;
            int i11 = i5;
            int i12 = i4;
            int i13 = i3;
            while (i8 < 80) {
                if (i8 < 16) {
                    iArr2[i8] = b2[i2 + i8];
                } else {
                    iArr2[i8] = SHA1.m7596a(((iArr2[i8 - 3] ^ iArr2[i8 - 8]) ^ iArr2[i8 - 14]) ^ iArr2[i8 - 16], 1);
                }
                int a = SHA1.m7596a(i13, 5);
                int i14 = i8 < 20 ? (i12 & i11) | ((i12 ^ -1) & i10) : (i8 < 40 || i8 >= 60) ? (i12 ^ i11) ^ i10 : ((i12 & i11) | (i12 & i10)) | (i11 & i10);
                a = SHA1.m7601b(a, i14);
                i9 = SHA1.m7601b(i9, iArr2[i8]);
                i14 = i8 < 20 ? 1518500249 : i8 < 40 ? 1859775393 : i8 < 60 ? -1894007588 : -899497514;
                a = SHA1.m7601b(a, SHA1.m7601b(i9, i14));
                i9 = SHA1.m7596a(i12, 30);
                i8++;
                i12 = i13;
                i13 = a;
                int i15 = i9;
                i9 = i10;
                i10 = i11;
                i11 = i15;
            }
            i3 = SHA1.m7601b(i13, i3);
            i4 = SHA1.m7601b(i12, i4);
            i5 = SHA1.m7601b(i11, i5);
            i6 = SHA1.m7601b(i10, i6);
            i7 = SHA1.m7601b(i9, i7);
        }
        return new int[]{i3, i4, i5, i6, i7};
    }

    private static int m7596a(int i, int i2) {
        return (i << i2) | (i >>> (32 - i2));
    }

    private static int m7601b(int i, int i2) {
        int i3 = (i & 65535) + (i2 & 65535);
        return (i3 & 65535) | ((((i >> 16) + (i2 >> 16)) + (i3 >> 16)) << 16);
    }

    private static int[] m7602b(String str) {
        int i;
        int i2;
        int i3 = 0;
        if (str == null) {
            str = "";
        }
        int[] iArr = new int[(str.length() * 8)];
        for (i = 0; i < str.length() * 8; i += 8) {
            i2 = i >> 5;
            iArr[i2] = iArr[i2] | ((str.charAt(i / 8) & 255) << (24 - (i % 32)));
        }
        i = 0;
        i2 = 0;
        while (i2 < iArr.length && iArr[i2] != 0) {
            i2++;
            i++;
        }
        int[] iArr2 = new int[i];
        while (i3 < i) {
            iArr2[i3] = iArr[i3];
            i3++;
        }
        return iArr2;
    }

    private static int[] m7603b(int[] iArr, int i) {
        int i2 = 0;
        int length = iArr.length;
        if (length >= i + 1) {
            return iArr;
        }
        int[] iArr2 = new int[(i + 1)];
        for (int i3 = 0; i3 < i; i3++) {
            iArr2[i3] = 0;
        }
        while (i2 < length) {
            iArr2[i2] = iArr[i2];
            i2++;
        }
        return iArr2;
    }
}
