package com.cnetopro.wechatapp.controller;

import com.cnetopro.wechatapp.service.ControlerDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class ControlerDataController {

    @Autowired
    ControlerDataService controlerDataService;


    @PostMapping("/saveState")
    public String saveData(String session, String controlType,Integer controlId,Integer controlValue){
        System.out.println("controlType: "+controlType);
        System.out.println("controlId: "+controlId);
        System.out.println("controlValue: "+controlValue);

        String res=controlerDataService.saveControler(controlType,controlId,controlValue);
        return res;
    }


    @PostMapping("/saveName")
    public String setName(String session,String type, String newName, int id){
        System.out.println("接收数据："+session);
        System.out.println("接收数据 newName："+ newName);
        System.out.println("接收数据type："+type);
        System.out.println("接收数据id："+id);
        String strData= controlerDataService.saveName(type,newName, id);
        System.out.println("返回数据："+strData);
        return strData;
    }


    @PostMapping("/saveTask")
    public String saveTask(String session,String taskName, int devieID, String time,String topic,String message ){
//    public String saveTask(String session,String time){
        System.out.println("接收数据session："+session);
        System.out.println("接收数据taskName："+taskName);
        System.out.println("接收数据devieID："+devieID);
        System.out.println("接收数据topic："+topic);
        System.out.println("接收数据message："+message);

        String strData= controlerDataService.saveTask(taskName, devieID, time, topic, message );
        System.out.println("返回数据："+strData);
        return strData;
    }
    @PostMapping("/getTask")
    public String getTask(String session, int deviceID){

        System.out.println("接收数据："+session);
        System.out.println("接收数据 devieID："+ deviceID);

        String strData= controlerDataService.getTask(deviceID);
        System.out.println("返回数据："+strData);
        return strData;
    }


    @PostMapping("/delTask")
    public String delTask(String session, int taskID){

        System.out.println("接收数据："+session);
        System.out.println("接收数据 devieID："+ taskID);

        String strData= controlerDataService.pullTask(taskID);
        System.out.println("返回数据："+strData);
        return strData;
    }



}
