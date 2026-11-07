package com.cnetopro.wechatapp.service;

/**
 * <p>
 * ESP32设备一ID表 服务类 激活设备
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-01
 */
public interface ActivateDeviceService {


     /**
      * 用于激活ESP32设备，只有激活设备用户才能用于后台数据信息
      * */

     String activate(String deviceId,String usersession);
}
