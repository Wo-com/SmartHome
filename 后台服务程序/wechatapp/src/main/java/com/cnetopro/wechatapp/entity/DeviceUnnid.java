package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * ESP32设备一ID表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class DeviceUnnid implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设备id
     */
    @TableId(value = "device_id", type = IdType.AUTO)
    private Integer deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 设备MacID
     */
    private String deviceMacid;

    /**
     * 订阅的发布的
     * */
    private String deviceSendTopic;

    /**
     * 订阅的主题
     * */
    private String deviceReceiveTopic;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;


}
