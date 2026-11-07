// pages/funtionPage/funtionPage.js
var app = getApp();

// 字符串转byte
function stringToBytes(str) {
  var strArray = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    strArray[i] = str.charCodeAt(i);
  }
  const array = new Uint8Array(strArray.length)
  strArray.forEach((item, index) => array[index] = item)
  return array.buffer;
}

// ArrayBuffer转16进制字符串示例
function ab2hext(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
//16进制转字符串
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



Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度

    
    textLog: "",
    deviceId: "",
    name: "",
    allRes: "",
    serviceId: "",
    readCharacteristicId: "",
    writeCharacteristicId: "",
    notifyCharacteristicId: "",
    connected: true,
    canWrite: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var devid = decodeURIComponent(options.deviceId);
    var devname = decodeURIComponent(options.name);
    var devserviceid = decodeURIComponent(options.serviceId);
    var log = that.data.textLog + "设备名=" + devname + "\n设备UUID=" + devid + "\n服务UUID=" + devserviceid + "\n";
    this.setData({
      textLog: log,
      deviceId: devid,
      name: devname,
      serviceId: devserviceid
    });
    //获取特征值
    that.getBLEDeviceCharacteristics();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("关闭蓝关闭关闭");
    console.log("BLE发送数据进入后台时。");


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that=this;
    console.log("Ble发送页面注销。");
    wx.notifyBLECharacteristicValueChange({
      state: false, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
    });
  },
  

  /*返回按钮*/
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  //清空log日志
  startClear: function () {
    var that = this;
    that.setData({
      textLog: ""
    });
  },
  //返回蓝牙是否正处于链接状态
  onBLEConnectionStateChange: function (onFailCallback) {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      return res.connected;
    });
  },
  //断开与低功耗蓝牙设备的连接
  closeBLEConnection: function () {
    var that = this;
    app.globalData.bleDeviceId = "close";  //设置任意字符
    app.globalData.bleConnect = false;     //蓝牙断开标志
    wx.closeBLEConnection({
      deviceId: that.data.deviceId
    })
    that.setData({
      connected: false,

    });
    wx.showToast({
      title: '连接已断开',
      icon: 'success'
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },
  //获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics: function (order) {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success: function (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {//该特征值是否支持 read 操作
            var log = that.data.textLog + "该特征值支持 read 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              readCharacteristicId: item.uuid
            });
          }
          if (item.properties.write) {//该特征值是否支持 write 操作
            var log = that.data.textLog + "该特征值支持 write 操作:" + item.uuid + "\n";

            app.setWriteCharacter(item.uuid);//设置全局变量

            that.setData({
              textLog: log,
              writeCharacteristicId: item.uuid,
              canWrite: true
            });

          }
          if (item.properties.notify || item.properties.indicate) {//该特征值是否支持 notify或indicate 操作
            var log = that.data.textLog + "该特征值支持 notify 操作:" + item.uuid + "\n";

            app.setNotifyCharacter(item.uuid);//设置全局变量

            that.setData({
              textLog: log,
              notifyCharacteristicId: item.uuid,
            });
            that.notifyBLECharacteristicValueChange();
          }

        }

      }
    })
    // that.onBLECharacteristicValueChange();   //监听特征值变化
  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success: function (res) {
        var log = that.data.textLog + "notify启动成功" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
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
      var log0 = that.data.textLog + "成功获取：" + resValueStr + "\n";

      console.log(log0);//接收数据

      that.setData({
        textLog: log0,
      });

    });
  },
  //orderInput
  orderInput: function (e) {
    this.setData({
      orderInputStr: e.detail.value
    })
  },

  //发送指令
  sentOrder: function () {
    var that = this;
    var orderStr = that.data.orderInputStr;//指令
    let order = stringToBytes(orderStr);

    let byteLen = order.byteLength;//长度
    let pos=0;       //字符位置

    let tempBuffer;   //一次发送的数据
    var i=0;          //计数

    //为了安全每次发送18个字节 (每次最多20个)
    while(byteLen>0){
      i++;
      if(byteLen>18){
        tempBuffer=order.slice(pos,pos+18);
        pos+=18;
        byteLen-=18;
        console.log("第",i,"次发送:",tempBuffer);
        that.writeBLECharacteristicValue(tempBuffer);
      }else{
        tempBuffer=order.slice(pos,pos+byteLen);
        pos+=byteLen;
        byteLen-=byteLen;
        console.log("第", i, "次发送:",tempBuffer);
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
    let byteLength = order.byteLength;
    var log = that.data.textLog + "当前执行指令的字节长度:" + byteLength + "\n";
    that.setData({
      textLog: log,
    });

    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      value: order.slice(0, 20),
      success: function (res) {
        if (byteLength > 20) {
          setTimeout(function () {
            // that.writeBLECharacteristicValue(order.slice(20, byteLength));
          }, 150);
        }
        var log = that.data.textLog + "写入成功：" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      },

      fail: function (res) {
        var log = that.data.textLog + "写入失败" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      }

    })
  },
  ///////

/*当点击输入框时   输入框随着键盘上移动 其他容器位置不变*/
  foucus: function (e) {
    var that = this;
    that.setData({
      inputBottom: e.detail.height
    })
  },


  //失去聚焦
  blur: function (e) {
    var that = this;
    that.setData({
      inputBottom: 20
    })
  },
  ///////

})