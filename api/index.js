/*
 * @Author: Lance Ma
 * @Date: 2021-04-02 12:29:27
 * @LastEditTime: 2021-08-17 16:02:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\api\index.js
 */

import request from '../utils/request'
import config from '../config/default-config'

const apis = {
    'wxLogin': 'auth/login/wechat',
    'info': 'auth/me',
    'sendCode': `sms/${config.sms.name}/send`,
    'smsCodeLogin': 'auth/login/smscode',
    'pageIndex': 'basic/page/index',
    'pageInfo': 'basic/page/info',
    'getAd': 'basic/ad/get',
    'getVip': 'vip/card/get',
    'addVip': 'vip/card/add',
    'openVip': 'vip/card/open',
    'WeChartToPay': 'pay/wechat/miniapp',
    'WeChartGetPay': 'pay/wechat/get',
    'WeChartClosePay': 'pay/wechat/close',
    'getCategory': 'check/category/get'
}

// 用户信息
export function info () {
    return request('get', apis.info)
}

// 获取 用户 （微信信息） 
export function wxLogin (data) {
    return request('post', apis.wxLogin, data)
}

// 短信验证码 (获取)
export function sendCode (data) {
    return request('post', apis.sendCode, data)
}

// 短信验证码 (登录)
export function smsCodeLogin (data) {
    return request('post', apis.smsCodeLogin, data)
}

// 首页信息
export function pageIndex (data) {
    return request('get', apis.pageIndex, data)
}

// 基础信息
export function pageInfo (data) {
    return request('get', apis.pageInfo, data)
}

// 广告位信息
export function getAd (data) {
    return request('get', apis.getAd, data)
}

// 会员卡查询
export function Vip (data) {
    return request('get', apis.getVip, data)
}

// 会员卡创建
export function addVip (data) {
    return request('post', apis.addVip, data)
}

// 会员卡开通
export function openVip (data) {
    return request('post', apis.openVip, data)
}


// 支付 (微信)
export function WeChartToPay (data) {
    return request('post', apis.WeChartToPay, data)
}

// 支付 (微信) 查询订单
export function WeChartGetPay (data) {
    return request('get', apis.WeChartGetPay, data)
}

// 支付 (微信) 关闭订单
export function WeChartClosePay (data) {
    return request('get', apis.WeChartClosePay, data)
}

// 分类信息
export function category (data) {
    return request('get', apis.getCategory, data)
}