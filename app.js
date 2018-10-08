const host = 'https://www.9zhouzhi.cn';

var app = App({
  // 接口地址
  api: {
    town: `${host}/api/Organization/GetCity?cityId=d8b952c4-b885-4ca2-a73c-99b99697211f`,
    unit: `${host}/api/Organization/GetCity?cityId=c2cd267b-6d49-4914-a35d-e22a42ad0b39`,
    cun: `${host}/api/Organization/GetCity`,
    list: `${host}/api/Swgk/GetPageListJson`,
    listInfo: `${host}/api/Swgk/Get/`,
    getCard: `${host}/api/Swgk/BuTieDetails`,
    // getCard: `${host}/api/Swgk/Login`,
  },
  onLaunch: function () {
    
  },
  onShow: function () {
    
  },
  setJaData(data){
    
  },
  // 提示框
  alert: function (t) {
    wx.showModal({
      title: '提示',
      content: t,
      showCancel: false,
      confirmColor: '#000'
    })
  },
  // 询问提示框
  confirm: function (opt) {
    wx.showModal({
      title: '提示',
      content: opt.con,
      confirmColor: '#000',
      success: function (res) {
        if (res.confirm) {
          opt.ok()
        }
      }
    })
  },
  // 全局变量 
  globalData: {
    
  }
})