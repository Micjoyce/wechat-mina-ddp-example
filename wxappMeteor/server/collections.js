import { Mongo } from  'meteor/mongo';

message = new Mongo.Collection("message");
message.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
