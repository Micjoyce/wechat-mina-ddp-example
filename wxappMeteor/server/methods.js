import { Meteor } from 'meteor/meteor';

Meteor.methods({
  sendMessage:function(msg){
    return message.insert({
      msg: msg,
      _updateAt: new Date()
    });
  }
});
