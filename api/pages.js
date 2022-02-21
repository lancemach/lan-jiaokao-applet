/*
 * @Author: Lance Ma
 * @Date: 2021-06-04 09:43:32
 * @LastEditTime: 2021-06-04 09:47:37
 * @LastEditors: Please set LastEditors
 * @Description: 单页面
 * @FilePath: .\api\pages.js
 */
import request from '../utils/request'

const apis = {
    'check': 'pages/get'
}

// 查询单页面
export function check (data) {
    return request('get', apis.check, data)
}
