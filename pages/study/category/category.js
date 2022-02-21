/*
 * @Author: Lance Ma
 * @Date: 2021-05-06 16:17:05
 * @LastEditTime: 2021-05-08 11:37:55
 * @LastEditors: Please set LastEditors
 * @Description: 考题分类
 * @FilePath: .\pages\study\category\category.js
 */
// pages/study/category/category.js

import config from "../../../config/default-config"
import { sleep, setLoadingClose, urlEncode } from '../../../utils/util'
import { specificTraining } from '../../../api/study'
import routers from '../../../router/routers'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    loadingStart: true,
    title: '专项训练'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({ ...{options} })
    const { loadingStart } = this.data
    try {
      const resData = await specificTraining(options)
      const data = resData[config.requesCode.keyData]
      this.setData({ ...data })
    } catch (error) {
      
    }
    if (loadingStart) {
      setLoadingClose(this)
    }
  },
  bindToExamination ({ currentTarget }) {
    const { chapter } = currentTarget.dataset || 0
    const { options } = this.data
    const param = urlEncode({ ...options, ...{ chapter } })

    routers(['exam', param])
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