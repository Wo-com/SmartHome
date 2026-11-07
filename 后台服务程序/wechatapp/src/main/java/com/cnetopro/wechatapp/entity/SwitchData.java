package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 用户开关控制器数据表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SwitchData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 开关控制器id
     */
    @TableId(value = "switch_id", type = IdType.AUTO)
    private Integer switchId;

    /**
     * 开关控制器所属设备
     */
    private Integer switchDevice;

    /**
     * 开关控制器名称
     */
    private String switchName;

    /**
     * 开关控制器状态/值
     */
    private Integer switchState;


}
