const config = require('config');
const http = require('http');
const app = require('./app');
const ngrok = require("@ngrok/ngrok");

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
  await ngrok.authtoken(config.get("ngrok.auth.token"));
  const session = await new ngrok.NgrokSessionBuilder().authtokenFromEnv().connect();
  const tunnel = await session.httpEndpoint().listen();
  console.log("Ingress established at:", tunnel.url());
  tunnel.forwardTcp("localhost:"+port);
}
create_tunnel();