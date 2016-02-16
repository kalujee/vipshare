var express = require('express');
var router = express.Router();

var HospitalModel = require('../models').hospital;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.get('/', function(req, res, next) {

	var paging = {pagenum: 20, page: 1};
	if (req.query.page) {
		paging.page = req.query.page;
	}

	HospitalModel.find()
				   .skip(paging.pagenum * (paging.page - 1))
				   .limit(paging.pagenum)
				   .sort({modifyTime: 'desc'})
				   .exec(function(err, hos) {
				   	if (err) {
				   		return res.json({rc: 500, error: err});
				   	} else {
				   		return res.json({rc: 200, data: hos});
				   	}

				   });
});

router.get('/search', function(req, res, next) {

	var info = req.query.info;
	var paging = {pagenum: 20, page: 1};
	if (req.query.page) {
		paging.page = req.query.page;
	}

	HospitalModel.find({name: eval('/' + info + '/')})
			.skip(paging.pagenum * (paging.page - 1))
		    .limit(paging.pagenum)
		    .sort({modifyTime: 'desc'})
			.exec(function(err, hos) {
				if (err) {
					return res.json({rc: 500, error: err});
				} else {
					return res.json({rc: 200, data: hos});
				}
			});
});


module.exports = router;