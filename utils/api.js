/*
 * @Author: Lance Ma
 * @Date: 2019-12-10 11:27:37
 * @LastEditTime: 2021-03-22 15:53:55
 * @LastEditors: Please set LastEditors
 * @Description: 网络接口 配置
 * @FilePath: .\utils\api.js
 */
// import defaultConfig from '../config/default-config'
import request from './request'

const apis = {
  postUpload: 'upload',
  postImports: 'import',
  getUserOpenID: 'wechat/decrypt/data',
  postWeChatLogin: 'auth/login/wechat',
  getMineInfo: 'auth/me',
  postBatchAdd: 'batch/add',
  getBatchCheck: 'batch/check',
  postBatchState: 'batch/state',
  postBatchDelete: 'batch/delete',
  postBatchUpdate: 'batch/update',
  postProductsAdd: 'products/add',
  getProductsCheck: 'products/check',
  postProductsDelete: 'products/delete',
  postProductsUpdate: 'products/update',
  postReportAdd: 'report/add',
  getReportCheck: 'report/check',
  postReportDelete: 'report/delete',
  postReportUpdate: 'report/update',
  postWorkStationAdd: 'work_station/add',
  getWorkStationCheck: 'work_station/check',
  getWorkStationConfigs: 'work_station/configs',
  postWorkStationDelete: 'work_station/delete',
  postWorkStationUpdate: 'work_station/update',
  getReportRelation: 'agg/check/report_relation',
  getWorkBigData: 'agg/check/work_data',
}

export function postUpload (data = '') {
  return apis.postUpload + data
}

export function postImports (data = '') {
  return apis.postImports + data
}


// 获取 用户 openID 
export function getUserOpenID (data) {
  return request('post', apis.getUserOpenID, data)
}

// 小程序(手机号、密码登录)
export function postWeChatLogin (data) {
  return request('post', apis.postWeChatLogin, data)
}

// 获取用户信息
export function getMineInfo (data) {
  return request('get', apis.getMineInfo, {...data, ...{ toast: false }})
}

// 获取用户信息
export function getMeInfo (data) {
  return request('get', apis.getMineInfo)
}

// 添加批号
export function postBatchAdd (data) {
  return request('post', apis.postBatchAdd, data)
}

// 添加查询
export function getBatchCheck (data) {
  return request('get', apis.getBatchCheck, data)
}

// 开启关闭批号
export function postBatchState (data) {
  return request('post', apis.postBatchState, data)
}

// 更新批号
export function postBatchUpdate (data) {
  return request('post', apis.postBatchUpdate, data)
}

// 删除批号
export function postBatchDelete (data) {
  return request('post', apis.postBatchDelete, data)
}

// 添加产品
export function postProductsAdd (data) {
  return request('post', apis.postProductsAdd, data)
}

// 查询
export function getProductsCheck (data) {
  return request('get', apis.getProductsCheck, data)
}

// 更新产品
export function postProductsUpdate (data) {
  return request('post', apis.postProductsUpdate, data)
}

// 删除产品
export function postProductsDelete (data) {
  return request('post', apis.postProductsDelete, data)
}

// 添加工位
export function postWorkStationAdd (data) {
  return request('post', apis.postWorkStationAdd, data)
}

// 查询工位
export function getWorkStationCheck (data) {
  return request('get', apis.getWorkStationCheck, data)
}

// 查询工位 配置
export function getWorkStationConfigs (data) {
  return request('get', apis.getWorkStationConfigs, data)
}

// 更新工位
export function postWorkStationUpdate (data) {
  return request('post', apis.postWorkStationUpdate, data)
}

// 删除工位
export function postWorkStationDelete (data) {
  return request('post', apis.postWorkStationDelete, data)
}

// 添加报告
export function postReportAdd (data) {
  return request('post', apis.postReportAdd, data)
}

// 查询报告
export function getReportCheck (data) {
  return request('get', apis.getReportCheck, data)
}

// 更新报告
export function postReportUpdate (data) {
  return request('post', apis.postReportUpdate, data)
}

// 删除报告
export function postReportDelete (data) {
  return request('post', apis.postReportDelete, data)
}

// 查询报告
export function getReportRelation (data) {
  return request('get', apis.getReportRelation, data)
}

// 查询工作数据
export function getWorkBigData (data) {
  return request('get', apis.getWorkBigData, data)
}