package com.cnetopro.wechatapp.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


/**
 *
 * 通过yml文件来配置常量  方便后续修改
 *
 * */

@Data

@Component
@ConfigurationProperties(prefix = "wechatdata")
public class WeChatData {
    private String appid;
    private String secret;

}
