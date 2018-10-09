// pages/card/card.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  inputTyping: function (e) {
    console.log("输入", e)
    this.setData({
      cardNum: e.detail.value
    });
  },
  search1Fn: function (e) {
    // console.log("搜索事件", this.data.inputVal, e)
    // this.getData(this.data.inputVal);
  },
  goSubsidy: function(){
    var _self=this;
    wx.request({
      url: app.api.cardLogin + "?cardno=" + _self.data.cardNum,//150302194002111530
      method: 'post',
      success: function (res) {
        console.log("card", JSON.parse(res.data))
        var data = JSON.parse(res.data);
        if(data.type == 1) {
          wx.navigateTo({
            url: './subsidy/subsidy?card=' + data.resultdata.cardno
          })
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
    // wx.navigateTo({
    //   url: './subsidy/subsidy'
    // })
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