var app=getApp();
Page({
    data: {
        data:[],//数据
        house_type:0,//户型
        house_style:0,//风格
        house_area:0,//面积
        tabTxt:['户型','风格','面积'],//tab文案
        tab:[true,true,true],
        page:1,//当前页码
        page_count:0,//总页数
        dataNull:true,
        flag:false //无限加载开关
    },
    onShow: function () {
      
    },
    onHide: function () {
    
    },
    // 分享
    onShareAppMessage: function () {
        return {
            title:'家居在线',
            desc:'家居在线，中国领先的家居家装服务垂直网站，网站拥有近10年的发展历史，为广大用户提供一站式家居生活服务。家居在线致力于以家居家装设计信息为依托，提供主材包服务、整装服务、施工服务、建材团购服务四大服务，为广大业主提供透明、保障、省心、省钱的装修服务!',
            path: '/pages/case/list/list'
        }
    },
    onReady: function() {
        //初始化数据
        var self=this;
        self.getFilter();
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration:10000
        });
        // wx.getNetworkType({
        //     success: function(res) {
        //         var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
        //         // console.log(networkType);
        //     }
        // })
    },
    onReachBottom:function(){
        var self = this;
        if(self.data.flag&&self.data.page_count>self.data.page){
            self.setData({
                flag:false
            });
            self.getMore();
        }
    },
    // 搜索
    search:function(){
        wx.navigateTo({
          url: '../../search/search?cat=1'
        });
    },
    // 选项卡
    filterTab:function(e){
        var data=[true,true,true],index=e.currentTarget.dataset.index;
        data[index]=!this.data.tab[index];
        this.setData({
            tab:data
        })
    },
    // 获取筛选项
    getFilter:function(){
        var self=this;
        wx.request( {
            url:app.api.condition,
            data: app.sign({
                type:'housetype-style-area'
            }),
            header: {
                'Content-Type': 'application/json'
            },
            success: function( res ) {
                self.getData();
                self.setData({
                    filterList:res.data.data
                }); 
            },
            fail:function(){
                console.log('error!!!!!!!!!!!!!!')
            }
        })
    },
    //筛选项点击操作
    filter:function(e){
        var self=this,id=e.currentTarget.dataset.id,txt=e.currentTarget.dataset.txt,tabTxt=this.data.tabTxt;
        switch(e.currentTarget.dataset.index){
            case '0':
                tabTxt[0]=txt;
                self.setData({
                    page:1,
                    data:[],
                    tab:[true,true,true],
                    tabTxt:tabTxt,
                    house_type:id
                });
            break;
            case '1':
                tabTxt[1]=txt;
                self.setData({
                    page:1,
                    data:[],
                    tab:[true,true,true],
                    tabTxt:tabTxt,
                    house_style:id
                });
            break;
            case '2':
                tabTxt[2]=txt;
                self.setData({
                    page:1,
                    data:[],
                    tab:[true,true,true],
                    tabTxt:tabTxt,
                    house_area:id
                });
            break;
        }
        //数据筛选
        self.getData();
    },
    //加载数据
    getData:function(callback){
        var self = this;
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration:10000
        });
        var params = app.sign({
                page:self.data.page,
                page_size:10,
                house_type:self.data.house_type,
                house_style:self.data.house_style,
                house_area:self.data.house_area
            })
        wx.request( {
            url:app.api.subjectList,
            data: params,
            header: {
                'Content-Type': 'application/json'
            },
            success: function( res ) {
                if(res.data.status=="1"){
                    if(res.data.page_count){
                        var datas=self.data.data.concat(res.data.data);
                        self.setData({
                            data:datas,
                            page_count:res.data.page_count,
                            flag:self.data.page<res.data.page_count,
                            dataNull:true
                        });
                    }else{
                        self.setData({
                             dataNull:false
                        });  
                    }
                }
            },
            complete:function(){
                wx.hideToast();
            }
        });
        var forname = (d,id)=>{
            if (!self.data.filterList){
                return '不限'
            }
            for (var a in self.data.filterList[d]){
                if (self.data.filterList[d][a]['id'] == id){
                    return self.data.filterList[d][a]['name']
                }
            }
            return '不限'
        }
        console.log(self.data)
        var title = forname('housetype_list', self.data.house_type) + '_' + forname('style_list', self.data.house_style) + '_' + forname('area_list', self.data.house_area)
        app.ja_record_page({
          pageid: 'main_tab_case_list',
          data: params,
          title:title
        });
    },
    //加载更多
    getMore:function(){
        var self=this;
        self.setData({
            page:self.data.page+1
        });
        self.getData();
    },
    //跳转案例详情
    goToDetaile:function(event){
        wx.navigateTo({
          url: '../detaile/detaile?caseId='+event.currentTarget.dataset.gid
        });
    },
    //跳转设计师详情
    goToDesigner:function(event){
        wx.navigateTo({
          url: '/pages/designer/designer?designerId='+event.currentTarget.dataset.did
        });
    }
});