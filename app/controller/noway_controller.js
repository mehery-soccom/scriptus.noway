const config = require('@bootloader/config');
const express = require('express');
const router = express.Router();
var Queue = require('node-persistent-queue') ;
const clientapp = require('./../service/clientapp');

var q = new Queue('./temp/webhook.sqlite') ;
q.on('open',() => {
	console.log('Opening SQLite DB') ;
	console.log('Queue contains '+q.getLength()+' job/s') ;
});
q.on('add',task => {
	console.log('Adding task: '+JSON.stringify(task)) ;
	console.log('Queue contains '+q.getLength()+' job/s') ;
});
q.on('start',() => {
	console.log('Starting queue') ;
}) ;

const {safely, Response, throwInputException, status, cdn } = require('../service/responsy');
// const { TimeStampIndex} = require('../model/timely');
router.post('/setup/channel/webhook',(function(req,res) {
    res.send({});
}));

router.get('/ping',(function(req,res) {
    res.send({
        success : true,
        public_url : config.store("ngrok").url
    });
}));
router.get('/test/message/push',safely(function(req,res) {
    q.open().then(()=>{
        q.add({ time : Date.now(), type : "webhook"})
        q.start();
    })
    res.send({});
}));
router.get('/test/message/poll',safely(function(req,res) {
    q.open().then((task)=>{
       let items = [];
       for(var i in task){
        items.push(JSON.parse(task[i].job));
        q.delete(task[i].id)
       }
       res.send(items);
    })
}));

router.post('/xms/inbound/webhook',safely(function(req,res) {
    if(req.body)
    clientapp.pushMessages(JSON.parse(JSON.stringify(req.body)));
},{
    printRequest :  true
}));

router.get([`/test/*`,`/test`], cdn({
    viewName : "test", 
    CONST : {
        APP_TITLE : "Test",
        CDN_URL : "https://deploy-xyz.mehery-web.pages.dev",
        APP : "dev", APP_CONTEXT: "/noway",
        CDN_VERSION: "5",
    }
}));

module.exports = router;