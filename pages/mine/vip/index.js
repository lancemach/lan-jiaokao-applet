/*
 * @Author: Lance Ma
 * @Date: 2021-06-08 17:58:45
 * @LastEditTime: 2021-07-01 18:40:35
 * @LastEditors: Please set LastEditors
 * @Description: 会员卡
 * @FilePath: .\pages\mine\vip\index.js
 */
// pages/mine/vip/index.js

import { setSafeArea } from '../../../utils/util'
import storageSync from '../../../store/storage'
import config from '../../../config/default-config'
import routers from '../../../router/routers'
import { check } from '../../../api/pages'
import { Vip, openVip } from '../../../api/index'
import WxParse from '../../../components/wxParse/wxParse'
import dayjs from '../../../components/dayjs/dayjs.min'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    name: 'vip',
    comboId: 2,
    type: 1,
    loadingStart: true,
    comboData: [],
    comboName: '',
    isTabBar: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = storageSync.get("userInfo") || ''
    this.setData({ userInfo })
    setSafeArea(this, { isNavBar: true })
    const { id } = options || 0
    if (id) {
      this.setData({ type: id })
    }
    this.getVip()
    this.getVIPInterests()
  },
  changeVIPCombo({ currentTarget }) {
    const { id } = currentTarget.dataset || 0
    if (! id) {
      return
    }
    this.setData({ comboId: id})
  },
  bindGeToPages ({ currentTarget }) {
    const { dataset } = currentTarget
    const { page, id } = dataset || 0
    if (! page && ! id) {
      return
    }
    if (! id) {
      return routers(page)
    }

    if (page && id) {
      return routers([page, 'id=' + id])
    }
  },
  async getVIPInterests() {
    const { type } = this.data
    console.log(type, type == 1 ? 14 : 15)
    try {
      const res = await check({ id: type == 1 ? 14 : 15 })
      const pages = res[config.requesCode.keyData]
      const { description } = pages || ''
      if (description) {
        WxParse.wxParse('article', 'html', description, this, 5)
      }
      this.setData({ pagesHtml: pages })
    } catch (error) {
    }
  },
  async getVip() {
    const { type, loadingStart } = this.data
    const res = await Vip({ type })
    const { vip, combo } = res[config.requesCode.keyData] || ''
    const { sn } = vip || 0
    const end_time = vip['et' + [type]] || 0
    vip.end_time = end_time ? dayjs.unix(end_time).format("YYYY-MM-DD HH:mm") : dayjs().startOf('date').format("YYYY-MM-DD HH:mm")
    if (sn) {
      vip.sn = sn.replace(/(.{4})/g, "$1 ")
    }
    this.setData({ vip, comboData: combo, comboId: type == 2 ? 1 : 2 })
    if (loadingStart) {
      this.setData({ loadingStart: false })
    }
  },
  async goPay() {
    const { type, comboId, comboData, vip } = this.data
    const params = {
      type,
      comboId,
      title: comboData.name + '年卡会员' + (type == 1 ? ('('+ comboData.title  + ')') : ''),
      goods_id: 0,
      mid: vip.mid,
      seller_id: 0,
      num: 1
    }
    
    const order = await openVip({ ...params })
    const resData = order[config.requesCode.keyData] || ''
    if (resData && Object.keys(resData).length) {
      wx.requestPayment({
        ...resData,
        success (res) {
          routers('mine')
          console.log(res)  // { errMsg: "requestPayment:ok" }
        },
        fail (res) {
          console.log('取消支付', res) // errMsg: "requestPayment:fail cancel"
        },
        complete() {
        }
      })
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