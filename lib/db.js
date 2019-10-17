'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
// Connection url
const url = process.env.mlabconn;
// Database Name
const dbName = process.env.mlabdb;

// Define user schema
const userSchema = new mongoose.Schema({
  userId: { type : String , unique : true, required : true, dropDups: true },
  privateKey: String,
  address: String,
  createDate: { type: Date, default: Date.now }
});

// Define log schema
const logSchema = new mongoose.Schema({
  content: String
});

var getUser = function(_userId){
   return new Promise(async(resolve, reject) => {
   	let result = null;
	mongoose.connect(url,{ useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', function(){
		mongoose.disconnect();
	});
	db.once('open', async function() {
	  // we're connected!

	  var userCollection = mongoose.model('User', userSchema);

	  await userCollection.find({ userId: _userId },function (err, users) {
		  if (err) mongoose.disconnect();
		  if(users.length > 0)
		  {
			result = users[0];	
		  }
		  mongoose.disconnect();
	  })
	});
	db.on('close', () => { resolve(result); })
  })
}

var saveUser = function(_userId,_privateKey,_address){
   return new Promise(async(resolve, reject) => {
   	let result = null;
	mongoose.connect(url,{ useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', function(){
		mongoose.disconnect();
	});
	db.once('open', async function() {
	  // we're connected!

	  var userCollection = mongoose.model('User', userSchema);

	  var newUser = new userCollection({ 
	  	userId: _userId, 
	  	privateKey: _privateKey,
	  	address: _address
	  });
		
	  await newUser.save(function (err, _user) {
	    if (err) mongoose.disconnect();
	    result = _user;
		mongoose.disconnect();
	  });

	});
	db.on('close', () => { resolve(result); })
  })
}

var saveLog = function(_content){
   return new Promise(async(resolve, reject) => {
   	let result = null;
	mongoose.connect(url,{ useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', function(){
		mongoose.disconnect();
	});
	db.once('open', async function() {
	  // we're connected!

	  var logCollection = mongoose.model('Log', logSchema);

	  var newLog = new logCollection({ 
	  	content: _content
	  });
		
	  await newLog.save(function (err, _log) {
	    if (err) mongoose.disconnect();
	    result = _log;
		mongoose.disconnect();
	  });

	});
	db.on('close', () => { resolve(result); })
  })
}

module.exports = {
    saveUser: saveUser,
    getUser: getUser,
    saveLog: saveLog
};