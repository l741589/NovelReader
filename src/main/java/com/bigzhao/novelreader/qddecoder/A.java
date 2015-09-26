//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.bigzhao.novelreader.qddecoder;

import java.io.UnsupportedEncodingException;

public final class A {
    private static char[] a = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'};
    private static byte[] b = new byte[]{(byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)62, (byte)-1, (byte)-1, (byte)-1, (byte)63, (byte)52, (byte)53, (byte)54, (byte)55, (byte)56, (byte)57, (byte)58, (byte)59, (byte)60, (byte)61, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)0, (byte)1, (byte)2, (byte)3, (byte)4, (byte)5, (byte)6, (byte)7, (byte)8, (byte)9, (byte)10, (byte)11, (byte)12, (byte)13, (byte)14, (byte)15, (byte)16, (byte)17, (byte)18, (byte)19, (byte)20, (byte)21, (byte)22, (byte)23, (byte)24, (byte)25, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)26, (byte)27, (byte)28, (byte)29, (byte)30, (byte)31, (byte)32, (byte)33, (byte)34, (byte)35, (byte)36, (byte)37, (byte)38, (byte)39, (byte)40, (byte)41, (byte)42, (byte)43, (byte)44, (byte)45, (byte)46, (byte)47, (byte)48, (byte)49, (byte)50, (byte)51, (byte)-1, (byte)-1, (byte)-1, (byte)-1, (byte)-1};

    public static String a(byte[] var0) {
        StringBuffer var1 = new StringBuffer();
        int var2 = var0.length;
        int var3 = 0;

        while(var3 < var2) {
            int var4 = var3 + 1;
            int var5 = 255 & var0[var3];
            if(var4 == var2) {
                var1.append(a[var5 >>> 2]);
                var1.append(a[(var5 & 3) << 4]);
                var1.append("==");
                break;
            }

            int var6 = var4 + 1;
            int var7 = 255 & var0[var4];
            if(var6 == var2) {
                var1.append(a[var5 >>> 2]);
                var1.append(a[(var5 & 3) << 4 | (var7 & 240) >>> 4]);
                var1.append(a[(var7 & 15) << 2]);
                var1.append("=");
                break;
            }

            var3 = var6 + 1;
            int var8 = 255 & var0[var6];
            var1.append(a[var5 >>> 2]);
            var1.append(a[(var5 & 3) << 4 | (var7 & 240) >>> 4]);
            var1.append(a[(var7 & 15) << 2 | (var8 & 192) >>> 6]);
            var1.append(a[var8 & 63]);
        }

        return var1.toString();
    }

    public static byte[] a(String var0) throws UnsupportedEncodingException {
        StringBuffer var1 = new StringBuffer();
        byte[] var2 = var0.getBytes("US-ASCII");
        int var3 = var2.length;
        int var4 = 0;

        while(var4 < var3) {
            label72:
            while(true) {
                byte[] var5 = b;
                int var6 = var4 + 1;
                byte var7 = var5[var2[var4]];
                if(var6 >= var3 || var7 != -1) {
                    if(var7 == -1) {
                        return var1.toString().getBytes("iso8859-1");
                    }

                    while(true) {
                        byte[] var8 = b;
                        int var9 = var6 + 1;
                        byte var10 = var8[var2[var6]];
                        if(var9 >= var3 || var10 != -1) {
                            if(var10 == -1) {
                                return var1.toString().getBytes("iso8859-1");
                            }

                            var1.append((char)(var7 << 2 | (var10 & 48) >>> 4));

                            while(true) {
                                int var12 = var9 + 1;
                                byte var13 = var2[var9];
                                if(var13 == 61) {
                                    return var1.toString().getBytes("iso8859-1");
                                }

                                byte var14 = b[var13];
                                if(var12 >= var3 || var14 != -1) {
                                    if(var14 == -1) {
                                        return var1.toString().getBytes("iso8859-1");
                                    }

                                    var1.append((char)((var10 & 15) << 4 | (var14 & 60) >>> 2));

                                    while(true) {
                                        var4 = var12 + 1;
                                        byte var16 = var2[var12];
                                        if(var16 == 61) {
                                            return var1.toString().getBytes("iso8859-1");
                                        }

                                        byte var17 = b[var16];
                                        if(var4 >= var3 || var17 != -1) {
                                            if(var17 == -1) {
                                                return var1.toString().getBytes("iso8859-1");
                                            }

                                            var1.append((char)(var17 | (var14 & 3) << 6));
                                            continue label72;
                                        }

                                        var12 = var4;
                                    }
                                }

                                var9 = var12;
                            }
                        }

                        var6 = var9;
                    }
                } else {
                    var4 = var6;
                }
            }
        }

        return var1.toString().getBytes("iso8859-1");
    }
}
