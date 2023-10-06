const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
var path = require('path');
const config = require('@bootloader/config');
global.appRoot = path.resolve(__dirname);
app.set("view engine", "ejs");

const timeout = require('connect-timeout')
app.use(timeout('10s'))

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

// app.use('/postman/', proxy("http://127.0.0.1:8082/",{
//     path : "/postman"
// }));
// app.use('/admin/', proxy("http://127.0.0.1:8081/",{
//     path : "/admin"
// }));
// app.use('/agent/', proxy("http://127.0.0.1:8083/",{
//     path : "/agent"
// }));
// app.use('/bot/', proxy("http://127.0.0.1:8084/",{
//     path : "/bot"
// }));
// app.use('/xms/', proxy("http://127.0.0.1:8085/",{
//     path : "/xms"
// }));
// app.use('/demo/', proxy("http://127.0.0.1:8086/",{
//     path : "/demo"
// }));
// app.use('/contak/', proxy("http://127.0.0.1:8087/",{
//     path : "/contak"
// }));
// app.use('/mxnode/', proxy("http://127.0.0.1:3000/",{
//     path : "/mxnode"
// }));

app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({limit: '50mb',extended: true}));
app.use(bodyParser.text({limit: '50mb',extended: true}));
app.use(bodyParser.raw({limit: '50mb'}));


app.use(haltOnTimedout)

app.use(express.static('/api/routes'));
app.use(haltOnTimedout)

app.use(cors());
app.get('/',function(req,res) {
    res.send({ x : "Hello World!"});
});
const noway_controller = require('./app/controller/noway_controller');
app.use('/noway/',noway_controller);

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