// pages/Control/Cinfredcont/Cinfredcont.js
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
    navtop: app.globalData.navTop,       //顶部栏高度
    navheigh: app.globalData.navHeight,  //顶部栏高度
    irData:app.globalData.girData,               //红外遥控



    changeName:false,
    changeCode:false,
    changeTime:false,

    irID:null,//红外ID

    touchTopic: null,      //当前主题
    touchId: null,
    touchName: null,       //点击的开关名称
    inputText: "",         //输入的名字
    touchCode:"",           //输入编码

   //弹出框
    showModal: false,
    // pwmData: null,
    // pwmindex: 11,

    //时间
    dateTimeArray: null,
    dateTime: null,
    // dateTime1: null,
    startYear: 2000,
    endYear: 2050,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("遥控页面加载");
    
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
   
   
    that.setData({
      
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,

      client : app.globalData.client,
      irData: app.globalData.girData ,              //红外遥控
    });

    

  },
/**
 *点击事件
*/
  sentIR:function(tapE){


    var code = parseInt(tapE.currentTarget.dataset.code);//转10进制

    //时间参数
    var timeObj = new Date()
    var nowtime = timeObj.getTime();
    var blestr = "" + app.globalData.deviceUNID + nowtime + app.globalData.bleirCont+ "V"+code;
    
    console.log(blestr);
   
    if (app.globalData.bleConnect) {          //如果蓝牙连接 蓝牙发送 
      app.sentOrder(blestr);
    } else {   //如果mqtt连接  mqtt发送
      app.sentMQTT(blestr);
    }

  },


/**
 * 长按
*/
  setInf: function (event) {
    console.log(event);
    this.setData({
      showModal:true,

      changeName: false,
      changeCode: false,
      changeTime: false,

      // dateTime1: obj.dateTime,
      irID: event.currentTarget.dataset.id,       //红外ID
      touchId:Number(event.currentTarget.dataset.autoid),                        //当前点击的ID
      touchTopic: event.currentTarget.dataset.topic,
      inputText: event.currentTarget.dataset.name,    //防止点击了 但是没有修改
      touchCode:event.currentTarget.dataset.code,
      touchName: event.currentTarget.dataset.name,    //当前点击名称
    })
  },


  /**
* 获取input输入值
*/
  wish_input: function (e) {

    this.setData({
      changeName: true,            //修改
      inputText: e.detail.value   //修改名称
    })
    // console.log(this.data.changeName);//输入的内容
    console.log(e.detail.value);//输入的内容
  },
  /**
* 获取input输入值
*/
  wish_input_code: function (e) {

    this.setData({
      changeCode: true,            //修改
      touchCode: e.detail.value   //修改名称
    })
    // console.log(this.data.changeName);//输入的内容
    console.log("code:",e.detail.value);//输入的内容
  },

  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
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
          type: "ir",
          newName: that.data.inputText,
          id: Number(that.data.irID)
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
        },
        success(res) {
          console.log(res.data);
          console.log(res);

          if (res.data == "ok") {
            app.toastTips1("修改成功", 1000);

            that.data.irData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'irData[' + index + '].irName';
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

    if (that.data.changeCode) {
      //更新输入新的编码
      console.log("确定 点击修改编码");

      var setNameUrl = app.globalData.requestURL + "/saveName";
      wx.request({
        url: setNameUrl,
        method: 'POST',
        data: {
          session: app.globalData.globlesession,
          type: "irCode",
          newName: that.data.touchCode,
          id: Number(that.data.irID)
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
        },
        success(res) {
          console.log(res.data);
          console.log(res);

          if (res.data == "ok") {
            app.toastTips1("修改成功", 1000);

            that.data.irData.forEach(function (val, index) {
              if (　parseInt(that.data.touchId) == index) {
                var name = 'irData[' + index + '].irCode';
                that.setData({
                  [name]: that.data.touchCode,
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

    if (that.data.changeTime){
   
      var time = this.data.dateTime;
      var realtime = this.data.dateTimeArray;
      var restime = "" + realtime[0][time[0]] + "-" + realtime[1][time[1]] + "-" + realtime[2][time[2]] + " " + realtime[3][time[3]] + ":" + realtime[4][time[4]] + ":" + realtime[5][time[5]];

      var swindex = String.fromCharCode(2 +app.globalData.charIndex.charCodeAt());//转 ASCII 码减少数据位

      var name = "" + that.data.touchName + "点击";
      var restimeS = new Date(restime);
      console.log("选择的时间", restimeS);
      console.log("选择的时间2", restimeS.getTime());
      var message = "" + app.globalData.deviceUNID + restimeS.getTime() + app.globalData.bleirCont + swindex + "t";


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

  /**
     * 点击返回按钮隐藏
     */
  back: function () {
    this.setData({
      showModal: false
    })
  },

 
})