var CryptoJS = require('../../../utils/util2.js')//引入解密算法 蓝牙到小程序

// ArrayBuffer转16进制字符串示例（蓝牙数据解析）
function ab2hext(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
//16进制转字符串 （蓝牙数据解析）
function hexToString(str) {
  var trimedStr = str.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
      trimedStr.substr(2) :
      trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    // alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    client: app.globalData.client,//MQTT 客户端

    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度
    screenWidth: app.globalData.sysinfo.screenWidth,//屏幕宽度
    screenHeight: app.globalData.sysinfo.screenHeight,//屏幕高度

    sensorData: app.globalData.gsensorData,//检测器
    htData: app.globalData.ghtData,//温度湿度


    // touchTopic: null,    //当前主题
    touchType:null,       //点击的传感器类型
    touchId: null,
    touchName: null,       //点击的开关名称
    seneorID:null,
    showModal: false,
    inputText: "",


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("传感器页面OnLoad。");
    var that = this;

    that.setData({
      sensorData: app.globalData.gsensorData,//检测器

      htData: app.globalData.ghtData,//温度湿度
    });


    //页面加载的时候 执行MQTT函数
    that.data.client = app.globalData.client;
    

    //订阅用户主题   重新连接的时候要订阅   打开页面要订阅
    console.log("onlode订阅主题 ");
    that.data.client.subscribe(app.globalData.mqttRecvTopic, { qos: 1 });
    // that.clientSubcribe();
    //监听




    that.data.client.on('connect', that.ConnectCallback);
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);

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
   * 点击确定按钮获取input值并且关闭弹窗
   */
  ok: function () {
    var that = this;
    that.setData({
      showModal: false
    })

    var setNameUrl = app.globalData.requestURL + "/saveName";
    wx.request({
      url: setNameUrl,
      method: 'POST',
      data: {
        session: app.globalData.globlesession,
        type: that.data.touchType,
        newName: that.data.inputText,
        id: Number(that.data.seneorID)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
      },
      success(res) {
        console.log(res.data);
        console.log(res);

        if (res.data == "ok") {
          app.toastTips1("修改成功", 1000);

          if(that.data.touchType=="sensor"){//修改类型不同
            that.data.sensorData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'sensorData[' + index + '].sensorName';
                that.setData({
                  [name]: that.data.inputText,
                })
              }
            });
            app.globalData.gsensorData[that.data.touchId].sensorName = that.data.inputText;//全局变量
          }else{
            that.data.htData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'htData[' + index + '].htName';
                that.setData({
                  [name]: that.data.inputText,
                })
              }
            });
            app.globalData.ghtData[that.data.touchId].htName = that.data.inputText;//全局变量
          }
      

        } else {
          app.toastTips1("修改失败", 1000);
        }
      },
      fail(res) {
        app.toastTips1("修改失败", 1000);
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
    console.log("传感器页面OnShow。");
    var that=this;


    //在当前页面 蓝牙notify
    if (app.globalData.bleConnect){
      that.notifyBLECharacteristicValueChange();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("传感器进入后台时。");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that=this;
    console.log("传感器页面注销。");
    // 取消订阅
    that.data.client.unsubscribe(app.globalData.mqttRecvTopic,);
    //等隐藏页面 的时候关闭蓝牙接收
    if (app.globalData.bleConnect) {
      wx.notifyBLECharacteristicValueChange({
        state: false, // 关闭 notify 功能
        deviceId: that.data.deviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.notifyCharacteristicId,
      });
    }
  },

  /**
* 获取input输入值
*/
  wish_put: function (e) {

    this.setData({
      changeName: true,            //修改
      inputText: e.detail.value   //修改名称
    })
   
    console.log(e.detail.value);//输入的内容
  },

  /**
* 弹出窗口显示
*/
  btnChangeName: function (event) {
    console.log(this.data.changeName);//点击 控制栏左边
    console.log(event);

    this.setData({
      seneorID: event.currentTarget.dataset.sensorid,
      touchId: event.target.id,                        //当前点击的ID
      touchType: event.currentTarget.dataset.type,     //传感器还是温度
      inputText: event.currentTarget.dataset.name,    //防止点击了 但是没有修改
      touchName: event.currentTarget.dataset.name,    //当前点击名称
      showModal: true,

    })
  
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


  //蓝牙相关方法
  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: app.globalData.bleDeviceId,
      serviceId: app.globalData.bleServiceId,
      characteristicId: app.globalData.notifyCharacteristicId,
      success: function (res) {
        console.log("notify成功 监听");
        that.onBLECharacteristicValueChange();   //监听特征值变化
      },
      fail: function (res) {
        wx.showToast({
          title: 'notify启动失败',
          mask: true
        });
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }
    })
  },
  //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
  onBLECharacteristicValueChange: function () {
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      var resValue = ab2hext(res.value); //16进制字符串
      var resValueStr = hexToString(resValue);
    
      if (app.globalData.bleRec.length>10240){
        app.globalData.bleRec="";    //清0
      }
     
      //开始累加
      if (resValueStr.charAt(0) == app.globalData.codeSta){
        console.log("开始0");
        app.globalData.bleRec="";
      }

      app.globalData.bleRec += resValueStr;
    

      //结束累加
      if (resValueStr.charAt(resValueStr.length-1) == app.globalData.codeEnd) {
        // console.log("结束0");
        // console.log("接收总", app.globalData.bleRec, "接收总");
        
        var relyStr = app.globalData.bleRec.substring(1, app.globalData.bleRec.length-1);
        // console.log("提取", relyStr, "提取");
        that.setValue(relyStr);
      }
    });
  },
  setValue :function(str){
    var that=this;
   //解密
    // console.log("解密之前",str);
    var mm = CryptoJS.Decrypt(str);
    // console.log("解密结果:",mm);

    var dataArrys= mm.split(",");// 在每个逗号(,)处进行分解。
    // console.log("数据:",dataArrys);
    
   //传感器
   for(var i=0;i<10; i++){
     app.globalData.gsensorData[i].sensorValue = dataArrys[i];
   }
    // app.globalData.gswitchData[that.data.touchId].switchName = that.data.inputText;//全局变量
   //温度湿度
    app.globalData.ghtData[0].humidityValue = dataArrys[10];
    app.globalData.ghtData[0].temperatureValue = dataArrys[11];
    app.globalData.ghtData[1].humidityValue = dataArrys[12];
    app.globalData.ghtData[1].temperatureValue = dataArrys[13];


    that.setData({
      sensorData: app.globalData.gsensorData,//检测器

      htData: app.globalData.ghtData,//温度湿度
    });

  },




  //orderInput 输入内容
  orderInput: function (e) {
    this.setData({
      orderInputStr: e.detail.value
    })
  },


//MQTT相关方法
//MQTT连接
//MQTT订阅内容
//MQTT出错

  ConnectCallback: function (connack) {
    var that = this;
    //订阅用户主题   重新连接的时候要订阅   打开页面要订阅
    console.log("重连订阅用户主题 ");
  //  that.clientSubcribe();
   
  },

  MessageProcess: function (topic, message) {
    var that = this;

    var str = "" + message;//如果不多加这一步会出错
  
  //如果蓝牙连接 那么不处理mqtt数据
    if (!app.globalData.bleConnect){
      that.setValue(str);//数据处理方法
    }
    

  },

  ConnectError: function (error) {
    console.log("MQTT错误", error);
  },

  ClientReconnect: function () {
    console.log("MQTT重新连接")
  },

  ClientOffline: function () {
    console.log("MQTT下线")
  },
  
  //订阅主题
  // clientSubcribe: function () {
  //   var that = this;
  //   console.log("MQTT订阅主题", app.globalData.mqttRecvTopic);
  //   //订阅MQ

  // },

})