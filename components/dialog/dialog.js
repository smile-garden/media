Component({
  // 组件属性列表
  properties: {
    content: String
  },
  // 组件的初始数据
  data: {
    show: false
  },
  // 组件的方法列表
  methods: {
    show: function () {
      this.setData({
        show: true
      })
    },
    hide: function () {
      this.setData({
        show: false
      })
    },
    goLogin: function (e) {
      this.triggerEvent('confirm', e)
    }
  }
})