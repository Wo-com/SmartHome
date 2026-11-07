const app = getApp()
Page({
  data: {

    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度

    screenWidth: app.globalData.sysinfo.screenWidth,//屏幕宽度
    screenHeight: app.globalData.sysinfo.screenHeight,//屏幕高度



    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [{ name: "蓝牙", id: 0, illustrate:"1、安卓设备扫描不到蓝牙\n 安卓设备需要给微信授权定位服务（只需授权即可，无需打开定位）\n\n2、已经连接上蓝牙但是无法控制设备\n 解决办法：退出小程序关闭蓝牙再打开蓝牙，再次进入小程序连接设备。" }, 
      { name: "Wi-Fi", id: 1, illustrate:"1、给设备配置Wi-Fi网络\n设备如需实现远程控制功能需要让设备连接到Wi-Fi网络"}, 
      { name: "激活设备", id: 2,illustrate:"1、激活须知:\n一个用户可以激活多台设备，一台设备也可以被多人激活，第一个激活设备的用户拥有对设备的最高控制权限。" }, 
      { name: "权限分配", id: 3, illustrate: "1、只有管理员才能给其它用户分配权限。\n2、管理员可以给字节分配权限，\n3、管理员可以给该设备的其它用户分配权限" },  
      { name: "任务管理", id: 4, illustrate: "1、任务由控制器界面产生。\n2、控制器界面包括开关界面，电机界面，遥控界面。\n3、点击控制器的名称即可设置相应的任务。" }, 
      {
        name: "控制说明", id: 5, illustrate: "1、如果Wi-Fi和蓝牙同时连接发送控制信号，蓝牙数据优先。\n2、如果我 Wi-Fi和蓝牙数据同时连接接收传感器数据，蓝牙优先。"
      }, {
        name: "预留接口", id: 6, illustrate: "1、本设计目前可以控制40个开关，本来可以更多，但目前没必要。\n2、 一共有4个PWM电机接口可以控制需要调速的电机。\n3、两个舵机接口可以控制门锁，窗口等。\n4、5个遥控按键可以随意更改按键编码。\n6、预留红外接收器接口，但没有开发（出于安全考虑）。"
      }, {
        name: "传感器", id: 7, illustrate: "1、目前确定的传感器有温度湿度传感器。空气检测器。\n2、预留8个电阻传感器确定的有土壤湿度传感器，雨水传感器，剩下6个可以是光敏、声音等传感器。"
      }],
    // list: [{ name: "蓝牙", id: 0 }, { name: "配置设备Wi-Fi", id: 1 }],
    load: true
  },
  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})