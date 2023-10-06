const config = require('@bootloader/config');
const fetch = require("node-fetch");
const ngrokStore = config.store("ngrok");
const httpProxyStore = config.store("http-proxy");
var Queue = require('node-persistent-queue') ;
const noway = require("./noway");

var q = new Queue('./temp/xmsinbound.sqlite') ;
const serviceProxy = require('./proxy');
// q.on('open',() => {
// 	console.log('Opening SQLite DB') ;
// 	console.log('Queue contains '+q.getLength()+' job/s') ;
// });
// q.on('add',task => {
// 	console.log('Adding task: '+JSON.stringify(task)) ;
// 	console.log('Queue contains '+q.getLength()+' job/s') ;
// });
// q.on('start',() => {
// 	console.log('Starting queue') ;
// }) ;

const clientapp = {
    async initWebhook(){
      let apiKey = config.get("mry.api.key");
      let domain = config.get("mry.domain");
      if(apiKey){
        return await this.webhook({apiKey,domain})
      }
    },
    webhook({apiId,apiKey,domain}){
        let _apiId = apiId || config.get("mry.api.id");
        let _apiKey = apiKey || config.get("mry.api.key");
        let _domain = domain || config.get("mry.domain");
        let endPoint = `https://${_domain}/xms/api/v1/config/webhook`
        //let endPoint = ngrokStore.url+'/noway/ping'
        console.log("_apiKey",_apiKey)
        console.log("_domain",_domain)
        console.log("endPoint",endPoint)
        console.log("ngrokStore.url",ngrokStore.url)
        return fetch(endPoint, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
              "Content-Type" : "application/json",
              "x-api-id" : _apiId,
              "x-api-key" : _apiKey,
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              "url": ngrokStore.url + "/noway/xms/inbound/webhook",
              "headers": {
              }
            }), // body data type must match "Content-Type" header
          },{}).catch((e) => {  
            return { text(){return JSON.stringify(e)}};
          }).then(res => res.text())
          .then(function(text){
            try {
              return JSON.parse(text);
            } catch(e) {
                return {
                  message : e.message,
                  text : text
                }
            }
          }).catch((e) => {  
            return e;
          }).then(function(json){
            console.log("json.results[0]",json?.results?.[0]);
            return json; 
          });
    },
    pushMessages(msg){
      q.open().then(()=>{
          q.add({ time : Date.now(), type : "xmsinbound",msg})
          q.start();
      })
    },
    async pollMessages(msg){
      return q.open().then((task)=>{
        let items = [];
        for(var i in task){
         items.push(JSON.parse(task[i].job));
         q.delete(task[i].id)
        }
        return items;
     })
    }
};

noway.on("noway.started", function(){
  console.log("clientapp.js : noway.started");
  //clientapp.initWebhook();
  let tnt = (function(domain){
    let tnts = domain.split(".")[0].split("/");
    return tnts[tnts.length-1]
  })(config.get("mry.domain"));
  headers = serviceProxy.appendRequestHeader('tnt',tnt)
});

module.exports = clientapp;