package com.cnetopro.wechatapp.util;

//import org.apache.commons.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Component;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by allensun on 10/5/17.
 * on Tubitv.com, allengotstuff@gmail.com
 */

@Component
public class AESutil {

    public static final String key = "thisismsjejhejy11231";
    public static final String initVector  = "thsheismyinsjkjeect";


    // 加密
    public  String encrypt( String value) {
        try {

            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(value.getBytes());

            return Base64.encodeBase64String(encrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    // 解密
    public String decrypt( String encrypted) {
        try {

            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));



            return new String(original ,"UTF-8");

//            return new String(original);


        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }
/*
    public String toHex(String arg) {
        return new BigInteger(arg.getBytes()).toString(16);
    }

    public String hexToString(String txtInHex)
    {
        byte [] txtInByte = new byte [txtInHex.length() / 2];
        int j = 0;
        for (int i = 0; i < txtInHex.length(); i += 2)
        {
            txtInByte[j++] = Byte.parseByte(txtInHex.substring(i, i + 2), 16);
        }

        return new String(txtInByte);
    }


    public static void main(String[] args) {

        String str="Xueyan zheng, student id: 9918382234";
        String key = "thisismykey11111"; // 128 bit key
        String initVector = "thisismyinitvect"; // 16 bytes IV

        Encryptor encryptor=new Encryptor();

//        String key_hex = encryptor.toHex(key);
//        String initVector_hex = encryptor.toHex(initVector);
//
//        System.out.println("key: " + key_hex);
//        System.out.println("iniVector: " + initVector_hex);

        String enc= encryptor.encrypt(str);

        System.out.println("加密"+enc);

        String dec= encryptor.decrypt(enc);
        System.out.println("加密"+dec);

    }
 */


}