/*
 * @Author: Lance Ma
 * @Date: 2021-04-11 12:13:30
 * @LastEditTime: 2021-04-11 12:30:21
 * @LastEditors: Please set LastEditors
 * @Description: CopyRight
 * @FilePath: .\components\copyright\index.js
 */
// components/copyright/index.js
import config from '../../config/default-config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconColor: String,
    textColor: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    config,
    textColor: 'rgba(0, 0, 0, .2)',
    iconColor: 'rgba(0, 0, 0, .2)'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
