package com.cnetopro.wechatapp.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.*;
import com.cnetopro.wechatapp.util.AESutil;
import com.cnetopro.wechatapp.mapper.*;
import com.cnetopro.wechatapp.model.Device;
import com.cnetopro.wechatapp.service.ActivateDeviceService;
import com.cnetopro.wechatapp.service.UserDeviceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDeviceDataServiceImpl implements UserDeviceDataService {

    @Autowired
    AESutil AES;

    @Autowired
    UserUnnidMapper userUnnidMapper;//用户登录信息表

    @Autowired
    DeviceAndUserMapper deviceAndUserMapper;//设备用户表关系 接口

    @Autowired
    DeviceUnnidMapper deviceUnnidMapper; //设备数据接口

    @Autowired
    SwitchDataMapper switchDataMapper;//开关表接口

    @Autowired
    SliderDataMapper sliderDataMapper;//滑块接口

    @Autowired
    SensorDataMapper sensorDataMapper;//传感器接口

    @Autowired
    TaskManageMapper taskManageMapper;//任务接口

    @Autowired
    HtDataMapper htDataMapper;//温度湿度

    @Autowired
    IrDataMapper irDataMapper;//遥控数据





    /**
     * 1.通过session得到用户当前deviceID
     *
     * 2.拿到deviceID获取设备权限
     *
     * 3.通过权限计算视图
     *
     * 4.返回视图
     *
     * */

    @Override
    public String getDevice(String session) {

        int userID;         //用户ID
        int deviceID;       //设备ID
        String deviceName;  //设备名称
        String powerKEY;    //权限

        //1.获取deviceID
        QueryWrapper<UserUnnid> qwUser=new QueryWrapper<>();
        qwUser.eq("session_key",session);
        UserUnnid userUnnid=userUnnidMapper.selectOne(qwUser);
        System.out.println(userUnnid);

        if(userUnnid==null){
            System.out.println("查询不到session");
            return null;
        }
        userID=userUnnid.getUserId();
        if(userUnnid.getOnDevice()==null){
           return null;
        }
        deviceID=userUnnid.getOnDevice();
        deviceName=userUnnid.getOnDeviceName();


        //2 .获取设备ID 用户ID 用户对设备的权限
        QueryWrapper<DeviceAndUser> queryWrapperDeviceAndUser =new QueryWrapper<>();
        queryWrapperDeviceAndUser.eq("device_id",deviceID);
        queryWrapperDeviceAndUser.eq("user_id",userID);
        DeviceAndUser deviceAndUser = deviceAndUserMapper.selectOne(queryWrapperDeviceAndUser);
        if(deviceAndUser==null){
            System.out.println("数据为空 没有设备");
            return null;
        }
        System.out.println("设备关系");
        System.out.println(deviceAndUser);
        powerKEY=deviceAndUser.getUserKey(); //获取用户对当前访问者的权限

        //3。通过权限 组织视图
        // 进行device激活码加密
        DeviceUnnid deviceUnnid=getDeviceInf(deviceID);
        String MacID=deviceUnnid.getDeviceMacid();
        System.out.println("加密"+MacID+":"+AES.encrypt(MacID));
        deviceUnnid.setDeviceMacid(AES.encrypt(MacID));


        //非权限数据
        Device device=new Device();//设备对象
        device.setDeviceUnnid(deviceUnnid);  //获取主题
        device.setThisUserID(userID);                   //当前用户ID
        device.setOnDeviceid(deviceID);                 //当前设备ID
        device.setOnDeviceName(deviceName);             //当前设备名称

        if(powerKEY.charAt(0)=='r'){   //权限的第一位为用户属性r代表root，p代表person
            device.setDeviceUser("root");
        }else{
            device.setDeviceUser("pers");
        }


        /**
         * 权限数据
         * 依次判断对象权限 0代表没权限 1代码有权限
         * */
        if(powerKEY.charAt(1)=='1'){
            device.setSensorData( getSensor(deviceID));     //1传感器数据
        }
        if(powerKEY.charAt(2)=='1'){
            device.setHtData(getHT(deviceID));              //2温度湿度
        }
        if(powerKEY.charAt(3)=='1'){
            device.setSwitchData( getSwitch(deviceID));     //3开关数据
        }
        if(powerKEY.charAt(4)=='1'){
            device.setSliderData( getSlader(deviceID));     //4滑块数据
        }
        if(powerKEY.charAt(5)=='1'){
            device.setIrData( getIr(deviceID));             //5遥控数据
        }
        if(powerKEY.charAt(6)=='1'){
            device.setTaskData( getTask(deviceID));         //6任务数据
        }


        //设备对象转JSON ,SerializerFeature.WriteMapNullValue:null也显示
        String jsonObjData = JSON.toJSONString(device, SerializerFeature.WriteMapNullValue); // List转json

        //4.返回视图
        return jsonObjData;
    }



    /**
     * 开关数据
     * */
    public List getSwitch(int deviceID){
        QueryWrapper<SwitchData> queryWrapperDevices =new QueryWrapper<>();
        queryWrapperDevices.eq("switch_device",deviceID);
        List<SwitchData> switchData= switchDataMapper.selectList(queryWrapperDevices);

        return switchData;
    }


    /**
     * 滑块数据
     * */
    public List<SliderData> getSlader(int deviceID){
        QueryWrapper<SliderData> queryWrapperDevicesSlider =new QueryWrapper<>();
        queryWrapperDevicesSlider.eq("slider_device",deviceID);
        List<SliderData> sliderData= sliderDataMapper.selectList(queryWrapperDevicesSlider);

        return sliderData;
    }

    /**
     * 滑块数据
     * */
    public List<SensorData> getSensor(int deviceID){
        QueryWrapper<SensorData> queryWrapperDevicesSensor =new QueryWrapper<>();
        queryWrapperDevicesSensor.eq("sensor_device",deviceID);
        List<SensorData> sensorData= sensorDataMapper.selectList(queryWrapperDevicesSensor);

        return sensorData;
    }


    /**
     * 温度湿度
     * */
    public List<HtData> getHT(int deviceID){
        QueryWrapper<HtData> queryWrapperDeviceHT=new QueryWrapper<>();
        queryWrapperDeviceHT.eq("ht_device",deviceID);
        List<HtData> htData=htDataMapper.selectList(queryWrapperDeviceHT);

        return htData;
    }

    /**
     * 红外遥控数据
     *
     * */
    public List<IrData> getIr(int deviceID){
        QueryWrapper<IrData> irDataQueryWrapper=new QueryWrapper<>();
        irDataQueryWrapper.eq("ir_device",deviceID);
        List<IrData> irData=irDataMapper.selectList(irDataQueryWrapper);

        return irData;
    }

    /**
     * 任务数据
     * */
    public List<TaskManage> getTask(int deviceID){
        QueryWrapper<TaskManage> taskManageQueryWrapper=new QueryWrapper<>();
        taskManageQueryWrapper.eq("device_id",deviceID);
        List<TaskManage> taskManages= taskManageMapper.selectList(taskManageQueryWrapper);

        return taskManages;
    }

    /**
     * 设备的主题数据
     * */
    public DeviceUnnid getDeviceInf(int deviceID){
        QueryWrapper<DeviceUnnid> queryTopic=new QueryWrapper<>();
        queryTopic.eq("device_id",deviceID);

        DeviceUnnid deviceUnnids=deviceUnnidMapper.selectOne(queryTopic);
        return  deviceUnnids;
    }



}
