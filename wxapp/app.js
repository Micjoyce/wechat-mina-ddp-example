//app.js
import Meteor from './meteor/index'


App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 链接Meteor后端

    Meteor.connect('http://localhost:3000')

    Meteor.ddp.on('disconnected', () => {
      console.log('Meteor ddp disconnected')
    })
    
    Meteor.ddp.on('connected', () => {
      console.log('Meteor ddp connected')

      // subscripbe meteor publish
      let msgSub
      Meteor.subscribe('message.all')
        .then(result => msgSub = result)
      // listen publish and get data
      Meteor.ddp.on("added", ({collection, id, fields}) => {
        console.log(collection, id, fields)
      })
      Meteor.ddp.on("changed", ({collection, id, fields}) => {
        console.log(collection, id, fields)
      })
      Meteor.ddp.on("removed", ({collection, id, fields}) => {
        console.log(collection, id, fields)
      })
      // after 5 seconds unsubscribe messages.all
      setTimeout(() => {
        msgSub && msgSub.unsubscribe()
      }, 5000)


      // list Meteor stream message
      Meteor.ddp.on('stream-messages', (ddpMessage) => {
        console.log(ddpMessage)
      })
      // subscribe stream message
      let streamSub
      Meteor.subscribe('stream-messages', 'rid', false)
        .then(result => streamSub = result)

      // after 5 seconds stop subscribe rid's messages
      setTimeout(() => {
        streamSub && streamSub.unsubscribe()
      }, 5000)


      // call send Message
      Meteor.call('sendMessage', 'test message')
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log(err)
        })
    })

    Meteor.ddp.on('error', (err) => {
      console.log('Meteor ddp connect error', err)
    })


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})