var ja = {
  /**
   * [_ja_data description]
   * @type {Object}
   */
  _ja_data: {
    device_info: {// 设备相关属性
      ja_uuid: '', //COOKIE ID
      unionid: '' //微信唯一ID
    },

    ja_version: '2.0.0', // JA版本
    app_version: '', // app版本
    appid: '', // APP标识符
    pageid: '___sys_page_undefined_id', //页面id
    userid: '' //微信用户ID
  },
  /**
   * 统一发送统计请求
   * @method _ja
   * @param  {String} opt.pageid
   * @param  {String} opt.eventit
   * @param  {Object} opt.data
   * @param  {String} opt.logtype
   * @param  {String} opt.subtype
   */
  _ja(opt) {
    var self = this;
    var data = this._ja_data,
      params = {
        device_info: data.device_info, // 设备相关属性
        ja_version: data.ja_version, // JA版本
        app_version: data.app_version, //app版本
        app_identifier:data.appid,  //APP标识符
        appid: data.appid, //APP标识符
        ja_uuid: data.ja_uuid, //COOKIE ID
        userid: data.userid, //微信用户ID

        time: new Date().getTime(), //时间戳
        // logtype: opt.logtype, //事件主类型 40：自定义事件 50页面事件
        // subtype: opt.subtype //事件子类型（当logtype是页面事件50时为1）
        ...opt
      };
    if (opt.pageid) { //页面id
      params.pageid = opt.pageid;
      data.pageid = opt.pageid;
    } else {
      params.pageid = data.pageid;
    }
    if (opt.data) { //事件所携带的数据
      params.data = opt.data;
    } else {
      params.data = {}
    }
    if(opt.title){
      params.title = opt.title
    }
    wx.request({
      method: 'POST',
      url: 'https://ja.jiajuol.com/wxxcx/pv',
      data: params,
      success: function (res) {
      }
    });
  },
  /**
   * 自定义事件统计
   * @method _ja_record_custom
   * @param  {String}  opt.subtype
   */
  _ja_record_custom(opt) {
    this._ja({
      logtype: '40',
      subtype: opt.subtype,
      data: opt.data,
      ...opt
    })
  },
  /**
   * 初始化设置APPID
   * @method init
   * @param  {String|Number}
   */
  ja_init(appid, version) {
    var self = this;
    self._ja_data.appid = appid || '';
    self._ja_data.app_version = version || '1.0.0';

    //获取 ja_uuid
    try {
      var ja_uuid = wx.getStorageSync('ja_uuid');
      if (!ja_uuid) {
        ja_uuid = self.md5.hex_md5(String(new Date().getTime()) + Math.ceil(Math.random() * 1000));
        wx.setStorageSync('ja_uuid', ja_uuid);
      }
      self._ja_data.device_info.ja_uuid = ja_uuid;
    } catch (e) {console.log(e) }

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        for (var x in res) {
          if (x != 'errMsg') {
            self._ja_data.device_info[x] = res[x];
          }
        }
      }
    });

    // 获取网络类型
    wx.getNetworkType({
      success: function (res) {
        self._ja_data.device_info.networkType = res.networkType;
      }
    });
  },
  /**
   * 设置通用参数
   * @method set
   * @param  {Object} opt 自定义数据
   */
  ja_set(opt) {
    for (var x in opt) {
      this._ja_data[x] = opt[x];
    }
  },
  /**
   * 打开新页面，页面ID，页面数据
   * @method ja_record_page
   * @param  {String}  opt.pageid  页面ID
   * @param {Object}  opt.data 页面数据
   */
  ja_record_page(opt) {
    this._ja({
      logtype: '50',
      subtype: '1',
      pageid: opt.pageid,
      title:opt.title,
      data: opt.data
    });
  },
  /**
   * 提交线索
   * @method ja_submit_clue
   * @param  {Object}
   */
  ja_submit_clue(data){
    this._ja_record_custom({
      subtype: '__sys_user_commit_clue',
      data: data
    });
  },
  /**
   * 切换后台
   * @method ja_app_enter_background
   */
  ja_app_enter_background() {
    this._ja_record_custom({
      subtype: '__sys_app_enter_background'
    });
  },
  /**
   * 切换前台
   * @method ja_app_enter_foreground
   */
  ja_app_enter_foreground() {
    var self = this;
    setTimeout(function(){
      self._ja_record_custom({
        subtype: '__sys_app_enter_foreground'
      });
    },100);
  },
  /**
   * 注册
   * @method ja_user_register
   * @param  {Object}
   */
  ja_user_register(data) {
    this._ja_record_custom({
      subtype: '__sys_user_register',
      data: data
    })
  },
  /**
   * 登录
   * @method ja_user_login
   * @param  {Object}
   */
  ja_user_login(data) {
    this._ja_record_custom({
      subtype: '__sys_user_login',
      data: data
    })
  },
  /**
   * 注销
   * @method ja_user_logout
   * @param  {Object}
   */
  ja_user_logout(data) {
    this._ja_record_custom({
      subtype: '__sys_user_logout',
      data: data
    })
  },
  /**
   * GPS事件
   * @method ja_set_location
   */
  ja_set_location() {
    var self = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        self._ja_record_custom({
          subtype: '__sys_app_location',
          data: {
            'longitude': res.longitude,
            'latitude': res.latitude,
            'double': "__sys_decare_tencent"
          }
        });
      }
    })
  }
}

module.exports = ja;