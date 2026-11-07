package com.cnetopro.wechatapp.controller;

import com.cnetopro.wechatapp.service.UserDeviceDataService;
import com.cnetopro.wechatapp.service.UserDevicePowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserDeviceDataController {

    @Autowired
    UserDeviceDataService userDeviceDataService;

    @Autowired
    UserDevicePowerService userDevicePowerService;


    @PostMapping("/device")
    public String getDeviceData(String session){
        System.out.println("接收数据："+session);
        String strData= userDeviceDataService.getDevice(session);
        System.out.println("返回数据："+strData);
        return strData;
    }



    @PostMapping("/power")
    public String setDevicePower(String session){
        System.out.println("接收数据："+session);
        String strData= userDevicePowerService.getAllDeviceInf(session);
        System.out.println("返回数据："+strData);
        return strData;
    }

    @PostMapping("/changeDevice")
    public String changeDevice(String session,String deviceID,String deviceName){
        System.out.println("接收数据session："+session);
        System.out.println("接收数据deviceID："+ deviceID);
        System.out.println("接收数据deviceName："+deviceName);
        String strData= userDevicePowerService.changeDevice(session,deviceID,deviceName);
        System.out.println("返回数据："+strData);
        return strData;
    }

    @PostMapping("/setPower")
//    session: app.globalData.globlesession,
//    power: userPower,
//    deviceID: app.globalData.deviceID,
//    userID: app.globalData.userID
    public String setPower(String session,String power,int deviceID,int userID){
        System.out.println("接收数据session："+session);
        System.out.println("接收数据power："+power);
        System.out.println("接收数据deviceID："+ deviceID);
        System.out.println("接收数据userID："+userID);
        String strData= userDevicePowerService.setPower(power,deviceID,userID);
        System.out.println("返回数据："+strData);
        return strData;
    }

}
