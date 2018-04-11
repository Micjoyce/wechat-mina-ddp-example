import DDP from './ddp/index';
import sha256 from './sha256';

const TOKEN_KEY = 'mina_meteor_usertoken';
const SERVER_TIMEOUT = 30000;

const Meteor = {
	TOKEN_KEY,
	hashPassword(password) {
		return {
			digest: sha256(password).toString(),
			algorithm: "sha-256"
		}
	},
	getUserToken() {
    try {
      var value = wx.getStorageSync(TOKEN_KEY)
      return value;
    } catch (e) {
      console.log('getUserToken error: ', e);
    }
  },
  saveUserToken(token = '') {
    try {
      wx.setStorageSync(TOKEN_KEY, token)
    } catch (e) {    
      console.log('saveUserToken error: ', e);
    }
  },
  reconnect() {
		if (this.ddp) {
			this.ddp.reconnect();
		}
	},
	
	call(methodName, params) {
		return this.ddp.call(methodName, params)
	},

	subscribe(...args) {
		return this.ddp.subscribe(...args);
	},

	connect(url) {
		if (this.ddp) {
			this.ddp.disconnect();
		}
		this.ddp = new DDP(url);
		return this;
	},

	loginWithPassword({ username, password }, callback) {
		let params = {
      password: password,
      user: {
        username
      }
    };
    if (typeof username === 'string' && username.indexOf('@') !== -1) {
      params.user = { email: username };
    }
		return this.login(params, callback);
	},

	disconnect() {
		if (!this.ddp) {
			return;
		}
		delete this.ddp;
		return this.ddp.disconnect();
  },

	login(params, callback) {
		return this.ddp.call('login', params).then((result) => {
			if (typeof callback === 'function') {
				callback(null, result);
			}
			return result;
		}, (err) => {
			if (/user not found/i.test(err.reason)) {
				err.error = 1;
				err.reason = 'User or Password incorrect';
				err.message = 'User or Password incorrect';
			}
			if (typeof callback === 'function') {
				callback(err, null);
			}
			return Promise.reject(err);
		});
  },

	logout() {
		if (this.ddp) {
			this.ddp.logout();
		}
    this.saveUserToken('');
	}
};

export default Meteor;