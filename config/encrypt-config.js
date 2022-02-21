/*
 * @Author: Lance Ma
 * @Date: 2019-12-15 14:42:05
 * @LastEditTime: 2021-01-23 19:47:02
 * @LastEditors: Please set LastEditors
 * @Description: 通信加密验证
 * @FilePath: .\config\encrypt-config.js
 */

import MD5 from 'md5'
import defaultSettings from './default-config'

export const getClientAppletKey = MD5(defaultSettings.secret)
