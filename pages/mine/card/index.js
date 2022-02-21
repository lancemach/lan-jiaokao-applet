/*
 * @Author: Lance Ma
 * @Date: 2021-06-15 08:37:40
 * @LastEditTime: 2021-06-15 09:04:28
 * @LastEditors: Please set LastEditors
 * @Description: 我的卡包
 * @FilePath: .\pages\mine\card\index.js
 */
// pages/mine/card/index.js

const lancema = getApp()
import { pageInfo, info } from '../../../api/index'
import { setLoadingClose } from '../../../utils/util'
import config from '../../../config/default-config'
import routers from '../../../router/routers'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    title: '我的卡包',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.bindCheck()
  },
  async bindCheck(paramsPage = 0) {
    const { loadingStart, isTitle, params } = this.data
    if (paramsPage) {
      params.page = paramsPage
    }
    try {
      // const res = await examinationCheck({ ...params })
      // const { total, pages, limit, performance } = res[config.requesCode.keyData].list
      // if (! performance.length) {
      //   return this.setData({empty: true})
      // }
      
      if (loadingStart) {
        if (isTitle.enabled) {
          this.setData({ 'isTitle.number': total })
        }
        setLoadingClose(this)
      }
      // const performanceData = [...this.data.performance || []]
      
      // performance.forEach(i => {
      //     i.date_time = dayjs.unix(i.updated_time).format("YYYY-MM-DD HH:mm")
      //     performanceData.push(i)
      // })

      // this.setData({ performance: performanceData, total, pages, limit })
    } catch (error) {
      if (loadingStart) {
        setLoadingClose(this)
      }
      this.setData({empty: true})
    }
    
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