/*
 * @Author: Lance Ma 
 * @Date: 2021-04-02 12:13:03
 * @LastEditTime: 2021-04-08 16:24:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\app.js
 */
// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    const that = this
    wx.getSystemInfo({
        success: function (res) {
            if (res.model.search('iPhone X') !== -1) {
              that.globalData.isIphoneX = true
              wx.setStorageSync('isIphoneX', true)
            }
        }
    })
  },
  globalData: {
    userInfo: null,
    isIphoneX: false
  }
})
