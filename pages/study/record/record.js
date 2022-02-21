/*
 * @Author: Lance Ma
 * @Date: 2021-04-30 17:03:41
 * @LastEditTime: 2021-10-18 15:07:58
 * @LastEditors: Lance Ma
 * @Description: 考试成绩
 * @FilePath: \pages\study\record\record.js
 */
// pages/study/record/record.js
const lancema = getApp()

import config from "../../../config/default-config"
import { sleep, setLoadingClose } from '../../../utils/util'
import dayjs from '../../../components/dayjs/dayjs.min'
import { examinationCheck } from '../../../api/study'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    title: '考试成绩',
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
      limit: 10
    }
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
      const res = await examinationCheck({ ...params })
      const { total, pages, limit, performance } = res[config.requesCode.keyData].list
      console.log(total, pages, limit, performance)
      if (! performance.length) {
        this.setData({ empty: true })
      }
      
      if (loadingStart) {
        if (isTitle.enabled) {
          this.setData({ 'isTitle.number': total })
        }
        setLoadingClose(this)
      }
      const performanceData = [...this.data.performance || []]
      
      performance.forEach(i => {
          i.date_time = dayjs.unix(i.updated_time).format("YYYY-MM-DD HH:mm")
          performanceData.push(i)
      })

      this.setData({ performance: performanceData, total, pages, limit })
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