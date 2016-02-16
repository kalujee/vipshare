/**
 * User module
 *
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

var JobSchema = mongoose.Schema({
    name: { type: String, required: true, index: true, mergeable: false },
    // hospitalname: {type: String, required: true, mergeable: true},
    hospital: { type: Schema.Types.ObjectId, required: true , ref: 'Hospital'},
	url: {type: String, required: true, mergeable: true},
	releaseData: {type: Date, required: true, mergeable: true},
	description:{type: String, mergeable: true},
	contact: {type: String, mergeable: true}
},{ versionKey: 'version', 'autoIndex': config.autoIndex });

JobSchema.plugin(timestamps,{createdAt: 'createTime', updatedAt: 'modifyTime'});
JobSchema.path('createTime').get(dc);
JobSchema.path('modifyTime').get(dc);
JobSchema.path('releaseData').get(dc);
JobSchema.set('toObject', { getters: true });
JobSchema.set('toJSON', { getters: true });

JobSchema.statics.insertNew = function (job, cb) {
	// this.findOne({name: job.name, hospital: job.hospital}, function(err, one) {
	// 	if (err) {
	// 		cb(err);
	// 	} else if (one) {
	// 		cb('already exist');
	// 	} else {
			this.create(job, cb);
	// 	}
	// });
}

JobSchema.statics.isExist = function(name, hospital, cb) {
	this.findOne({name: name, hospital: hospital}, function(err, one) {
		if (err) {
			cb(err, null);
		} else if (one) {
			cb(one, true);
		} else {
			cb(null, false);
		}
	});
}

JobSchema.statics.findByName = function(name, cb) {
	this.find({name: eval('/' + name +'/')}, cb);
}



var JobModel = mongoose.model('Job', JobSchema);

module.exports = {job:JobModel};
