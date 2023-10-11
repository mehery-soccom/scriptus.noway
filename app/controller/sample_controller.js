const config = require('@bootloader/config');
const {TimeStampIndex} = require("@bootloader/models");
const sample_dao = require("../dao/sample_dao");
const {safely, Response, throwInputException, status, cdn } = require('../service/responsy');
const express = require('express');

//const sample = express.Router();

module.exports = function(sample){
    sample.path("/sample");

    sample.get('/models',async function(req,res,next) {
        res.send({
            success : true,
            results : [TimeStampIndex.now()]
        });
    });

    sample.get('/fetch',async function(req,res,next) {
        let samples = await sample_dao.findAll();
        res.send({
            success : true,
            results : samples
        });
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