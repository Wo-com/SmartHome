package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 遥控器数据表数据表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-04-04
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class IrData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 红外按键id
     */
    @TableId(value = "ir_id", type = IdType.AUTO)
    private Integer irId;

    /**
     * 红外按键所属设备
     */
    private Integer irDevice;

    /**
     * 红外按键名称
     */
    private String irName;


    /**
     * 红外按键编码
     */
    private String irCode;


}
