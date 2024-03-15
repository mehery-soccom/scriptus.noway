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

module.exports = function(noway){
    noway.path("/noway");

    noway.post('/setup/channel/webhook',(function(req,res) {
        res.send({});
    }));

    noway.get('/ping',(function(req,res) {
        res.send({
            success : true,
            public_url : config.store("ngrok").url,
            apiKey : config.get("mry.api.key"),
            domain : config.get("mry.domain")
        });
    }));

    noway.post('/ping',safely(function(req,res) {
        res.send({
            success : true,
            public_url : config.store("ngrok").url,
            apiKey : config.get("mry.api.key"),
            domain : config.get("mry.domain")
        });
    },{
        printRequest :  true, printHeaders :  true
    }));

    noway.get('/test/message/push',safely(function(req,res) {
        q.open().then(()=>{
            q.add({ time : Date.now(), type : "webhook"})
            q.start();
        })
        res.send({});
    }));

    noway.get('/test/message/poll',safely(function(req,res) {
        q.open().then((task)=>{
        let items = [];
        for(var i in task){
            items.push(JSON.parse(task[i].job));
            q.delete(task[i].id)
        }
        res.send(items);
        })
    }));

    noway.get('/xms/inbound/point',(function(req,res) {
        clientapp.initWebhook().then(function(resp){
            //res.send({ m : "ere"});
            res.send(resp);
        });
    }));

    noway.post('/xms/inbound/webhook',safely(function(req,res) {
        if(req.body)
            clientapp.pushMessages(JSON.parse(JSON.stringify(req.body)));
        res.send({});
    }));

    noway.get('/xms/inbound/webhook',safely(function(req,res) {
        clientapp.pollMessages().then(function(msgs){
            res.send({ messages : msgs.map((msg)=>msg.msg) });
        });
    }));

    noway.get([`/test/*`,`/test`], cdn({
        viewName : "test", 
        CONST : {
            APP_TITLE : "Test",
            CDN_URL : "https://deploy-xyz.mehery-web.pages.dev",
            APP : "dev", APP_CONTEXT: "/noway",
            CDN_VERSION: "5",
        }
    }));

}