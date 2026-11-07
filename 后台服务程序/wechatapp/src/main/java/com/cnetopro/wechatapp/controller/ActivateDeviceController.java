package com.cnetopro.wechatapp.controller;


import com.cnetopro.wechatapp.service.ActivateDeviceService;
import com.cnetopro.wechatapp.util.AESutil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * ESP32设备一ID表 前端控制器
 * </p>
 *
 * @author ZhuGuoXu
 * @since 2020-03-01
 */
@RestController
public class ActivateDeviceController {

    @Autowired
    ActivateDeviceService activateDeviceService ;


    @Autowired
    AESutil AES;


    @PostMapping("/active")
    public String getcode(@RequestParam(value = "activatekey",defaultValue = "activatekey")String  activatekey,@RequestParam(value = "session",defaultValue = "session") String session){

       //解密activatekey 发送到业务层处理

        String res= activateDeviceService.activate(AES.decrypt(activatekey),session);

        return res;
    }




}
