//生成随机ID
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//MQTT
import mqtt from './utils/mqtt.js';
var CryptoJS1 = require('./utils/util.js')//引入加密算法
var CryptoJS2 = require('./utils/util2.js')//引入加密算法

const host = 'wxs://www.xxxxxxx.com/mqtt';
const options = {
  protocolVersion: 4, //MQTT连接协议版本
  clientId:randomString(10),
  
  clean: true,
  username: 'zhu',
  password: 'zhu',
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  resubscribe: true
};



App({
  onLaunch: function () {
 
    this.globalData.sysinfo = wx.getSystemInfoSync();//获取设信息
    console.log("本地储存");
    console.log(this.globalData.sysinfo);
    //获取高度
    var datas = wx.getMenuButtonBoundingClientRect()
    console.log(datas);
    console.log('菜单按键高度：', datas.height)
    console.log('菜单按键下边界坐标：', datas.top)
    this.globalData.navTop = datas.top;
    this.globalData.navHeight = datas.height;
    
    

    var testUrl = this.globalData.requestURL +"/test";
    wx.request({
      url: testUrl,
   
      header: {
        // 使用这个能正常获取数据
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log("test 请求 成功");
        console.log(res);
      },
      fail(res){
        console.log("test 请求 失败");
        console.log(res);
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        var that=this;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.wxUserInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              that.loginRequest();//重新登录
              
            }
          })
        }
      }
    });
  },

  getModel: function () { //获取手机型号
    return this.globalData.sysinfo["model"]
  },
  getWxVersion: function () { //获取微信版本号
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData.sysinfo["SDKVersion"]
  },

  //toast提示
  toastTips: function (txt) {
    wx.showToast({
      title: txt
    })
  },
  //toast提示，可以设置等待时长
  toastTips1: function (txt, time) {
    wx.showToast({
      title: txt,
      duration: time
    })
  },
  toastTips2: function (txt) {
    wx.showToast({
      title: txt,
      icon: "loading"
    })
  },

  //弹窗提示
  showModal: function (txt) {
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false,
    })
  },
  //弹窗提示,有确认按钮
  showModal1: function (txt) {
    wx.showModal({
      title: "提示",
      content: txt,
      showCancel: false,
      confirmText: "确定"
    })
  },
  //loading
  showLoading: function (txt) {
    wx.showLoading({
      title: txt,
      mask: true
    });
  },

  //获取设备信息方法
  getDevice:function(){
    var that = this;
    var deviceUrl = that.globalData.requestURL + "/device";
    console.log("获取设备信息");
    wx.request({
      url: deviceUrl,
      method: 'POST',
      data: {
        session: that.globalData.globlesession
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
      },
      success(res) {

        if (res.data == "error" || res.data == null || res.data.length==0) {
          console.log("获取设备数据失败！");
        } else {
          console.log(res.data);
          that.globalData.deviceID   = res.data.onDeviceid;        //当前设备ID
          that.globalData.deviceName = res.data.onDeviceName;      //当前设备Name
          that.globalData.userID     = res.data.thisUserID;        //当前用户   
          that.globalData.deviceUser = res.data.deviceUser;        //当前用户对设备的控制权限  
       
          that.globalData.deviceUNID    = CryptoJS1.Decrypt(res.data.deviceUnnid.deviceMacid);        //设备激活数据 
          that.globalData.mqttSentTopic = res.data.deviceUnnid.deviceReceiveTopic;  //小程序发布数据 ESP32接收数据
          that.globalData.mqttRecvTopic = res.data.deviceUnnid.deviceSendTopic;     //小程序接收数据 ESp32发布数据
      
          that.globalData.gswitchData = res.data.switchData;    //开关数据
          that.globalData.gsensorData = res.data.sensorData;    //传感器数据
          that.globalData.gsliderData = res.data.sliderData;    //滑块数据
          that.globalData.ghtData = res.data.htData;            //温度湿度数据
          that.globalData.girData = res.data.irData ;           //红外遥控
          that.globalData.gTask = res.data.taskData;            //任务数据

          //设置标志
          that.globalData.haveDevice = true;
          //订阅主题
          console.log("订阅主题");
          if (that.globalData.haveDevice){
            that.globalData.client.subscribe(that.globalData.mqttRecvTopic, { qos: 1 });
          }
          
        }
        if (that.globalData.deviceID!=null){
          that.getTask();//请求设备之后请求任务
        }else{
          console.log("设备ID为空");
        }
        
      }
    })
  },
  //获取设备任务
  getTask: function () {
    var that = this;
    var taseUrl = that.globalData.requestURL + "/getTask";
    console.log("获取设备信息");
    wx.request({
      url: taseUrl,
      method: 'POST',
      data: {
        session: that.globalData.globlesession,
        deviceID: that.globalData.deviceID
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
      },
      success(res) {
        console.log("任务");
        console.log(res.data);
        that.globalData.gTask = res.data;    //任务数据
     
      }
    })
  },
  //登录小程序方法
  loginRequest: function () {
    var that = this;
    console.log("用户登录请求");
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var loginUrl = that.globalData.requestURL + "/login";
          wx.request({
            url: loginUrl,

            data: {
              code: res.code,
              userInfo: that.globalData.wxUserInfo
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
            },
            success(res) {
              console.log(res);
              if (res.data == "error" || res.data == null) {
                console.log("登录失败");

                wx.showToast({
                  title: '登录失败',
                  duration: 1000,
                  mask: true   //是否有透明蒙层，默认为false 
                  //如果有透明蒙层，弹窗的期间不能点击文档内容 
                })
              } else {
                wx.setStorageSync("md5ssion", res.data);//将用户session保存到缓存中
                // wx.setStorage({key: "md5ssion",data: res.data })     //异步版本

                that.globalData.globlesession = res.data;               //赋值给全局变量
                that.getDevice();                                       //获取设备信息
                
                console.log("session:"+res.data);
                wx.showToast({
                  title: '登录成功',
                  duration: 1000,
                  mask: true   //是否有透明蒙层，默认为false 
                  //如果有透明蒙层，弹窗的期间不能点击文档内容 
                })
              }
            },
            fail(failRes) {
              wx.setStorageSync("md5ssion", null);//将用户null保存到缓存中
              wx.showToast({
                title: '登录失败',
                duration: 2000,
                mask: true   //是否有透明蒙层，默认为false 
                //如果有透明蒙层，弹窗的期间不能点击文档内容 
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail(failRes){
        wx.setStorageSync("md5ssion", null);//将用户null保存到缓存中
        console.log("请求登录失败");
        wx.showToast({
          title: '请求登录失败',
          duration: 1000,
          mask: true   //是否有透明蒙层，默认为false 
          //如果有透明蒙层，弹窗的期间不能点击文档内容 
        })
      }
    });
  },

  /*更改设备名称*/
  setName:function(type,newname,id){
    var that=this;
    var setNameUrl = that.globalData.requestURL + "/saveName";
    wx.request({
      url: setNameUrl,
      method: 'POST',
      data: {
        session: that.globalData.globlesession,
        type:type,
        newName: newname,
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
      },
      success(res) {
        console.log(res.data);
        console.log(res);
      },
    })
  },

  globalData: {
    //color: "F8F8F8",系统 默认背景颜色
    sysinfo:{},//设备信息
    haveDevice:false,       //获取到设备信息没有

    requestURL:"https://www.xxxxx.com", //访问地址
    // requestURL: "http://localhost:8848", //访问地址

    wxUserInfo: null,       //用户信息 //顶部栏高度 //顶部栏高度  //屏幕高度
    isBindUser: false,
    navHeight: 0,           //顶部栏高度
    backHeight: 0,          //顶部栏高度
    // screenWidth: 0,         //屏幕宽度
    // screenHeight: 0,        //屏幕高度

    client: mqtt.connect(host, options),   //MQTT
    mqttConnect: true,      //mqtt 连接没有

    bleConnect:false,       //蓝牙连接没有
    bleName: null,          //当前连接蓝牙名字
    bleDeviceId: null,      //蓝牙设备ID
    bleServiceId: null,     //蓝牙服务ID

    notifyCharacteristicId: null, //蓝牙notify
    writeCharacteristicId: null,  //蓝牙write

    mqttSentTopic:null,
    mqttRecvTopic: null,

    codeSta : String.fromCharCode(123), //转 ASCII 起始符
    codeEnd : String.fromCharCode(125), //转 ASCII 结束符
    openTheDoor:true,//舵机控制
    deviceID : null,  //设备ID
    deviceName:null,  //设备名称
    // deviceUNID:null,
    charIndex:'A',
    bleRec:"",//蓝牙接收数据
    bleswitch:"switch", //开关
    blewifi:"stWiFi",   //Wi-Fi
    blePwmEM:"pwm_EM", //电机
    blePwmSE:"pwm_SE",  //舵机
    bleirCont:"irCont",  //遥控
    bleTGbuzzer:"TG_S_B",//触发蜂鸣器
    bleTGswitch:"TG_I_S",//触发开关
    bleTGpwmEM: "TG_S_E",//触发电机

    userID: null,                 //当前用户ID
    deviceUser:"pers",              //root或者pers
    globlesession:null,             //全局session

    gTask:[{  "mqttMessage": "0t", "mqttTopic": "Topic_Switch1",  "taskName": "开关任务","taskTime": "2020-06-02T12:17:10"}, 
    {  "mqttMessage": "0f", "mqttTopic": "Topic_Switch1",  "taskName": "开关任务", "taskTime": "2020-06-02T12:17:10"}, 
    {  "mqttMessage": "5f", "mqttTopic": "Topic_Switch1",  "taskName": "开关任务", "taskTime": "2022-06-02T12:17:22"}],

    gswitchData: [ 
    { switchDevice: 667, switchId: 1, switchName: "开关1", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 2, switchName: "开关2", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 3, switchName: "开关3", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 4, switchName: "开关4", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 5, switchName: "开关5", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 6, switchName: "开关6", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 7, switchName: "开关7", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 8, switchName: "开关8", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 9, switchName: "开关9", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 10, switchName: "开关10", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 11, switchName: "开关11", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 12, switchName: "开关12", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 13, switchName: "开关13", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 14, switchName: "开关14", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 15, switchName: "开关15", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 16, switchName: "开关16", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 17, switchName: "开关17", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 18, switchName: "开关18", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 19, switchName: "开关19", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 20, switchName: "开关20", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 21, switchName: "开关21", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 22, switchName: "开关22", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 23, switchName: "开关23", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 24, switchName: "开关24", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 25, switchName: "开关25", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 26, switchName: "开关26", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 27, switchName: "开关27", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 28, switchName: "开关28", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 29, switchName: "开关29", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 30, switchName: "开关30", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 31, switchName: "开关31", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 32, switchName: "开关32", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 33, switchName: "开关33", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 34, switchName: "开关34", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 35, switchName: "开关35", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 36, switchName: "开关36", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 37, switchName: "开关37", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 38, switchName: "开关38", switchState: 0, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 39, switchName: "开关39", switchState: 1, switchTopic: "Topic" },
  { switchDevice: 667, switchId: 40, switchName: "开关40", switchState: 0, switchTopic: "Topic" },
    ],

    gsensorData: [
      { sensorDevice: 667, sensorId: 1, sensorName: "雨水传感器", sensorTopic: "Topic", sensorValue: 107 },
      { sensorDevice: 667, sensorId: 2, sensorName: "传感器1", sensorTopic: "Topic", sensorValue: 213 },
      { sensorDevice: 667, sensorId: 3, sensorName: "传感器3", sensorTopic: "Topic", sensorValue: 140 },
      { sensorDevice: 667, sensorId: 4, sensorName: "传感器4", sensorTopic: "Topic", sensorValue: 860 },
      { sensorDevice: 667, sensorId: 5, sensorName: "传感器5", sensorTopic: "Topic", sensorValue: 1480 },
      { sensorDevice: 667, sensorId: 6, sensorName: "传感器6", sensorTopic: "Topic", sensorValue: 200 },
      { sensorDevice: 667, sensorId: 7, sensorName: "传感器7", sensorTopic: "Topic", sensorValue: 2800 },
      { sensorDevice: 667, sensorId: 8, sensorName: "传感器8", sensorTopic: "Topic", sensorValue: 300 },
      { sensorDevice: 667, sensorId: 9, sensorName: "传感器9", sensorTopic: "Topic", sensorValue: 2800 },
      { sensorDevice: 667, sensorId: 10, sensorName: "传感器10", sensorTopic: "Topic", sensorValue: 300 },
    ],

    ghtData: [
      { htDevice: 667, htId: 1, htName: "客厅温度湿度", humidityTopic: "Topic", humidityValue: 80, temperatureTopic: "Topic", temperatureValue: 37},
      { htDevice: 667, htId: 2, htName: "厨房温度湿度", humidityTopic: "Topic", humidityValue: 95, temperatureTopic: "Topic", temperatureValue: 20}
    ],

    girData: [
      { "irName": "按键1", "irCode": "0x33B87986", "irDevice": 667, "irId": 1, "irTopic": "Topic_Ir" }, 
      { "irName": "按键2", "irCode": "0x33B8A15E", "irDevice": 667, "irId": 2, "irTopic": "Topic_Ir" }, 
      { "irName": "按键3", "irCode": "0x33B8F906", "irDevice": 667, "irId": 3, "irTopic": "Topic_Ir" }, 
      { "irName": "按键3", "irCode": "0x33B8619E", "irDevice": 667, "irId": 4, "irTopic": "Topic_Ir" }, 
      { "irName": "按键4", "irCode": "0x33B8EEEE", "irDevice": 667, "irId": 5, "irTopic": "Topic_Ir" }, 
      { "irName": "按键5", "irCode": "0x33B8619A", "irDevice": 667, "irId": 6, "irTopic": "Topic_Ir" }],

    gsliderData: [
      { sliderDevice: 667, sliderId: 1, sliderName: "舵机", sliderTopic: "Topic", sliderValue: 0 },
      { sliderDevice: 667, sliderId: 2, sliderName: "电风扇", sliderTopic: "Topic", sliderValue: 0 },
      { sliderDevice: 667, sliderId: 3, sliderName: "抽水泵", sliderTopic: "Topic", sliderValue: 0 },
      { sliderDevice: 667, sliderId: 4, sliderName: "电风扇", sliderTopic: "Topic", sliderValue: 0 }
   ],

    navImage:'data:image/png;base64,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',

},


  //保存控制器的值
  setDeviceInfo: function (controlType, controlId, controlValue){
    var that=this;
    var saveUrl =  that.globalData.requestURL + "/saveState";
    var resTF = false;
    wx.request({
      url: saveUrl,
      method: 'POST',
      data: {
        session: that.globalData.globlesession,
        controlType: controlType, 
        controlId: controlId, 
        controlValue: controlValue
      },
      header: {
        // 使用这个能正常获取数据
        "Content-Type": "application/x-www-form-urlencoded" 
      },
      success(res) {
        if(res.data==="ok"){
          resTF=true;
        }
        console.log("保存 状态");
      },
      fail(res){
        resdata = false;
      }
    })
    return resTF;
  },

 

  saveTask: function(time,name,message){
    var that=this;
    var resp=null;

  
    //加密
    console.log(message);
    var mm = CryptoJS2.Encrypt(message);


    var data = {};
    data['session'] = that.globalData.globlesession;
    data['taskName'] = name;
    data['devieID'] = that.globalData.deviceID;
    data['time'] = time;
    data['topic'] = that.globalData.mqttSentTopic;
    data['message']=mm;

    var method="POST";
    var taskUrl = that.globalData.requestURL + "/saveTask";
    var header = { "Content-Type": "application/x-www-form-urlencoded" };



    var promise = new Promise(function (resolve, reject) {
      wx.request({
        url: taskUrl,
        data: data,
        method: method,
        header: header,
        success: function (res) { resolve(res.data); },
        fail: function (res) {
          reject(res.errMsg);
        },
      })
      // return status
    });
    return promise;


    // var taskUrl = that.globalData.requestURL + "/saveTask";
    // var header = { "Content-Type": "application/x-www-form-urlencoded" };
    // requestUtil.sendRrquest(taskUrl, 'POST', data, header).then(function (response) {
    //   resp=response;
    //   console.log("appjs 保存", response);
    //   console.log("appjs 保存",resp);
    // }, function (error) {
    //   resp= "ERROE"
    // })

  },


  //设置蓝牙全局变量
  setConnect: function (connect,name, devID, serviceID) {

    var that = this;
    that.globalData.bleConnect = connect;
    that.globalData.bleName = name;
    that.globalData.bleDeviceId = devID;
    that.globalData.bleServiceId = serviceID;
  },
  //设置蓝牙 写特征值
  setWriteCharacter: function (writeCharacter) {
    var that = this;
    that.globalData.writeCharacteristicId = writeCharacter;
  },

    //设置蓝牙 notify特征值
  setNotifyCharacter: function (notifyCharacter){
    var that = this;
    that.globalData.notifyCharacteristicId = notifyCharacter;
  },


  // 字符串转byte
  stringToBytes: function(str) {
    var strArray = new Uint8Array(str.length);
    for(var i = 0; i<str.length; i++) {
      strArray[i] = str.charCodeAt(i);
    }
  const array = new Uint8Array(strArray.length)
  strArray.forEach((item, index) => array[index] = item)
  return array.buffer;
},
  ////////////写入数据
  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
  //发送指令
      //蓝牙发送数据


////

  sentMQTT :function(str){
    var that=this;
    //加密 传输
    //加密

    var mm = CryptoJS2.Encrypt(str);

    console.log("原始数据",str);
    console.log(that.globalData.mqttSentTopic);
    console.log("MQTT加密", mm);

    if (that.globalData.client.connected){
      console.log("MQTT btn 已经连接");
    } else if (that.globalData.client.reconnecting){
      console.log("MQTT btn 正在连接");
    }else{
      console.log("MQTT btn 重新连接");
      that.globalData.client.reconnect();
    }
  
    that.globalData.client.publish(that.globalData.mqttSentTopic, mm);
    
    
  },
  
  //蓝牙发送数据
  sentOrder: function (str) {
    var that = this;
    // this.toastTips1(str, 1000);
    
    //加密 传输
    //加密
    var mm = CryptoJS2.Encrypt(str);
    var recs = "" + that.globalData.codeSta + mm + that.globalData.codeEnd;
    console.log(str);
    console.log("加密", mm);
    console.log("加密传输", recs);


    let order = that.stringToBytes(recs);

    let byteLen = order.byteLength;//长度
    let pos = 0;       //字符位置

    let tempBuffer;   //一次发送的数据
    var i = 0;          //计数

    //为了安全每次发送18个字节 (每次最多20个)
    while (byteLen > 0) {
      i++;
      if (byteLen > 18) {
        tempBuffer = order.slice(pos, pos + 18);
        pos += 18;
        byteLen -= 18;
        console.log("第", i, "次发送:", tempBuffer);
        that.writeBLECharacteristicValue(tempBuffer);
      } else {
        tempBuffer = order.slice(pos, pos + byteLen);
        pos += byteLen;
        byteLen -= byteLen;
        console.log("第", i, "次发送:", tempBuffer);
        that.writeBLECharacteristicValue(tempBuffer);
      }

    }
    console.log("发送结束");
    // that.writeBLECharacteristicValue(order);
  },

  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性

  writeBLECharacteristicValue: function (order) {
    var that = this;

    wx.writeBLECharacteristicValue({

      deviceId: this.globalData.bleDeviceId,
      serviceId: this.globalData.bleServiceId,
      characteristicId: this.globalData.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      value: order.slice(0, 20),
      success: function (res) {
        console.log("发送成功");
      },

      fail: function (res) {
        console.log("发送失败");
      }

    })
  },


})