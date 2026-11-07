package com.cnetopro.wechatapp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 拖动控制器数据表
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SliderData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 控制器id
     */
    @TableId(value = "slider_id", type = IdType.AUTO)
    private Integer sliderId;

    /**
     * 控制器所属设备
     */
    private Integer sliderDevice;

    /**
     * 控制器名称
     */
    private String sliderName;


    /**
     * 控制器的值
     */
    private Integer sliderValue;


}
