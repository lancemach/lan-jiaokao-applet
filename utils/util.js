/*
 * @Author: Lance Ma
 * @Date: 2019-12-09 20:29:29
 * @LastEditTime: 2021-10-18 15:14:14
 * @LastEditors: Lance Ma
 * @Description: 通用公共方法库
 * @FilePath: \utils\util.js
 */
const lanceMa = getApp()

import config from '../config/default-config'
import storageSync from '../store/storage'
import routers from '../router/routers'
import pagesURL from '../config/page-urls'
import QQMapWX from './qqmap-wx-jssdk'

import { wxLogin } from '../api/index'

const qqMapSdk =  {
  mapObj: new QQMapWX({ key: config.qqMapKey })
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 数组去重
export const getArrayToFlat = arr => {
  return Array.from(new Set(arr))
}

export const getUserLogin = () => {
  return storageSync.get(config.headerToken) ? true : false;
}

// 调起客户端小程序设置界面，返回用户设置的操作结果

export const getOpenSetting = (type = true) => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      withSubscriptions: type === 'subscriptionsSetting' ? true : false,
      success (res) {
        if (type === 'subscriptionsSetting') {
          resolve(res.subscriptionsSetting)
        } else {
          if (type === true) {
            resolve(res)
          } else {
            const scope = res.authSetting[`scope.${type}`]
            console.log(scope)
            if (scope) {
              resolve(scope)
            } else {
              reject(f)
            }
          }
        }
      },
      fail (f) {
        reject(f)
      }
    })
  })
}

// 获取 用户当前权限
export const getUserAuthSetting = (type = true) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: type === 'subscriptionsSetting' ? true : false,
      success (res) {
        if (type === 'subscriptionsSetting') {
          resolve(res.subscriptionsSetting)
        } else {
          if (type === true) {
            resolve(res)
          } else {
            const scope = res.authSetting[`scope.${type}`]
            if (scope) {
              resolve(scope)
            } else {
              reject(f)
            }
          }
        }
      },
      fail (f) {
        reject(f)
      }
    })
  })
}

// 储存 用户信息
export const setUserInfo = (that, app, data) => {
  app.userInfo = data.userInfo
  app.hasUserInfo = data.status
  that.setData({
    userInfo: data.userInfo,
    hasUserInfo: data.status
  })
}

// 获取用户位置
export const getUserLocation = (app, type = 'default') => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        getGeographic(app, res, type).then(location => {
          resolve(location)
        })
      },
      fail (e) {
        console.log('位置获取失败：', e)
        e.location = false
        resolve(e)
      }
    })
  })
}

// 腾讯地图 经纬度（location）获得当前地理位置
export const getGeographic = (app, pos, type) => {
  return new Promise((resolve, reject) => {
    qqMapSdk.mapObj.reverseGeocoder({
      location: {
        latitude: pos.latitude,
        longitude: pos.longitude
      },
      success (res) {
        setUserLocation(app, { userLocation: res.result, status: true }, type)
        resolve(res.result)
      },
      fail (e) {
        wx.showToast({ title: e.message.includes(`fail`) === true ? '获取用户位置失败' : e.message, icon: 'none' })
        reject(e)
      }
    })
  })
}
// 储存 用户位置信息 
export const setUserLocation = (app, data, type = 'default') => {
  const storeType = `location.${type}`
  app.globalData.storeType = data
  storageSync.set(storeType, data)
  app.hasLocation = true
}

export const getStoreUserLocation = (app = {}, type = 'default') => {
  const storeType = `location.${type}`
  return (app ? app.globalData.storeType : false) || storageSync.get(storeType)
}

// 处理用户当前位置 (地标)
export const setUserLandmark = data => {

  const getLocation = data.userLocation
  const district = getLocation.address_component.district
  const landmark_l1Title = getLocation.address_reference.landmark_l1 ? getLocation.address_reference.landmark_l1.title : ''
  const landmark_l2Title = getLocation.address_reference.landmark_l2 ? getLocation.address_reference.landmark_l2.title : ''
  const landmark_title = landmark_l2Title ? (
    landmark_l2Title.indexOf(district) !== -1 ? landmark_l2Title.substring(landmark_l2Title.indexOf(district) + district.length) : landmark_l2Title
  ) : (
    landmark_l1Title.indexOf(district) !== -1 ? landmark_l1Title.substring(landmark_l1Title.indexOf(district) + district.length) : landmark_l1Title
  )
  const userLocation = {
    district: district || getLocation.address_component.city,
    landmark: landmark_title.length < 9 ? landmark_title : landmark_title.substr(0, 8) + ' ...'
  }
  return userLocation
}


// 获取用户设备信息
export const getSystemInfo = () => {
  return disSystemInfo()
}

// 获取数组中数值的(最大/最小值) type: true(最大值) false（最小值）
export const getArrayLimit = (data = [], min = false) => {
  return min === true ? Math.min.apply(null, data) : Math.max.apply(null, data)
}

// 获取页面状态栏的高度，单位px
export const getStatusBarHeight = () => disSystemInfo().statusBarHeight

// 获取页面安全区高度
export const getSafeMainHeight = () => {
  return disSystemInfo().screenHeight - disSystemInfo().statusBarHeight - 45
}

// 处理设备信息
export const disSystemInfo = () => {
  const userSystemInfo = wx.getSystemInfoSync()
  Object.assign(userSystemInfo, {
    systemAbbr: userSystemInfo.system.split(' ')[0].toLowerCase(),
    menuButtonBounding: wx.getMenuButtonBoundingClientRect(),
    devicePixelRatio: userSystemInfo.windowWidth / 750
  })
  return userSystemInfo
}

// 开启 Loading 状态
export const setLoadingStart = (that, delayTime = 5) => {
  const boole = true
  that.setData({ loadingStart: boole })
  lanceMa.globalData.loadingStart = boole
  setLoadingType(that, 'loading')
}

// 关闭 Loading 状态
export const setLoadingClose = (that, time = 460) => {
  const { isTitle, title } = that.data

  wx.hideNavigationBarLoading()
  wx.setNavigationBarTitle({ title: isTitle && isTitle.enabled ? title + '(' + isTitle.number + ')' : title })
  setTimeout(() => {
    that.setData({ loadingStart: false })
    lanceMa.globalData.loadingType = ''
    lanceMa.globalData.loadingStart = false
  }, time)
}

// 设置 Loading 类型
export const setLoadingType = (that, type) => {
  setTimeout(() => {
    that.setData({ loadingType: type })
    lanceMa.globalData.loadingType = type
  }, 120)
}

// 获取页面节点
export const getPageSelectorNode = (id, style = [], that = false) => {
  if (! that) {
    
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery().select(id).fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY'],
        computedStyle: style,
        context: true,
      }, res => {
        // res.dataset    // 节点的dataset
        // res.width      // 节点的宽度
        // res.height     // 节点的高度
        // res.scrollLeft // 节点的水平滚动位置
        // res.scrollTop  // 节点的竖直滚动位置
        // res.scrollX    // 节点 scroll-x 属性的当前值
        // res.scrollY    // 节点 scroll-y 属性的当前值
        // // 此处返回指定要返回的样式名
        // res.margin
        // res.backgroundColor
        // res.context    // 节点对应的 Context 对象
        resolve(res)
      }).exec()
    })
  }
  const query = wx.createSelectorQuery().in(that)
  return new Promise((resolve, reject) => {
    query.select(id).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}

// 显示转发页面 配置
export const setShowShareMenu = () => {
  return new Promise((resolve, reject) => {
    wx.showShareMenu({
      withShareTicket: true,
      success (res) {
        resolve(res)
      },
      fail (e) {
        reject(e)
      }
    })
  })
}

// 获取用户 登录凭证（code）
export const getUserCode = () => {
  return new Promise((resolve, reject) => {
    // wx.checkSession({
    //   success () {
    //     resolve({ sessionKey: true })
    //   },
    //   fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success (res) {
            const code = res || ''
            if (code) {
              resolve(code)
            } else {
              reject('')
            }
          },
          fail (e) {
            reject(e)
          }
        })
    //   }
    // })
  })
}

// 获取用户 登录凭证（code）
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { encryptedData, iv } = res
        resolve({ encryptedData, iv })
      },
      fail (e) {
        reject('')
      }
    })
  })
}

export const getUserProfile = (desc = '用于完善会员资料') => {
  return new Promise((resolve, reject) => {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc, // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        console.log(res)
        resolve(res)
      },
      fail: e => {
        reject(e)
      }
    })
  })
}

// 获取用户 登录凭证（code）
// export const getUserLogin = () => {
 
// }

export const getDataType = data => {  
  return Object.prototype.toString.call(data).replace(/\[object\s(.+)\]/, "$1").toLowerCase()
}

//a~z 排序
export const charCodeSort = (data, key, lang = 'zh') => {
  if (! key) { return [] }
  if (lang === 'zh') {
    return data.sort((a, b)=> a[key].localeCompare(b[key], 'zh'))
  }
  return data.sort((a, b) => a[key].charCodeAt(0) - b[key].charCodeAt(0));
}

export const gotoLogin = (pages, param) => {
  const fromRoute = pages[pages.length-1].route
  
  if (fromRoute && ('/' + fromRoute !== pagesURL(config.loginName))) {
    const pagesName = pagesURL(fromRoute, true) || ''
    storageSync.set('loginFrom', param ? param : pagesName)
  }
  console.log(config.loginName)
  return routers(config.loginName)
}

export const syncLogined = (that, LanceMa, data, userInfo, token) => {
  storageSync.set(config.headerToken, token)
  delete data.token
  storageSync.set("userInfo", { ...userInfo, ...data })
  setUserInfo(that, LanceMa, {
    userInfo: { ...userInfo, ...data },
    status: true
  })
  
  sleep(300).then(() => {
    const loginFrom = storageSync.get('loginFrom') || null

    if (loginFrom) {
      storageSync.remove('loginFrom')
      console.log(loginFrom)
      return routers(loginFrom, 'reLaunch')
    }
    return routers('index', 'reLaunch')
  })
}

// 用户微信登录
export const syncLoging = async (that, LanceMa) => {
  const userCode = await getUserCode()
    if (userCode) {
      const info = await getUserInfo()
      const { code, sessionKey } = userCode || 0
      let loginData = { ...info }
    
      if (sessionKey !== true) {
        loginData = { ...{ code: code }, ...loginData }
      }
      try {
        const login = await wxLogin({ ...loginData , ...{ toast: false }})
        const data = login[config.requesCode.keyData] || []
        const { token } = data || ''
        console.log('token', data)
        if (token) {
          return syncLogined(that, LanceMa, data, {}, token)
        }
        return new Promise((resolve, reject) => {
          if (data.openId) {
            that.setData({ userInfo: data })
            resolve(1)
          }
          reject(0)
        })
      } catch (error) {
        console.log(error)
      }
    }
}

// 用户更新微信信息
// export const syncWeChartUpdate = async that => {
//   const userCode = await getUserCode()
//     if (userCode) {
//       const info = await getUserProfile()
//       // const { code, sessionKey } = userCode || 0
//       // let loginData = { ...info }
    
//       // if (sessionKey !== true) {
//       //   loginData = { ...{ code: code }, ...loginData }
//       // }
//       // try {
//       //   const update = await wxLogin({ ...loginData , ...{ toast: false }})
//       //   const data = update[config.requesCode.keyData] || []
//       //   console.log(data)
       
//       // } catch (error) {
//       //   console.log(error)
//       // }
//     }
// }

export const setSafeArea = (that, target, params = { tabbar: 0, navbar: 0 }) => {
  const { statusBarHeight, screenWidth } = wx.getSystemInfoSync() || '';
  const { isTabBar, isNavBar } = target
  let setStyle = []
  if (isTabBar) {
    setStyle = [ ...setStyle, ...[`--tabbar-safe-area-height:${ params.tabbar ? params.tabbar : config.customComponent.tabBarHeight}rpx`]]
  }
  if (isNavBar) {
    setStyle = [ ...setStyle, ...[`--navbar-safe-area-height:${ params.navbar ? params.navbar : config.customComponent.navBarHeight + statusBarHeight * 750 / screenWidth }rpx`]]
  }
  that.setData({ setStyle: setStyle.join(';') })
}

// 对象转字符串(拼接)

export const obgImplode = (object = {}, include = [], str = '_') => {
  let strings = ''
  for (const key in object) {
    if (include && include.length > 0 && include.includes(key)) {
      strings += key + str + object[key] + str
    } else {
      strings += key + str + object[key] + str
    }
  }
  return strings
}

// 随机排序
export const arrayShuf = (arr) => Array.prototype.reduce.call(
  arr,
  (acc, el) => {
      acc.push(el)
      // Move following line to func top for Sattolo's
      let i = Math.floor(Math.random() * (acc.length))
      ;[acc[i], acc[acc.length - 1]] = [acc[acc.length - 1], acc[i]]
      return acc
  },
[])

// 颜色转换
export const colorToRGB = (val, opa) => {

  var pattern = /^(#?)[a-fA-F0-9]{6}$/; //16进制颜色值校验规则
  var isOpa = typeof opa == 'number'; //判断是否有设置不透明度

  if (!pattern.test(val)) { //如果值不符合规则返回空字符
      return '';
  }

  var v = val.replace(/#/, ''); //如果有#号先去除#号
  var rgbArr = [];
  var rgbStr = '';

  for (var i = 0; i < 3; i++) {
      var item = v.substring(i * 2, i * 2 + 2);
      var num = parseInt(item, 16);
      rgbArr.push(num);
  }

  rgbStr = rgbArr.join();
  rgbStr = 'rgb' + (isOpa ? 'a' : '') + '(' + rgbStr + (isOpa ? ',' + opa : '') + ')';
  return rgbStr;
}

/* param 将要转为URL参数字符串的对象
* key URL参数字符串的前缀
* encode true/false 是否进行URL编码
* idx ,循环第几次，用&拼接
* return URL参数字符串
*/
export const urlEncode = (param, idx = 1, key, encode = false) => {  
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    var one_is = idx < 3 ? '?' : '&';
    paramStr += one_is + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      idx++
      paramStr += urlEncode(param[i],idx, k, encode);
    }
  }
  return paramStr;
}

// 格式化时间
export const formatSeconds = value => {
  let seconds = parseInt(value)// 秒
  let minutes = 0// 分
  let hours = 0// 小时
  if (seconds > 60) {
      minutes = parseInt(seconds / 60)
      seconds = parseInt(seconds % 60)
      if (minutes > 60) {
          hours = parseInt(minutes / 60)
          minutes = parseInt(minutes % 60)
      }
  }

  const second = parseInt(seconds) //秒
  const minute = parseInt(minutes) //分
  let result = 10 > seconds && seconds > 0 ? '0' + second : second
      result = (10 > minutes && minutes > 0 ? '0' + minutes : minutes) + ":" + result
  if (hours > 0) {
      result = "" + parseInt(hours) + ":" + result;//时
  }
  return result;
}

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

// 正则表达式
export const RegExpDict = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  IDNumber: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
  phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
  image: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  picture: /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i,
  password: /^\S*(?=\S{6,16})(?=\S*\d)(?=\S*[a-z])\S*$/,
  batch: /^[a-zA-Z0-9_-]{6,20}$/,
  number: /^\d{1,10}$/,
  decimals: /^100$|^([1-9]\d*|0)(\.\d{1,2})?$/,
  isNull: /\S/,
  code: /^\d{6}$/,
  hanzi: /^(?:[\u4e00-\u9fa5·]{2,8})$/ //2-8个字之间，仅支持中文
}
// 获取 #loadin-box 页面节点
// const getLoadingBoxNode = that => {
//   return getPageSelectorNode('.loading-box', that)
// }

