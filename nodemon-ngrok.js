const nodemon = require("nodemon");
const {setup} = require("./app/service/ngrok");
setup().then(function({ url }){
    nodemon({
      script: process.argv[2],
      exec: `NGROK_URL=${url} node `,
    });
});