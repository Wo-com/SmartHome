package com.cnetopro.wechatapp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.DeviceAndUser;
import com.cnetopro.wechatapp.entity.DeviceUnnid;
import com.cnetopro.wechatapp.entity.UserUnnid;
import com.cnetopro.wechatapp.mapper.DeviceAndUserMapper;
import com.cnetopro.wechatapp.mapper.DeviceUnnidMapper;
import com.cnetopro.wechatapp.mapper.UserUnnidMapper;
import com.cnetopro.wechatapp.service.ActivateDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * ESP32设备一ID表 服务实现类
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-01
 */
@Service
public class ActivateDeviceServiceImpl implements ActivateDeviceService {

    @Autowired
    DeviceUnnidMapper deviceUnnidMapper;//设备表

    @Autowired
    UserUnnidMapper userUnnidMapper;//当前用户

    @Autowired
    DeviceAndUserMapper deviceAndUserMapper; //设备与用户关系表

    @Override
    public String activate(String deviceMacId,String session) {

        /**
         * 激活步骤
         *
         * 1、查询设备表有没有该 设备MACID
         *      拿到设备ID
         *
         * 2、查询当前激活者的ID
         *      拿到用户ID
         *
         * 3、查询是不是重复激活
         *
         * 4、查询 设备用户关系表 是不是第一次激活
         *      是：设置最高权限
         *      否：设置最低权限
         *
         * 5、插入数据 设备与用户关系
         *
         * 6、更新用户当前使用设备
         *
         * */



        int deviceID;           //设备ID
        String deviceName;      //设备名称
        int userID;             //用户ID
//        int userKey;  //用户权限


        //1、查询设备表有没有该 设备MACID
        //myabtis_plis 条件构造器
        QueryWrapper<DeviceUnnid> queryWrapperDevice =new QueryWrapper<>();
        queryWrapperDevice.eq("device_macid",deviceMacId);
        DeviceUnnid deviceUnnid=deviceUnnidMapper.selectOne(queryWrapperDevice);

        //如果查询不到就 返回激活码错误
        if(deviceUnnid==null){
            System.out.println("查询不到设备");
            return "error";
        }else{
            deviceID=deviceUnnid.getDeviceId();
            deviceName=deviceUnnid.getDeviceName();
        }

        //2、查询当前激活者的ID
        //myabtis_plis 条件构造器
        QueryWrapper<UserUnnid> qwUserUnnid =new QueryWrapper<>();
        qwUserUnnid.eq("session_key",session);
        System.out.println("session_key"+session);
        UserUnnid userUnnid= userUnnidMapper.selectOne(qwUserUnnid);

        //如果查询不到就 返回重新登录
        if(userUnnid==null){
            System.out.println("查询不到用户session");
            return "error";
        }else{
            System.out.println("deviceUnnid"+deviceUnnid);
            System.out.println("sessionkeyId"+userUnnid);
            userID=userUnnid.getUserId();
        }

        //3、是不是重复插入
        //myabtis_plis 条件构造器
        QueryWrapper<DeviceAndUser> queryWrappeRepeat =new QueryWrapper<>();
        queryWrappeRepeat.eq("device_id",deviceID);
        queryWrappeRepeat.eq("user_id",userID);

        int relation=deviceAndUserMapper.selectCount(queryWrappeRepeat);
        if(relation>0){
            System.out.println("重复插入");
            return "repeat";
        }



        //4查询是不是第一个激活者
        QueryWrapper<DeviceAndUser> queryWrappeRootUser =new QueryWrapper<>();
        queryWrappeRootUser.eq("device_id",deviceID);

        int rootUser=deviceAndUserMapper.selectCount(queryWrappeRootUser);

        DeviceAndUser deviceAndUser=new DeviceAndUser();
        deviceAndUser.setDeviceId(deviceID);
        deviceAndUser.setUserId(userID);

        //如果这个用户是第一个激活者
        if(rootUser==0){
            deviceAndUser.setUserKey("r111111111");//权限key标示符  1023=1111111111
        }else{
            deviceAndUser.setUserKey("p000000000");//权限key标示符
        }

        //5插入数据
        deviceAndUserMapper.insert(deviceAndUser);

        //6更新用户当前设备数据
//        UserUnnid sessionkeyIdobj=new SessionkeyId();


        userUnnid.setOnDevice(deviceUnnid.getDeviceId());
        userUnnid.setOnDeviceName(deviceUnnid.getDeviceName());


        userUnnidMapper.updateById(userUnnid);



        //map转json对象
        Map<String,Object> map = new HashMap<>();
        map.put("device",deviceAndUser.getDeviceAndUserId().toString());
        map.put("deviceName",deviceName);
        map.put("devicActivated",true);

        System.out.println("激活设备返回");
        return JSON.toJSONString(map);

    }
}
