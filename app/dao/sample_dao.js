const mongon = require('@bootloader/mongon')
const SampleScheme = require('../schema/sample_schema');

module.exports = {
    async findAll(){
        let SampleModel = mongon.model(SampleScheme);
        let doc = await SampleModel.find();
        return doc;
    },
    async save({type,message}){
        let SampleModel = mongon.model(SampleScheme,{});
        let doc = await SampleModel.save({
            type,message
        });
        return doc;
    },
    async saveToDifferent({type,message},tenant){  // Save to Another DB
        let SampleModel = mongon.model(SampleScheme,{
            domain : tenant
        });
        let doc = await SampleModel.save({
            type,message
        });
        return doc;
    }
}