// pages/videos/videos.js
const util = require('../../utils/util.js')
const movieUrl = getApp().globalData.movieBase
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: null,
    swiperList: null,
    isLoading: false,
    hasMore: true,
    article_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    if (token) {
      this.initSwiper();  // 加载轮播图
      this.getList('down');
    } else {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  },
  // 获取视频列表
  getList: function (type) {
    this.setData({
      isLoading: true,
      hasMore: true
    })
    type === 'down' ? this.setData({ article_id: 0}) : null;
    util.$get(`${movieUrl}/api/v2/article`, {app_id: 6, cid: 4, article_id: this.data.article_id}).then(res => {
      if (res.data.status === 0) {
        this.processData(type, res.data.data.articles)
      };
      console.log(res)
    }).catch(e => {
      this.setData({
        isLoading: true,
        hasMore: false
      })
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络错误1！',
        icon: 'none',
        duration: 1000
      })
    })
  },
  processData: function (type, list) {
    if (list.length) {
      list.map(v => {  //时间格式处理
        v.create_time = util.yymmdd(new Date(v.create_time))
      })
      if (type === 'up') { // 上拉
        this.setData({
          movieList: this.data.movieList.concat(list)
        })
      } else {
        this.setData({
          movieList: list
        })
      }
      this.setData({
        article_id: ++this.data.article_id,
        isLoading: false,
        hasMore: true
      })
    } else {
      if (type === 'down') {
        wx.showToast({
          title: '没有数据',
          icon: 'none',
          duration: 1000
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
  initSwiper: function () {
    util.$get(`${movieUrl}/api/v2/article`, {app_id: 6, cid: 4, article_id: 0}).then(res => {
      if (res.data.status === 0) {
        let swiperList = res.data.data.articles.map(v => {
          return {
            create_time: v.create_time = util.yymmdd(new Date(v.create_time)),
            article_id: v.article_id,
            title: v.title,
            content: v.content,
            video_src: v.videos[0].video_src,
            thumbnails: v.thumbnails[0].url
          }
        })
        this.setData({
          swiperList
        })
      };
    }).catch(e => {
      wx.showToast({
        title: '网络错误2！',
        icon: 'none',
        duration: 1000
      })
    })
  },
  openDetail: function (e) {
    console.log(e);
    let item = e.currentTarget.dataset.list
    let url = `video-detail/video-detail?title=${item.title}&time=${encodeURIComponent(item.create_time)}&url=${item.videos[0].video_src}`
    wx.navigateTo({
      url: url
    })
  },
  onSwiperTap: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    let url = `video-detail/video-detail?title=${item.title}&time=${item.create_time}&url=${item.video_src}`
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList('down');
    this.initSwiper();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading) {
      return false
    };
    this.getList('up');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})