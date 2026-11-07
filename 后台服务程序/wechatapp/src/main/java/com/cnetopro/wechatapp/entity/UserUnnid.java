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
 * 用户唯一ID表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class UserUnnid implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    @TableId(value = "user_id", type = IdType.AUTO)
    private Integer userId;

    /**
     * openid
     */
    private String openId;


    /**
     * 登录session
     * */
    private String  sessionKey;

    /**
     * 当前使用设备ID
     * */
    private Integer onDevice;

    /**
     * 当前使用设备名称
     * */
    private String onDeviceName;


    /**
     * 用户昵称
     */
    private String userNickname;

    /**
     * 用户头像地址
     */
    private String userHeadUrl;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;


}
