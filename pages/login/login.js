/*
 * @Author: Lance Ma
 * @Date: 2021-04-02 15:33:18
 * @LastEditTime: 2021-07-05 09:54:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\pages\login\login.js
 */
// pages/login/login.js
const LanceMa = getApp()

import config from '../../config/default-config'
import { RegExpDict, sleep, syncLogined, syncLoging } from '../../utils/util'
import { sendCode, smsCodeLogin, pageInfo  } from '../../api/index'
// import storageSync from '../../store/storage'
import routers from '../../router/routers'

const countDownComponent = '.control-count-down'

Page({

  /**
   * 页面的初始数据
   */
   data: {
    config,
    checked: true,
    isLogin: false,
    error: {
      phone: false,
      code: false
    },
    productName: config.productName,
    params: {
      phone: false,
      code: false
    },
    phoneCode: {
      sendCycle: 0,
      status: 0,
      default: '点击发送验证码',
      loading: '发送中 ...',
      again: '重新发送验证码',
      text: '',
    },
    disabled: false,
    loading: {
      enable: false,
      text: '登录中 ...'
    },
    isAuth: false,
    sessionKey: false,
    wechartLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.bindWeChartLogin()
    try {
      const login = await pageInfo()
      const resData = login[config.requesCode.keyData]
      this.setData({ ...resData })
    } catch (error) {
      console.log(error)
    }
    
    const text = this.data.phoneCode.default
    this.setData({ 'phoneCode.text': text })
    
  },
  async bindSendCode () {
    const that = this
    const { params, phoneCode, form } = this.data
    const countDown = this.selectComponent(countDownComponent)

    if (! params.phone || ! phoneCode.status || countDown.counting) {
      return
    }
    this.setData({ 'phoneCode.text': phoneCode.loading, 'phoneCode.status': 0 })
    
    try {
      const code = await sendCode({ phone: form.phone, scene: 'login', desired: 'code' })
      const data = code[config.requesCode.keyData]
      
      this.setData({ 'phoneCode.text': '', 'phoneCode.sendCycle': data.expires_in })
      
      countDown.reset()
      
      let showToast = { title: code[config.requesCode.keyMsg] }

      if (! data.serial || Object.keys(data).length === 1) {
        showToast = { ...showToast, ...{ icon: 'none' } }
      }

      sleep(10).then(() => {
        countDown.start()
        console.log('计时开始')
      })
      this.setData({ 'phoneCode.status': 0 })
      wx.showToast({ ...showToast })

    } catch (error) {

      countDown.reset()
      this.setData({ 'phoneCode.text': phoneCode.again, 'phoneCode.status': 1 })
    }

  },
  bindWeChartLogin() {
    
    this.setData({ 
                    wecharDisabled: true,
                    wechartLoading: {
                      enable: true,
                      text: '微信正在登录中 ...'
                    }
                })
    this.wechartLogin()
  },
  async wechartLogin() {
    const login = await syncLoging(this, LanceMa)
    console.log('login', login)
    if (login) {
      wx.showToast({ icon: 'none', title: '请先绑定手机号码' })
      sleep(1000).then(res => this.setData({ wecharDisabled: false, wechartLogin: false }))
      
    }
  },
  onChange (e) {
    const { seconds, minutes, milliseconds} = e.detail
    const time = minutes * 60 + seconds
    if (seconds >= 1) {
      this.setData({
        'phoneCode.text': '重新发送('+ (time < 9 ? '0' + time : time)  + 's)',
      })
    } else {
      if (milliseconds <= 1000) {
          const { params, phoneCode } = this.data
          if (params.phone) {
            this.setData({ 'phoneCode.text': phoneCode.again, 'phoneCode.status': 1 })
          } else {
            this.setData({ 'phoneCode.text': phoneCode.default, 'phoneCode.status': 0 })
          }
      }
      
    }
  },
  checkInput({target, detail}) {
    const { name } = target.dataset
    const { value } = detail
    const { params, error, phoneCode } = this.data
    const regExp = {
      phone: RegExpDict.phone,
      code: RegExpDict.code
    }
    
    const values = { ...params , ...{ [name]: regExp[name].test(value) }}

    if (name === 'phone') {
      if (regExp[name].test(value) && ! this.selectComponent(countDownComponent).counting) {
        this.setData({ 'phoneCode.status': 1, 'form.phone': value })
      } else {
        this.setData({ 'phoneCode.status': 0 })
      }
    }

    this.setData({ 
      params: values,
      isLogin: Object.values(values).indexOf(false) !== -1 ? false : true,
      error: { ...error , ...{ [name]: ! regExp[name].test(value) }}
    })
    
  },
  testInput({target, detail}) {
    const { min } = target.dataset
    const { value } = detail
    if (value.length >= min) {
      this.checkInput({target, detail})
    }
  },
  bindGoPages ({ currentTarget }) {
    const { dataset } = currentTarget || {}
    const { id } = dataset || 0
    if (! id) {
      return
    }
    return routers(['pages', 'id=' + id])
  },
  onCheckboxChange ({ detail }) {
    this.setData({
      checked: detail
    })
  },
  // getPhoneNumber (e) {
  //   console.log(e)
  // },
  async formSubmit ({detail}) {
      const { checked } = this.data
      if (! checked) {
        return wx.showToast({
          title: '请勾选用户协议',
          icon: 'none',
          duration: 1600
        })
      }
    // 必须是在用户已经授权的情况下调用
      const { value } = detail
      const { userInfo } = this.data || ''
      const { unionId, openId } = userInfo || ''
      this.setData({'loading.enable': true, disabled: true })
      const values = { 
          ...{ type: 2 },
          login: value,
          ...{ unionId: unionId },
          ...{ openId: openId }
      }
      console.log(values, 666)
      try {
        const login = await smsCodeLogin(values)
        const data = login[config.requesCode.keyData]
        const { token } = data || ''
        if (token) {
          this.setData({'loading.enable': false, 'loading.text': '登录成功'})
          return syncLogined(this, LanceMa, data, userInfo, token)
        } else {
          sleep(800).then(res => this.setData({'loading.enable': false, disabled: false}))
        }
      } catch (error) {
          sleep(800).then(res => this.setData({'loading.enable': false, disabled: false}))
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