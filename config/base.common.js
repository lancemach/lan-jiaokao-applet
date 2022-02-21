/*
 * @Author: Lance Ma
 * @Date: 2021-02-06 15:13:59
 * @LastEditTime: 2021-06-15 14:41:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\plant-statistic\config\base.common.js
 */
export const drivingLicence = {
    '小车': 'xiaoche',
    '货车': 'huoche',
    '客车': 'keche',
    '摩托车': 'motuoche'
}

export const questionTypes = {
    1:{ name: '单选'},
    2:{ name:'判断'},
    3:{ name:'多选'}
}

export const drivingSubject = [
    {
        id: 1,
        name: '科一',
        indexSwiper: true
    },
    {
        id: 2,
        name: '科二',
        indexSwiper: false
    },
    {
        id: 3,
        name: '科三',
        indexSwiper: false
    },
    {
        id: 4,
        name: '科四',
        indexSwiper: true
    }
]

export const character = ['学员', '车主', '教练', '店主']