// pages/review/review-detail/review-detail.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filmDetail: {},
    isLoading: true,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })
    wx.showLoading({
      title: '加载中'
    })
    wx.showNavigationBarLoading();
    this.getInfo();
  },

  getInfo: function () {
    util.$get(doubanUrl + '/v2/movie/subject/'+this.data.id).then( res => {
      res.data.stars = util.convertToStarsArray(res.data.rating.average)  // 展示评分星星
      this.setData({
        filmDetail: res.data,
        isLoading: false
      })
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    }).catch(e => {
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        isLoading: false
      })
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    })
  },
  // 点击演员/导演
  viewPersonDetail: function (e) {
    let data = e.currentTarget.dataset;
    if (!data.id) {
      wx.showToast({
        title: '没找到相关信息！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.redirectTo({
      url: `../person-detail/person-detail?id=${data.id}&title=${data.title}`
    })
  },
  // 点击类型标签
  viewFilmByTag: function (e) {
    let item = e.currentTarget.dataset;
    wx.redirectTo({
      url: `../more-movie/more-movie?category=tag&title=${item.tag}`
    })
  },
  // 查看图片
  viewMoviePostImg: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})