const msgStreamer = new Meteor.Streamer('messages');

msgStreamer.allowRead('all');
msgStreamer.allowWrite('all');


Meteor.startup(function(){
  Meteor.setInterval(function(){
    msgStreamer.emit("rid", {msg: "hello"});
  }, 1000);
});
