// pages/page/index.js
const lancema = getApp()

import config from "../../config/default-config"
import { sleep, setLoadingClose } from '../../utils/util'
import { check } from '../../api/pages'
import WxParse from '../../components/wxParse/wxParse'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    title: '',
    pagesHtml: {},
    isTitle: {
      enabled: true,
      number: 0,
    },
    empty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const { id } = options || 0
    this.setData(options)
    if (id) {
      try {
        const res = await check(options)
        const pages = res[config.requesCode.keyData]
        const { description, name } = pages || ''
        if (description) {
          WxParse.wxParse('article', 'html', description, this, 5)
        }
        if (name) {
          wx.setNavigationBarTitle({ title: name })
        }
        this.setData({ pagesHtml: pages })
      } catch (error) {
        this.setData({ empty: true }) 
      }
    } else {
      this.setData({ empty: true }) 
    }
    
    await sleep(500)
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