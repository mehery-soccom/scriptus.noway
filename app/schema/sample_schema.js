const mongoose = require('mongoose');

const Schema = mongoose.Schema({  
        "useId" : { type : String, index: true},

        //Message
        "type" : { type : String },
        "title" :{ type : String },
        "message" :{ type : String },

        //STAMPS
        "createdAt" : mongoose.Schema.Types.Mixed,
        "readAt" : mongoose.Schema.Types.Mixed,
        "active" :  Boolean,
},{ 
        minimize: false , collection: 'SAMPLE'
});

module.exports = Schema;