
var path = require('path');
var sessions = require('../utils/sessions');
var express = require('express');
var router = express.Router();

/* upload image form */
router.get('/', function(req, res, next) {
  var sessionId = req.query.sessionId;
  if (sessionId && sessionId>0) {
    var session = sessions.getSession(sessionId);
    if (!!session) {
      return res.render('upload', {
        name: sessions.getSession(sessionId).name
      });
    }
  }

  next(new Error('No session found!'));
});

var uploadPath = path.resolve(__dirname, '../public/images/uploads');
var upload = require('multer')({ dest: uploadPath });

router.post('/', upload.single('upload'), function (req, res, next) {
  if (req.file.size < 10*1024*1024) {
    var sessionId = req.body.sessionId;
    console.log('file received from user:', sessionId);

    if (sessionId && sessionId>0) {
      var session = sessions.getSession(sessionId);
      if (!!session) {
        sessions.getSession(sessionId).sendImagePath(req.file);
        return res.send('File received!');
      }
    }

    next(new Error('No session found!'));
  }
  else {
    next(new Error('File too large!'));
  }
});


module.exports = router;
