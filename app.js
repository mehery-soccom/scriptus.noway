const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
var path = require('path');
const config = require('@bootloader/config');
global.appRoot = path.resolve(__dirname);
app.set("view engine", "ejs");

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.options('*', cors())
var customParser = bodyParser.json({type: function(req) {
    console.log("customParser:bodyParser.json",req.headers['content-type'])
    if (req.headers['content-type'] === ""){
        return req.headers['content-type'] = 'application/json';
    }
    else if (typeof req.headers['content-type'] === 'undefined'){
        return req.headers['content-type'] = 'application/json';
    } else {
        return req.headers['content-type'] = 'application/json';
    }
}});
app.use(cookieParser());

//app.use(require('connect-restreamer')());
const proxy = require('./app/service/proxy');

const mappings = config.get("proxy.mappings").split(",").map((mapping)=>mapping.trim()).map(function(mapping){
    let server = config.getIfPresent(`proxy.mapping.${mapping}.server`) ;
    let context = config.getIfPresent(`proxy.mapping.${mapping}.context`) || mapping;
    if(server){
        app.use(`/${context}/`, proxy.forward(`${server}/`,{
            path : `/${context}`
        }));
    }
});

app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({limit: '50mb',extended: true}));
app.use(bodyParser.text({limit: '50mb',extended: true}));
app.use(bodyParser.raw({limit: '50mb'}));

app.use(express.static('/api/routes'));

app.get('/',function(req,res) {
    res.send({ x : "Hello World!"});
});

const routes = require('./setup/routes');
app.use('/',routes);

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

module.exports = app;