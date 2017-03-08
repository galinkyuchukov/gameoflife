var express = require('express');
var multer  = require('multer');
var fs  = require('fs');

var lif  = require('./modules/lif');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-1.lif`)
  }
})

var upload = multer({ storage: storage })

var filename = __dirname + '/uploads/lif-1.lif';

var app = express();

var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/assets'));

app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	next();
});

app.get('/', function(req, res) {
    var data = {};

    if(fs.existsSync(filename)){
        data.file = filename;
    }

    res.render('index', data);
});

app.get('/simulation', function(req, res) {

    var data = {};
    var options = JSON.parse(fs.readFileSync( __dirname + '/config.json', 'utf8'));

    var lifParser = lif(options);

    if(fs.existsSync(filename)){
        options.fileCells = lifParser.load(filename).parseCellBlocks().result();
        data.file = filename;
    }

    options = JSON.stringify(options);
    data.options = options;

	res.render('simulation', data);
});

app.post('/simulation', upload.single('lif'),  function(req, res) {

    if(req.body.action && req.body.action == 'Delete'){
        fs.unlink(filename);
        res.redirect('/');
        return;
    }

    res.redirect('/simulation');
});

app.listen(port);