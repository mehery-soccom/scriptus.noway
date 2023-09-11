const nodemon = require("nodemon");
const {setup} = require("./app/service/ngrok");
setup().then(function({ url }){
    console.log(" process.argv", process.argv[1], process.argv[2])
    nodemon({
      script: process.argv[2],
      exec: `NGROK_URL=${url} node `,
    });
});