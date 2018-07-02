const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
const hotTag = ['动作', '喜剧', '爱情', '悬疑'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchType: 'keyword',
    hotKeyword: null,
    hotTag
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotKeyword();
  },
  // 获取热词
  getHotKeyword: function () {
    util.$get(doubanUrl + '/v2/movie/coming_soon', {start: 0, count: 10}).then(res => {
      this.setData({
        hotKeyword: res.data.subjects
      })
    })
  },
  // 变换搜索类型
  changeSearchType: function () {
    let types = ['默认', '类型'];
    let searchType = ['keyword', 'type'];
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        if (!res.cancel) {
          this.setData({
            searchType: searchType[res.tapIndex]
          })
        };
      }
    })
  },
  searchA: function (e) {
    this.search(e.detail.value.keyword)
  },
  searchB: function (e) {
    this.search(e.detail.value)
  },
  search: function (keyword) {
    if (keyword == '') {
      wx.showToast({
        title: '请输入内容！',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: `../more-movie/more-movie?category=${this.data.searchType}&title=${encodeURIComponent(keyword)}`
      })
    }
  },
  searchByKeyword: function (e) {
    let keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `../more-movie/more-movie?category=keyword&title=${keyword}`
    })
  },
  searchByTag: function (e) {
    let keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `../more-movie/more-movie?category=tag&title=${keyword}`
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})