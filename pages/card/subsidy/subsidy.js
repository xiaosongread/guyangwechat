// pages/card/subsidy/subsidy.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardno: "",
    info:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options1", options)
    this.setData({
      cardno: options.card
    });
    var _self = this;
    wx.request({
      url: app.api.getCard + "?cardno=" + _self.data.cardno+"&type=1",//150302194002111530
      method: 'post',
      success: function (res) {
        console.log("1111", JSON.parse(res.data))
        var data = JSON.parse(res.data);
        if (data.type == 1) {
          _self.setData({
            info: data.resultdata
          });
        } else {
          wx.showToast({
            title: data.message,
            icon: "none"
          })
        }
        // _self.setData({
        //   listData: JSON.parse(res.data).resultdata.rows
        // })
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