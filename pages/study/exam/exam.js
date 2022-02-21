/*
 * @Author: Lance Ma
 * @Date: 2021-04-15 14:27:30
 * @LastEditTime: 2021-06-23 09:53:33
 * @LastEditors: Please set LastEditors
 * @Description: 答题(考试)
 * @FilePath: .\pages\study\exam\exam.js
 */
// pages/study/exam/exam.js

const lancema = getApp();

import config from "../../../config/default-config";
// import dayjs from '../../../components/dayjs/dayjs.min'
// import duration from '../../../components/dayjs/plugin/duration'
// dayjs.extend(duration)
import { questionTypes } from "../../../config/base.common";
import {
  setSafeArea,
  getUserProfile,
  getUserCode,
  // syncWeChartUpdate,
  disSystemInfo,
  colorToRGB,
  formatSeconds,
  sleep,
  obgImplode,
  arrayShuf,
  urlEncode
} from "../../../utils/util";
import { check, collect } from "../../../api/study";
import { wxLogin } from "../../../api/index";
import routers from "../../../router/routers";
import storageSync from "../../../store/storage";

const selectComponent = ".control-count-down";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    config,
    hieghtTabbar: 100,
    disabled: true,
    loadingStart: true,
    start: 0,
    popShow: false,
    dist: 20,
    elapsedTime: 80,
    problem: {},
    question: {
      timer_in: 45 * 60 * 1000,
      expires_in: 45 * 60 * 1000,
      residue_in: 0,
      collect: 0,
      list: [],
    },
    recite: 0,
    lastX: 0,
    lastY: 0,
    timeStamp: 0,
    maxHieghtTabbar: 0,
    catchTouch: true,
    model: 1,
    target: ['random', 'type', 'subjects']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { target } = this.data
    const userInfo = storageSync.get("userInfo") || {};
    let question = storageSync.get((options.random == 1 ? 'random_1_' : obgImplode(options, target)) + "question") || {}

    if (question.length > 0 && typeof question == "string") {
      question = JSON.parse(question)
    }

    this.checkQuestion(question, options)
    
    if (options.random == 1 && options.review == 1) {
      storageSync.remove("random_1_question")
    }
    if (userInfo.nickName === "微信用户" && userInfo.gender === 0) {
      this.bindUserUpdateCode()
      this.setData({
        update: 1,
      });
    }

    setSafeArea(this, {
      isTabBar: true,
      isNavBar: true,
    })
    this.setData({
      ...options,
      ...{ options },
      ...{
        userInfo,
      },
    });

    
  },
  bindGoVIP() {
    routers('vip')
  },
  // 查询考题
  async checkQuestion(question, options, param = { limit: 200, page: 1 }) {
    const { random, subjects, type, review, review_wong, rule } = options || "";
    if ((rule && ['random','errors','collect','undone'].indexOf(rule) !== -1) || Object.keys(question).length < 1 || !question || question.list.study.length < 1) {
      try {
          if (random == 0) {
            if (! param.id) {
              param.id = -1
            }
            param.limit = 1
            options = { ...options, ...param }
          }

          const exam = await check({
            ...options,
          });
          const resData = exam[config.requesCode.keyData];

          if (random == 0 && this.data.maxHieghtTabbar) {
            this.bindUnfoldExam()
          }
          if (resData.list.study && resData.list.study.length < 1) {
            this.setData({
              loadingStart: false,
              question: resData,
              start: 1,
            })
            return this.bindStartExam()
          }

          // 格式化部分数据
          const study = [...resData.list.study].map(problem => {
            const options = []
            for (const key in problem) {
              const element = problem[key]
              if (key.indexOf("option") !== -1 && element.indexOf("、") !== -1) {
                const array = element.split("、") || element
                const item = array[0]

                options.push({
                  item,
                  text: array[1],
                  select: 0,
                  wrong: (problem.answer === item || problem.answer.indexOf(item) !== -1) ? 0 : 1
                })
                delete problem[key]
              } else {
                // 删除选项
                if (key.indexOf("option") !== -1) {
                  delete problem[key]
                }
                if (element) {
                  problem[key] = element 
                }
              }
              problem.options = [... options]
            }

            return problem
          }) || []

          
          if (random == 0) {
            
            // resData.list.folder_list = [ ...resData.list.folder_list || [], ...list || []]
            const problem = resData.list.study[0]
            param.index = resData.list.folder_list.map(i => i.id).indexOf(problem.id) || 0
            problem.index = param.index || 0

            // 添加选中样式
            if (resData.list.folder_list[param.index].answered !== 1) {
                resData.list.folder_list[param.index].style = `color: ${colorToRGB(config.skin.primaryColors, 1)};border-color: ${colorToRGB(config.skin.primaryColors, 1)};`
            }
            if (resData.list.folder_list && resData.list.folder_list.length > 0) {
              resData.list.folder_list.map(i => {
                if (i.answered === 1) {
                  i.style = `
                    color: ${i.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
                    border-color: ${i.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
                    background-color: ${colorToRGB(i.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors, .08)}
                  `
                }
                return i
              })
            }

            let type = 1
            if (problem.options.length === 2 && problem.answer.length === 1) {
                type = 2
            }
            if (problem.options.length === 4 && problem.answer.length > 1) {
                type = 3
            }
            const { list } = this.data.answered || []
            if (list && list.length > 0) {
              const answered = list.filter(i => i.id === problem.id)[0] || []
              if (answered.id === problem.id) {
                problem.wrong = answered.wrong
                problem.options = answered.options
                problem.answered = 1
              }
            }
            
            // problem.answered
            problem.type = type
            problem.typeTitle = questionTypes[type].name || ''

            this.setData({ ...{problem} })
          }

          resData.exam.random = random
          resData.exam.subjects = subjects
          resData.exam.type = type
          this.setData({
            question: resData,
            loadingStart: false,
            start: random == 1 ? 0 : 1,
          })
          // if (random == 0) {
            // this.bindStartExam()
          // }
            
        } catch (error) {
          console.log(error);
        }
    } else {
      if (review == 1 && review_wong == 1) {
          question.list.study = [...question.list.study].filter(i => i.wrong === 1)
          question.list.total = question.list.study.length
      }

      this.setData({
        loadingStart: false,
        ...{
          question,
        },
        start: 1,
      })
      this.bindStartExam()
    }
  },
  // 准备开始答题
  bindStartExam() {
    const { start, random, question, review } = this.data;

    if (question.list.study && question.list.study.length < 1) {
      return
    }

    if (start !== 1 && ! storageSync.get("random_1_question")) {
      this.setData({
        start: 1,
      });
    }

    if (random == 1 && ! storageSync.get("random_1_question")) {
      this.setData({ start: 2 })
    }

    if (review != 1) {
      if (question.residue_in > 0 && random == 1) {
        this.countReset();
        this.setData({
          // "question.startTime": dayjs(),
          "question.expires_in": question.residue_in,
        });
      }
  
      if (question.residue_in > 0 || question.expires_in > 0) {
        this.setProblemData({ currentTarget: { dataset: { index: 0 } } });
        if (random == 1) {
          this.countStart()
          // storageSync.set("random_1_question", JSON.stringify(question))
        }
      }
    } else {
      this.setProblemData({ currentTarget: { dataset: { index: 0 } } });
    }
  },
  setProblemData({ currentTarget }) {
    const { dataset } = currentTarget || 0
    const select = dataset.select || 0
    const num = dataset.index
    const { question, options } = this.data
    let index = num >= 0 ? num : this.data.problem.index || 0

    if (options && options.random == 0) {

      if (select === 1) {
        return this.checkQuestion(0, options, { id: dataset.id})
      }
      
      const tid = this.data.problem.id
      const length = question.list.folder_list.length
      index = tid ? question.list.folder_list.map(i => i.id).indexOf(tid) : 0

      if (num) {
        if (num === -1) {
          if (index === 0) {
            return wx.showToast({
              icon: "error",
              title: '已经是第一道题了',
            })
          }
          index--
        }
        if (num === -2) {
          if (index === length - 1) {
            return wx.showToast({
              icon: "error",
              title: '已经是后一道题了',
            })
          }
          index++
        }
        return this.checkQuestion(0, options, { id: question.list.folder_list[index].id})
      }
      return
    }
    if (num === -1) {
      if (index === 0) {
        return wx.showToast({
          icon: "error",
          title: '已经是第一道题了',
        });
      }
      index--
    }
    if (num === -2) {
      if (index === question.list.study.length - 1) {
        return wx.showToast({
          icon: "error",
          title: '已经是最后一道题了',
        });
      }
      index++
    }

    const problem = question.list.study[index];
    // 取消已选中(未答题)样式
    const findIndex = [...question.list.study].map(i => {
      if (i.current === 1 && i.answered !== 1) {
        i.current = 0
        i.style = ''
      }
      return i
    }) || 0

    // 校验当前题是否已答过
    if (select === 1 && problem.answered !== 1 && problem.wrong !== 1) {
      question.list.study[index].style = {
        color: colorToRGB(config.skin.primaryColors, .8),
        bgc: 'none'
      }
    }

    // 添加选中样式
    question.list.study[index].current = 1
    if (question.list.study[index].answered !== 1 && question.list.study[index].current === 1) {
      question.list.study[index].style = `color: ${colorToRGB(config.skin.primaryColors, 1)};border-color: ${colorToRGB(config.skin.primaryColors, 1)};`
    }
    
    problem.index = index

    let type = 1
    if (problem.options.length === 2 && problem.answer.length === 1) {
        type = 2
    }
    if (problem.options.length === 4 && problem.answer.length > 1) {
        type = 3
    }
    problem.type = type
    problem.typeTitle = questionTypes[type].name || ''

    this.setData({ ...{ problem }, ...{ question } })
    if (dataset.select) {
      this.bindUnfoldExam()
    }
  },
  // 选择答案
  bindEnterAnswer({ currentTarget }) {
    const { dataset } = currentTarget
    const { answer, key, index, multiple } = dataset || 0
    const { problem, question, recite, model, review, options } = this.data
    const { answered } = problem || 0
    let multiples = multiple
    
    if (review == 1 || answered || model === 2) {
      return
    }
    if (typeof key == 'string' && key.length > 0) {
      // 单选
      if (problem.type < 3) {
        const wrong = problem.options.filter(i => i.item === key)[0] || {}

        if (key === wrong.item) {
          wrong.select = 1
        }
        const options = problem.options.filter(i => i.wrong === 0)[0] || {}

        problem.wrong = key !== options.item ? 1 : 0

        options.select = 1
        
        problem.answered = 1

        // 多选
      } else {
        
        const options = problem.options.filter(i => i.item === key)[0] || {}
        
        options.select = ! options.select ? 1 : 0
        
        multiples = ! multiples ? 1 : multiples
        options.multiples = multiples
        
        this.setData({ ...{ problem }, ...{ options } })

        const selected = problem.options.filter(i => i.select === 1) || {}
        
        this.setData({ 'problem.confirmAnswer': selected.length > 1 ? 1 : 0 })

        return
      }
    }

    // 验证当前选项有否错误
    if (multiples === 2) {
      const confirmOptions = [...problem.options].map(i => {
        problem.wrong = i.wrong === 1 && i.select === 1 || i.wrong === 0 && i.select !== 1 ? 1 : 0
        if (i.multiples === 1) {
          i.multiples = 2
        } else {
          if (i.wrong === 0 && i.select !== 1) {
            i.multiples = 1
            i.select = 1
          }
        }
        return i
      })
    }

    const { exam } = question || {}

    if (options && options.random == 0) {
      // 练习答题
      const { list, style } = this.data.answered || []
      const question_answered = [...list || [], ...[
        {
          id: problem.id,
          wrong: problem.wrong,
          options: problem.options
        }
      ]]
      const style_list = {...style || {}, ...{ 
        [problem.id]:
                      `
                        color: ${problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
                        border-color: ${problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
                        background-color: ${colorToRGB(problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors, .08)}
                      `
      }}

      const answerWrong = question_answered.filter(i => i.wrong === 1).length || 0
      const answerRight = question_answered.filter(i => i.wrong === 0).length || 0

      this.setData({ 
                      answered: {
                        list: question_answered,
                        style: style_list,
                        right: answerRight,
                        wrong: answerWrong,
                        undone: exam.full_marks - answerRight - answerWrong
                      } 
                  })

    } else {
      question.list.study[problem.index].style = `
        color: ${problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
        border-color: ${problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors};
        background-color: ${colorToRGB(problem.wrong === 1 ? config.skin.errorColors : config.skin.primaryColors, .08)}
      `

      question.list.study[problem.index].wrong = problem.wrong
      question.list.study[problem.index].answered = 1
      const answerWrong = question.list.study.filter(i => i.wrong === 1).length || 0
      const answerRight = question.list.study.filter(i => i.wrong === 0).length || 0
      
      question.exam = { ...exam, ... { right: answerRight, wrong: answerWrong, undone: exam.full_marks - answerRight - answerWrong } }
    }

    // 收藏(错题)
    if (problem.wrong === 1 && ! problem.isWrong) {
      this.bindCollectExam({ currentTarget: { dataset: { tid: 1, id: problem.id, type: exam.type, subjects: exam.subjects } } })
    }

    // 收藏(已答题)
    if (problem.answered === 1 && ! problem.isAnswered) {
      this.bindCollectExam({ currentTarget: { dataset: { tid: 3, id: problem.id, type: exam.type, subjects: exam.subjects } } })
    }

    this.setData({ ...{ question }, ...{ problem } })
    
    if (recite === 0 && multiples !== 1) {
      sleep(500).then(res => this.setProblemData({ currentTarget: { dataset: { index: -2 } } }))
    }
    
  },
  // 展开答卷（序号）
  bindUnfoldExam() {
    const { maxHieghtTabbar } = this.data
    if (maxHieghtTabbar) {
      this.setData({ maxHieghtTabbar: 0 })
    } else {
      const systemInfo = disSystemInfo()
      this.setData({ maxHieghtTabbar: disSystemInfo().screenHeight / (systemInfo.screenWidth / 750) * .76 })
    }
  },
  // 提交答卷
  bindSubmitExam() {
    const {  question } = this.data
    const { usedTime } = question
    const { random, subjects, type, right, wrong, undone, scores_value, title } = question.exam || 0
    storageSync.set("random_1_question", JSON.stringify(question))
    this.setData({ popShow: false })
    console.log(urlEncode({
      random: random,
      subjects: subjects,
      typeName: title,
      type: type,
      right: right || 0,
      wrong: wrong || 0,
      scores_value: scores_value || 0,
      undone: undone || 0,
      usedTime: usedTime
     }))
    routers([
            'transcript',
             urlEncode({
              random: random,
              subjects: subjects,
              typeName: title,
              type: type,
              right: right || 0,
              wrong: wrong || 0,
              scores_value: scores_value || 0,
              undone: undone || 0,
              usedTime: usedTime
             })
            ], 'reLaunch')
  },
  // 提交答卷(弹窗)
  bindActionExam(status = 0) {
    this.countPause()
    const { question } = this.data || {}
    const { residue_in, timer_in, exam } = question || ''
    const duration = timer_in - residue_in
    const start = typeof status == 'number' ? status : 2
    const right = question.list.study.filter(i => i.wrong === 0) || 0

    // exam.scores_value = exam.right === right.length ? exam.right * exam.question_value : 0
    exam.scores_value = exam.right * exam.question_value || 0

    this.setData({
      ...{ question },
      'question.usedTime': formatSeconds(duration / 1000),
      popShow: true,
      catchTouch: true,
      start
    });
  },
  bindClosedExam() {
    const { random } = this.data.question.exam
    if (random == 1) {
      this.countStart()
      this.setData({
        popShow: false,
        catchTouch: false
      })
    } else {
      // routers('index', 'switchTab')
      this.bindExitExam()
    }
    
  },
  bindExitExam() {
    if (storageSync.remove('random_1_question')) {
      this.setData({ start: 3 })
      sleep(800).then(res => routers('index'))
    }
    
  },
  bindModelExam({ currentTarget }) {
    const { dataset } = currentTarget
    const { model, text } = dataset

    if (this.data.model !== model) {
      wx.showToast({
        icon: "none",
        title: "切换" + text,
        duration: 800
      });
      this.setData({ ...{ model } })
    }
    
  },
  // 触摸开始事件
  touchStart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  // 触摸移动事件
  touchMove: function (event) {
    let timeStamp = this.data.timeStamp || 0
    if (timeStamp < 1) {
      this.data.timeStamp = event.timeStamp
    }
    
  },
  // 触摸结束事件
  touchEnd: function (event) {
    const { dist, options, question } = this.data
    let currentX = event.changedTouches[0].pageX
    let currentY = event.changedTouches[0].pageY
    let tx = currentX - this.data.lastX
    let ty = currentY - this.data.lastY

    if (this.data.timeStamp > 0 && event.timeStamp - this.data.timeStamp > this.data.elapsedTime) {
      if (Math.abs(tx) > Math.abs(ty) && Math.abs(ty) < dist && Math.abs(tx) > 2* dist) {

        //左右方向滑动
        if (tx < 0) {
           //向左滑动 => 自动切换选题
            this.setProblemData({ currentTarget: { dataset: { index: -2 } } })

        } else if (tx > 0) {
            // 向右滑动 => 自动切换选题
            this.setProblemData({ currentTarget: { dataset: { index: -1 } } })
        }
        
      }
      // else {
      //   //上下方向滑动
      //   if (ty < 0) // 向上滑动
      //     console.log('向上滑动')
      //   else if (ty > 0) // 向下滑动
      //   console.log('向下滑动')
      // }
    }

    this.data.timeStamp = 0
    //将当前坐标进行重计以进行下一次计算
    this.data.lastX = 0
    this.data.lastY = 0

  },
  bindAnswerExam() {},
  countChange(e) {
    let { seconds, minutes, hours, milliseconds } = e.detail;
    const residue_in = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    seconds = seconds < 10 ? '0' + seconds : seconds
    minutes = minutes < 10 ? '0' + minutes : minutes
    if (milliseconds <= 1000) {
      this.setData({
        "question.timer": minutes + ":" +seconds,
        "question.residue_in": residue_in,
      });
    }
  },
  async bindCollectExam({ currentTarget }) {
    const { dataset } = currentTarget
    
    try {
      const data = await collect({ ...dataset })
      if (dataset.tid === 2) {
        this.setData({ 'problem.favorite': ! this.data.problem.favorite })
      }
    } catch (error) {
      wx.showToast({
        icon: "error",
        title: (this.data.problem.favorite ? '取消' : '添加') + "收藏失败",
      });
    }
    
  },
  onclickLeft() {
    const { question, start, review } = this.data || ''
    if (review == 1) {
      return routers('index')
    }
    if (question.exam && question.exam.random == 1 && start === 2) {
      return this.bindActionExam(1)
    }
    return routers('index')

  },
  countStart() {
    const countDown = this.selectComponent(selectComponent);
    countDown.start();
  },

  countPause() {
    const countDown = this.selectComponent(selectComponent);
    countDown.pause();
  },

  countReset() {
    const countDown = this.selectComponent(selectComponent);
    countDown.reset();
  },
  async bindUserUpdateCode() {
    try {
      const wxcode = await getUserCode();
      const { code } = wxcode;
      console.log(code)
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
        const user_info = this.data.userInfo || storageSync.get("userInfo");
        const { encryptedData, iv, userInfo } = userProfile;
        const info = {
          ...user_info,
          ...userInfo,
        };
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
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const { question, start, random, review } = this.data
    if (question.residue_in > 0 && random == 1 && start == 2 && ! review) {
      question.expires_in = question.residue_in;
      storageSync.set("random_1_question", JSON.stringify(question))
      console.log('考试中...，保存考题')
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
