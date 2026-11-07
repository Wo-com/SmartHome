package com.cnetopro.wechatapp.algorithm;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestStringToInt {

    @Test
    void sti(){
        String s="1110";
        int in = Integer.parseInt(s, 2);
        int num=7;
        System.out.println(Integer.toBinaryString(num));
        System.out.println(in);
        System.out.println(s.charAt(1));
        System.out.println(s.charAt(2));
        System.out.println(s.charAt(3));
    }

}
