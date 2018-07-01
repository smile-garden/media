const wxParse = require('/wxParse/wxParse.js').wxParse; // 解决HTML及markdown解析
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const yymmdd = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const $get = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

const convertToStarsArray = (average) => {
  const LENGTH = 5;
  const CLS_ON = 'on'; // 全星
  const CLS_HALF = 'half'; // 半星
  const CLS_OFF = 'off'; // 无星
  let result = [];
  let score = Math.round(average) / 2;
  let hasDecimal = score % 1 !==0;  // 是不是整数
  let integer = Math.floor(score); // 向下取整
  for (let i = 0; i < integer; i++) {
    result.push(CLS_ON)
  }
  if (hasDecimal) {
    result.push(CLS_HALF)
  };
  while (result.length < LENGTH) {
    result.push(CLS_OFF)
  }
  return result;
}

module.exports = {
  wxParse,
  formatTime,
  yymmdd,
  $get,
  convertToStarsArray
}
