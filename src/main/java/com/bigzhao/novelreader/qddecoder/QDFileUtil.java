package com.bigzhao.novelreader.qddecoder;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.zip.GZIPOutputStream;

/* compiled from: QDFileUtil */
/* renamed from: com.qidian.QDReader.core.d.b */
public final class QDFileUtil {

    public static String readAllString(File file, String str) {
        try {
            byte[] c = QDFileUtil.readAllBytes(file);
            if (c != null) {
                return new String(c, str);
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

    public static byte[] readAllBytes(File file) throws Throwable {
        InputStream fileInputStream=null;
        IOException e;
        Throwable th;
        byte[] bArr = null;
        if (file != null && file.exists()) {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            try {
                fileInputStream = new FileInputStream(file);
                try {
                    byte[] bArr2 = new byte[8192];
                    while (true) {
                        int read = fileInputStream.read(bArr2);
                        if (read <= 0) {
                            break;
                        }
                        byteArrayOutputStream.write(bArr2, 0, read);
                    }
                    byteArrayOutputStream.flush();
                    bArr = byteArrayOutputStream.toByteArray();
                    try {
                        fileInputStream.close();
                        byteArrayOutputStream.close();
                    } catch (Exception e2) {
                        e2.printStackTrace();
                    }
                } catch (IOException e3) {
                    e = e3;
                    try {
                        e.printStackTrace();
                        if (fileInputStream != null) {
                            try {
                                fileInputStream.close();
                            } catch (Exception e22) {
                                e22.printStackTrace();
                            }
                        }
                        byteArrayOutputStream.close();
                        return bArr;
                    } catch (Throwable th2) {
                        th = th2;
                        if (fileInputStream != null) {
                            try {
                                fileInputStream.close();
                            } catch (Exception e222) {
                                e222.printStackTrace();
                                throw th;
                            }
                        }
                        byteArrayOutputStream.close();
                        throw th;
                    }
                }
            } catch (IOException e4) {
                e = e4;
                e.printStackTrace();
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
                byteArrayOutputStream.close();
                return bArr;
            } catch (Throwable th3) {
                th = th3;
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
                byteArrayOutputStream.close();
                throw th;
            }
        }
        return bArr;
    }

    public static boolean writeAllString(File file, String str, String str2) {
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(str.getBytes(str2));
            fileOutputStream.close();
            return true;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e2) {
            e2.printStackTrace();
            return false;
        }
    }

    public static boolean writeAllBytes(File file, byte[] bArr) {
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(bArr);
            fileOutputStream.close();
            return true;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e2) {
            e2.printStackTrace();
            return false;
        }
    }

    public static void copy(File file, File file2, boolean z) {
        if (file.exists()) {
            if (!file2.exists()) {
                QDFileUtil.createFileOrDir(file2, true);
            } else if (z) {
                file2.delete();
            } else {
                System.out.println("\ufffd\u013c\ufffd" + file2.getAbsolutePath() + "\ufffd\u047e\ufffd\ufffd\ufffd\ufffd\u06a3\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u013c\ufffd\ufffd\ufffd");
                return;
            }
            try {
                InputStream fileInputStream = new FileInputStream(file);
                FileOutputStream fileOutputStream = new FileOutputStream(file2);
                byte[] bArr = new byte[1024];
                while (fileInputStream.read(bArr) >= 0) {
                    fileOutputStream.write(bArr);
                }
                fileInputStream.close();
                fileOutputStream.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e2) {
                e2.printStackTrace();
            }
        }
    }

    public static void copyDir$(String str, String str2) {
        try {
            new File(str2).mkdirs();
            String[] list = new File(str).list();
            if (list != null) {
                for (int i = 0; i < list.length; i++) {
                    File file;
                    if (str.endsWith(File.separator)) {
                        file = new File(str + list[i]);
                    } else {
                        file = new File(str + File.separator + list[i]);
                    }
                    if (file.isFile()) {
                        FileInputStream fileInputStream = new FileInputStream(file);
                        FileOutputStream fileOutputStream = new FileOutputStream(str2 + "/" + file.getName().toString());
                        byte[] bArr = new byte[1444];
                        while (true) {
                            int read = fileInputStream.read(bArr);
                            if (read == -1) {
                                break;
                            }
                            fileOutputStream.write(bArr, 0, read);
                        }
                        fileOutputStream.flush();
                        fileOutputStream.close();
                        fileInputStream.close();
                    }
                    if (file.isDirectory()) {
                        QDFileUtil.copyDir$(str + "/" + list[i], str2 + "/" + list[i]);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u013c\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u0772\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd");
            e.printStackTrace();
        }
    }

    public static void createFileOrDir(File file, boolean z) {
        while (!file.exists()) {
            if (!file.getParentFile().exists()) {
                file = file.getParentFile();
                z = false;
            } else if (z) {
                try {
                    file.createNewFile();
                    return;
                } catch (IOException e) {
                    e.printStackTrace();
                    return;
                }
            } else {
                file.mkdirs();
                return;
            }
        }
    }

    public static File empty$(String str) {
        File file = new File(str);
        if (file.exists()) {
            file.delete();
        }
        if (!file.exists()) {
            if (file.getParentFile().exists()) {
                try {
                    file.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                QDFileUtil.createFileOrDir(file.getParentFile(), false);
            }
        }
        return file;
    }


    public static void rm(File file) {
        if (file.exists()) {
            try {
                Runtime.getRuntime().exec("rm -r " + file.getAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void mkdirs(String str) {
        File file = new File(str);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    public static File list(File file, final String str) {
        if (!file.exists() || !file.isDirectory()) {
            return null;
        }
        File[] listFiles = file.listFiles(new FileFilter() {

            public boolean accept(File pathname) {
                return str != null && pathname.getAbsolutePath().toLowerCase().endsWith(str);
            }
        });
        if (listFiles == null || listFiles.length == 0) {
            return null;
        }
        return listFiles[0];
    }

    public static int litterEndian(InputStream inputStream) throws IOException {
        byte[] bArr = new byte[4];
        inputStream.read(bArr);
        ByteBuffer wrap = ByteBuffer.wrap(bArr);
        wrap.order(ByteOrder.LITTLE_ENDIAN);
        return wrap.getInt();
    }

    public static void createNoMedia(String str) {
        File file = new File(str + ".nomedia");
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static long canRead(File file) {
        try {
            if (file.exists()) {
                return (long) new FileInputStream(file).available();
            }
            return 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public static void gzip(File file, File file2) {
        try {
            if (file.exists()) {
                if (!file2.exists()) {
                    file2.createNewFile();
                }
                GZIPOutputStream gZIPOutputStream = new GZIPOutputStream(new FileOutputStream(file2));
                FileInputStream fileInputStream = new FileInputStream(file);
                byte[] bArr = new byte[1024];
                while (true) {
                    int read = fileInputStream.read(bArr);
                    if (read > 0) {
                        gZIPOutputStream.write(bArr, 0, read);
                    } else {
                        fileInputStream.close();
                        gZIPOutputStream.finish();
                        gZIPOutputStream.close();
                        return;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
