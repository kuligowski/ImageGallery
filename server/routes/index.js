var express = require('express');
var router = express.Router();
var mongo   = require('mongodb');
var Grid    = require('gridfs-stream');
var db      = new mongo.Db('projekt', new mongo.Server("localhost", 27017), {safe:true});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST to retrieve photos data*/
router.post('/photos', function(req, res) {
	db.open(function () {
		var gfs = Grid(db, mongo);
		gfs.files.find().toArray(function (err, files) {
			res.send({photos: files});
			db.close();
		});
	});
});

router.post('/upload', function(req, res) {
	var fs = require('fs');
	db.open(function () {
		var gfs = Grid(db, mongo);
		var writestream = gfs.createWriteStream({ filename: req.files[0].name, root: 'photoscollection' });
		writestream.on('close', function (file) {
			res.send({fileName: file.filename});
			db.close();
		});		
		fs.createReadStream(req.files[0].path)
		.pipe(writestream);
	});
});

module.exports = router;
