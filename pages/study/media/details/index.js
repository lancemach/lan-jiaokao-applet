/*
 * @Author: Lance Ma
 * @Date: 2021-06-07 12:25:35
 * @LastEditTime: 2021-10-18 15:13:34
 * @LastEditors: Lance Ma
 * @Description: 车考视频
 * @FilePath: \pages\study\media\details\index.js
 */
// pages/study/media/details/index.js

const lancema = getApp()

import config from "../../../../config/default-config"
import dayjs from '../../../../components/dayjs/dayjs.min'
import { getStatusBarHeight } from '../../../../utils/util'
import { drivingCheck } from '../../../../api/study'
import WxParse from '../../../../components/wxParse/wxParse'
import routers from '../../../../router/routers'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    pagesHtml: {},
    empty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ options, statusBarHeight: getStatusBarHeight() })
    this.haledDrivingCheck(options)
  },
  async haledDrivingCheck(options) {
    try {
      const res = await drivingCheck(options)
      const resData = res[config.requesCode.keyData]
      const { description } = resData || ''
      if (description) {
        WxParse.wxParse('article', 'html', description, this, 5)
      } else {
        this.setData({ empty: true }) 
      }
      
      this.setData({ drives: resData })
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
  videoErrorCallback (e) {
    console.log(e)
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