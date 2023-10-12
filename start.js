const config = require('@bootloader/config');
const http = require('http');
const app = require('./app');
const noway = require("./app/service/noway");

const port = process.env.PORT || config.get("server.port");
//Create a server
var server = http.createServer(app);

//Lets start our server
server.listen(port, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
    noway.emit('noway.started', null)
});

//setup();