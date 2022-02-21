/*
 * @Author: your name
 * @Date: 2021-04-09 15:34:47
 * @LastEditTime: 2021-10-17 18:19:34
 * @LastEditors: Lance Ma
 * @Description: In User Settings Edit
 * @FilePath: .\pages\study\category\form.js
 */
// pages/study/category/form.js
// 获取应用实例
const lancema = getApp()

import { categoryPage } from '../../../api/study'
import { setSafeArea, sleep } from '../../../utils/util'
import { drivingLicence } from '../../../config/base.common'
import routers from '../../../router/routers'
import storageSync from '../../../store/storage'
import config from '../../../config/default-config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    drivingLicence,
    loadingStart: true,
    loadingType: '',
    setStyle: '',
    swChecked: true,
    drivingChecked: 2,
    form: {},
    loading: {
      disabled: false,
      enable: false,
      text: '保存中 ...'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const that = this
    that.setData({ setStyle: `.container::before` })
    // setSafeArea(that, { isNavBar: true })
    categoryPage().then(res => {
      const { swChecked, drivingChecked } = this.data
      let { driving, sex } = storageSync.get('driving') || 0
      driving = driving || drivingChecked
      sex = sex || (swChecked ? 1 : 2)
      console.log(sex, driving)
      
      const resData = res[config.requesCode.keyData]
      const drivingData = [...resData.category].filter(i => i.id === driving)[0] || []
      const drivingName = drivingData ? drivingData.name : '小车'
      // console.log(drivingName, driving)
      that.setData({ 
        loadingStart: false,
        ...resData,
        swChecked: sex !== 1 ? false : true,
        sex: resData.dict.sex[sex] || '未知',
        drivingChecked: driving,
        form: {
          sex,
          driving
        },
        drivingName 
      })
    }).catch(e => {})
  },
  onSwitchChange({ detail }) {
    const { sex } = this.data.dict
    console.log(detail)
    this.setData({ swChecked: detail, 'form.sex': detail ? 1 : 2, sex: sex[detail ? 1 : 2]})
    //swChecked
  },
  bindCheckedDriving ({ currentTarget }) {
    const { id, name} = currentTarget.dataset || 2
    this.setData({ drivingChecked: id, 'form.driving': id, drivingName: name})
  },
  bindSetDrivingInfo() {
    const { form } = this.data
    this.setData({'loading.enable': true, 'loading.disabled': true })
    storageSync.set('driving', form)
    sleep(600).then(res => {
      routers('index', 'navigateTo', true)
    }).catch(e => {})
  },
  bindCheckedCities() {
    wx.showToast({ icon: 'none', title: "当前只开通西安城市" })
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