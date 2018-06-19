// pages/music/music.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    hasMore: true,
    id: 0,
    musicList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    if (token) {
      this.getList('down');
    } else {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  },
  getList: function (type) {
    this.setData({
      isLoading: true,
      hasMore: true
    });
    type === 'down' ? this.setData({ id: 0}) : null;
    util.$get(`${app.globalData.musicBase}/api/channel/music/more`, { id: this.data.id }).then(res => {
      if (res.data.res === 0) {
        console.log(res.data.data)
        this.processData(type, res.data.data);
      };
    }).catch(e => {
      this.setData({
        isLoading: true,
        hasMore: false
      }),
      wx.stopPullDownRefresh();
      wx.showToast({
        title: `网络错误!`,
        duration: 1000,
        icon: 'none'
      })
    })
  },
  processData: function (type, list) {
    if (list.length) {
      list.map(v => { // 转换时间
        return v.post_date = util.yymmdd(new Date(v.post_date))
      });
      if (type === 'up') {  // 上拉
        this.setData({
          musicList: this.data.musicList.concat(list)
        })
      } else {
        this.setData({
          musicList: list
        })
        wx.stopPullDownRefresh()
      }
      this.setData({
        id: list[list.length - 1].id,
        isLoading: false,
        hasMore: true
      })
    } else {
      if (type === 'down') {
        wx.showToast({
          title: `没有数据`,
          duration: 1000,
          icon: 'none'
        })
        this.setData({
          isLoading: false,
          hasMore: false
        })
      } else {
        this.setData({
          isLoading: false,
          hasMore: true
        })
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList('down');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading) {
      return false;
    };
    this.getList('up');
  },
  openDetail: function (e) {
    let item = e.currentTarget.dataset.list;
    console.log(item);
    wx.navigateTo({
      url: `music-detail/music-detail?id=${item.item_id}&title=${item.title}`
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})