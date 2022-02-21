/*
 * @Author: your name
 * @Date: 2021-06-08 17:05:00
 * @LastEditTime: 2021-06-23 09:25:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\pages\study\paper\index.js
 */
// pages/study/paper/index.js
import config from "../../../config/default-config"
import routers from '../../../router/routers'
import { urlEncode } from '../../../utils/util'
import { Vip } from '../../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.bindGetVip(options)
  },
  async bindGetVip(options) {
    const res = await Vip()
    const param = { 
                    ...options,
                    ...{
                      rule: 'vip',
                      limit: 1,
                      page: 1,
                    }
                  }
    
    const { life } = res[config.requesCode.keyData].vip || 0
    if (life == 1) {
      routers(['exam', urlEncode(param)])
    }
    console.log(res)
  },
  bindGoVIP() {
    routers('vip')
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})