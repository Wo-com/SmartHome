// pages/index/mine.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.wxUserInfo,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//是不是官方授权接口可不可以用

    boxHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var height = app.globalData.sysinfo.windowHeight - app.globalData.sysinfo.screenWidth * 0.68
    that.setData({
      boxHeight: height,
    });
  },


  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    var that=this;
    //全局变量在变  所以要动态获取
    if (app.globalData.wxUserInfo) {

      that.setData({
        hasUserInfo: true,
        userInfo: app.globalData.wxUserInfo,
      });
    }
  },



//请求授权用户信息 调用方法
  getUserInfo: function (e) {

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
  
      app.globalData.wxUserInfo = e.detail.userInfo
      that.setData({
        hasUserInfo: true,
        userInfo: e.detail.userInfo
      });

      //第一次授权时登录
      app.loginRequest();

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '拒绝授权，将无法激活设备!!!',
        showCancel: false,
        confirmText: '返回授权',
        // success: function (res) {
        //   // 用户没有授权成功，不需要改变 isHide 的值
        //   if (res.confirm) {
        //     console.log('用户点击了“返回授权”');
        //   }
        // }
      });
    }
  },



//激活设备之前必须先 授权登录

  goToPageActive:function(){
    if(this.data.userInfo!=null){
      console.log("跳转");
      wx.navigateTo({
        url: '/pages/User/Activate/Activate',
      });
    }else{
      wx.showToast({
        title: '请先授权登录',
        duration: 1000,
        mask: true   //是否有透明蒙层，默认为false 
        //如果有透明蒙层，弹窗的期间不能点击文档内容 
      })
    }
  },

  goToPageBnetwork: function () {
    if (app.globalData.mqttConnect) {
      console.log("跳转");
      wx.navigateTo({
        url: '/pages/User/Bnetwork/Bnetwork',
      });
    } else {
      wx.showToast({
        title: '请先连接设备蓝牙',
        duration: 1000,
        mask: true   //是否有透明蒙层，默认为false 
        //如果有透明蒙层，弹窗的期间不能点击文档内容 
      })
    }
  },

 
  goToPageCdevicePower: function () {
    wx.navigateTo({
      url: '/pages/User/CdevicePower/CdevicePower',
    });
  },
  goToPageDhelp: function () {
    wx.navigateTo({
      url: '/pages/User/DHelp/DHelp',
    });
  },
  goToPageaboutMe: function () {
    wx.navigateTo({
      url: '/pages/User/EaboutMe/EaboutMe',
    });
  },
  goToPageabout: function () {
    wx.navigateTo({
      url: '/pages/User/Fabout/Fabout',
    });
  },



})