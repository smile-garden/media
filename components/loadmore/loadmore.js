// components/loadmore/loadmore.js
const TYPES = [
  {
    icon: 'https://s10.mogucdn.com/p2/161213/upload_124lgj5ji1h9f3ci0bdbe5k4gf1kk_44x44.png',
    text: '没有了呢'
  }
];
const IconType = {
  HIDDEN: -1,
  SHOW_DEFAULT: 1,
  SHOW_CONFIG: 2
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
    isEnd: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: TYPES[0],
    iconStatus: IconType.HIDDEN,
    iconType: IconType
  },
  attached: function () {
    let iconStatus = IconType.HIDDEN;
    const icon = this.data.icon;
    console.log(this.data);
    if (icon) {
      iconStatus = IconType.SHOW_DEFAULT;
    };
    if ((/\.(jpg|gif|jpeg|png)+$/).test(icon)) {
      iconStatus = IconType.SHOW_CONFIG;
    };
    this.setData({
      iconStatus
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
