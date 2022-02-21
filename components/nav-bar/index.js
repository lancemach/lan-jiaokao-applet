/*
 * @Author: Lance MA
 * @Date: 2020-01-04 22:52:13
 * @LastEditTime: 2021-01-29 12:20:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\components\nav-bar\index.js
 */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        leftLocation: Boolean,
        ghostBar: Boolean,
        border: Boolean,
        statusBar: null,
        zIndex: {
            type: Number,
            value: 1
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        },
        primaryColors: {
            type: String,
            value: '#000000'
        },
        LeftTextClass: {
            type: String,
            value: ''
        }
    },
    data: {
        statusBarHeight: 0
    },
    created: function () {
        var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
        this.setData({ statusBarHeight: statusBarHeight });
    },
    methods: {
        onClickLeft: function () {
            this.$emit('click-left');
        },
        onClickRight: function () {
            this.$emit('click-right');
        }
    }
});
