// pages/list/list.js
var app = getApp();
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal:'',
    category:'',
    orgId:'',
    listData:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("22", options)
    this.setData({
      category: options.category,
      orgId: options.orgId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _self = this;
    this.getData();
  },
  getData: function (keyWord) {
    wx.request({
      url: app.api.list,
      method: 'get',
      data: {
        orgId: _self.data.orgId,
        category: _self.data.category,
        pageindex:1,
        pagesize:10,
        keyWords: keyWord || ''
      },
      success: function (res) {
        console.log("res",JSON.parse(res.data))
        _self.setData({
          listData: JSON.parse(res.data).resultdata.rows
        })
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  goInfo: function (e) {
    var url = app.host + '/Home/details/' + e.currentTarget.dataset.id;
    console.log('url',url)
    wx.navigateTo({
      url: './info/info?url=' + url
    })
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
  searchFn: function () {
    console.log("搜索事件", this.data.searchKeyWord)
    this.getData(this.data.inputVal);
  },
  inputTyping: function (e) {
    console.log("输入",e)
    this.setData({
      inputVal: e.detail.value
    });
  },
  search1Fn: function (e) {
    console.log("搜索事件", this.data.inputVal,e)
    this.getData(this.data.inputVal);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("到底部了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})