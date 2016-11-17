msgStreamer = new Meteor.Streamer('message');

msgStreamer.allowRead('all');
msgStreamer.allowWrite('all');


Meteor.startup(function(){
  Meteor.setInterval(function(){
    msgStreamer.emit("message", {msg: "hello"});
  }, 1000);
});
