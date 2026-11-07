package com.cnetopro.wechatapp.algorithm;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;


//@SpringBootTest
public class TestUuID {

    public static String[] chars = new String[] {
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V","W", "X", "Y", "Z"
    };


//    @Test
    public  void getShortUuid() {
        for (int i = 0; i < 1000; i++) {
            StringBuffer stringBuffer = new StringBuffer();
            String uuid = UUID.randomUUID().toString().replace("-", "");
            for (int j = 0; j < 8; j++) { // 32 -> 8
                String str = uuid.substring(j * 4, j * 4 + 4);
                // 16进制为基解析
                int strInteger = Integer.parseInt(str, 16);
                // 0x3E -> 字典总数 62
                stringBuffer.append(chars[strInteger % 0x3E]);
            }
            System.out.println(stringBuffer);
        }

    }


}
