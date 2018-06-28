// pages/videos/video-detail/video-detail.js
const util = require('../../../utils/util.js')
const movieUrl = getApp().globalData.movieBase
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: null,
    movieList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      video: {
        time: decodeURIComponent(options.time),
        url: decodeURIComponent(options.url),
        title: decodeURIComponent(options.title)
      }
    })
    this.getList()
  },
  getList: function () {
    util.$get(`${movieUrl}/api/v2/article`, {app_id: 6, cid: 4, article_id: 0}).then(res => {
      console.log(res)
      if (res.data.status === 0) {
        res.data.data.articles.map(v => {
          v.create_time = util.yymmdd(new Date(v.create_time))
          v.thumbnails[0].url = v.thumbnails[0].url.replace(/(\.\w{3,4})$/i, "_crop" + 234 + "x" + 146 + "$1")
        })
        this.setData({
          movieList: res.data.data.articles
        })
      };
    }).catch(e => {
      wx.showToast({
        title: '网络错误3',
        icon: 'none',
        duration: 1000
      })
    })
  },
  openDetail: function (e) {
    let item = e.currentTarget.dataset.list
    let url = `../video-detail/video-detail?title=${item.title}&time=${item.create_time}&url=${item.videos[0].video_src}`
    wx.redirectTo({
      url: url
    })
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