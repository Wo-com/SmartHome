// pages/Control/Ftask/Ftask.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从全局变量获取状态栏高度
    navimage: app.globalData.navImage,   //顶部图片
    navtop: app.globalData.navTop,      //顶部栏高度
    navheigh: app.globalData.navHeight, //顶部栏高度
    
    taskID:null,            //任务ID
    touchId: null,                        //当前点击的ID
    task:app.globalData.gTask           //任务
  },
  /*返回按钮*/
  backPage: function () {
    console.log("点击");
    wx.navigateBack({
      delta: 1
    });
  },
  
  /*删除数组**/
  deleteArr :function (delIndex) {
    var temArray = [];
    for (var i = 0; i < this.length; i++) {
      if (i != delIndex) {
        temArray.push(this[i]);
      }
    }
    return temArray;
  },


  deletetask:function(e){
    console.log(e);
    var that=this;


    //点击的ID
    that.setData({
      touchId: e.target.id,
      taskID: e.currentTarget.dataset.taskid
    });


    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          console.log('确定')

          // that.delTask(Number(that.data.taskID));//删除设备
          var delTaskUrl = app.globalData.requestURL + "/delTask";
          wx.request({
            url: delTaskUrl,
            method: 'POST',
            data: {
              session: app.globalData.globlesession,
              taskID: Number(that.data.taskID) ,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded" // 使用这个能正常获取数据
            },
            success(res) {
              console.log(res);
              if (res.data ==="ok"){
                wx.showToast({
                  title: '删除成功',
                  duration: 1000,
                  mask: true   //是否有透明蒙层，默认为false 
                  //如果有透明蒙层，弹窗的期间不能点击文档内容 
                })


                var id = e.target.id;
                var arr = that.data.task;
                var array = [];
                for (var i = 0; i < arr.length; i++) {
                  if (i != id) {
                    array.push(arr[i]);
                  }
                }
                app.globalData.gTask = array;//全局数据更新
                that.setData({
                  task: array,
                  touchId: e.target.id,
                  taskID: e.currentTarget.dataset.taskid
                });


              }else{
                wx.showToast({
                  title: '删除失败',
                  duration: 1000,
                  mask: true   //是否有透明蒙层，默认为false 
                  //如果有透明蒙层，弹窗的期间不能点击文档内容 
                })
              }

            }
          })

        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      task: app.globalData.gTask  
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