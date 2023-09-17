const config = require('@bootloader/config');
const fetch = require("node-fetch");
const ngrokStore = config.store("ngrok");
var Queue = require('node-persistent-queue') ;
const noway = require("./noway");

var q = new Queue('./temp/xmsinbound.sqlite') ;
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

const clientapp = {
    initWebhook(){
      let apiKey = config.get("mry.api.key");
      let domain = config.get("mry.domain");
      if(apiKey){
        return this.webhook({apiKey,domain})
      }
    },
    webhook({apiKey,domain}){
        let _apiKey = apiKey || config.get("mry.api.key");
        let _domain = domain || config.get("mry.domain");
        let endPoint = `https:/${_domain}/xms/api/v1/config/webhook`
        fetch(endPoint, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type" : "application/json",
              "x-api-key" : _apiKey
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              "url": ngrokStore.url + "/noway/xms/inbound/webhook",
              "headers": {
              }
            }), // body data type must match "Content-Type" header
          },{}).catch((e) => {  
            console.error("PostError",e) 
          }).then(function(res){
            return res.json();
          }).then(function(res){
            console.log("Client Webhook URL Set",ngrokStore,res)
          });
    },
    pushMessages(msg){
      q.open().then(()=>{
          q.add({ time : Date.now(), type : "xmsinbound",msg})
          q.start();
      })
    }
};

noway.on("noway.started", function(){
  console.log("clientapp.js : noway.started");
  clientapp.initWebhook();
});

module.exports = clientapp;