package com.cnetopro.wechatapp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.DeviceAndUser;
import com.cnetopro.wechatapp.entity.DeviceUnnid;
import com.cnetopro.wechatapp.entity.UserUnnid;
import com.cnetopro.wechatapp.mapper.DeviceAndUserMapper;
import com.cnetopro.wechatapp.mapper.DeviceUnnidMapper;
import com.cnetopro.wechatapp.mapper.UserUnnidMapper;
import com.cnetopro.wechatapp.model.DeviceUser;
import com.cnetopro.wechatapp.service.UserDevicePowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserDevicePowerServiceImpl implements UserDevicePowerService {


    @Autowired
    DeviceAndUserMapper deviceAndUserMapper;    //用户登录信息表

    @Autowired
    DeviceUnnidMapper deviceUnnidMapper;        //设备信息表

    @Autowired
    UserUnnidMapper userUnnidMapper;            //用户信息表

    @Autowired
    DeviceUser deviceUser;

    /**
     * getDevice方法获取获取该用户的所有设备及 设备的所有用户
     *
     * 1.通过session得到用户当前用户ID  当前用户使用的设备ID
     *
     * 2.通过用户ID 查询该用户所有设备ID
     * 3。通过设备ID查询设备名称
     *
     * 4.通过设备ID查询该设备的所有用户ID
     * 5.通过用户ID查询 用户头像 和昵称
     *
     * 7.通过权限计算视图
     *
     * 8.返回视图
     *
     * */


    @Override
    public String getAllDeviceInf( String session) {

        int userID;        //用户ID
        int deviceID;      //设备ID



        //1.获取deviceID
        QueryWrapper<UserUnnid> qwUserUnnid=new QueryWrapper<>();
        qwUserUnnid.eq("session_key",session);
        UserUnnid userUnnid=userUnnidMapper.selectOne(qwUserUnnid);
        if(userUnnid==null){
            System.out.println("管理设备用户session出错");
            return null;
        }
        deviceID=userUnnid.getOnDevice();   //获取当前使用的设备ID
        userID=userUnnid.getUserId();       //获取用户ID


        //2.通过用户ID 查询该用户所有设备ID
        QueryWrapper<DeviceAndUser> qwAllDevice=new QueryWrapper<>();
        qwAllDevice.eq("user_id",userID);
        List<DeviceAndUser> deviceAndUsers=deviceAndUserMapper.selectList(qwAllDevice);
        if(deviceAndUsers==null){
            return null;
        }

        // 3。通过设备ID查询设备名称
        ArrayList deviceList = new ArrayList();        //设备ID数组队列
        for( int i = 0 ; i < deviceAndUsers.size() ; i++) {//内部不锁定，效率最高，但在多线程要考虑并发操作的问题。
            deviceList.add(deviceAndUsers.get(i).getDeviceId());
        }
        QueryWrapper<DeviceUnnid> qwDeviceInf=new QueryWrapper<>();
        qwDeviceInf.select("device_id","device_name");
        qwDeviceInf.in("device_id", deviceList);
        List<DeviceUnnid> deviceUnnids=deviceUnnidMapper.selectList (qwDeviceInf);

        deviceUser.setAllDevice(deviceUnnids);//把数据封装到对象中

        //4.通过设备ID查询该设备的所有用户ID
        QueryWrapper<DeviceAndUser> qwAllUserID =new QueryWrapper<>();
        qwAllUserID.eq("device_id",deviceID);
        List<DeviceAndUser> deviceAndUsers1=deviceAndUserMapper.selectList(qwAllUserID);
        if(deviceAndUsers1==null){
            return null;
        }

        //5.通过用户ID查询用户信息
        ArrayList userList = new ArrayList();        //设备ID数组队列
        for( int i = 0 ; i < deviceAndUsers1.size() ; i++) {//内部不锁定，效率最高，但在多线程要考虑并发操作的问题。
            userList.add(deviceAndUsers1.get(i).getUserId());
        }
        QueryWrapper<UserUnnid> qwUserInf=new QueryWrapper<>();
        qwUserInf.select("user_id","user_nickname","user_head_url");
        qwUserInf.in("user_id",userList);
        List<UserUnnid> userUnnids= userUnnidMapper.selectList(qwUserInf);

        deviceUser.setAllUser(userUnnids);//把数据封装到对象中
        String jsonDeviceUsers = JSON.toJSONString(deviceUser); // List转json

        return jsonDeviceUsers;
    }

    /**
     *方法：更换设备
     *
     * */
    @Override
    public String changeDevice(String session,String deviceID ,String deviceName){
        QueryWrapper<UserUnnid> qwUserUnnid =new QueryWrapper<>();
        qwUserUnnid.eq("session_key",session);
        UserUnnid userUnnid=new UserUnnid();
        userUnnid.setOnDevice(Integer.parseInt( deviceID ));//类型转换
        int res=userUnnidMapper.update(userUnnid,qwUserUnnid);
        if(res==1){
            return "OK";
        }else{
            return "error";
        }
    }

    /**
     * 方法设置权权限
     * */


    @Override
    public String setPower(String power,int deviceID ,int userID) {
        QueryWrapper<DeviceAndUser> qwpower =new QueryWrapper<>();
        qwpower.eq("device_id",deviceID);
        qwpower.eq("user_id",userID);
        DeviceAndUser deviceAndUser=new DeviceAndUser();
        deviceAndUser.setUserKey(power);
        int res=deviceAndUserMapper.update(deviceAndUser,qwpower);
        return "OK"+res;
    }
}
