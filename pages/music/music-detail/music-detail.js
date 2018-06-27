// pages/music/music-detail/music-detail.js
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    music_id: '',
    isPlayingMusic: false,
    isLoading: true,
    isPlay: false,
    isMusic: false,
    musicSrc: '',
    nodes: '',
    content: null,
    postsCollected: false // 文章是否收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      id: options.id
    })
    this.isCollected();
    this.getDetail(); 
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoading: false,
        isMusic: true,
        isPlay: true
      })
    } else if (!app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoading: false,
        isMusic: true,
        isPlay: false
      })
    }
    this.setMusicMonitor();
  },

  getDetail: function () {
    util.$get(`${app.globalData.musicBase}/api/music/detail?`, { id: this.data.id }).then((res) => {
      console.log(res);
      this.setData({
        nodes: res.data.data.story,
        content: res.data.data
      })
      util.wxParse('artice', 'html', res.data.data.story, this, 15);
      this.setData({
        isLoading: false
      })
      this.initMusic();
    }).catch(e => {
      this.setData({
        isLoading: false
      })
      wx.showToast({
        title: `网络错误1！`,
        icon: "none",
        duration: 1000
      })
    })
  },
  setMusicMonitor() {
    wx.onBackgroundAudioPlay((e) => {  //播放图标和自带音乐按钮联动
      console.log(e)
    });
    wx.onBackgroundAudioPause((e) => {
      console.log(e)
    });
    wx.onBackgroundAudioStop((e) => {
      console.log(e)
    })
  },
  initMusic: function () {  // 初始化音乐  虾米音乐代替
    util.$get(`${app.globalData.QQMusicBase}/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${this.data.content.title}${this.data.content.author.user_name}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=1&remoteplace=txt.mqq.all&_=1520833663464`).then(res => {
      let list = JSON.parse(res.data.match(/callback\((.*)\)/)[1]).data.song.list;
      if (list.length) {
        this.data.music_id = list[0].songmid;
        this.setData({
          isLoading: false, // 结束loading动画
          isMusic: true, // 音乐存在
          musicSrc: `http://ws.stream.qqmusic.qq.com/C100${this.data.music_id}.m4a?fromtag=0&guid=126548448`
        })
      } else {
        this.setData({
          isLoading: false,
          isMusic: false
        })
        wx.showToast({
          title: '暂无音乐版权！',
          icon: 'none',
          duration: 1000
        })
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误2！',
        icon: 'none',
        duration: 1000
      })
    })
  },
  onMusicTap: function () { // 音乐播放按钮
    if (this.data.isLoading) {
      return false;
    };
    if (!this.data.isMusic) {
      wx.showToast({
        title: `暂无音乐版权！`,
        icon: "none",
        duration: 1000
      });
      return false
    };
    if (this.data.isPlay) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlay: false
      })
      app.globalData.g_isPlayingMusic = false; // 总开关 关闭
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.musicSrc,
        title:  `${this.data.content.title}-${this.data.content.author.user_name}`,
        coverImgUrl: this.data.content.cover
      })
      this.setData({
        isPlay: true
      })
      app.globalData.g_currentMusicPostId = this.data.id;
      app.globalData.g_isPlayingMusic = true;
    }
  },
  isCollected: function () {
    let postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      let bol = postsCollected[this.data.id];
      if (bol) {
        this.setData({
          collected: bol
        })
      };
    } else {
      let postsCollected = {};
      postsCollected[this.data.id] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    console.log('操作')
  },
  onCollectionTap: function (e) {
    this.getPostsCollectedSyc(); // 同步
  },
  getPostsCollectedSyc: function () {
    let postsCollected = wx.getStorageSync('posts_collected');
    let bol = postsCollected[this.data.id];
    bol = !bol;
    postsCollected[this.data.id] = bol;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: bol
    })
    wx.showToast({
      title: bol ? "收藏成功" : "取消成功",
      icon: 'success',
      duration: 1000
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

  onShareTap: function () {
    let itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#4290f0",
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.showShareMenu({
            withShareTicket: true,
            success: function (res) {
              console.log(res)
            }
          })
        } else {
          wx.showModal({
            title: "用户 " + itemList[res.tapIndex],
            content: "此功能暂不支持"
          })          
        };
        
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})