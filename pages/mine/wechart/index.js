/*
 * @Author: Lance Ma
 * @Date: 2021-06-09 16:56:31
 * @LastEditTime: 2021-07-01 15:14:29
 * @LastEditors: Please set LastEditors
 * @Description: 用户基本信息
 * @FilePath: .d\pages\mine\wechart\index.js
 */
// pages/mine/wechart/index.js
import storageSync from '../../../store/storage'
import dayjs from '../../../components/dayjs/dayjs.min'
import { wxLogin } from "../../../api/index"
import {
  getUserProfile,
  getUserCode
} from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const updated = storageSync.get('userInfo.updated') || 0
    if (! updated) {
      this.bindUserUpdateCode()
    } else {
      this.setData({ updated })
    }
    
    const userInfo = storageSync.get('userInfo') || {}
    if (typeof userInfo.updated_time == 'number') {
      userInfo.updated_time = dayjs.unix(userInfo.updated_time).format("YYYY-MM-DD HH:mm")
    }
    this.setData({ userInfo })
  },
  async bindUserUpdateCode() {
      try {
        const wxcode = await getUserCode();
        const { code } = wxcode;
        if (code) {
          this.setData({
            code,
          });
        }
      } catch (error) {
        wx.showToast({
          icon: "error",
          title: "更新失败",
        });
      }
    },
  async bindUserUpdateInfo() {
    try {
      const userProfile = await getUserProfile();

      if (userProfile) {
        const { code } = this.data || 0;
        const user_info = this.data.userInfo || storageSync.get("userInfo")
        const { encryptedData, iv, userInfo } = userProfile
        const info = {
          ...user_info,
          ...userInfo,
        }
        storageSync.set("userInfo", info);
        this.setData({
          userInfo: info,
        });

        const updateData = {
          ...{
            code,
            encryptedData,
            iv,
          },
          ...{
            toast: false,
            openId: user_info.openId,
            update: 1,
          },
        };

        try {
          const update = await wxLogin({
            ...updateData,
          })
          storageSync.set("userInfo.updated", 1, 86400)
          this.setData({ updated: 1 })
          return wx.showToast({
            icon: "none",
            title: "更新成功",
          });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})