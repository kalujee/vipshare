var express = require('express');
var router = express.Router();

var PreferenceModel = require('../models').preference;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', function(req, res, next) {

	console.log(req.body);
	var preference = JSON.parse(req.body.preference);
	PreferenceModel.findOne({devicetoken: req.body.token}, function(err, one) {
		if (err) {
			res.json({rc: 500, error: err});
		} else {
			if (one) {
				
				one.update({preference: preference}, function(err, newone) {
					if (err) {
						return res.json({rc: 500, error: err});
					}

					return res.json({rc: 200});
				});
			} else {
				PreferenceModel.create({devicetoken: req.body.token, preference: preference}, function(err, newone) {
					if (err) {
						return res.json({rc: 500, error: err});
					}

					return res.json({rc: 200});
				});
			}
		}
	});
});


module.exports = router;