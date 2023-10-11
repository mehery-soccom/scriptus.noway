const { database, throwError} = require('./mongon');

const getTenantDB = (domain, modelName, schema) => {
    const dbName = `tnt_${domain}`;
    if (database) {
      // useDb will return new connection
      const db = database(dbName);
      //console.info(`DB switched to ${dbName}`);
      db.model(modelName, schema);
      return db;
    }
    return throwError(500, codes.CODE_8004);
};

module.exports = {
    getModel (domain, modelName, schema){
        console.info(`getModelByTenant tenantId : ${domain}.`);
        const tenantDb = getTenantDB(domain, modelName, schema);
        return tenantDb.model(modelName);
    },

    model (schema, { domain , collection }){
        let collectionName = collection || schema.options.collection;
        const tenantDb = getTenantDB(domain || 'app', collectionName, schema);
        return tenantDb.model(collectionName);
    },
}