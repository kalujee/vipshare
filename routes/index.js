var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/jobs', require('./job'));
router.use('/api/hospitals', require('./hospital'));
router.use('/api/preference', require('./preference'));

module.exports = router;
