// pages/about/about.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  //隐藏操作
  openTheDoor:function(){
    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
    //转 ASCII 码减少数据位
    var index = String.fromCharCode(0+app.globalData.charIndex.charCodeAt()); 
    //设备ID+时间+操作码+地址码+数据码 BLE
    var blestr = "" + app.globalData.deviceUNID + nowtime + app.globalData.blePwmSE + index + app.globalData.openTheDoor;

    app.toastTips1("(ô‿ô)", 1000);
    //全局变量修改
    if (app.globalData.openTheDoor){
      app.globalData.openTheDoor = false;
    }else{
      app.globalData.openTheDoor = true;
    }
   

    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },

})