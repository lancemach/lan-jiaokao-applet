/*
 * @Author: Lance Ma
 * @Date: 2021-04-02 12:13:03
 * @LastEditTime: 2021-10-18 16:43:41
 * @LastEditors: Lance Ma
 * @Description: In User Settings Edit
 * @FilePath: \pages\index\index.js
 */
// index.js
// 获取应用实例
const lancema = getApp()

import { getUserLocation, getStoreUserLocation, setSafeArea, getUserLogin, gotoLogin, sleep, obgImplode } from '../../utils/util'
import { pageIndex, pageInfo, getAd } from '../../api/index'
import routers from '../../router/routers'
import storageSync from '../../store/storage'
import config from '../../config/default-config'
import { drivingLicence, drivingSubject } from '../../config/base.common'

Page({
  data: {
    config,
    name: 'index',
    drivingSubject,
    subjectId: 1,
    subjectName: '科一',
    tabActive: 0,
    isTabBar: true,
    loadingStart: true,
    loadingType: '',
    location: {},
    slider: [],
    driving: 2,
    type: 'C1',
    city: 156610100,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(data) {
    this.getPageInfo()
    this.getAdInfo()
    const { loading } = data
    if (loading) {
      this.setData({ loadingStart: loading })
    }
    this.getPageIndex()
    setSafeArea(this, { isTabBar: true, isNavBar: true })
    
    let location = getStoreUserLocation(lancema) ? getStoreUserLocation(lancema).userLocation.ad_info : ''
    this.setData({ location })
    getUserLocation(lancema).then(res => {
      location = res.ad_info
      this.setData({ location })
    }).catch(e => {})
    
  },
  async getPageInfo () {
    const { city } = this.data
    try {
      const res = await pageInfo({ ...{city}, page: 'index' })
      const resData = res[config.requesCode.keyData]
      this.setData({ ...resData, ...{ loadingStart: false } })
    } catch (error) {
    }
  },
  async getAdInfo () {
    const { city } = this.data
    try {
      const res = await getAd({ ...{city}, parent_id: 1 })
      const resData = res[config.requesCode.keyData]
      this.setData({ ...resData })
    } catch (error) {
    }
  },
  async getPageIndex(subjects = 0) {
    const userInfo = storageSync.get("userInfo") || {};
    const { driving } = storageSync.get('driving') || this.data || 0
    const { subjectId, type } = this.data

    try {
      const res = await pageIndex({ uid: userInfo.uid || 0, cid: driving, subjects: subjects || subjectId, type: type || '' })
      const resData = res[config.requesCode.keyData]
      const { study } = resData
      if (study && study.name) {
        resData.study.pinyin = drivingLicence[study.name] || ''
      }
      this.setData({ ...resData })
    } catch (error) {
      
    }
    
  },
  onTabActive ({ currentTarget }) {
    const { subjectId } = this.data
    const { id } = currentTarget.dataset || 1
    if (subjectId === id) {
      return
    }

    const subjectName = drivingSubject[id - 1].name || ''
    this.setData({ subjectId: id, subjectName })
    this.getPageIndex(id)
  },
  bindGotoPage ({ currentTarget }) {
    const { page } = currentTarget.dataset || ''
    if (page === 'city') {
      return wx.showToast({ icon: 'none', title: "当前只开通西安城市" })
    }
    routers(page)
  },
  bindToExamination ({ currentTarget }) {
    const { study, subjectId } = this.data
    const { simulation, login, page, rule, tid } = currentTarget.dataset || 0

    let param = 'random=' + (simulation || 0) + '&type=' + study.type + '&subjects=' + subjectId

    if (page) {
      let pages = page
      if (page === 'collect') {
        param += '&cate=' + tid
        pages = ['studyCate', param]
      }
      if (page === 'paper') {
        
        pages = ['vip', param]
      }
      if (login && ! getUserLogin()) {
        return gotoLogin(getCurrentPages(), pages)
      }
      return routers(pages)
    }
    
    if (rule) {
      // const question = storageSync.get(obgImplode({
      //   random: simulation || 0,
      //   type: study.type,
      //   subjects: subjectId
      // }) + "question") || {}

      // if (! question || Object.keys(question).length < 1) {
      //   return wx.showToast({
      //     icon: "error",
      //     title: '您还未答过任何题',
      //   });
      // }
      param += '&rule=' + rule
    }

    if (login && ! getUserLogin()) {
      return gotoLogin(getCurrentPages(), ['exam', param])
    }
    routers(['exam', param])
  },
  bindGov12122 () {
    routers('gov')
  },
  bindGoPages ({ currentTarget }) {
    const { dataset } = currentTarget || {}
    const { id } = dataset || 0
    if (! id) {
      return
    }
    return routers(['pages', 'id=' + id])
  },
  bindGoDrives ({ currentTarget }) {
    const { site } = this.data
    const { dataset } = currentTarget || {}
    const { id, subjects } = dataset || 0
    if (! subjects) {
      wx.showToast({ icon: 'none', title: '视频不存在' })
      return
    }
    return routers(id ? ['media', 'id=' + id + '&subjects=' + subjects + '&passed=' + site.passed] : ['media-list', 'subjects=' + subjects])
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
   onShow: function () {
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //     console.log('设置选中项 0')
    //     this.getTabBar().setData({
    //       selected: 0
    //     })
    // }
 
    sleep(600).then(res => {
      // 检车是否有未完成考试
      if (storageSync.get('random_1_question')) {
        wx.showModal({
          content: '您有一个考试未完成，是否继续考试？',
          success (res) {
            if (res.confirm) {
              routers(['exam', 'random=1'])
            } else if (res.cancel) {
              storageSync.remove('random_1_question')
            }
          }
        })
      }
    })
  }
})
