const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require("cors");
var path = require('path');
const config = require('config')
global.appRoot = path.resolve(__dirname);

const timeout = require('connect-timeout')

app.use(timeout('10s'))
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(haltOnTimedout)

app.use(express.static('/api/routes'));
app.use(haltOnTimedout)

app.get('/',function(req,res) {
    res.send({ x : "Hello World!"});
});


app.use((req,res,next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }

module.exports = app;