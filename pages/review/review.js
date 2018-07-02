// pages/review/review.js
const util = require('../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
const bannerUrl = getApp().globalData.musicBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    searchResult: {},
    isLoading: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   /* wx.showLoading({
      title: '加载中'
    })*/
    this.getMovieListData(`/v2/movie/in_theaters`, {start: 0, count: 6}, "inTheaters", "正在热映");
    this.getMovieListData(`/v2/movie/coming_soon`, {start: 0, count: 6}, "comingSoon", "即将上映");
    this.getMovieListData(`/v2/movie/top250`, {start: 0, count: 6}, "top250", "豆瓣Top250");
    this.initSwiper();
  },
  // 进入搜索页
  viewSearch: function () {
    wx.navigateTo({
      url: "/pages/review/search/search"
    })
  },
  // 更多
  onMoreTap: function (e) {
    console.log(e);
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: `more-movie/more-movie?category=${item.category}&title=${item.title}`
    })
  },
  // banner 轮播相关
  onSwiperTap: function (e) {
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: `review-detail/review-detail?id=${item.id}&title=${item.title}`
    })
  },
  // 图文列表跳转
  openDetail: function (e) {
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: `review-detail/review-detail?id=${item.movieid}&title=${item.title}`
    })
  },
  initSwiper: function () {
    util.$get(bannerUrl + '/api/tv/banner').then(res => {
      if (res.data.status === 0) {
        this.setData({
          swiperList: res.data.data
        })
      };
    }).catch(e => {
      wx.showToast({
        title: '网络错误1',
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 获取影评图文列表
  getMovieListData: function (url, sendData, settedKey, categoryTitle) {
    util.$get(doubanUrl + url, sendData).then(res => {
      this.processDoubanData(res.data, settedKey, categoryTitle)
    }).catch(e => {
      wx.hideLoading()
    })
  },
  processDoubanData: function (data, settedKey, categoryTitle) {
    let list = data.subjects.map((v) => {
      return {
        stars: util.convertToStarsArray(v.rating.average),
        title: v.title,
        average: v.rating.average,
        coverageUrl: v.images.large,
        movieId: v.id
      }
    })
    this.setData({
      [settedKey]: {
        categoryTitle: categoryTitle,
        movies: list
      }
    })
    if (this.data.inTheaters && this.data.comimgSoon && this.data.top250) {
      wx.hideLoading()
    };
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})