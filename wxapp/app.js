//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    // start ddp connect
    var Meteor = require('./meteor/Meteor')
    var _ = Meteor.underscore;
    Meteor.connect('ws://localhost:3000/websocket');
    wx.Meteor = Meteor;

    // Meteor streamer
    var Streamer = require('./meteor/stream/Streamer');
    wx.Streamer = Streamer;

    // Meteor streamer
    var Notifications = require('./lib/Notifications');
    wx.Notifications = Notifications;
    Notifications.onAll("sayHello", function(msg){
      // console.log("sayHello", msg);
    });

    var msgStreamer = new Streamer("message");
    wx.msgStreamer = msgStreamer;
    msgStreamer.on('message', function(msg) {
      console.log(msg);
    });

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              var options = {email: "test@test.com", pass: "test"};
              wx.Meteor.call("registerUser", options, function(err, result){
                console.log("注册" ,err, result);
                wx.Meteor.loginWithPassword(options.email, options.pass, function (err, result) {
                  console.log("登录", err, result);
                });
              });
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
