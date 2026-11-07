package com.cnetopro.wechatapp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.TaskManage;
import com.cnetopro.wechatapp.mapper.TaskManageMapper;
import com.cnetopro.wechatapp.service.IMqttSender;
import com.cnetopro.wechatapp.service.SchedulTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


@Service
public class SchedulTaskServiceImpl implements SchedulTaskService {


    String message;
    String topic;


    /**
     * 注入发送MQTT的Bean
     */
    @Autowired
    private IMqttSender iMqttSender;

    @Autowired
    TaskManageMapper taskManageMapper;


    /**
     * 1、定时扫描数据库，
     * 2、查询除小于当前时间的行数据，
     * 3、执行字段的发布MQTT主题，
     * 4、删除该行
     * */

    @Override
    @Scheduled(cron = "0/30 * * * * ?")     //1、每隔30秒执行一次
    public void schedualTask() {
        System.out.println("执行定时任务的时间是："+new Date());

        //得到当前时刻
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        String  now =df.format(new Date());
//        System.out.println(now);// new Date()为获取当前系统时间

        //2查询数据库表字段
        QueryWrapper<TaskManage> qwtask=new QueryWrapper<>();
        qwtask.le("task_time", now);
        List<TaskManage> taskManages=taskManageMapper.selectList(qwtask);
        System.out.println(taskManages);
        if( taskManages.size()==0){
            System.out.println("没有任务");
            return;
        }

        for( int i = 0 ; i < taskManages.size() ; i++) {//内部不锁定，效率最高，但在多线程要考虑并发操作的问题。
            System.out.println(taskManages.get(i));
            topic  =taskManages.get(i).getMqttTopic();
            message=taskManages.get(i).getMqttMessage();
            //3发布主题
            iMqttSender.sendToMqtt(topic, message);
        }
        //4删除数据行
        taskManageMapper.delete(qwtask);                //删除已经执行的任务
    }
}
