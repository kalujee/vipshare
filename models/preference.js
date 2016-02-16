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

var PreferenceSchema = mongoose.Schema({
    devicetoken: { type: String, required: true, index: true, mergeable: false },
    // hospitalname: {type: String, required: true, mergeable: true},
    preference: [{type: String, mergeable: true}]
},{ versionKey: 'version', 'autoIndex': config.autoIndex });

PreferenceSchema.plugin(timestamps,{createdAt: 'createTime', updatedAt: 'modifyTime'});
PreferenceSchema.path('createTime').get(dc);
PreferenceSchema.path('modifyTime').get(dc);
PreferenceSchema.set('toObject', { getters: true });
PreferenceSchema.set('toJSON', { getters: true });

PreferenceSchema.statics.insertNew = function (preference, cb) {
	// this.findOne({name: job.name, hospital: job.hospital}, function(err, one) {
	// 	if (err) {
	// 		cb(err);
	// 	} else if (one) {
	// 		cb('already exist');
	// 	} else {
			this.create(preference, cb);
	// 	}
	// });
}

var PreferenceModel = mongoose.model('Preference', PreferenceSchema);

module.exports = {preference: PreferenceModel};
