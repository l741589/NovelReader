package com.bigzhao.novelreader.qddecoder;

public final class B
{
    private static final char[] a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".toCharArray();

    public static String a(byte[] paramArrayOfByte)
    {
        int i = paramArrayOfByte.length;
        StringBuffer localStringBuffer = new StringBuffer(3 * paramArrayOfByte.length / 2);
        int j = i - 3;
        int k = 0;
        int m = 0;
        for (;;)
        {
            if (m > j)
            {
                if (m != -2 + (i + 0)) {
                    break;
                }
                int i4 = (0xFF & paramArrayOfByte[m]) << 16 | (0xFF & paramArrayOfByte[(m + 1)]) << 8;
                localStringBuffer.append(a[(0x3F & i4 >> 18)]);
                localStringBuffer.append(a[(0x3F & i4 >> 12)]);
                localStringBuffer.append(a[(0x3F & i4 >> 6)]);
                localStringBuffer.append("=");
            }
            int i1;
            int i2;
            for (;;)
            {
                int n = (0xFF & paramArrayOfByte[m]) << 16 | (0xFF & paramArrayOfByte[(m + 1)]) << 8 | 0xFF & paramArrayOfByte[(m + 2)];
                localStringBuffer.append(a[(0x3F & n >> 18)]);
                localStringBuffer.append(a[(0x3F & n >> 12)]);
                localStringBuffer.append(a[(0x3F & n >> 6)]);
                localStringBuffer.append(a[(n & 0x3F)]);
                i1 = m + 3;
                i2 = k + 1;
                if (k < 14) {
                    break;
                }
                localStringBuffer.append(" ");
                m = i1;
                k = 0;
                //break;
                if (m == -1 + (i + 0))
                {
                    int i3 = (0xFF & paramArrayOfByte[m]) << 16;
                    localStringBuffer.append(a[(0x3F & i3 >> 18)]);
                    localStringBuffer.append(a[(0x3F & i3 >> 12)]);
                    localStringBuffer.append("==");
                }
            }

            k = i2;
            m = i1;
        }
        return localStringBuffer.toString();
    }

}

