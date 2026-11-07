package com.cnetopro.wechatapp.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties("mqtt")
public class MqttProperties {

    private String username;

    private String password;

    private String url;

    private Producer producer = new Producer();

    private Consumer consumer = new Consumer();

    @Data
    public class Producer {
        private String clientId;

        private String defaultTopic;
    }

    @Data
    public class Consumer {
        private String clientId;

        private String defaultTopic;
    }

}
