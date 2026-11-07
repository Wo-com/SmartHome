package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 用户传感器数据表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SensorData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 传感器id
     */
    @TableId(value = "sensor_id", type = IdType.AUTO)
    private Integer sensorId;

    /**
     * 传感器所属设备
     */
    private Integer sensorDevice;

    /**
     * 传感器名称
     */
    private String sensorName;


    /**
     * 传感器的值
     */
    private Integer sensorValue;


}
