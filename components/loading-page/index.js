/*
 * @Author: Lance Ma
 * @Date: 2020-03-26 22:10:04
 * @LastEditTime: 2021-02-06 11:52:28
 * @LastEditors: Please set LastEditors
 * @Description: Loading
 * @FilePath: .\components\loading\index.js
 */
// components/loading/index.js
import config from '../../config/default-config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadingStart: {
      type: Boolean,
      value: false,
      observer(data) {
        if (data) {
          this.setData({ loadingStart: data })
        }
      }
    },
    loadingType: {
      type: String,
      value: '',
      observer(data) {
        if (data) {
          this.setData({ loadingType: data })
        }
      }
    },
    loadingTitle: {
      type: String,
      value: '',
      observer(data) {
        if (data) {
          this.setData({ loadingTitle: data })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    config,
    loadingType: '',
    loadingTitle: '',
    loadingStart: false
  },
  created() {
    wx.setNavigationBarTitle({title: '加载中 ... '})
    wx.showNavigationBarLoading({success: res => {}})
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // myEventDetail detail对象，提供给事件监听函数 // myEventOption  detail对象，提供给事件监听函数
    setLoadingDataCom (myEventDetail = {}, myEventOption = {}) {
      // 触发事件的选项
      this.triggerEvent('getLoadingDataCom', myEventDetail, myEventOption)
    },
    // 重新获取网络数据
    getLinkedNetwork () {
      this.triggerEvent('getLoadingDataCom', { pageOnLoad: true })
    },
    getOpenSettingLocation () {
      this.triggerEvent('getLoadingDataCom', { opneSetting: 'userLocation' })
    }
  }
})
