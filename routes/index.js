var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { sessionId: new Date().getTime() });
});

module.exports = router;
