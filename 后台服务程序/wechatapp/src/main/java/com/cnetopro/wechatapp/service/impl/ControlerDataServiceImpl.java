package com.cnetopro.wechatapp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.*;
import com.cnetopro.wechatapp.mapper.*;
import com.cnetopro.wechatapp.service.ControlerDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Service
public class ControlerDataServiceImpl implements ControlerDataService {

    /**
     * 1.先判断控制器类型
     *
     * 2.更新 状态/值
     *
     * */

    @Autowired
    SwitchDataMapper switchDataMapper;

    @Autowired
    SliderDataMapper sliderDataMapper;

    @Autowired
    SensorDataMapper sensorDataMapper;

    @Autowired
    HtDataMapper htDataMapper;

    @Autowired
    IrDataMapper irDataMapper;

    @Autowired
    TaskManageMapper taskManageMapper;



    @Override
    public String saveControler(String controlType, Integer controlId,Integer controlValue) {
        int res=0;
        try {
            if(controlType=="switch"||controlType.equals("switch")){
                SwitchData switchData = new SwitchData();
                switchData.setSwitchId(controlId);
                switchData.setSwitchState(controlValue);

                res=switchDataMapper.updateById(switchData);
                System.out.println("更新switch成功");
            }
            if(controlType=="slider"||controlType.equals("slider")){
                SliderData sliderData = new SliderData();
                sliderData.setSliderId(controlId);
                sliderData.setSliderValue(controlValue);

                res=sliderDataMapper.updateById(sliderData);
                System.out.println("更新slider成功");
            }
        }catch (Exception e){
            System.out.println("数据库错误");
            return null;
        }
        if( res==1){
            return "ok";
        }else{
            return "error";
        }

    }




    /**
     * 接收数据
     * 判断类型  改变值
     *
     * */

    @Override
    public String saveName(String type, String newName, int id){

        int res=0;

        if(type=="switch"||type.equals("switch")){
            SwitchData switchData=new SwitchData();
            switchData.setSwitchId(id);
            switchData.setSwitchName(newName);
            res=switchDataMapper.updateById(switchData);
        }

        if(type=="slider"||type.equals("slider")){
            SliderData sliderData=new SliderData();
            sliderData.setSliderId(id);
            sliderData.setSliderName(newName);
            res=sliderDataMapper.updateById(sliderData);
        }

        if(type=="sensor"||type.equals("sensor")){
            SensorData sensorData=new SensorData();
            sensorData.setSensorId(id);
            sensorData.setSensorName(newName);
            res=sensorDataMapper.updateById(sensorData);
        }

        if(type=="ht"||type.equals("ht")){
            HtData htData =new HtData();
            htData.setHtId(id);
            htData.setHtName(newName);
            res=htDataMapper.updateById(htData);
        }

        if(type=="ir"||type.equals("ir")){
            IrData irData =new IrData();
            irData.setIrId(id);
            irData.setIrName(newName);
            res=irDataMapper.updateById(irData);
        }

        if(type=="ir"||type.equals("irCode")){
            IrData irData =new IrData();
            irData.setIrId(id);
            irData.setIrCode(newName);
            res=irDataMapper.updateById(irData);
        }





        if(res==1){
            return "ok";

        }else{
            return "error";
        }

    }


    /**
     * 保存任务
     * */

    public String saveTask(String taskName,int devieID, String time,String topic,String message) {

        TaskManage taskManage=new TaskManage();
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime  datetime = LocalDateTime.parse(time,df);

        taskManage.setTaskName(taskName);
        taskManage.setDeviceId(devieID);
        taskManage.setTaskTime(datetime);
        taskManage.setMqttTopic(topic);
        taskManage.setMqttMessage(message);

        int res=taskManageMapper.insert(taskManage);

        if(res==1){
            return "OK";
        }else{
            return "ERROR";
        }

    }


    /**
     *  得到所有任务
     * */
    public String getTask(int deviceID){


        QueryWrapper<TaskManage> qwtask=new QueryWrapper<>();
        qwtask.eq("device_id",deviceID);
        List<TaskManage> taskManages= taskManageMapper.selectList(qwtask);

        //转换数据
//        for( int i = 0 ; i < taskManages.size() ; i++) {
//            String topicType=taskManages.get(i).getMqttTopic();
//            String tp=topicType.substring(6,8);
//
//            String mess=taskManages.get(i).getMqttMessage();
//            String reStr="";
//            if(tp=="Sw"||tp.equals("Sw")){//'Topic_Switch'
//
//                char tf=mess.charAt(1);
//                if(tf=='t'){
//                    reStr=taskManages.get(i).getControlName()+"开启";
//                }else{
//                    reStr=taskManages.get(i).getControlName()+"关闭";
//                }
//                taskManages.get(i).setMqttMessage(reStr);
//            }
//            if(tp=="Sl"||tp.equals("Sl")){//Topic_Slider1
//
//                String value=mess.substring(1);
//                reStr=taskManages.get(i).getControlName()+"值为"+value;//开关名+值
//
//                taskManages.get(i).setMqttMessage(reStr);
//            }
//
//        }

        String jsonDeviceUsers = JSON.toJSONString(taskManages);
        return jsonDeviceUsers;
    }

    /**
     * 删除任务
     * */

    @Override
    public String pullTask(int taskID) {
        QueryWrapper<TaskManage> qwdel=new QueryWrapper<>();
        int res=taskManageMapper.deleteById(taskID);

        if(res==1){
            return "ok";
        }else{
            return "error";

        }

    }
}
