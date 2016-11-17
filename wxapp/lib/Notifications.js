var Meteor = require('../meteor/Meteor');
var Streamer = require('../meteor/stream/Streamer');
const Notifications = new class {
	constructor() {
		this.debug = false;
		this.streamAll = new Streamer('notify-all');
		this.streamRoom = new Streamer('notify-room');
		this.streamRoomUsers = new Streamer('notify-room-users');
		this.streamUser = new Streamer('notify-user');

		if (this.debug === true) {
			this.onAll(function() { return console.log("Notifications: onAll", arguments); });
			this.onUser(function() { return console.log("Notifications: onAll", arguments); });
		}
	}


	notifyRoom(room, eventName, ...args) {
		if (this.debug === true) { console.log("Notifications: notifyRoom", arguments); }

		args.unshift(`${room}/${eventName}`);
		return this.streamRoom.emit.apply(this.streamRoom, args);
	}

	notifyUser(userId, eventName, ...args) {
		if (this.debug === true) { console.log("Notifications: notifyUser", arguments); }

		args.unshift(`${userId}/${eventName}`);
		return this.streamUser.emit.apply(this.streamUser, args);
	}

	notifyUsersOfRoom(room, eventName, ...args) {
		if (this.debug === true) { console.log("Notifications: notifyUsersOfRoom", arguments); }

		args.unshift(`${room}/${eventName}`);
		return this.streamRoomUsers.emit.apply(this.streamRoomUsers, args);
	}

	onAll(eventName, callback) {
		return this.streamAll.on(eventName, callback);
	}

	onRoom(room, eventName, callback) {
		if (this.debug === true) {
			this.streamRoom.on(room, function() { return console.log(`Notifications: onRoom ${room}`, arguments); });
		}

		return this.streamRoom.on(`${room}/${eventName}`, callback);
	}

	onUser(eventName, callback) {
		return this.streamUser.on(`${Meteor.userId()}/${eventName}`, callback);
	}


	unAll(callback) {
		return this.streamAll.removeListener('notify', callback);
	}

	unRoom(room, eventName, callback) {
		return this.streamRoom.removeListener(`${room}/${eventName}`, callback);
	}

	unUser(callback) {
		return this.streamUser.removeListener(Meteor.userId(), callback);
	}
};

module.exports = Notifications
