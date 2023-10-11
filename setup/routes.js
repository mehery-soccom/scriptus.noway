const config = require('@bootloader/config');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { safely } = require('../app/service/responsy');

let contollers = (function getFiles(dir, files = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
      const name = `${dir}/${file}`;
      // Check if the current file/directory is a directory using fs.statSync
      if (fs.statSync(name).isDirectory()) {
        // If it is a directory, recursively call the getFiles function with the directory path and the files array
        getFiles(name, files);
      } else {
        // If it is a file, push the full path to the files array
        files.push({path : name,file});
      }
    }
    return files;
})(__dirname+"/../app/controller/");

function RouterController(){
    const _router = express.Router();
    let _path = "/";
    let wrapper = {
        path(path){
            if(path !== undefined){
                _path = path;
            }
            return _path;
        },
        router(){
            return _router;
        }
    };
    ['all', 'get' , 'post' , 'put' , 'delete' , 'patch' , 'options' , 'head'].forEach(method => {
        wrapper[method] = async function(a,b,c,d,e,f){
            //console.log(_path,method,arguments)
            let newArgs = [...arguments].map(function(arg){
                if(typeof arg == 'function'){
                    return safely(arg)
                } else return arg;
            });
            return await _router[method].apply(_router,newArgs);
        }
    });
    return wrapper;
}


contollers.forEach(element => {
    const controller = require('../app/controller/'+element.file);
    if( typeof controller == 'function'
        && controller.name == 'router'
        && typeof controller.get == 'function'
        && typeof controller.post == 'function'
        && typeof controller.all == 'function'
        && typeof controller.head == 'function'
    ){
        //console.log("DefaultRouter",element,typeof controller)
        //console.log("DefaultRouter",controller)
        router.use('/',controller);
    } else if(typeof controller == 'function') {
        //console.log("RouterController",element,typeof controller)
        let wrapper = RouterController();
        //console.log("RouterController.path",wrapper.path())
        controller(wrapper);
        //console.log("RouterController.router",wrapper.router())
        router.use(wrapper.path(),wrapper.router());
    }

});


// const sample_controller = require('../app/controller/sample_controller');
// router.use('/sample',sample_controller);

module.exports = router;