/*
 * @Author: Lance Ma
 * @Date: 2019-12-01 14:56:14
 * @LastEditTime : 2022-02-21 13:03:06
 * @LastEditors  : Lance Ma
 * @Description: 默认配置 文件
 * @FilePath     : \config\default-config.js
 */
const website = 'https://lansi-jiakao.lancema.com/' // 接口地址
export default {
  hostURL: website,
  hostAPI: website + 'api/',
  headerToken: 'Access-Token',
  secret: 'p6dl8BUXxu37oibahwF1eJPStcOQIskT',
  qqMapKey: 'OC3BZ-N6T34-MGYUP-XDWXL-F2YY5-IB6CT', // 腾讯地图Key
  mainName: 'index',
  loginName: 'login',
  indate: {
    wxCode: 60 * 5 - 1, //微信code 有效期
  },
  sms: {
    'name': 'aliyun' // aliyun、qqyun ....
  },
  customComponent: {
    tabBarHeight: 118,
    navBarHeight: 88
  },
  requesCode: {
    keyCode: 'errcode',
    statusCode: 100200,
    loginOutCode: 100403,
    keyMsg: 'errmsg',
    keyData: 'data'
  },
  skin: {
    heightopColors: '#58D26F',
    saturationColors: '#57BD02',
    graynessColors: '#99A8B1',
    primaryColors: '#1BB823',
    errorColors: '#FF623E',
    lowColors: '#E8FCE7',
    microlensColor: 'rgba(255, 255, 255, .96)',
    distantColors: '#B1D7FD',
  },
  params: {
    tabbarHeight: 50, // *.px
    dividerText: '已经到底了，哦'
  },
  productName: '蓝思驾考',
  version: 'RC 1.001.23.1944',
  appKW: 'lanbd',
  copyright: {
    date: 'Copyright © 2016 - ' + new Date().getFullYear(),
    data: '技术强力驱动',
    author: '蓝思同学'
  }
}
