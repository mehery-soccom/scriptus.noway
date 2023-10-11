const mongon = require('@bootloader/mongon');

module.exports = mongon.Schema({  
        "useId" : { type : String, index: true},

        //Message
        "type" : { type : String },
        "title" :{ type : String },
        "message" :{ type : String },

        //STAMPS
        "createdAt" : mongon.Schema.Types.Mixed,
        "readAt" : mongon.Schema.Types.Mixed,
        "active" :  Boolean,
},{ 
        minimize: false , collection: 'SAMPLE'
});