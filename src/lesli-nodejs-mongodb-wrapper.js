/*
Lesli

Copyright (c) 2020, Lesli Technologies, S. A.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

Lesli NodeJS MongoDB Wrapper - MongoDB query helpers

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@license  GPLv3 http://www.gnu.org/licenses/gpl-3.0.en.html
@version  0.1.0-alpha

// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
// · 
*/


// · Import frameworks, libraries and tools
// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
const MongoDB = require("mongodb")
const MongoClient = MongoDB.MongoClient
const ObjectId = MongoDB.ObjectID


// · 
class databaseService {


    // · 
    constructor(config) {
        this.config = config
        this.database = this.config.namespace
        this.client = new MongoClient("mongodb://"+this.config.host+":"+this.config.port, { family: 4, useNewUrlParser: true, useUnifiedTopology: true })
        this.connection = this.client.connect()
        this.namespace = this.config.namespace
    }


    // · Return an independent copy of any object
    copy(obj) {
        return Object.assign({ }, obj)
    }


    // · Create a new collection (also create a schema if needed)
    createSchemaCollection(config) {

        //let database = JSON.parse(JSON.stringify(config))
        let database = this.copy(config)

        database.schema = [this.namespace, database.schema].join('-')

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            return schema.createCollection(database.collection)

        }).catch(error => {

            console.log(error)

        })

    }


    // · Return info of an individual schema
    getSchema(config) {

        let database = this.copy(config)
        
        database.schema = [this.namespace, database.schema].join('-')

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)

            let collection = schema.listCollections()

            return new Promise((resolve, reject) => {

                return resolve(collection.toArray())

            })

        }).catch(error => {

            console.log(error)
            
        })

    }


    // · return info of an individual schema collection
    getSchemaCollection(config) {

        let database = this.copy(config)

        database.schema = [this.namespace, database.schema].join('-')

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)
            let stats = collection.stats()

            return stats.then(s => {

                return new Promise(resolve => {

                    return resolve({
                        ok: s.ok,
                        ns: s.ns,
                        size: s.size,
                        storageSize: s.storageSize,
                        totalIndexSize: s.totalIndexSize
                    })

                })

            }).catch(error => {

            })


        }).catch(error => {

            console.log(error)

        })

    }


    // · Find documents
    findDocument(database, options = {}) {

        database.schema = [this.namespace, database.schema].join('-')

        // parse specific document id
        if (options.query && options.query._id) {
            options.query._id = ObjectId(options.query._id)
        }

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)

            return collection
                .find(options.query)
                .project(options.fields)
                .sort(options.sort)
                .toArray()

        }).catch(error => {

            console.log(error)
            
        })

    }


    // · 
    insertDocument(config, data) {

        let database = this.copy(config)

        database.schema = [this.namespace, database.schema].join('-')

        // check if database persistanse is enabled
        if (!this.config.enabled) {

            return new Promise((resolve, reject) => {
                return reject({ message: 'Database is disable' })
            })

        }

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)

            data._meta = {
                datetime: new Date(),
                timestamp: Math.floor(Date.now() / 1000)
            }

            return collection.insertOne(data)

        }).catch(error => {

            console.log(error)

        })

    }


    // · 
    dropSchemaCollection(database) {

        database.schema = [this.namespace, database.schema].join('-')

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)
            return collection.drop()

        }).catch(error => {

            console.log(error)

        })

    }


    // · 
    getSchemaCollectionDocuments(database, query={}) {

        database.schema = [this.namespace, database.schema].join('-')

        let pipeline = this.aggregationPipelineSelection(query)

        return this.aggregate(database, pipeline)

    }


    // · Update specific document
    updateDocument(database, options = {}, data = {}) {

        database.schema = [this.namespace, database.schema].join('-')

        // Advanced search options
        if (!options.query) {
            options.query = {}
        }

        // Find by object id
        if (options.query._id) {
            options.query._id = ObjectId(options.query._id)
        }

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)

            delete data._id

            return collection.updateOne(options.query, { $set: data })

        }).catch(error => {

            console.log(error)

        })

    }



    // · 
    aggregate(database, pipeline) {

        return this.connection.then(e => {

            let schema = this.client.db(database.schema)
            let collection = schema.collection(database.collection)
            let aggregation = collection.aggregate(pipeline)
            let result = aggregation.toArray()

            return result

        }).catch(error => {

            console.log(error)

        })

    }


    // · 
    aggregationPipelineSelection(query) {

        var pipeline = [{

            // Processes multiple aggregation pipelines 
            // within a single stage on the same set of input documents.
            "$facet": {

                // rows range found
                "rows": [
                    { "$match": {} },
                    { "$sort": { "_meta.datetime": -1 } },
                    { "$skip": query.skip ? parseInt(query.skip) : 0 },
                    { "$limit": query.limit ? parseInt(query.limit) : 1000 },
                ],

                // total rows found
                "count": [{ "$count": "count" }]

            }

        }]


        // Filter by specific field
        if (query.field && query.field != "") {
            pipeline[0]["$facet"].rows[0]["$match"][field] = query.text
        }


        // Return records from specific topic
        if ((query.start && query.start != "") || (query.end && query.end != "")) {
            pipeline[0]["$facet"].rows[0]["$match"]["datetime"] = {
                "$gte": query.start ? parseInt(query.start) : 0,
                "$lte": query.end ? parseInt(query.end) : Date.now(),
            }
        }

        // Get N last records
        if (query.last && query.last != "") {
            pipeline[0]["$facet"].rows[1]["$sort"]["_meta.datetime"] = -1
            pipeline[0]["$facet"].rows[3]["$limit"] = parseInt(query.last)
        }

        return pipeline

    }



















    
    // · 
    getSchemaStats(db) {
        db.schema = this.database + '-' + db.schema
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true })
            let schema = client.db(db.schema)
            let result = yield schema.stats()
            if (client) {
                client.close()
            }
            return new Promise((resolve, reject) => {
                return resolve(result)
            })
        }))()
    }
    // · 
    getSchemaCollections(db) {
        db.schema = this.database + '-' + db.schema
        return this.connection.then(e => {
            let schema = this.client.db(db.schema)
            let collection = schema.listCollections()
            return new Promise((resolve, reject) => {
                return resolve(collection.toArray())
            })
        }).catch(error => {
            console.log(error)
        })
    }
    // · 
    getSchemaCollectionStats(db) {
        db.schema = this.database + '-' + db.schema
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true })
            let schema = client.db(db.schema)
            let collection = schema.collection(db.collection)
            let result = yield collection.stats()
            if (client) {
                client.close()
            }
            return new Promise((resolve, reject) => {
                return resolve(result)
            })
        }))()
    }
    // · 
    deleteSchemaCollection(db) {
        db.schema = this.database + '-' + db.schema
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port, { useNewUrlParser: true })
            let schema = client.db(db.schema)
            let collection = schema.collection(db.collection)
            let result = yield collection.drop()
            if (client) {
                client.close()
            }
            return new Promise((resolve, reject) => {
                return resolve(result)
            })
        }))()
    }
    // · 
    aggregationPipelineCounting(query) {
        let fields = ['value']
        if (query.fields) {
            fields = query.fields
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
            }]
        fields.forEach(field => {
            pipeline[0]['$facet'].year[0]['$group'][field] = { $sum: `$data.${field}` }
            pipeline[0]['$facet'].month[0]['$group'][field] = { $sum: `$data.${field}` }
            pipeline[0]['$facet'].day[0]['$group'][field] = { $sum: `$data.${field}` }
        })
        return pipeline
    }
    // · 
    runCommand(command) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect("mongodb://localhost:" + this.config.port)
            let schema = client.db('localschema')
            let result = yield schema.command("show collections")
            if (client) {
                client.close()
            }
            return new Promise((resolve, reject) => {
                return resolve(result)
            })
        }))()
    }
}


// · 
module.exports = databaseService
