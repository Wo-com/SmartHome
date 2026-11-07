// 数据请求 wx.request
var sendRrquest = function (url, method, data, header) {
  var status = true;

  var promise = new Promise(function (resolve, reject) {
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型2g，3g，4g，wifi, none, unknown
        var networkType = res.networkType
        if (networkType == "none") {
          console.log('网络连接失败,请检查您的网络设置');
          status = false;
        } else if (networkType == "unknown") {
          console.log('未知的网络类型,请检查您的网络设置');
          status = false;
        } else {
          wx.request({
            url: url,
            data: data,
            method: method,
            header: header,
            success: function (res) {resolve(res.data);},
            fail: function(res) {
              reject(res.errMsg);
            },
          })

        }
      }
    })
    return status
  });
  return promise;
};


// header 头部
function reqHeader() {
  var header = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  return header
}




// 把方法暴露接口出来供别的页面使用[前面为名字，后面为方法]
module.exports = {
  reqHeader: reqHeader,
  sendRrquest: sendRrquest,
}

