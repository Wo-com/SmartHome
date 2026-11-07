package com.cnetopro.wechatapp.service;

public interface UserDevicePowerService {

    /**
     *
     * 1、用户设备
     *
     * 2、权限分配
     *
     * */



    //获取用户所有设备
    public String getAllDeviceInf(String session);


    //更改设备
    String changeDevice(String session,String devicID,String devicName);

    //设置该用户权限
    public String setPower(String power,int deviceID,int userID);



}
