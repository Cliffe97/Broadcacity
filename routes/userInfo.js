var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userInfo', { title: 'User Informtion' });
});

module.exports = router;
