// pages/User/Bnetwork/Bnetwork.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度

  },
  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  configDevice:function(e){
    console.log(e);
    if(!app.globalData.bleConnect){
      app.toastTips1("请连接设备蓝牙",1000);
      return;
    }

    var wifiName = e.detail.value.wifiname;
    var wifiPassword = e.detail.value.wifipassword;

    // wifiName = "wfn" + wifiName;
    // wifiPassword = "wfp" + wifiPassword;

    //时间参数
    var timeObj1 = new Date()
    var nowtime1 = timeObj1.getTime();
    //设备ID+时间+操作码+地址码+数据码 BLE
    var bleWifiName = "" + app.globalData.deviceUNID + nowtime1 + app.globalData.blewifi + "n" + wifiName;
    // var timeObj1 = new Date()
    var nowtime2 = nowtime1+1;
    var blesWifPass = "" + app.globalData.deviceUNID + nowtime2 + app.globalData.blewifi + "p" + wifiPassword;


    //如果蓝牙连接 蓝牙发送
    if (app.globalData.bleConnect) {
      app.sentOrder(bleWifiName);
      app.sentOrder(blesWifPass);
    }


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})