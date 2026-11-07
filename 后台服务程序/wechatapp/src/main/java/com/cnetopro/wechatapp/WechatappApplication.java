package com.cnetopro.wechatapp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling                           //定时任务
@SpringBootApplication
@MapperScan("com.cnetopro.wechatapp.mapper")//mybatis
public class WechatappApplication {

    public static void main(String[] args) {
        SpringApplication.run(WechatappApplication.class, args);
    }

}
