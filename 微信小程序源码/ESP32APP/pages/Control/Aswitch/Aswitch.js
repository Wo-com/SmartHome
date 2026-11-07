// pages/Control/Aswitch/Aswitch.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var CryptoJS = require('../../../utils/util2.js');//引入加密算法


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

   
    screenWidth: app.globalData.sysinfo.screenWidth,//屏幕宽度
    screenHeight: app.globalData.sysinfo.screenHeight,//屏幕高度
    toView: '',//跳转到这里,

    switchID:null,//当前点击的开关ID

    switchData: app.globalData.gswitchData,//开关
    touchId:null,
    touchName:null,       //点击的开关名称
    showModal: false,
    inputText: "",


    changeName :false,
    changeOpen :false,
    chanegClose:false,


//时间
    dateTimeArray: null,
    dateTime: null,
    dateTime1: null,

    startYear: 2000,
    endYear: 2050

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
   
    console.log("开关页面加载");
    var that = this;
    that.data.client = app.globalData.client;//mqtt客户端


    this.setData({
      dateTime: obj.dateTime,
      dateTime1: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
     
      switchData: app.globalData.gswitchData,//开关
      // dateTimeArray1: obj.dateTimeArray,
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
    console.log("开关进入后台时。");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("开关页面注销。");
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
  
  /**
 * 弹出窗口显示
 */
  eject: function (event) {
    console.log(this.data.changeName);//点击 控制栏左边
    var switch_id = event.currentTarget.dataset.switchid;//开关ID
    console.log("rID:", switch_id);//点击 控制栏左边
    console.log("zID:", event.target.id);//点击 控制栏左边


    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      //清除上次点击修改数据
      switchID: switch_id ,
      changeName:false,
      changeOpen:false,
      chanegClose:false,
      dateTime: obj.dateTime,
      dateTime1: obj.dateTime,

      touchId:  Number(event.currentTarget.dataset.tapid),     //当前点击的ID
      inputText: event.currentTarget.dataset.name,    //防止点击了 但是没有修改
      touchName: event.currentTarget.dataset.name,    //当前点击名称
      showModal: true,
    
    })
    console.log(this.data.changeName);//点击 控制栏左边
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

    if (that.data.changeName){
      //更新输入新的名称
      // console.log("确定 点击修改名称");

      var setNameUrl = app.globalData.requestURL + "/saveName";
      wx.request({
        url: setNameUrl,
        method: 'POST',
        data: {
          session: app.globalData.globlesession,
          type: "switch",
          newName: that.data.inputText,
          id: Number(that.data.switchID)
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
        },
        success(res) {
          console.log(res.data);
          console.log(res);

          if(res.data=="ok"){
            app.toastTips1("修改成功", 1000);
         

            that.data.switchData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'switchData[' + index + '].switchName';
                that.setData({
                  [name]: that.data.inputText,
                })
              }
            });
            app.globalData.gswitchData[that.data.touchId].switchName = that.data.inputText;//全局变量

          }else{
            app.toastTips1("修改失败",1000);
          }
        },
        fail(res){
          app.toastTips1("修改失败", 1000);
        }
      })    
    }

    if (that.data.changeOpen){
      var time = this.data.dateTime;
      var realtime = this.data.dateTimeArray;
      var restime = "" + realtime[0][time[0]] + "-" + realtime[1][time[1]] + "-" + realtime[2][time[2]] + " " + realtime[3][time[3]] + ":" + realtime[4][time[4]] + ":" + realtime[5][time[5]];
 
  
      var swindex = String.fromCharCode(that.data.touchId+app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
      
      // var reqSaveTask= app.saveTask("开关任务",restime, topic, message);
      var name = "" + that.data.touchName+"打开";
      var restimeS = new Date(restime);
      console.log("选择的时间",restimeS);
      console.log("选择的时间2", restimeS.getTime());
      var message = "" +app.globalData.deviceUNID + restimeS.getTime()+ app.globalData.bleswitch + swindex + "t";


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
      console.log("确定 点击修改开始时间");
    }
    
    
    
    if (that.data.chanegClose) {

      var time = this.data.dateTime;
      var realtime = this.data.dateTimeArray;
      var restime = "" + realtime[0][time[0]] + "-" + realtime[1][time[1]] + "-" + realtime[2][time[2]] + " " + realtime[3][time[3]] + ":" + realtime[4][time[4]] + ":" + realtime[5][time[5]];
      var swindex = String.fromCharCode(that.data.touchId + +app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位
      var message = "" + swindex + "f";
      var taskUrl = app.globalData.requestURL + "/saveTask";
      var name = "" + that.data.touchName + "关闭";
      var restimeS = new Date(restime);
      console.log("选择的时间", restimeS);
      console.log("选择的时间2", restimeS.getTime());
      var message = "" + app.globalData.deviceUNID + restimeS.getTime() + app.globalData.bleswitch + swindex + "f";

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
      //     taskName: "开关任务",
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

      console.log("确定 点击修改关闭");
    }
   
  },



  //开关事件
  //如果有网络就走网络 如果没有就走蓝牙 如果都没有就提示
  switchChange: function (e) {
    var that = this;
    var swich_no = Number(e.target.id);
    var switch_id=e.currentTarget.dataset.switchid;//开关ID

    //转 ASCII 码减少数据位
    var index = String.fromCharCode(swich_no + app.globalData.charIndex.charCodeAt()); 
    var swich_tf = e.detail.value;
    console.log(e);

    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
   //设备ID+时间+操作码+地址码+数据码 BLE
    var blestr = "" + app.globalData.deviceUNID + nowtime + app.globalData.bleswitch + index + swich_tf ;
    
     
   //全局变量修改
    app.globalData.gswitchData[swich_no].switchState = swich_tf;
    var value=null;
    //如果 有设备数据 把当前值保存到数据库中
    if (app.globalData.haveDevice){
      console.log("保存 开关 的状态");
      if (swich_tf){
        value=1;
      }else{
        value=0;
      }
      //保存状态
      app.setDeviceInfo("switch", switch_id,value);
    }

   
    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }




  },


  /**
 * 获取input输入值
 */
  wish_put: function (e) {
  
    this.setData({
      changeName:true,            //修改
      inputText: e.detail.value   //修改名称
    })
    // console.log(this.data.changeName);//输入的内容
    // console.log(e.detail.value);//输入的内容
  },

  //时间相关函数
 
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
 
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },

  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      changeOpen:true,          //点击了修改开启时间
      dateTimeArray: dateArr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, 
    dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
     dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      chanegClose: true,          //点击了修改关闭时间
      dateTimeArray: dateArr
    });
  },

})