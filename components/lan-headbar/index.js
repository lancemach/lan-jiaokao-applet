/*
 * @Author: Lance MA
 * @Date: 2020-01-04 22:52:13
 * @LastEditTime: 2021-04-27 18:05:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\components\nav-bar\index.js
 */

import config from '../../config/default-config'

Component({
    classes: ['lan-headbar'],
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        title: String,
        titleColor: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        leftArrowColor: String,
        leftLocation: Boolean,
        ghostBar: Boolean,
        border: Boolean,
        statusBar: String,
        background: String,
        barHieght: Number,
        zIndex: {
            type: Number,
            value: 8
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        },
    },
    data: {
        config,
        statusBarHeight: 0,
        style: [],
        styleText: ''
    },
    attached () {
        const { zIndex, safeAreaInsetTop, background, statusBar, barHieght } = this.data
        const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
        let style = [ `padding-top: ${statusBarHeight}px` ]
        if (zIndex) {
            style = [ ...style, ...[ `z-index:  ${zIndex}` ] ]
        }
        if (background) {
            style = [ ...style, ...[ `background:  ${background}` ]]
        }

        const styleText = style.join(';')
        this.setData({
            styleText,
            statusBarHeight: statusBarHeight,
            navBarHeight: barHieght
        });
    },
    methods: {
        onClickLeft: function () {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('click-left', myEventDetail, myEventOption)
        },
        // onClickRight: function () {
        //     const myEventDetail = {} // detail对象，提供给事件监听函数
        //     const myEventOption = {} // 触发事件的选项
        //     this.triggerEvent('click-right', myEventDetail, myEventOption)
        // }
    }
});
