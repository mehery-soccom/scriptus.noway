const config = require('@bootloader/config');
//var proxy = require('express-http-proxy');
// const { createProxyMiddleware } = require('http-proxy-middleware');
var httpProxy = require('http-proxy');
const httpNative   = require('http');
var agent = new httpNative.Agent({ maxSockets: Number.MAX_VALUE });

const {safely, Response, throwInputException, status ,printRequest} = require('./responsy');
const httpProxyStore = config.store("http-proxy");
const proxyFlags = {
    initd : false
}

var proxy = httpProxy.createProxyServer({
    hostRewrite: true,
    changeOrigin: true,
    secure :  false,
    agent: agent
});

proxy.on("error", function (err, req, res) {
    console.log("proxy error", err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    for(let key in httpProxyStore.headers){
        console.log("proxyReq",key,httpProxyStore.headers[key]);
        proxyReq.setHeader(key,httpProxyStore.headers[key]);
    }
});

proxy.on('proxyRes', function (proxyRes, req, res) {
});

proxy.on('end', function (req, res, proxyRes) {
});

function requestHeaders(){
    httpProxyStore.headers = httpProxyStore.headers || {};
    return  httpProxyStore.headers;
}
function appendRequestHeader(key,value){
    let headers = requestHeaders();
    headers[key]=value;
}
function init(){
    if(proxyFlags.initd) return;
    console.log("initd......")
    const mappings = config.get("proxy.request.headers").split(",").map((mapping)=>mapping.trim()).map(function(mapping){
        let headerKey = config.getIfPresent(`proxy.request.header.${mapping}.key`);
        let headerValue = config.getIfPresent(`proxy.request.header.${mapping}.value`);
        appendRequestHeader(headerKey,headerValue)
    });
    proxyFlags.initd = true;
}

module.exports = {
    forward(host,options){
        host = host.replace(/\/+$/, '');
        if(options.path){
            //options.https = false;
            options.proxyReqPathResolver = function(req){
                var parts = req.url.split('?');
                var queryString = parts[1];
                var updatedPath = options.path + parts[0];
                return updatedPath + (queryString ? '?' + queryString : '');
            }
        }
        let target  = ( host + "/" + options.path || "").replace(/(\/)\/+/g, "$1").replace(/^http(s?):/,'http$1:/');
        console.log("target",target)  
        return function(req, res, next){
            // console.log("header  ", req.headers)
            // let url = host + options.proxyReqPathResolver(req)
            // console.log("url  ", url)
            // httpNative.get(url, function(resp){
            //     console.log("httpNative.request");
            //     let data = [];
            //     resp.on('data', chunk => {
            //         data.push(chunk);
            //     });
            //     resp.on('end', () => {
            //         const rawdata = Buffer.concat(data).toString();
            //         console.log('Response ended: ',(rawdata || "").length);
            //         //res.send({ "e" : rawdata });
            //         res.writeHeader(200, {"Content-Type": "text/html"});  
            //         //res.write(html);
            //         res.write("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>")
            //         res.end();
            //     });
            // }).on('error', err => {
            //     console.log('Error: ', err.message);
            // });
            // return;   
            //res.send({})
            //bodyParser.raw(req,res, function(){
                let to = host + options.proxyReqPathResolver(req)
                // let { hostname } = req;
                // console.log('req',{
                //     hostname
                // })
                console.log("from: ",req.originalUrl)
                console.log("   to:> ",to)
                proxy.web(req, res, {
                    xfwd : true,
                    secure :  false,
                    prependPath : true,
                    target: target ,
                    toProxy :  false,
                    changeOrigin: false,
                  }, function(a,b,c,d,e){
                    next(a,b,c,d,e);
                  });
            //});
        }
        //return proxy(host,options)
    },
    appendRequestHeader(key,value){
        init();
        appendRequestHeader(key,value);
    },
}




