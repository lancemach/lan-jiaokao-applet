/*
 * @Author: Lance Ma
 * @Date: 2021-08-17 14:57:18
 * @LastEditTime: 2021-10-20 17:46:58
 * @LastEditors: Lance Ma
 * @Description: In User Settings Edit
 * @FilePath: \pages\buys\index.js
 */
// pages/buys/index.js
const lancema = getApp();

import config from "../../config/default-config"
import { category } from "../../api/index"
import { getArrayToFlat, getDataType, charCodeSort } from "../../utils/util"
import routers from '../../router/routers'
import {
  setSafeArea,
  getPageSelectorNode
} from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    model: 1,
    setSafeArea,
    cateIndex: [],
    cateList: [],
    nodeTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    setSafeArea(this, {
      isTabBar: true,
      isNavBar: true,
    })
    this.getCategory()
  },
  async getCategory () {
    const node = await getPageSelectorNode('.container', ['paddingTop'])
    const cate = await category({ limit: 0, parent_id: 24, max: 1, pinyin: 1 })
    const data = cate[config.requesCode.keyData].list.cates || []
    let cateIndex = []

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        cateIndex.push(key)
      }
    }
    const index = cateIndex.sort()
    // cateIndex = [ ...['选'], ...index]
    const cateList = index.map(i => {
      return { k: i, d: data[i] }
    })
    this.setData({ cateIndex, cateList, nodeTop: parseInt(node.paddingTop) || 0 })
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