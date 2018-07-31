const md5 = require('./js/md5.js');
const ja = require('./js/ja.js');
const host = 'https://api.jiajuol.com/partner/';
const appname = 'wx_xcx_jjjpal';

var app = App({
  // 接口地址
  api: {
    //提交预约
    yuyue: `${host}crm_apply.php`,
    //条件   'all' => '全部','style' => '风格','space' => '空间','housetype' => '户型','area' => '面积','price' => '预算','section' => '局部'
    condition: `${host}weixin/common/condition_list.php`,
    //案例列表
    subjectList: `${host}weixin/subject/subject_list.php`,
    //案例详情
    subjectInfo: `${host}weixin/subject/subject_info.php`,
    // 搜索
    search: `${host}weixin/search/search.php`,
    //设计师详情
    designerInfo: `${host}weixin/designer/designer_info.php`,
    //图库列表
    picList: `${host}weixin/pic_list/pic_list.php`,
    //收藏人头像列表
    favoriteInfo: `${host}weixin/user/fav_user_list.php`,
    //他收藏的案例
    taSubject: `${host}weixin/user/user_collect_subject_list.php`,
    //他收藏的效果图
    taPic: `${host}weixin/user/user_collect_pic_list.php`,
    // 用户接口
    user: `${host}user/index.php`,
    // checkLogin: `${host}user/index.php`,
    //获取图形验证码
    // imgCode: `${host}user/index.php?action=get_verify_code_for_login&app_name=${appname}`,
    // 获取手机验证码
    // phoneCode: `${host}user/index.php`,
    // 微信+手机帐号登录
    // quickLogin: `${host}user/index.php`,
    // 添加删除收藏
    resetLike: `${host}weixin/user/save_favorite.php`,
    //意见反馈
    feedback: `${host}weixin/common/feedback.php`
  },
  md5: md5,
  sign: function (params) {
    params.app_name = appname;
    var expireTs = Math.floor(new Date().getTime() / 1000 + 300); //签名失效时间点（unix时间戳，单位秒） 5分钟;
    var tmp = '';
    var delimiter = ''; //签名参数分隔符

    // 对参数名进行字典排序  
    var array = new Array();
    for (var key in params) {
      array.push(key);
    }
    array.sort();

    //md5
    for (var k in array) {
      delimiter = (tmp === '') ? '' : '&';
      tmp += delimiter + array[k] + '=' + params[array[k]];
    }
    params.sign = md5.hex_md5('859d2acfe7a6fac387ecd36656cf2386' + '&' + expireTs + '&' + tmp).substr(12, 8) + expireTs;
    return params;
  },
  onLaunch: function () {
    var self = this;
    self.ja_init("wx2c3e9a7b34e9a9b9","1.1.4");
  },
  onShow: function () {
    var self = this;
    try{
      self.setJaData(wx.getStorageSync('userInfo'));
    }catch(e){}
    this.ja_app_enter_foreground();
    this.ja_set_location();
  },
  setJaData(data){
    this._ja_data.userid = data.user_base_id;
    this._ja_data.device_info.unionid = data.unionid;
  },
  onHide: function () {
    this.ja_app_enter_background();
    this.ja_set_location();
  },
  login: function (result,callback) {
    // 新登录方式
    var self = this;
    try {
      var value = wx.getStorageSync('userInfo');
      if (value) {
        if (typeof callback == 'function') {
          self.setJaData(value);
          callback(value);
        }
      } else {
        wx.login({
          success: function (res) {
            if (res.code) {
              var jscode = res.code;
              if (result.detail.errMsg == "getUserInfo:ok"){
                  wx.request({
                      url: self.api.user,
                      data: {
                          encryptedData: result.detail.encryptedData,
                          iv: result.detail.iv,
                          action: 'wx_union_login',
                          app_name: appname,
                          jscode: jscode
                      },
                      success: function (res) {
                          self.globalData.userInfo = res.data.data;
                          try {
                              wx.setStorageSync('userInfo', res.data.data);
                              res.data.data.userid = res.data.data.user_base_id;//统一字段对接大数据
                              res.data.data.username = res.data.data.unionid;//统一字段对接大数据
                              self.setJaData(value);
                              self.ja_user_login(res.data.data);
                              if (typeof callback == 'function') {
                                  callback(res.data.data);
                              }

                              //绑定手机号码 暂时不好使
                              // if (res.data.data.phone_login==0){
                              //   self.confirm({
                              //     con:'系统检测到您没有绑定过手机号码，是否现在去绑定？',
                              //     ok:function(){
                              //       wx.switchTab({
                              //         url:'/pages/user/user'
                              //       })
                              //     }
                              //   })
                              // }
                          } catch (e) { console.log(e) }
                      }
                  });
              }
              
            }
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  // 退出登录
  loginOut: function () {
    try {
      wx.removeStorageSync('userInfo');
    } catch (e) {
      // Do something when catch error
    }
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
  //收藏功能
  resetLike: function (opt) {
    var self = this, loginInfo;
    if (opt.auth.detail.errMsg == "getUserInfo:ok"){
        try {
            self.globalData.userInfo = wx.getStorageSync('userInfo');
        } catch (e) { }
        loginInfo = self.globalData.userInfo;
        if (!loginInfo) {
            self.login(opt.auth,function (data) {
                loginInfo = data;
                fn();
            });
            return;
        }
        if (opt.cat == "del_subject" || opt.cat == "del_photo") {
            self.confirm({
                con: "确认要删除该收藏？",
                ok: function () {
                    fn();
                }
            })
        } else {
            fn();
        }
    }else{
        self.confirm({
            con: "小程序内需要您允许访问用户信息,是否现在设置？",
            ok: function () {
                if (wx.openSetting) {
                    wx.openSetting();
                }
            }
        })
    }


    function fn() {
      wx.request({
        url: self.api.resetLike,
        data: self.sign({
          act: opt.cat,
          id: opt.id,
          user_base_id: loginInfo.user_base_id,
          auth_token: loginInfo.auth_token
        }),
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.status == 1004) {
            self.loginOut();
            self.login(function (data) {
              loginInfo = data;
              fn();
            });
            return;
          }
          if (typeof opt.callback == 'function') {
            opt.callback(res);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500
            });
          }
        }
      })
    }
  },
  // 全局变量 
  globalData: {
    appname:appname,
    kefu: "18513092059" //客服电话
  },
  ...ja  
})