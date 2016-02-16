/**
 * Hospital module
 * 医院 Schema
 */
var debug = require('debug')('app:model:user:' + process.pid);
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var async = require('async');
mongoose.plugin(require('mongoose-merge-plugin'));
var timestamps = require('./timestampplugin');
var config = require('config');
var events = require('events');
var emitter = new events.EventEmitter();
var dc = require('./dateutil');


var HospitalSchema = mongoose.Schema({
    name: { type: String, required: true, index: true, mergeable: false },
	url: {type: String, required: true, mergeable: true},
	description: {type: String, mergeable: true},
	contact: {type: String, mergeable: true}
},{ versionKey: 'version', 'autoIndex': config.autoIndex });

HospitalSchema.plugin(timestamps,{createdAt: 'createTime', updatedAt: 'modifyTime'});
HospitalSchema.path('createTime').get(dc);
HospitalSchema.path('modifyTime').get(dc);
HospitalSchema.set('toObject', { getters: true });
HospitalSchema.set('toJSON', { getters: true });

HospitalSchema.statics.insertNew = function (hospital, cb) {
	// this.findOne({name: hospital.name}, function(err, one) {
	// 	if (err) {
	// 		cb(err);
	// 	} else if (one) {
	// 		cb('already exist');
	// 	} else {
			this.create(hospital, cb);
	// 	}
	// });
};

HospitalSchema.statics.isExist = function(url, cb) {
	this.findOne({url: url}, function(err, one) {

		if (err) cb(err, null);
		else if (one) {
			cb(null, true, one._id);
		} else {
			cb(null, false);
		}
	});
}

HospitalSchema.statics.fineOneByName = function(name, cb) {
	this.find({name: name}, cb);
};

HospitalSchema.statics.findByName = function(name, cb) {
	this.find({name: eval('/' + name +'/')}, cb);
};


var HospitalModel = mongoose.model('Hospital', HospitalSchema);

module.exports = {hospital: HospitalModel};
