/*
 * @Author: Lance Ma
 * @Date: 2021-06-15 14:27:35
 * @LastEditTime: 2021-06-23 10:40:14
 * @LastEditors: Please set LastEditors
 * @Description: 选择角色
 * @FilePath: .\pages\mine\character\index.js
 */
// pages/mine/character/index.js

import storageSync from '../../../store/storage'
import config from '../../../config/default-config'
import routers from '../../../router/routers'
import { sleep } from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    character: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const character = storageSync.get('character') || 1
    console.log(character)
    this.setData({ character: character })
  },

  async bindGeCharacter({ currentTarget }) {
    const { id } = currentTarget.dataset || 0
    const { character } = this.data
    if (! id || character == id) {
      return
    }

    this.setData({ character: id })
    storageSync.set('character', id)
    await sleep(500)
    return routers('mine', 'reLaunch')
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