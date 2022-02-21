/*
 * @Author: lance Ma
 * @Date: 2021-06-07 12:25:21
 * @LastEditTime: 2021-10-18 16:41:39
 * @LastEditors: Lance Ma
 * @Description: 车考视频
 * @FilePath: \pages\study\media\list\index.js
 */
// pages/study/media/list/index.js
const lancema = getApp()

import config from "../../../../config/default-config"
import { setLoadingClose } from '../../../../utils/util'
import dayjs from '../../../../components/dayjs/dayjs.min'
import { drivingCheck } from '../../../../api/study'
import routers from '../../../../router/routers'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    title: '视频',
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
  onLoad (options) {
    const { subjects } = options
    this.setData({ options, title: '科目' + (subjects == 2 ? '二' : '三') + this.data.title })
    this.bindCheck()
  },
  async bindCheck(paramsPage = 0) {
    const { loadingStart, isTitle, params, options } = this.data
    const { subjects } = options || 0
    if (paramsPage) {
      params.page = paramsPage
    }
    if (subjects) {
      params.subjects = subjects
    }
    try {
      const res = await drivingCheck({ ...params })
      const { total, pages, limit, drives } = res[config.requesCode.keyData].list
      if (! drives.length) {
        return this.setData({empty: true})
      }
      
      if (loadingStart) {
        if (isTitle.enabled) {
          this.setData({ 'isTitle.number': total })
        }
        setLoadingClose(this)
      }
      const drivesData = [...this.data.drives || []]
      
      drives.forEach(i => {
          i.date_time = dayjs.unix(i.updated_time).format("YYYY-MM-DD HH:mm")
          drivesData.push(i)
      })

      this.setData({ drives: drivesData, total, pages, limit })
    } catch (error) {
      if (loadingStart) {
        setLoadingClose(this)
      }
      this.setData({empty: true})
    }
    
  },
  bindGoDrives ({ currentTarget }) {
    const { dataset } = currentTarget || {}
    const { id, subjects } = dataset || 0
    if (! id || ! subjects) {
      wx.showToast({ icon: 'none', title: '视频不存在' })
      return
    }
    return routers(['media', 'id=' + id + '&subjects=' + subjects])
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