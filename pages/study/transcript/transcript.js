/*
 * @Author: Lance Ma
 * @Date: 2021-04-27 16:57:37
 * @LastEditTime: 2021-06-11 11:10:18
 * @LastEditors: Please set LastEditors
 * @Description: 考试成绩单
 * @FilePath: .\pages\study\transcript\transcript.js
 */
// pages/study/transcript/transcript.js
// 
const lancema = getApp()

import config from "../../../config/default-config"
import { setSafeArea, colorToRGB, sleep } from '../../../utils/util'
import routers from '../../../router/routers'
import storageSync from '../../../store/storage'
import F2 from '../../../components/f2-canvas/lib/f2'
import dayjs from '../../../components/dayjs/dayjs.min'
import { examinationPaper } from '../../../api/study'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    lanTtitle: '考试成绩',
    bgColor: '',
    bgColorHigh: '',
    title: ['马路杀手', '车轮老司机', '秋名山车神'],
    opts: {
      // lazyLoad: true
    },
    chartComponent: null,
    chart: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let { lanTtitle, title } = this.data
    const { scores_value, typeName, type, right, wrong, usedTime } = options || 0
    lanTtitle += scores_value < 90 ? ' (不合格)' : ' (合格)'
    
    const params = {
      ...{ type, right, wrong },
      score: scores_value,
      honor: scores_value < 100 ? (scores_value > 90 ? title[1] : title[0]) : title[2],
      note: lanTtitle,
      use_time: usedTime,
      subjects: typeName
    }
    console.log(params)
    try {
      await examinationPaper({ ... params })
    } catch (error) {
      wx.showToast({
        icon: "error",
        title: "考试成绩提交失败",
      });
    }
    this.setData({ setStyle: `.container::before`, honor: params.honor, ...{ options }, dayTime: dayjs().format("YYYY-MM-DD HH:mm:ss") , ...{ lanTtitle }, bgColor: colorToRGB(scores_value < 90 ? config.skin.errorColors : config.skin.primaryColors, .92), bgColorHigh: colorToRGB(scores_value < 90 ? config.skin.errorColors : config.skin.primaryColors, .5) })
    setSafeArea(this, { isNavBar: true })
    this.initF2GaugeChart(scores_value)
  },
  initF2GaugeChart(results_value = 0) {
    const self = this
    const { title, honor } = self.data
    self.chartComponent = self.selectComponent('#f2-gauge-chart');
    self.chartComponent.init((canvas, width, height) => {
      const chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source([
        { pointer: '当前成绩', value: 0, length: 2, y: 1.05 }
        ], {
        value: {
          type: 'linear',
          min: 0,
          max: 100,
          nice: false
        },
        length: { type: 'linear', min: 0, max: 90 },
        y: { type: 'linear', min: 0, max: 1 }
      });
    
      chart.coord('polar', {
        inner: 0,
        startAngle: -1.25 * Math.PI,
        endAngle: 0.25 * Math.PI,
        radius: .96
      });
    
      //配置value轴刻度线
      chart.axis('value', false);
    
      chart.axis('y', false);
    
      //绘制仪表盘辅助元素
      chart.guide().arc({
        start: [0, 1.05],
        end: [results_value, 1.05],
        style: {
          strokeStyle: 'rgba(255,255,255, .78)',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [0, 1.05],
        end: [100, 1.05],
        style: {
          strokeStyle: 'rgba(255,255,255, .15)',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [0, 1.2],
        end: [100, 1.2],
        style: {
          strokeStyle: 'rgba(255,255,255, .15)',
          lineWidth: 1
        }
      });
    
      // chart.guide().text({
      //   position: [-0.5, 1.3],
      //   content: '0',
      //   style: {
      //     fillStyle: 'rgba(255,255,255, .6)',
      //     fontSize: 14,
      //     textAlign: 'center'
      //   }
      // });
      // chart.guide().text({
      //   position: [100, 1.3],
      //   content: '100',
      //   style: {
      //     fillStyle: 'rgba(255,255,255, .6)',
      //     fontSize: 14,
      //     textAlign: 'center'
      //   }
      // });

      chart.guide().text({
        position: [50, .1],
        content: results_value,
        style: {
          fillStyle: 'rgba(255,255,255, .96)',
          fontSize: '68',
          textAlign: 'center'
        }
      });

      chart.guide().text({
        position: [50, -.45],
        content: honor,
        style: {
          fillStyle: 'rgba(255,255,255, .96)',
          fontSize: '16',
          textAlign: 'center'
        }
      });
    
      chart.point().position('value*y').color('rgba(255, 255, 255, 0)')
      chart.render();
      return chart;
    })
  },
  onclickLeft() {
    return routers('index')
  },
  bindAction({ currentTarget }) {
    const { subjects, type } = this.data.options
    const { dataset } = currentTarget
    const { id } = dataset
    const question = storageSync.get('random_1_question') || ''
    if (question.length < 1 && typeof question == "string") {
      return routers('index')
    }
    this.setData({ review: 0 })
    if (id <= 2) {
        this.setData({ review: 1 })
        return sleep(300).then(res => routers(['exam', 'review=1&random=1' + (id === 1 ? '&review_wong=1' : '')], 'reLaunch'))
    } else {
      return routers(['exam', 'random=1&type=' + type + '&subjects=' + subjects], 'reLaunch')
    }
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
    if (this.data.review != 1) {
      return storageSync.remove('random_1_question')
    }
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