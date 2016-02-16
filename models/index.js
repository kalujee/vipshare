'use strict';

/*
* Model Data Access Module
*/

var config = require('config');
var mongoose = require('mongoose');
var debug = require('debug')('app:model:' + process.pid);
//var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
mongoose.set('debug', false);

var initialize = function(cb){
	if (mongoose.connection.readyState === 0) {
		var options = {
			db: { native_parser: true },
			server: { poolSize: 4 , socketOptions: { keepAlive: 1 }},
		}
		mongoose.connect(config.get('mongodb'),options);
		mongoose.connection.on('error', function () {
			console.log('Mongoose connection error');
		});
		mongoose.connection.once('open', function callback() {
			console.log("Mongoose connected to the database");
			if(cb)cb();
		});
	}
	else {
		if(cb)cb();
	}

}

debug('Model index initializing');

module.exports = {
	initialize: initialize,
	job: require('./job').job,
	hospital: require('./hospital').hospital,
	preference: require('./preference').preference
};