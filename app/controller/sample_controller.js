const config = require('@bootloader/config');
const sample_dao = require("../dao/sample_dao");
const {safely, Response, throwInputException, status, cdn } = require('../service/responsy');
const express = require('express');

//const sample = express.Router();

module.exports = function(sample){
    sample.path("/sample");

    sample.get('/fetch',async function(req,res,next) {
        // try {
            let samples = await sample_dao.findAll();
            res.send({
                success : true,
                results : samples
            });
        // } catch(e){
        //     //
        //     console.log(e);
        // }
        //next();
    });
    
    sample.post('/add',async function(req,res) {
        res.send({
            success : true,
            results : []
        });
    });
    
    sample.get([`/*`,`/`], cdn({
        viewName : "sample", 
        CONST : {
            APP_TITLE : "Sample Title",
            sampleData : {
                sampleKey : "Sample Value"
            }
        }
    }));
    
    console.log("sample",typeof sample,sample.name)

};