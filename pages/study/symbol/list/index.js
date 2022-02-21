// pages/study/symbol/list/index.js
const lancema = getApp()

import config from "../../../../config/default-config"
import { setLoadingClose } from '../../../../utils/util'
import dayjs from '../../../../components/dayjs/dayjs.min'
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
    total: 0,
    pages: 0,
    limit: 0,
    page: 1,
    isTitle: {
      enabled: true,
      number: 0,
    },
    empty: false,
    isJump: true,
    isLoading: {
      enabled: false,
      downRefresh: false
    },
    params: {
      page: 1,
      limit: 0,
      group_id: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.bindCheck()
  },
  async bindCheck(paramsPage = 0) {
    const { loadingStart, isTitle, params, options } = this.data
    if (paramsPage) {
      params.page = paramsPage
    }
  
    try {
      const res = await symbolCheck({ ...params })
      
      const { total, pages, limit, symbol } = res[config.requesCode.keyData].list

      if (! symbol.length) {
        return this.setData({empty: true})
      }
      
      if (loadingStart) {
        if (isTitle.enabled) {
          this.setData({ 'isTitle.number': total })
        }
        setLoadingClose(this)
      }
      const symbolData = [...this.data.symbol || []]

      symbol.forEach(i => {
        // i.date_time = dayjs.unix(i.updated_time).format("YYYY-MM-DD HH:mm")
        symbolData.push(i)
    })

      this.setData({ symbol: symbolData, total, pages, limit })
    } catch (error) {
      if (loadingStart) {
        setLoadingClose(this)
      }
      this.setData({empty: true})
    }
    
  },
  bindGoSymbol ({ currentTarget }) {
    const { dataset } = currentTarget || {}
    const { id } = dataset || 0
    if (! id) {
      wx.showToast({ icon: 'none', title: '图标不存在' })
      return
    }
    return routers(['symbol', 'category_id=' + id])
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
    const { pages, isLoading } = this.data
    let { page } = this.data.params
    if (! isLoading.enabled) {
      this.setData({
        'isLoading.enabled': true
      })
    }
    this.setData({
      'isLoading.downRefresh': page < pages ? true : false
    })
    if (page >= pages) {
      return
    }
    page++
    const paramsPage = page
    this.bindCheck(paramsPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})