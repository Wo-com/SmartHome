package com.cnetopro.wechatapp.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cnetopro.wechatapp.entity.UserUnnid;
import com.cnetopro.wechatapp.entity.WeChatData;
import com.cnetopro.wechatapp.mapper.UserUnnidMapper;
import com.cnetopro.wechatapp.service.WeChatLoginService;
import com.cnetopro.wechatapp.util.AESutil;
import com.github.kevinsawicki.http.HttpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class WeChatLoginServiceImpl implements WeChatLoginService {

    @Autowired
    AESutil AEStool;

    @Autowired
    UserUnnidMapper userUnnidMapper;       //自动装配


    @Autowired                             //自动装配
    WeChatData wedata;

    /**
     *
     * 请求参数：appid，secret，code，gtant_type
     * 通过封装的Http请求获取session和openid
     *
     * */

    @Override
    public String codeToOpenidAndSessionkey(String code) {
        Map<String, String> data = new HashMap<String, String>();
        data.put("appid", wedata.getAppid());
        data.put("secret", wedata.getSecret());
        data.put("js_code", code);
        data.put("grant_type", "authorization_code");

        //获取openid sessionkey
        String response = HttpRequest.get("https://api.weixin.qq.com/sns/jscode2session").form(data).body();
        System.out.println("Response was: " + response);

        return response;//返回http请求得到的结果集
    }


    /**
     *  1、对resp要做异常处理
     *  2、再将resp解析 取出code和session_key,userInfo
     *  3、session_key进行加密
     *  4、保存openid，保存session_key
     *
     * */

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String login(String resp,String userInfo) {

        //将resp转换为json对象
        JSONObject codeAndSessionKeyObj= JSON.parseObject(resp);
        //将userInfo转换为json对象
        JSONObject userInfoKeyObj= JSON.parseObject(userInfo);

        //1、错误结果集异常处理
        //请求错误返回结果：{"errcode":40125,"errmsg":"invalid appsecret, view more at http:\/\/t.cn\/RAEkdVq, hints: [ req_id: njnAiYXBe-J2vvaA ]"}
        try{
            if(codeAndSessionKeyObj.getInteger("errcode")==40125){
                System.out.println("获取openid失败");
                return "error";
            }
        }catch(Exception e){
            System.out.println("正常获取数据");
        }

        //2、获取openid    session_key,userInfo

        String openid= codeAndSessionKeyObj.getString("openid");
        String sessionkey = codeAndSessionKeyObj.getString("session_key");//获取sessionkey
        String userNickName=userInfoKeyObj.getString("nickName");//获取用户昵称
        String userHeadUrl=userInfoKeyObj.getString("avatarUrl");//用户头像地址

        // 3、session_key进行加密
        //先参数随机字符串和sessionkey加密产生加密数据（撒盐加密）加密算法用md5
        String salt= UUID.randomUUID().toString().replace("-", "");  //产生随机字符串去除"-"
        sessionkey=sessionkey+salt;//字符串拼接
        String md5SaltSessionkey = DigestUtils.md5DigestAsHex(sessionkey.getBytes());//加密


        //4、保存openid,  session_key,   userInfo

        /**
         * 保存数据的逻辑如下：
         *
         * 先查询表示是否已经存在该openID
         *
         * 如果不存在则说明：
         *      1、用户是第一次登录
         *
         *      执行操作：插入openID和sessionkey。插入用户头像，插入昵称
         * 如果存在则说明：
         *      2、用户是第二次登录
         *
         *      执行操作：更新sessionkey字段。更新用户头像，更新昵称
         *
         * */

        //myabtis_plis 条件构造器    //查询openid
        QueryWrapper<UserUnnid> qwUserUnnid =new QueryWrapper<>();
        qwUserUnnid.eq("open_id",openid);
        UserUnnid respUnnid=userUnnidMapper.selectOne(qwUserUnnid);

        //实例化openid表
        UserUnnid userUnnid=new UserUnnid();

        userUnnid.setUserNickname(userNickName);
        userUnnid.setUserHeadUrl(userHeadUrl);
        userUnnid.setSessionKey(md5SaltSessionkey);
        userUnnid.setOpenId(openid);

        if(respUnnid==null){
            // 插入用户数据
            System.out.println("插入用户");
            userUnnidMapper.insert(userUnnid);     //插入数据
        }else{
            // 更新用户头像 更新用户昵称，更新登录session
            System.out.println("更新用户");
            userUnnidMapper.update(userUnnid,qwUserUnnid);  //更新数据
        }
        return md5SaltSessionkey;
    }
}
