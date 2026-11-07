// pages/Control/Edetector/Edetector.js

var app = getApp();

const date = new Date()
const years = []
const months = []
const days = [[]]

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}




Page({

  /**
   * 页面的初始数据
   */
  data: {
    client: null,//MQTT 客户端
    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度
    // slider_data: app.globalData.gslider_data,//滑块
   
   
    sensorData: app.globalData.gsensorData,//检测器
    sliderData: app.globalData.gsliderData,//滑块
    switchData: app.globalData.gswitchData,//开关
 
    haveman:false,

    multiArray: [],               //控制蜂鸣器
    multiIndex: [0, 0, 0],        //初始选择

    fanboxArry:[],                //控制风扇
    fanIndex: [0, 0, 0, 0, 0],    //初始选择


    haveManArry: [],
    manIndex: [0, 0, 0]     //初始选择
   
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that=this;
    that.setData({
      sensorData: app.globalData.gsensorData,//重新获取检测器 数据 
      sliderData: app.globalData.gsliderData,//滑块
      switchData: app.globalData.gswitchData,//开关
    });

    //如果没有数据就不显示选择器
    if (app.globalData.gsensorData!=null){
      that.creatBuzzerData(); //创建选择器
    }
    if (app.globalData.gsliderData!=null){
      that.creatFanData();    //创建选择器
    }
    if (app.globalData.gswitchData!=null){
      that.creatHaveManData();//创建选择器
    }
    
  },
  
  creatBuzzerData:function(e){
    var that=this;
    var sensorArry=[];
    var conditionArry = [];
    var dataArry = [];
    var arrybox = new Array();

    //添加设备名字
    for (var i = 0; i < that.data.sensorData.length; i++) {
      sensorArry.push(that.data.sensorData[i].sensorName);
    }
    //添加条件
    conditionArry.push("大于","小于")
    //添加数值
    for(var i=0;i<4095;i+=100){
      dataArry.push(i);
    }
    arrybox.push(sensorArry);
    arrybox.push(conditionArry);
    arrybox.push(dataArry);

    that.setData({
      multiArray: arrybox,//重新获取检测器 数据 
    });
  },

  creatFanData:function(e){
    var that = this;
    var sensorArry = [];
    var conditionArry = [];
    var dataArry = [];
    var fanArry=[];
    var fandataArry=[];
    var fanbox = new Array();

    //添加设备名字
    for (var i = 0; i < that.data.sensorData.length; i++) {
      sensorArry.push(that.data.sensorData[i].sensorName);
    }
    //添加条件
    conditionArry.push("大于", "小于");
    //添加数值
    for (var i = 100; i < 4095; i += 100) {
      dataArry.push(i);
    }
    //添加风扇地址
    for (var i = 0; i < that.data.sliderData.length; i++) {
      fanArry.push(that.data.sliderData[i].sliderName);
    }
    //添加风扇值
    for (var i = 0; i <=1000; i += 100) {
      fandataArry.push(i);
    }
    fandataArry.push(1024);


    fanbox.push(sensorArry);
    fanbox.push(conditionArry);
    fanbox.push(dataArry);
    fanbox.push(fanArry);
    fanbox.push(fandataArry);
    
    that.setData({
      fanboxArry: fanbox,//重新获取检测器 数据 
    });

  },
  

  creatHaveManData: function (e) {
    var that = this;
    var tfArry = [];
    // var buzzerArry = [];
    var switchArry = [];
    var tfArry2=[];
    var manbox = new Array();


    //添加设备名字
    tfArry.push("开启","关闭");
    // buzzerArry.push("发声","静音");

    for (var i = 0; i < that.data.switchData.length; i++) {
      switchArry.push(that.data.switchData[i].switchName);
    }
    tfArry2.push("开启","关闭");

    manbox.push(tfArry);
    // manbox.push(buzzerArry);
    manbox.push(switchArry);
    manbox.push(tfArry2);

    that.setData({
      haveManArry: manbox,//重新获取检测器 数据 
    });
  },

  //条件控制
  bindMultiPickerChange: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    that.setData({
      multiIndex: e.detail.value
    })
    var resindex = String.fromCharCode(Number(e.detail.value[0])  + app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
    var restf = "";
    var resvalue = that.data.multiArray[2][e.detail.value[2]];

    if (e.detail.value[1]===0){
      restf =">";
    }else{
      restf = "<";
    }
   
    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();

    
    //设备ID+时间+操作码+地址码+数据码 BLE
    var blestr = "" + app.globalData.deviceUNID+ nowtime + app.globalData.bleTGbuzzer + resindex + restf + resvalue;
    // bleTGbuzzer: "TG_S_B",//触发蜂鸣器
    //   bleTGswitch: "TG_I_S",//触发开关
    //     bleTGpwmEM: "TG_S_E",//触发电机

    // var reStr = "ss" + resindex + restf + resvalue;
    //如果蓝牙连接 蓝牙发送
    console.log("返回字符串" + blestr);
    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }
  },

  bindfanPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    that.setData({
      fanIndex: e.detail.value
    })
  
    var resindex = String.fromCharCode(Number(e.detail.value[0]) + app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
    var restf = "";
    var resvalue = that.data.multiArray[2][e.detail.value[2]];

    if (e.detail.value[1] === 0) {
      restf = ">";
    } else {
      restf = "<";
    }
    var resindex2 = String.fromCharCode(Number(e.detail.value[3]) + app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
    var resvalue2 = that.data.fanboxArry[4][e.detail.value[4]];

    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
    //设备ID+时间+操作码+地址码+数据码 BLE
    var blestr = "" + app.globalData.deviceUNID+ nowtime + app.globalData.bleTGpwmEM + resindex + restf + resvalue + resindex2 + resvalue2;



    // var reStr = "dd" + resindex + restf + resvalue+resindex2+resvalue2;
    console.log("返回字符串" + blestr);
   
   
    // 如果蓝牙连接 蓝牙发送
    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else if (app.globalData.mqttConnect) {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }

  },

//触发开关
  bindhaveManChange: function (e) {
    var that = this;

    var restf="";
    // var buzzer="";
    var swindex = "";
    var restf2="";

    console.log('picker发送选择改变，携带值为', e.detail.value);
    that.setData({
      manIndexx: e.detail.value
    })
    if (e.detail.value[0]===1){
      that.setData({
        haveman: false
      })
    }else{
      that.setData({
        haveman: true
      })
    }
    if (e.detail.value[0] === 0) {
      restf = "t";
    } else {
     restf = "f";
    }


    // if (e.detail.value[1] === 0) {
    //   buzzer = "t";
    // } else {
    //   buzzer = "f";
    // }

    swindex = String.fromCharCode(Number(e.detail.value[1]) + app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
    
    if (e.detail.value[2] === 0) {
      restf2 = "t";
    } else {
      restf2 = "f";
    }


    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
    //设备ID+时间+操作码+地址码+数据码 BLE    A 为占位符
    var blestr = "" + app.globalData.deviceUNID+ nowtime + app.globalData.bleTGswitch +"A" + restf + swindex + restf2;


    // var reStr = "hh" +"A" +restf+ swindex + restf2;
    console.log(blestr);

    
    //如果蓝牙连接 蓝牙发送
    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else if (app.globalData.mqttConnect) {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }

  },




  /*返回按钮*/
  backPage: function () {
    console.log("点击");
    wx.navigateBack({
      delta: 1
    });
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