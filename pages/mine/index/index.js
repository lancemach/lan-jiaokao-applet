/*
 * @Author: Lance Ma
 * @Date: 2021-06-08 18:25:43
 * @LastEditTime: 2021-10-18 14:35:44
 * @LastEditors: Lance Ma
 * @Description: In User Settings Edit
 * @FilePath: \pages\mine\index\index.js
 */
// pages/mine/index/index.js
const lancema = getApp()
import { pageInfo, info } from '../../../api/index'
import { setSafeArea } from '../../../utils/util'
import { studyData } from '../../../api/study'
import storageSync from '../../../store/storage'
import config from '../../../config/default-config'
import { character as charDict } from '../../../config/base.common'
import routers from '../../../router/routers'
import F2 from '../../../components/f2-canvas/lib/f2'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    name: 'mine',
    isTabBar: true,
    popupShow: false,
    driving: 2,
    subjects: 1,
    f2Image: '',
    charName: '',
    type: 'C1',
    actions: [
      {
        name: '选项',
      },
      {
        name: '选项',
      },
      {
        name: '选项',
        subname: '描述信息',
        openType: 'share',
      }],
    opts: {
      // lazyLoad: true
    },
    chartComponent: null,
    chart: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setSafeArea(this, { isTabBar: true, isNavBar: true })
    const character = storageSync.get('character') || 1
    this.setData({ charName: charDict[character - 1], character, isVip: [1, 2, 3].indexOf(character) !== -1 })
    const userInfo = storageSync.get("userInfo") || {}
    if (userInfo && Object.keys(userInfo).length) {
      this.setData({ userInfo })
    }
    this.getStudyData()
    this.getUserInfo()
    this.getPageInfo()
    
  },
  async getUserInfo () {
    const { character } = this.data
    if (character) {
      this.initF2GaugeChart()
    }
    const res = await info()
    const resData = res[config.requesCode.keyData]
    const userInfo = { ...this.data.userInfo || {}, ...resData }
    if (userInfo.nickName) {
      if (userInfo.nickName.length > 10) {
        userInfo.nickNameText = 'long'
        if (userInfo.nickName.length > 14) {
          userInfo.nickNameText = 'longer'
        }
      }
    }

    this.setData({ userInfo })
    storageSync.set("userInfo", userInfo)
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
  async getStudyData (subjectId = 0) {
    const { driving } = storageSync.get('driving') || this.data || 0
    const { subjects, character } = this.data
    try {
      const res = await studyData({ cid: driving, subjects: subjectId || subjects })
      const resData = res[config.requesCode.keyData]
      const { study } = resData
      if (study && study.name) {
        resData.study.pinyin = drivingLicence[study.name] || ''
      }

      if (character) {
        this.chartComponent.chart.changeData(study.list)
      }
      
      this.setData({ ...resData })
    } catch (error) {
      
    }
    
  },
  changeSubject({ currentTarget }) {
    const { dataset } = currentTarget
    const { subjects } = dataset || 0
    if (! subjects) {
      return
    }
    this.getStudyData(subjects)
    this.setData({ subjects })
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
  bindGeToQuestionBank () {
    return routers('studyCategoryForm')
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
  initF2GaugeChart(results_value = 0) {
    const self = this
    const { title, honor } = self.data
    self.chartComponent = self.selectComponent('#f2-chart');
    self.chartComponent.init((canvas, width, height) => {
      const chart = new F2.Chart({
        el: canvas,
        width,
        height,
        padding: [8, 0, 10, 8]
      });
      const data = [];
      chart.source(data, {
        label: null
      });
      
      chart.axis(false);
      chart.tooltip(false)
      
      chart.area()
        .position('created_time*score')
        .color('l(90) 0:#1890FF 1:#f7f7f7')
        .shape('smooth');
      chart.line()
        .position('created_time*score')
        .color('l(90) 0:#1890FF 1:#f7f7f7')
        .shape('smooth');
      chart.area()
        .position('created_time*privilege')
        .color('l(90) 0:#FF195D 1:#f7f7f7')
        .shape('smooth');
      chart.line()
        .position('created_time*privilege')
        .color('l(90) 0:#FF195D 1:#f7f7f7')
        .shape('smooth');
      chart.render();
      return chart;
    })
  },
  bindGeToWechart () {
    return routers('wechart')
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