/*
 * @Author: Lance Ma
 * @Date: 2021-04-07 13:27:33
 * @LastEditTime: 2021-06-10 11:10:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\components\lan-tabbar\index.js
 */
// components/lan-tabbar/index.js
const lancema = getApp();

import config from '../../config/default-config'
import routers from '../../router/routers'

Component({
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    hieghtBar: Number,
    maxHieghtBar: Number,
    custom: Boolean,
    list: Array,
    name: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#7a7a7a",
    selectedColor: config.skin.primaryColors,
    list: [],
    //适配IphoneX的屏幕底部横线
    isIphoneX: lancema.globalData.isIphoneX
  },
  
  attached() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const dataset = e.currentTarget.dataset
      const { path, index, name } = dataset
      // this.setData({
      //   selected: index
      // })
      return routers(name, 'reLaunch')
      // wx.setTabBarItem 设置
      // 如果是特殊跳转界面 
      // if (this.data.list[index].isSpecial) {
      //   wx.navigateTo({
      //     url: path
      //   })
      // } else {
      //   //正常的tabbar切换界面
      //   wx.switchTab({
      //     url: path
      //   })
      //   this.setData({
      //     selected: index
      //   })
      // }
    }
  }
})