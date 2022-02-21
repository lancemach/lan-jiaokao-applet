/*
 * @Author: Lance Ma
 * @Date: 2021-06-18 20:44:33
 * @LastEditTime: 2021-06-18 20:59:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\api\order.js
 */

import request from '../utils/request'
import config from '../config/default-config'

const apis = {
    'order': 'order/get',
    'add': 'order/add',
}

// 订单查询
export function order (data) {
    return request('get', apis.order, data)
}

// 查询考题 
export function orderAdd (data) {
    return request('post', apis.add, data)
}


