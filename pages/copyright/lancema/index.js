/*
 * @Author: Lance Ma
 * @Date: 2021-01-24 17:16:09
 * @LastEditTime: 2021-06-11 17:45:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\pages\lancema\index.js
 */
// pages/lancema/index.js
import config from '../../../config/default-config'
import { getSystemInfo } from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    wxCodePreview: false,
    systemInfo: getSystemInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  bindPreviewImage ({ currentTarget }) {
    this.setData({wxCodePreview: ! this.data.wxCodePreview})
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