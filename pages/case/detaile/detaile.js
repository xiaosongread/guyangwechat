var app = getApp();
var $ = require('../../../js/util.js');
Page({
    data: {
        homeBtn: false,
        id:0,
        f_data: [], //收藏数据
        f_page_cur: 1, // 收藏数据当前页码
        f_page_count: null, //收藏页码总数
        f_page_size: 10, // 收藏每页数据条数
        f_count: null, //收藏总数
        f_btn_loading: false, //收藏列表加载按钮状态
        f_more_hide: false, //加载更多隐藏开关
        loginInfo:null,
        isLike:false
    },
    onLoad: function(e) {
        console.log(e)
        //初始化数据
        var value=null;
        try {value = wx.getStorageSync('userInfo')} catch (e) {}
        // console.log(value)
        this.setData({
            loginInfo:value,
            id:e.caseId,
            homeBtn: e.share || false
        });
        this.getData();
    },
    onShow:function(){
      
    },
    // 分享
    onShareAppMessage: function () {
      return {
        title: this.data.data.subject,
        path: '/pages/case/detaile/detaile?share=1&caseId=' + this.data.id
      }
    },
    //加载数据
    getData: function(callback) {
        var self = this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });

        var params = app.sign({
          subject_id: self.data.id,
          user_base_id: self.data.loginInfo ? self.data.loginInfo.user_base_id : 0
        });
        wx.request({
            url: app.api.subjectInfo,
            data: params,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                // console.log(res);
                self.setData({
                    data: res.data.data,
                    isLike:res.data.data.is_fav
                });
                wx.hideToast();
                // 加载收藏数据
                self.getFavoriteInfo();
                console.log(self.data)
                var msg = ()=>{
                    var jz_type = self.data.data.type_name ? self.data.data.type_name : ""
                    var jz_style = self.data.data.style_name ? self.data.data.style_name:''
                    var jz_area = self.data.data.area ? self.data.data.area+'平米':'0平米'
                    var jz_price = self.data.data.price_name ? self.data.data.price_name : ''
                    return jz_type + '_' + jz_style + '_' + jz_area + '_' + jz_price
                }
                app.ja_record_page({
                    pageid: 'detailes_case',
                    data: {
                        id: self.data.id
                    },
                    title: msg()
                });
            }
        });
        app.globalData.jaParams = params
    },
    yuyue: function() {
        wx.navigateTo({
            url: '../../yuyue/index/index'
        });
    },
    //跳转设计师详情
    goToDesigner: function() {
        wx.navigateTo({
            url: '../../designer/designer?designerId='+this.data.data.designerid
        });
    },
    // 跳转大图预览页面
    previewImage: function(e) {
        var data = [];
        $.each(this.data.data.photo_list, function(i, d) {
            data.push(d.photo_url_l)
        });
        wx.previewImage({
          current:data[e.currentTarget.dataset.index], // 当前显示图片的http链接
          urls: data // 需要预览的图片http链接列表
        })
    },
    getFavoriteInfo: function() {
        var self = this;
        self.setData({
            f_btn_loading: true
        });
        wx.request({
            url: app.api.favoriteInfo,
            data: app.sign({
                type: "subject",
                id: self.data.id,
                page: self.data.f_page_cur,
                page_size: self.data.f_page_size
            }),
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                // console.log(res);
                var data = res.data.data,
                    arr = self.data.f_data;
                self.setData({
                    f_data: arr.concat(data.list),
                    f_page_cur: data.page, // 收藏数据当前页码
                    f_page_count: data.page_count, // 总页数
                    f_count: data.count, //收藏总数
                    f_btn_loading: false
                });
            }
        })
    },
    getFavorite: function() {
        var self = this;
        if (self.data.f_page_cur < self.data.f_page_count) {
            self.setData({
                f_page_cur: self.data.f_page_cur + 1
            });
            self.getFavoriteInfo();
            if (self.data.f_page_cur == self.data.f_page_count) {
                self.setData({
                    f_more_hide: true
                });
            }
        }
    },
    goTaPage: function(e) {
        wx.navigateTo({
            url: '../../tapage/tapage?id='+e.currentTarget.dataset.id+"&name="+e.currentTarget.dataset.name+"&url="+e.currentTarget.dataset.src
        });
    },
    addLike:function(){
        var self=this;
        app.resetLike({
            cat:'add_subject',
            id:self.data.id,
            callback:function(res){
                if(res.data.status==1){
                    wx.showToast({
                      title:"收藏成功",
                      icon: 'success',
                      duration: 1500
                    });
                    self.setData({
                        f_count:++self.data.f_count,
                        isLike:true
                    });
                }else{
                    wx.showToast({
                      title:res.data.msg,
                      icon: 'success',
                      duration: 1500
                    });
                }
            }
        })
    }
})
