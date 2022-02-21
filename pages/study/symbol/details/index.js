// pages/study/symbol/details/index.js
const lancema = getApp()

import config from "../../../../config/default-config"
import dayjs from '../../../../components/dayjs/dayjs.min'
import { setLoadingClose } from '../../../../utils/util'
import { symbolCheck } from '../../../../api/study'
import routers from '../../../../router/routers'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    title: '图标技巧',
    loadingStart: true,
    isTitle: {
      enabled: true,
      number: 0,
    },
    pagesHtml: {},
    params: {
      page: 1,
      limit: 0
    },
    empty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.haledSymbolCheck(options)
  },
  async haledSymbolCheck(options) {
    const { params, loadingStart, isTitle } = this.data
    try {
      const res = await symbolCheck({ ...options, ...params })
      const resData = res[config.requesCode.keyData]
      const { total, symbol } = res[config.requesCode.keyData].list

      if (! symbol.length) {
        return this.setData({empty: true})
      }

      if (loadingStart) {
        if (isTitle.enabled) {
          this.setData({ 'isTitle.number': total })
        }
        setLoadingClose(this)
      }

      this.setData({ symbol })
    } catch (error) {
      this.setData({ empty: true }) 
    }
     
  },
  onclickLeft() {
    const pages = getCurrentPages(); //页面对象
    const prevPage = pages[pages.length - 2] || '' //上一个页面对象
    const prevRoute = prevPage.route || ''
    if (! prevPage || ! prevRoute) {
      return routers('index')
    }
    return routers(1, 'navigateBack')
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