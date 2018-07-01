// pages/review/more-movie/more-movie.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: "",
    movieList: [],
    sendData: {
      start: 0, // 总条数
      count: 18, // 每页加载条数
      q: undefined,
      tag: undefined
    },
    noData: false,
    isLoading: true,
    hasMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let category = options.category;
    let url = '';
    switch (category) {
      case "正在热映":
        url = "/v2/movie/in_theaters";
        break;
      case "即将上映":
        url = "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        url = "/v2/movie/top250";
        break;
      case "tag":
        url = "/v2/movie/search";
        this.data.sendData.tag = options.title;
        break;
      case "keyword":
        url = "/v2/movie/search";
        this.data.sendData.q = options.title;
        break;
    }
    this.data.requestUrl = doubanUrl + url;
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })
    this.getList('down');
  },
  // 获取列表
  getList: function (type) {
    this.setData({
      isLoading: true,
      hasMore: false
    })
    wx.showNavigationBarLoading() // 开启顶部loading
    type === "down" ? this.data.sendData.start = 0 : this.data.sendData.start;
    let data = Object.assign({}, this.data.sendData);
    data.start = data.start* data.count;
    util.$get(this.data.requestUrl, data).then(res => {
      this.processDoubanData(type, res.data.subjects)
      wx.hideNavigationBarLoading()
    }).catch(e => {
      this.setData({
        isLoading: false,
        hasMore: false
      })
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 处理数据
  processDoubanData: function (type, data) {
    if (data.length) {
      let list = data.map((v) => {
        return {
          stars: util.convertToStarsArray(v.rating.average),
          title: v.title,
          average: v.rating.average,
          coverageUrl: v.images.large,
          movieId: v.id
        }
      })
      if (type === 'up') {
        this.setData({
          movieList: this.data.movieList.concat(list)
        })
      } else {
        this.setData({
          movieList: list
        })
        wx.stopPullDownRefresh();
        this.setData({
          'sendData.start': ++this.data.sendData.start,
          isLoading: false,
          hasMore: false
        })
      }
    } else {
      if (type === 'down') {
        wx.showToast({
          title: '没有数据',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isLoading: false,
          hasMore: false,
          noData: true
        })
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          isLoading: false,
          hasMore: true
        })
      }
    }
  },
  openDetial: function (e) {
    let item = e.currentTarget.dataset;
    if (this.data.sendData.tag) {
      wx.redirectTo({
        url: `../review-detail/review-detail?id=${item.movieId}&title=${item.title}`
      })
    } else {
      wx.navigateTo({
        url: `../review-detail/review-detail?id=${item.movieId}&title=${item.title}`
      })
    }
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
    this.getList('down')
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})