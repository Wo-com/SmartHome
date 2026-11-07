package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 温度湿度检测传感器数据表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class HtData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 温度湿度传感器id
     */
    @TableId(value = "ht_id", type = IdType.AUTO)
    private Integer htId;

    /**
     * 温度湿度传感器所属设备
     */
    private Integer htDevice;

    /**
     * 温度湿度传感器名称
     */
    private String htName;

    /**
     * 温度湿度传感器的值
     */
    private Integer temperatureValue;

    /**
     * 温度湿度传感器的值
     */
    private Integer humidityValue;


}
