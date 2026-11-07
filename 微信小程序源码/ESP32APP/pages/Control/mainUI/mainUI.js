// pages/Control/mainUI/mainUI.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
    console.log("MUI进入后台时。");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("UI页面注销。");
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

  aSwitch:function(){
  
    wx.navigateTo({
      url: '../Aswitch/Aswitch',  
    })
  },

  bSensor: function () {
    wx.navigateTo({
      url: '../Bsensor/Bsensor',
    })
  },
 
  cInfredcont: function () {
    wx.navigateTo({
      url: '../Cinfredcont/Cinfredcont',
    })
  },

  dPWMotor: function () {
    wx.navigateTo({
      url: '../DPWMotor/DPWMotor',
    })
  },
   
  edetector: function () {
    wx.navigateTo({
      url: '../Edetector/Edetector',
    })
  },
  ftask: function () {
    wx.navigateTo({
      url: '../Ftask/Ftask',
    })
  }


})