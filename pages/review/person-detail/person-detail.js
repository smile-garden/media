// pages/review/person-detail/person-detail.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personDetail: {},
    id: '',
    movieList: [],
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中'
    })
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })
    this.data.id = options.id;
    this.getInfo();
  },

  getInfo: function () {
    util.$get(doubanUrl + '/v2/movie/celebrity/' + this.data.id).then(res => {
      let list = res.data.works.map((v) => {
        return {
          stars: util.convertToStarsArray(v.subject.rating.average),
          title: v.subject.title,
          average: v.subject.rating.average,
          coverageUrl: v.subject.images.large,
          movieId: v.subject.id
        }
      })
      this.setData({
        isLoading: false,
        personDetail: res.data,
        movieList: list
      })
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    }).catch(e => {
      wx.hideNavigationBarLoading();
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        isLoading: false
      })
      wx.hideLoading();
    })
  },
  openDetail: function (e) {
    let item = e.currentTarget.dataset;
    wx.redirectTo({
      url: `../review-detail/review-detail?id=${item.movieid}&title=${item.title}`
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})