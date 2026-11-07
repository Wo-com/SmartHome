package com.cnetopro.wechatapp.model;

import com.cnetopro.wechatapp.entity.DeviceUnnid;
import com.cnetopro.wechatapp.entity.UserUnnid;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 用于将 用户的所有设备，设备的使用者数据转为JSON 对象
 * */

@Data
@Component
public class DeviceUser {


    //用户的所有设备
    List<DeviceUnnid> allDevice;

    //设备的所有使用者
    List<UserUnnid> allUser;
}
