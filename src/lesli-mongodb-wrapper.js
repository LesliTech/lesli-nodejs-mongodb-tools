/*
Lesli

Copyright (c) 2019, Lesli Technologies, S. A.

All the information provided by this website is protected by laws of Guatemala related 
to industrial property, intellectual property, copyright and relative international laws. 
Lesli Technologies, S. A. is the exclusive owner of all intellectual or industrial property
rights of the code, texts, trade mark, design, pictures and any other information.
Without the written permission of Lesli Technologies, S. A., any replication, modification,
transmission, publication is strictly forbidden.
For more information read the license file including with this software.

Lesli Mongodb Wrapper

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@dev      Luis Donis <ldonis@lesli.tech>
@author   LesliTech <hello@lesli.tech>
@license  Propietary - all rights reserved.
@version  GIT: 0.1.0 alpha

// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
//  · 
*/


//  · Import frameworks, libraries and tools
// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
const MongoDB = require("mongodb")
const MongoClient = MongoDB.MongoClient
const ObjectId = MongoDB.ObjectID


// · 
// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
class databaseService {

    //
    constructor(config) {
        this.config = config
        this.database = this.config.namespace
        this.client = new MongoClient("mongodb://localhost:" + this.config.port, { family: 4, useNewUrlParser: true })
        this.connection = this.client.connect()
        this.namespace = this.config.namespace
    }

    // · 
    getSchema(database) {

        database.schema = [this.namespace, database.schema].join('-')

        return this.connection.then(e => {

            let schema = this.client.db(database.schema);

            let collection = schema.listCollections();

            return new Promise((resolve, reject) => {

                return resolve(collection.toArray());

            });

        }).catch(error => {

            console.log(error);
            
        });
    }

    // · 
    getSchemaCollection(database) {
        database.schema = [this.namespace, database.schema].join('-');
        return this.connection.then(e => {
            let schema = this.client.db(database.schema);
            let collection = schema.collection(database.collection);
            return collection.stats();
        }).catch(error => {
            console.log(error);
        });
    }

    // · 
    createSchemaCollection(database) {
        database.schema = [this.namespace, database.schema].join('-');
        return this.connection.then(e => {
            let schema = this.client.db(database.schema);
            return schema.createCollection(database.collection);
        }).catch(error => {
            console.log(error);
        });
    }

    // · 
    dropSchemaCollection(database) {
        database.schema = [this.namespace, database.schema].join('-');
        return this.connection.then(e => {
            let schema = this.client.db(database.schema);
            let collection = schema.collection(database.collection);
            return collection.drop();
        }).catch(error => {
            console.log(error);
        });
    }
    // · 
    getSchemaCollectionDocuments(database) {
        let pipeline = this.aggregationPipelineSelection({});
        database.schema = [this.namespace, database.schema].join('-');
        return this.aggregate(database, pipeline);
    }
    // · 
    aggregate(database, pipeline) {
        return this.connection.then(e => {
            let schema = this.client.db(database.schema);
            let collection = schema.collection(database.collection);
            return collection.aggregate(pipeline).toArray();
        }).catch(error => {
            console.log(error);
        });
    }
    // · 
    aggregationPipelineSelection(query) {
        var pipeline = [{
                // Processes multiple aggregation pipelines within a single stage on the same set of input documents.
                "$facet": {
                    // rows range found
                    "rows": [
                        { "$match": {} },
                        { "$sort": { "datetime": -1 } },
                        { "$skip": query.skip ? parseInt(query.skip) : 0 },
                        { "$limit": query.limit ? parseInt(query.limit) : 100 },
                    ],
                    // total rows found
                    "count": [{ "$count": "count" }]
                }
            }];
        // Return records from specific topic
        if (query.topic && query.topic != "") {
            pipeline[0]["$facet"].rows[0]["$match"]["topic"] = query.topic;
        }
        // Return records from specific topic
        if ((query.start && query.start != "") || (query.end && query.end != "")) {
            pipeline[0]["$facet"].rows[0]["$match"]["datetime"] = {
                "$gte": query.start ? parseInt(query.start) : 0,
                "$lte": query.end ? parseInt(query.end) : Date.now(),
            };
        }
        // Get N last records
        if (query.last && query.last != "") {
            pipeline[0]["$facet"].rows[1]["$sort"].datetime = -1;
            pipeline[0]["$facet"].rows[3]["$limit"] = parseInt(query.last);
        }
        return pipeline;
    }
    // · Find documents
    findDocument(db, options = {}) {
        db.schema = this.namespace + '-' + db.schema;
        return this.connection.then(e => {
            let schema = this.client.db(db.schema);
            let collection = schema.collection(db.collection);
            return collection
                .find(options.query)
                .project(options.fields)
                .sort(options.sort)
                .toArray();
        }).catch(error => {
            console.log(error);
        });
    }
    updateDocument(db, options = {}, data = {}) {
        db.schema = this.database + '-' + db.schema;
        // use schema in config file if default collection is sent
        if (db.schema == "default") {
            db.schema = this.config.schema;
        }
        // Advanced search options
        if (!options.query) {
            options.query = {};
        }
        // Find by object id
        if (options.query.objectid) {
            options.query = {
                '_id': ObjectId(options.query.objectid)
            };
        }
        return this.connection.then(e => {
            let schema = this.client.db(db.schema);
            let collection = schema.collection(db.collection);
            return collection.update(options.query, data);
        }).catch(error => {
            console.log(error);
        });
    }
    // · 
    insertDocument(db, data) {

        db.schema = this.database + '-' + db.schema;
        if (!this.config.enabled) {
            return new Promise((resolve, reject) => {
                return reject({ message: 'Database is disable' });
            });
        }
        return this.connection.then(e => {
            let schema = this.client.db(db.schema);
            let collection = schema.collection(db.collection);
            data.datetime = new Date();
            return collection.insertOne(data);
        }).catch(error => {
            console.log(error);
        });
    }
    // · 
    getSchemaStats(db) {
        db.schema = this.database + '-' + db.schema;
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true });
            let schema = client.db(db.schema);
            let result = yield schema.stats();
            if (client) {
                client.close();
            }
            return new Promise((resolve, reject) => {
                return resolve(result);
            });
        }))();
    }
    // · 
    getSchemaCollections(db) {
        db.schema = this.database + '-' + db.schema;
        return this.connection.then(e => {
            let schema = this.client.db(db.schema);
            let collection = schema.listCollections();
            return new Promise((resolve, reject) => {
                return resolve(collection.toArray());
            });
        }).catch(error => {
            console.log(error);
        });
    }
    // · 
    getSchemaCollectionStats(db) {
        db.schema = this.database + '-' + db.schema;
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true });
            let schema = client.db(db.schema);
            let collection = schema.collection(db.collection);
            let result = yield collection.stats();
            if (client) {
                client.close();
            }
            return new Promise((resolve, reject) => {
                return resolve(result);
            });
        }))();
    }
    // · 
    deleteSchemaCollection(db) {
        db.schema = this.database + '-' + db.schema;
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true });
            let schema = client.db(db.schema);
            let collection = schema.collection(db.collection);
            let result = yield collection.drop();
            if (client) {
                client.close();
            }
            return new Promise((resolve, reject) => {
                return resolve(result);
            });
        }))();
    }
    // · 
    aggregationPipelineCounting(query) {
        let fields = ['value'];
        if (query.fields) {
            fields = query.fields;
        }
        var pipeline = [{
                "$facet": {
                    year: [{
                            $group: {
                                _id: { $dateToString: { format: "%Y", date: "$datetime" } },
                            }
                        }, {
                            $sort: {
                                "_id": 1
                            }
                        }],
                    month: [{
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$datetime" } },
                            }
                        }, {
                            $sort: {
                                "_id": 1
                            }
                        }],
                    day: [{
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } },
                            }
                        }, {
                            $sort: {
                                "_id": 1
                            }
                        }]
                }
            }];
        fields.forEach(field => {
            pipeline[0]['$facet'].year[0]['$group'][field] = { $sum: `$data.${field}` };
            pipeline[0]['$facet'].month[0]['$group'][field] = { $sum: `$data.${field}` };
            pipeline[0]['$facet'].day[0]['$group'][field] = { $sum: `$data.${field}` };
        });
        return pipeline;
    }
    // · 
    runCommand(command) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port);
            let schema = client.db('localschema');
            let result = yield schema.command("show collections");
            if (client) {
                client.close();
            }
            return new Promise((resolve, reject) => {
                return resolve(result);
            });
        }))();
    }
}


// · 
module.exports = databaseService
