/*
 * @Author: Lance Ma
 * @Date: 2019-12-02 15:15:21
 * @LastEditTime: 2021-06-08 17:30:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\utils\request.js     
 */

const lanceMa = getApp()
import config from '../config/default-config'
import storageSync from '../store/storage'
import { getDataType, gotoLogin, getStoreUserLocation, sleep } from '../utils/util'

// 延迟时间（showToast）
const duration = 1500
/**
 * 设置统一的异常 状态码
 */
const statusCodeCompatable = code => {
  const status = {
    200: '请求成功',
    400: '请求失败',
    401: '用户权限验证失败',
    403: '服务器拒绝请求',
    404: '请求不存在或已删除',
    405: '当前用户未登录',
    500: '服务器内部错误'
  }

  if (!Object.keys(status).includes(`${code}`)) {
    return '网络通信异常'
  }
  return `${code}：` + status[code]
}
  /**
   * 设置统一的异常处理
   */
const errorHandler = message => {
  const data = Object.assign({ title: '操作提示', icon: 'none', duration }, message)
  return wx.showToast(data)
}

export default function request (method = 'GET', url = '', data = {}, header = { 'content-type': 'application/json' }) {
    const targetUrl = getDataType(url) === 'array' ? url.join('/')  : config.hostAPI + url
    let toast = true
    if (data && data.toast === false) {
      toast = data.toast
      delete data.toast
    }
    const { miniProgram } = wx.getAccountInfoSync()
    const location = getStoreUserLocation(null) ? getStoreUserLocation(null).userLocation.ad_info : ''
    data = { ...data,
             ...{ appid: miniProgram.appId,
                  from: 2,
                  // tags: config.appKW,
                  city: location.city_code || 0
                } 
           }
    header[config.headerToken] = storageSync.get(config.headerToken) || ''

    return new Promise((resolve, reject) => {
      wx.request({
        url: targetUrl,
				method: method,
				data: data,
        timeout: 6000,
				header: header,
        success (res) {
          if (res.statusCode !== 200) {
            //其它错误，提示用户错误信息
            if (toast === true) { errorHandler({ title: statusCodeCompatable(res.statusCode) || res.data}) }
            return reject(res)
          }

          const RefreshToken = res.header[config.headerToken] || null
          if (RefreshToken) {
            storageSync.set(config.headerToken, RefreshToken)
          }

          // 通信成功 数据结果异常 处理
          if (res.data[config.requesCode.keyCode] !== config.requesCode.statusCode) {
            if (res.data[config.requesCode.keyCode] === config.requesCode.loginOutCode) {
              if (toast === true) {
                errorHandler({ title: res.data[config.requesCode.keyMsg] || res.errMsg})
              }
              sleep(duration + 10).then(res => gotoLogin(getCurrentPages()))
              
            }
            if (toast === true) { errorHandler({ title: res.data[config.requesCode.keyMsg] || res.errMsg}) }
            return reject(res.data)
          }
          
          resolve(res.data)
        },
        fail (res) {
          if (toast === true) {
            errorHandler({ title: res.errMsg.includes(`fail`) === true ? statusCodeCompatable() : res.errMsg})
          }
          reject(res)
        }
      })
    })
}
