// pages/Control/DPWMotor/DPWMotor.js

var dateTimePicker = require('../../../utils/dateTimePicker.js');
var app = getApp();


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
   
    changeName: false,     // 修改名称
    changeTime: false,
    chanegValue: false,

    touchTopic: null,      //当前主题
    touchId: null,
    touchName: null,       //点击的电机名称
    inputText: "",         //输入的名字

   //弹出框
    showModal: false,
    pwmData:null,
    pwmindex:11,

    //时间
    dateTimeArray: null,
    dateTime: null,
    // dateTime1: null,
    startYear: 2000,
    endYear: 2050,

    sliderData: app.globalData.gsliderData,//滑块
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("PWM电机控制页面加载");
    var that = this;
    that.data.client = app.globalData.client;//mqtt客户端

    var fandataArry = [];
    //添加风扇值
    for (var i = 0; i <= 1000; i += 100) {
      fandataArry.push(i);
    }
    fandataArry.push(1024);

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    this.setData({
      pwmData: fandataArry,//重新获取检测器 数据 

      dateTime: obj.dateTime,
      // dateTime1: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      sliderData: app.globalData.gsliderData,//滑块
      // switchData: app.globalData.gswitchData,//开关
      // dateTimeArray1: obj.dateTimeArray,
    });
  },


  // 滑块事件
  sliderChange: function (event) {
    var that = this;
    var tap_index = event.currentTarget.dataset.tapid;//滑块地址
    var slider_id = event.currentTarget.dataset.sliderid;//滑块ID

    var slData = event.detail.value.toString(); //数据类型转换
    var value = event.detail.value;
    //也可以直接发送字母过去，但是ID如果是字母不好区分
    // var index = String.fromCharCode(65 + Number(slider_index) );//转 ASCII 码减少数据位
    console.log(index);
    console.log(event);
    //转 ASCII 码减少数据位
    var index = String.fromCharCode(tap_index + app.globalData.charIndex.charCodeAt());
 
    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
    //设备ID+时间+操作码+地址码+数据码 BLE
    var blestr = "" + app.globalData.deviceUNID + nowtime + app.globalData.blePwmEM + index + slData;

    app.globalData.gsliderData[tap_index].sliderValue = slData;//保证页面改动值（本地全局数据）

    //如果 有设备数据
    if (app.globalData.haveDevice) {
      console.log(typeof(slider_id));
      console.log(typeof (value));

      app.setDeviceInfo("slider", slider_id, value);//保存状态
    }


    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else{   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
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
    // console.log(this.data.changeName);//输入的内容
    // console.log(e.detail.value);//输入的内容
  },


  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  setInf: function (event) {
    console.log(event);
    // console.log(this.data.changeName);//点击 控制栏左边
    var slider_id = event.currentTarget.dataset.sliderid;//ID
    console.log("ID:", slider_id);//点击 控制栏左边
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
    //   //清除上次点击修改数据
      pwmindex: 11,
      changeName: false,
      changeTime: false,
      chanegValue: false,
      dateTime: obj.dateTime,
      // dateTime1: obj.dateTime,
      sliderID: slider_id,
      touchId: Number(event.currentTarget.dataset.tapid),    //当前点击的ID
      touchTopic: event.currentTarget.dataset.topic,
      inputText: event.currentTarget.dataset.name,    //防止点击了 但是没有修改
      touchName: event.currentTarget.dataset.name,    //当前点击名称
      showModal: true,

    })
    // console.log(this.data.changeName);//点击 控制栏左边
  },

  ok: function () {
    var that = this;

    that.setData({
      showModal: false
    })

    if (that.data.changeName) {
      //更新输入新的名称
      console.log("确定 点击修改名称");

      var setNameUrl = app.globalData.requestURL + "/saveName";
      wx.request({
        url: setNameUrl,
        method: 'POST',
        data: {
          session: app.globalData.globlesession,
          type: "slider",
          newName: that.data.inputText,
          id: Number(that.data.sliderID)
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
        },
        success(res) {
          console.log(res.data);
          console.log(res);

          if (res.data == "ok") {
            app.toastTips1("修改成功", 1000);

            that.data.switchData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'sliderData[' + index + '].sliderName';
                that.setData({
                  [name]: that.data.inputText,
                })
              }
            });

          } else {
            app.toastTips1("修改失败", 1000);
          }
        },
        fail(res) {
          app.toastTips1("修改失败", 1000);
        }
      })
    }


    if (that.data.changeTime || that.data.changeValue) {
      console.log("确定 点击修改开始时间");
      var time = this.data.dateTime;
      var realtime = this.data.dateTimeArray;
      var restime = "" + realtime[0][time[0]] + "-" + realtime[1][time[1]] + "-" + realtime[2][time[2]] + " " + realtime[3][time[3]] + ":" + realtime[4][time[4]] + ":" + realtime[5][time[5]];
      var topic = that.data.touchTopic;
      console.log("时间：" + restime);
      var slindex = String.fromCharCode(that.data.touchId + app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
      // var message = "" + slindex +  that.data.pwmData[that.data.pwmindex];
      // var reqSaveTask= app.saveTask("开关任务",restime, topic, message);
      // console.log(message);
     


      var name = "" + that.data.touchName + "的值为"+that.data.pwmData[that.data.pwmindex] ;
      var restimeS = new Date(restime);
      console.log("选择的时间", restimeS);
      console.log("选择的时间2", restimeS.getTime());
      var message = "" + app.globalData.deviceUNID + restimeS.getTime() + app.globalData.blePwmEM + slindex + that.data.pwmData[that.data.pwmindex];

      var reqq = app.saveTask(restime, name, message);
      reqq.then(function (response) {
        if (response == "OK") {
          app.toastTips1("设置任务成功", 1000);
          app.getTask();//请求设备之后重新获取任务
        } else {
          app.toastTips1("设置任务失败", 1000);
        }
      }, function (error) {
        reject(err)
        console.log("appjs 保存err", error);
      })




      // wx.request({
      //   url: taskUrl,
      //   method: 'POST',
      //   data: {
      //     session: app.globalData.globlesession,
      //     taskName: "电机任务",
      //     userID: app.globalData.userID,
      //     devieID: app.globalData.deviceUNID,
      //     controlName: that.data.touchName,
      //     time: restime,
      //     topic: topic,
      //     message: message,
      //   },
      //   header: {
      //     // 使用这个能正常获取数据
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   success(res) {
      //     if (res.data == "ok") {
      //       app.toastTips1("设置任务成功", 1000);
      //       app.getTask();//请求设备之后请求任务
      //     } else {
      //       app.toastTips1("设置任务失败", 1000);
      //     }

      //     console.log("保存 状态");
      //   },
      //   fail(res) {
      //     app.toastTips1("设置任务失败", 1000);
      //   }
      // })


     
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      sliderData: app.globalData.gsliderData,//滑块
    });
    console.log(this.data.sliderData);
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
  
  
  //选择值
  bindValueChange:function(e){
    console.log(e);
    this.setData({
      changeValue: true,          //点击了修改开启值
      pwmindex: e.detail.value
    }); 
  },



  //时间相关函数
 
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },

  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      changeTime: true,          //点击了修改开启时间
      dateTimeArray: dateArr
    });
  },


})