/*
 * @Author: Lance Ma
 * @Date: 2021-04-02 12:29:27
 * @LastEditTime: 2021-06-11 09:01:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\api\study.js
 */

import request from '../utils/request'
import config from '../config/default-config'

const apis = {
    'categoryPage': 'check/study/category/page',
    'check': 'study/check',
    'collect': 'study/collect',
    'examinationCheck': 'study/transcript/check',
    'examinationPaper': 'study/transcript/add',
    'specificTraining': 'study/cate/list',
    'drivingCheck' : 'study/drives/get',
    'symbolCheck' : 'study/symbol/get',
    'studyData' : 'study/data/get'
}

// 获取 用户 （微信信息） 
export function categoryPage (data) {
    return request('get', apis.categoryPage, data)
}

// 查询考题 
export function check (data) {
    return request('get', apis.check, data)
}

// 收藏考题 
export function collect (data) {
    return request('get', apis.collect, data)
}

// 生成成绩单 
export function examinationPaper (data) {
    return request('post', apis.examinationPaper, data)
}

// 查询成绩单 
export function examinationCheck (data) {
    return request('get', apis.examinationCheck, data)
}

// 专项训练
export function specificTraining (data) {
    return request('get', apis.specificTraining, data)
}

// 查询考题 (视频)
export function drivingCheck (data) {
    return request('get', apis.drivingCheck, data)
}

// 查询考题 (图标)
export function symbolCheck (data) {
    return request('get', apis.symbolCheck, data)
}

// 查询考题 (图标)
export function studyData (data) {
    return request('get', apis.studyData, data)
}

