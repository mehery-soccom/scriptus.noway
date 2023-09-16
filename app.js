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
    if (req.headers['content-type'] === ""){
        return req.headers['content-type'] = 'application/json';
    }
    else if (typeof req.headers['content-type'] === 'undefined'){
        return req.headers['content-type'] = 'application/json';
    }else{
        return req.headers['content-type'] = 'application/json';
    }
}});

app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({limit: '50mb',extended: true}));
app.use(bodyParser.text({limit: '50mb',extended: true}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(cookieParser());


//app.use(require('connect-restreamer')());
const proxy = require('./app/service/proxy');
app.use('/postman/', customParser, proxy("http://127.0.0.1:8082/",{
    path : "/postman"
}));
app.use('/admin/', customParser, proxy("http://127.0.0.1:8081/",{
    path : "/admin"
}));
app.use('/agent', proxy("http://127.0.0.1:8083/",{
    path : "/agent"
}));
app.use('/bot', proxy("http://127.0.0.1:8084/",{
    path : "/bot"
}));
app.use('/xms', proxy("http://127.0.0.1:8085/",{
    path : "/xms"
}));
app.use('/demo/', customParser, proxy("http://127.0.0.1:8086/",{
    path : "/demo"
}));
app.use('/contak', proxy("http://127.0.0.1:8087/",{
    path : "/contak"
}));


app.use(haltOnTimedout)

app.use(express.static('/api/routes'));
app.use(haltOnTimedout)

app.get('/',function(req,res) {
    res.send({ x : "Hello World!"});
});

function print_request(req){
    console.log("/=============  " + new Date() + "   =============/")
    console.log(JSON.stringify(JSON.parse(JSON.stringify(req.body))))
    console.log("\n") 
}

const noway_controller = require('./app/controller/noway_controller');

app.use('/noway/',noway_controller);

app.use(cors());
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