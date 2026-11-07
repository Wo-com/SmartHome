package com.cnetopro.wechatapp.service;

public interface ControlerDataService {

    /**
     * 方法作用：  保存  控制器（开关/电机）的状态或值
     *
     * 参数：控制器类型
     *      控制器ID
     *      控制器的值
     *
     * 返回类型：保存成功没有
     *
     * */

    public String saveControler(String controlType,Integer controlId,Integer controlValue);




    /**
     * 设置设备属性的值
     * 如开关的名称，传感器的名称
     *
     * */
    String saveName(String type,String newName,int id);


    /**
     * 保存任务
     * */
    String saveTask(String taskName,  int devieID, String time,String topic,String message );


    /**
     * 查询任务
     * */
    String getTask(int deviceID);

    /**
     * 删除任务
     * */
    String pullTask(int deviceID);


}
