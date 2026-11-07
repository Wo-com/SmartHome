package com.cnetopro.wechatapp.service;

public interface WeChatLoginService {
    /**
     * code换取openid session_key
     *
     * 参数：code
     * 返回参数： openid,session_key结果集（类型：json）
     *
     * */
    public String codeToOpenidAndSessionkey(String code);

    /**
     * 拿到openid session_key结果集
     *
     * 提取并储存openid，session_key
     *
     * 参数：openid session_key结果集
     * 返回参数：用户登录信息 （类型string）
     * */
    public String login(String resp,String userInfo);
}
