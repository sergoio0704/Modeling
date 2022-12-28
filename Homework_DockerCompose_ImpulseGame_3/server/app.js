const config = require('config')
const path = require('path')
const express = require('express');

const PORT = config.get('port') || 5000

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var cors = require('cors');
app.use(cors())

app.all(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

require('./controllers/authController')(app)
require('./controllers/accountController')(app)
require('./controllers/gameController')(app)
require('./controllers/healthcheckController')(app)

// app.use('/', express.static('../client/build'));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve('../client/build/index.html'));
// });

app.listen(PORT, function () {
    console.log('Server started on ' + PORT + ' port.');
});
