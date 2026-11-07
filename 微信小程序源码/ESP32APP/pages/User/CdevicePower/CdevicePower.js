// pages/User/CdevicePower/CdevicePower.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,       //顶部栏高度
    navheigh: app.globalData.navHeight,  //顶部栏高度

   
    showModal: false,

    touchUserId: null,                             //点击的用户ID
    deviceID:app.globalData.deviceID,          //当前设备ID
    allDevice:null,                            //用户的所有设备
    allUser:null,                              //设备的所有用户
    power:"",                                  //当前权限


    list: [{
      id: "1",
      name: "传感数据"
    },
    {
      id: "2",
      name: "温度湿度"
    },
    {
      id: "3",
      name: "开关控制"
    },
    {
      id: "4",
      name: "电机控制"
      },
      {
        id: "5",
        name: "遥控数据"
      },
      {
        id: "6",
        name: "任务数据"
      }
    ]
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
    // deviceUser: app.globalData.deviceUser,       //用户权限
    deviceID: app.globalData.deviceID,          //当前设备ID
    this.getUserDevices(app.globalData.deviceID);//第一次加载用全局变量数据
  },


  /** 获取数据 用户的所有设备 和所有用户
   * 
   * 参数的作用：初次加载需要 得到当前使用的设备信息
   *          点击事件由 事件提供参数
  */
  getUserDevices: function (deviceid) {
    var getUserUrl = app.globalData.requestURL + "/power";
    var that = this;
    wx.request({
      url: getUserUrl,
      method: 'POST',
      data: {
        session: app.globalData.globlesession
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"  // 使用这个能正常获取数据
      },
      success(res) {
        that.setData({
          deviceID: deviceid,  
          allDevice: res.data.allDevice,
          allUser: res.data.allUser,
        });
        console.log("用户设备");
        console.log(res);
      }
    })
  },

  /* 点击切换设备 */
  btnDevicechange:function(event){
    console.log(event);
    var deviceName = event.currentTarget.dataset.name;
    var deviceid = event.currentTarget.dataset.id;
    this.changeDevices(deviceid,deviceName);
  },


  /*点击切换设备 请求 */
  changeDevices: function (deviceBtnID,deviceOnName) {
    var activeUrl = app.globalData.requestURL + "/changeDevice";
    var that = this;
    wx.request({
      url: activeUrl,
      method: 'POST',
      data: {
        session: app.globalData.globlesession,
        deviceID: deviceBtnID,
        deviceName: deviceOnName
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"  // 使用这个能正常获取数据
      },
      success(res) {
        app.globalData.deviceID = deviceBtnID;//点击事件更新全局变量
   
        that.getUserDevices(deviceBtnID);//重新获取数据
        console.log("用户设备");
        console.log(res);
      }
    })
  },

  
  /**
   * 设置权限
   */
  btnsetPower: function (event) {
    if (app.globalData.deviceUser == "root") {
      this.setData({
        touchUserId: Number(event.currentTarget.dataset.userid),
        showModal: true,
      })
    }else{
      app.toastTips1("无权修改", 1000);
    }
   
  },

  /**
   * 点击返回按钮隐藏
   */
  back: function () {
    this.setData({
      showModal: false
    })
  },

 
  /**
   * 多选框值改变事件
   */
  checkboxChange: function (e) {
      var item = e.detail.value //选中的数组
      var id = []; //选中的ID

      //循环选中的数组，取出对应的数据进行数组拼接
      for (var i = 0; i < item.length; i++) {
        var row = item[i].split(",") //将数组进行分割
        id = id.concat(row[0]) //数组下表的第一个为id

      }
      console.log(id);
  },


  /**
   * 点击确定事件
   */

  formSubmit: function (e) {
    var that=this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    that.setData({
      showModal: false
    })
    var eventvalue= e.detail.value.checkbox;
    var power =eventvalue.toString();//转字符串
    var powerData = power.split(",").join("");//去除','号
    var arry = "";                //临时数组
    if (app.globalData.userID === that.data.touchUserId){
      console.log("当前权限");
      arry="r000000000"
    }else{
      console.log("其它用户权限");
      arry = "p000000000"
    }

    for (let char of powerData) {
      arry = arry.substr(0, Number(char)) + "1" + arry.substr(Number(char) +1);
    }

    console.log(arry);
    that.rqSetPower(arry);
  },

  /**
   * 设置权限 : 网络请求
   */
  rqSetPower:function(userPower){
    var setPowerUrl = app.globalData.requestURL + "/setPower";
    var that = this;
    wx.request({
      url: setPowerUrl,
      method: 'POST',
      data: {
        session: app.globalData.globlesession,
        power: userPower,
        deviceID: app.globalData.deviceID,
        userID: that.data.touchUserId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"  // 使用这个能正常获取数据
      },
      success(res) {
        console.log("设置权限");
        console.log(res);
        wx.showToast({
          title: '权限修改成功',
          duration: 1000,
          mask: true   //是否有透明蒙层，默认为false 
          //如果有透明蒙层，弹窗的期间不能点击文档内容 
        })
        
        /**
         * 如果更改的是当前设备的权限 则重新请求设备数据
        */
        if (userPower.charAt(0)==='r'){
          app.getDevice();
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
    console.log("退出 重新请求  设备")
    app.getDevice();//退出页面重新请求
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