Meteor.publish("message.all", function(){
  return message.find();
});
