package com.cnetopro.wechatapp.model;


import com.cnetopro.wechatapp.entity.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.List;

/**
 * 用于将 设备数据转为JSON 对象
 * */

@Data
@Component
public class Device implements Serializable {

    int thisUserID;            //当前用户ID
    int onDeviceid;            //当前设备ID
    String deviceUser;         //当前设备是不是root用户
    String onDeviceName;       //当前设备名称

    DeviceUnnid deviceUnnid;   //当前设备

    List<HtData> htData;
    List<IrData> irData;
    List<SwitchData> switchData;
    List<SliderData> sliderData;
    List<SensorData> sensorData;
    List<TaskManage> taskData;

}
