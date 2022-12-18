const config = require('config')
const path = require('path')
const express = require('express');

const PORT = config.get('port') || 5000

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


require('./controllers/authController')(app)
require('./controllers/accountController')(app)
require('./controllers/gameController')(app)

app.use('/', express.static('./assets/build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve('assets/build/index.html'));
});

app.listen(PORT, function () {
    console.log('Server started on ' + PORT + ' port.');
});
