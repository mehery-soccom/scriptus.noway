const config = require('@bootloader/config');
const sample_dao = require("../dao/sample_dao");
const {safely, Response, throwInputException, status, cdn } = require('../service/responsy');
const express = require('express');

const router = express.Router();

router.get('.json',(async function(req,res) {
    let samples = await sample_dao.getAll();
    res.send({
        success : true,
        results : samples
    });
}));

router.post('/',async function(req,res) {
    res.send({
        success : true,
        results : []
    });
});

router.get([`/*`,`/`], cdn({
    viewName : "sample", 
    CONST : {
        APP_TITLE : "Sample Title",
        sampleData : {
            sampleKey : "Sample Value"
        }
    }
}));

module.exports = router;