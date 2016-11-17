//index.js
//获取应用实例
var app = getApp()
var Meteor = wx.Meteor;
var util = require('../../utils/util.js')
var _ = Meteor.underscore;

function sortMessage(msgArr){
  if (!_.isArray(msgArr)) {
    return msgArr;
  }
  return msgArr.sort(function(a, b){
    return new Date(b._updateAt) - new Date(a._updateAt);
  });
}

Page({
  data: {
    messages: [],
    userInfo: {},
    inputValue: ""
  },
  //事件处理函数
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  sendMessage: function(e) {
    var self = this;
    var msg = this.data.inputValue;
    if (!msg || msg.length < 1) {
      return;
    }
    Meteor.call("sendMessage", msg, function(err, result) {
      if (!err) {
        self.setData({
          inputValue: ""
        })
        console.log("发送成功");
      }
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    // 数据订阅
    var subReady = Meteor.subscribe('message.all');
    var DDP = Meteor.getData().ddp;
    Meteor.Tracker.autorun(function(){
      console.log("message.all 订阅状态",subReady.ready())
    });
    DDP.on("added", _.debounce(({collection, id, fields}) => {
      this.setData({
        messages: sortMessage(Meteor.collection(collection).find())
      })
    }), 200);
    DDP.on("changed", _.debounce(({collection, id, fields}) => {
      this.setData({
        messages: sortMessage(Meteor.collection(collection).find())
      })
    }), 200);
    DDP.on("removed", _.debounce(({collection, id}) => {
      this.setData({
        messages: sortMessage(Meteor.collection(collection).find())
      })
    }), 200);
  }
})
