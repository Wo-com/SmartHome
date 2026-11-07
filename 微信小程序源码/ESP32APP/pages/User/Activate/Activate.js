// pages/User/Activate/Activate.js
var app = getApp();
var CryptoJS = require('../../../utils/util.js')//引入加密算法

Page({

  /**
   * 页面的初始数据
   */
  data: {
     //device: wx.getStorageSync('device')
     device:true,

 // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度
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


  formSubmit: function (e) {
    var that = this;
    var activateKey = e.detail.value.activatekey;
  
    if (!(/^\w\w{7}$/.test(activateKey))){                //正则表达式
      app.showModal("激活码不存在")
    }else{
     
      var aesActivate = CryptoJS.Encrypt(activateKey);  //AES加密数据
      that.acitveDevice(aesActivate, app.globalData.globlesession);   
    }
  },

  acitveDevice:function(key,session){
    var activeUrl = app.globalData.requestURL + "/active";
    wx.request({
      url: activeUrl,
      method: 'POST',
      data: {
        activatekey: key,
        session: session
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"  // 使用这个能正常获取数据
      },
      success(res) {
        console.log(res);
        if (res.data == "error" || res.data == null) {
          app.showModal("激活失败")
        } else if (res.data == "repeat") {
          wx.showToast({
            title: '请勿重复激活',
            duration: 3000,
            mask: true   //是否有透明蒙层，默认为false 
            //如果有透明蒙层，弹窗的期间不能点击文档内容 
          })

        } else {
          wx.setStorageSync("device", res.data.device);//将用户session保存到缓存中 
          wx.setStorageSync("deviceName", res.data.deviceName);//将用户session保存到缓存中 
          wx.setStorageSync("devicActivated", res.data.devicActivated);//将用户session保存到缓存中 
          app.getDevice(res.data.device);//激活成功之后获取设备视图数据
          app.showModal("激活成功")
        }
      }
    })
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