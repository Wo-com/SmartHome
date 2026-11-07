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
public class DeviceAndUser implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设备与用户关系id
     */
    @TableId(value = "device_and_user_id", type = IdType.AUTO)
    private Long deviceAndUserId;

    /**
     * 设备id
     */
    private Integer deviceId;

    /**
     * 用户id
     */
    private Integer userId;

    /**
     * 用户对设备的控制权限
     */
    private String userKey;

    /**
     * 设备激活时间
     */
    private LocalDateTime activationTime;


}
