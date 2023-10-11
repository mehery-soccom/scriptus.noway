const dbservice = require('../service/dbservice');
const SampleScheme = require('../schema/sample_schema');

module.exports = {
    async getAll(){
        let SampleModel = dbservice.model(SampleScheme,{});
        let doc = await SampleModel.findById(userid);
        return doc;
    },
    async save({type,message}){
        let SampleModel = dbservice.model(SampleScheme,{});
        let doc = await SampleModel.save({
            type,message
        });
        return doc;
    }
}