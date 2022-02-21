/*
 * @Author: Lance Ma
 * @Date: 2020-03-16 15:54:06
 * @LastEditTime: 2021-08-17 15:10:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\config\page-urls.js
 */

const pageConfig = {
    login: '/pages/login/login',
    index: '/pages/index/index',
    mine: '/pages/mine/index/index',
    lancema: '/pages/lancema/index',
    gov: '/pages/study/category/gov/gov',
    exam: '/pages/study/exam/exam',
    transcript: "/pages/study/transcript/transcript",
    studyCategoryForm: '/pages/study/category/form',
    studyCate: '/pages/study/category/category',
    record: '/pages/study/record/record',
    'media-list': "/pages/study/media/list/index",
    media: "/pages/study/media/details/index",
    'symbol-list': "/pages/study/symbol/list/index",
    symbol: "/pages/study/symbol/details/index",
    paper: "/pages/study/paper/index",
    wechart: "/pages/mine/wechart/index",
    vip: "/pages/mine/vip/index",
    lancema: "/pages/copyright/lancema/index",
    'mine-card': "/pages/mine/card/index",
    character: "/pages/mine/character/index",
    pages: '/pages/page/index',
    buys: '/pages/buys/index'
}

const pageUrl = (data, rollback = false) => {
    if (rollback) {
        let page = ''
        for (const key in pageConfig) {
            if (pageConfig.hasOwnProperty(key)) {
                const element = pageConfig[key];
                if (element === '/' + data) {
                    page = key
                    break
                }
            }
        }
        return page
    }
    return pageConfig[data]
}

export default pageUrl
