const config = require('config');
const http = require('http');
const app = require('./app');
const ngrok = require("@ngrok/ngrok");
const fetch = require("node-fetch");

function config_get(key){
  let prop = config.get(key);
  if(!prop){
    throw `Missing property ${key} in file config/local.properties`
  }
  return prop;
}

const port = process.env.PORT || config.get("server.port");

console.log("*************************");
console.log("ngrok.auth.token",config.get("ngrok.auth.token"));
console.log("*************************");
//Create a server
var server = http.createServer(app);

//Lets start our server
server.listen(port, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
});

async function create_tunnel() {
  await ngrok.authtoken(config_get("ngrok.auth.token"));
  const session = await new ngrok.NgrokSessionBuilder().authtokenFromEnv().connect();
  const tunnel = await session.httpEndpoint().listen();
  console.log("Ingress established at:", tunnel.url());
  tunnel.forwardTcp("localhost:"+port);

  fetch('https://waba-v2.360dialog.io/v1/configs/webhook', {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type" : "application/json",
      "D360-API-KEY" : config_get("wa360.api.key")
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      "url": tunnel.url() + "/api/webhook/debugger",
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
create_tunnel();