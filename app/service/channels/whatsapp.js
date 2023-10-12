const config = require('@bootloader/config');
const fetch = require("node-fetch");
const ngrokStore = config.store("ngrok");

module.exports = {
    webhook(config){
        apiKey = apiKey || config.get("wa360.api.key");
        let wabaurl = (channelType == 'wa360c') 
                ? 'https://waba-v2.360dialog.io/v1/configs/webhook' 
                : 'https://waba-v2.360dialog.io/v1/configs/webhook' 
        fetch(wabaurl, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type" : "application/json",
              "D360-API-KEY" : apiKey
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              "url": ngrokStore.url + "/noway/webhook/debugger",
              "headers": {
              }
            }), // body data type must match "Content-Type" header
          },{}).catch((e) => {  
            console.error("PostError",e) 
          }).then(function(res){
            return res.json();
          }).then(function(res){
            console.log("Webhook URL Set",res)
          });
    }
};