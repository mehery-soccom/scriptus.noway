
const config = require('@bootloader/config');
const ngrok = require("@ngrok/ngrok");
const port = process.env.PORT || config.get("server.port");

const NGROK_URL = config.getIfPresent("NGROK_URL");
console.log("ngrok.auth.token",config.get("ngrok.auth.token"));
console.log("NGROK_URL",NGROK_URL);
console.log("*************************");

let flags = {
    setup : null,
}

module.exports = {
    async setup() {
        console.log("NGROK SETUP", NGROK_URL)
        if(!flags.setup){
            if(NGROK_URL){
                flags.setup = new Promise(async function(resolve, reject){
                    config.store("ngrok").url = NGROK_URL;
                    resolve({
                        url : NGROK_URL
                    })
                });
            } else {
                flags.setup = new Promise(async function(resolve, reject){
                    try {
                        await ngrok.authtoken(config.get("ngrok.auth.token"))
                        // await ngrok.connect({
                        //   authtoken : config.get("ngrok.auth.token"),
                        //   //domain : config.get("ngrok.domain")
                        // });
                        const session = await new ngrok.NgrokSessionBuilder()
                        .authtoken(config.get("ngrok.auth.token"))
                        //.authtokenFromEnv()
                        .connect();
                        const tunnel = await session.httpEndpoint()
                        //.allowCidr("0.0.0.0/0")
                        .domain(config.get("ngrok.domain"))
                        .listen();
                        //const socket = await ngrok.listen(app, tunnel);
                        console.log(`Ingress established at: ${tunnel.url()}`);
                        //console.log(`Express listening on: ${socket.address()}`);
                        tunnel.forward("localhost:"+port);
                        config.store("ngrok").url = NGROK_URL;
                        resolve({
                            url : tunnel.url()
                        });
                    } catch(e){
                        reject(e);
                    }
                });
            }
        }
        return flags.setup;
      }
  }
