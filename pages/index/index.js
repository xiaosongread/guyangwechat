// pages/index/index.js
var app = getApp();
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://gw.alicdn.com/tfs/TB13kEnx21TBuNjy0FjXXajyXXa-2224-1018.png',
      'https://www.songyanbin.com/public/images/uploadcache/songyanbin/1515591459218.png'
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,


    townList: [],
    unitList:[]
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
    _self = this;
    this.getTown();
    this.getUnit();
  },
  getTown: function () {
    wx.request({
      url: app.api.town,
      method: 'get',
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data)
        _self.setData({
          townList: data.resultdata
        })
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  getUnit: function () {
    wx.request({
      url: app.api.unit,
      method: 'get',
      success: function (res) {
        var data = JSON.parse(res.data)
        _self.setData({
          unitList: data.resultdata
        })
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  goVillage: function (e) {
    wx.navigateTo({
      url: '../village/village?twonid=' + e.currentTarget.dataset.twonid
    })
  },
  goUnit: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../cun/cun?orgId=' + e.currentTarget.dataset.id
    })
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