var express = require('express');
var router = express.Router();

var JobModel = require('../models').job;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.get('/', function(req, res, next) {

	var paging = {pagenum: 20, page: 1};
	if (req.query.page) {
		paging.page = req.query.page;
	}

	console.log(paging);
	JobModel.find().skip(paging.pagenum * (paging.page - 1)).limit(paging.pagenum)
				   .populate('hospital')
				   .sort({releaseData: 'desc'})
				   .exec(function(err, jobs) {
				   	if (err) {
				   		return res.json({rc: 500, error: err});
				   	} else {
				   		return res.json({rc: 200, data: jobs});
				   	}

				   });
});

router.get('/search', function(req, res, next) {

	var info = req.query.info;
	console.log(req.params, req.query);
	var paging = {pagenum: 20, page: 1};
	if (req.query.page) {
		paging.page = req.query.page;
	}

	JobModel.find({$or: [{name: eval('/' + info + '/')}, {description: eval('/' + info + '/')}]})
			.skip(paging.pagenum * (paging.page - 1))
			.limit(paging.pagenum)
			.populate('hospital')
			.sort({releaseData: 'desc'})
			.exec(function(err, jobs) {
				if (err) {
					return res.json({rc: 500, error: err});
				} else {
					return res.json({rc: 200, data: jobs});
				}
			});
});


module.exports = router;