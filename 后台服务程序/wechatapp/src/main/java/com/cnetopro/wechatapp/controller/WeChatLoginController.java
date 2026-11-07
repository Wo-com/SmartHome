package com.cnetopro.wechatapp.controller;

import com.cnetopro.wechatapp.service.WeChatLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class WeChatLoginController {
    @Autowired
    WeChatLoginService wc;

    @RequestMapping("/login")
    @ResponseBody
    public String getcode(@RequestParam(value = "code")String  code,String userInfo){
        System.out.println(userInfo);
        String resp=wc.codeToOpenidAndSessionkey(code);          //发送请求获取opeind session
        String loginData=wc.login(resp,userInfo);                              //保存openID和session返回加密的session

        return loginData;
    }


    @GetMapping("/test")
    String test(){
        return "test 成功";
    }
}
