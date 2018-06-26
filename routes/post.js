var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('insideget')
  res.render('post', { title: 'Make Your Own Post' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.postType)
  console.log(req.body.code)
  res.render('post', { title: 'Make Your Own Post' });
});



module.exports = router;
