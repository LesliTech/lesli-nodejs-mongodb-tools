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

Lesli NodeJS MongoDB wrapper - MongoDB query helpers

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@contact  <hello@lesli.tech>
@website  <https://lesli.tech>
@license  GPLv3 http://www.gnu.org/licenses/gpl-3.0.en.html

// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
// · 
*/


// · 
const MongoDB = require("mongodb")


// · 
class LesliNodeJSMongoDBQuery {

    
    // · 
    constructor(config) {

        this.namespace = config.namespace
        
        this.mongodb = { }

        this.mongodb.client = new MongoDB.MongoClient("mongodb://"+config.host+":"+config.port, { family: 4, useNewUrlParser: true, useUnifiedTopology: true })
        
        this.mongodb.connection = this.mongodb.client.connect()

    }


    // · 
    database_collection_documents(schema, query = {}) {
        return this._database_collection_documents(schema, query)
    }

    // · 
    data_within_radius(schema, query) {
        return this._data_within_radius(schema, query)
    }


    // · Parse schema information
    // · Return standard namespace - database -collection structure
    parse_schema(schema) {
        schema = Object.assign({ }, schema)
        schema.database = [this.namespace, schema.database].join('-')
        return schema
    }


    // · Parse bytes to human format
    convert_bytes_to_human_value(size, unit = "bytes") {

        if (!size || size < 0) {
            size = 0
        }

        var decimals = 2
        var units = {
            bytes: "bytes",
            kilobytes: "kilobytes",
            megabytes: "megabytes",
            gigabytes: "gigabytes"
        }

        // converts bytes to kilobytes
        if (unit == units.bytes && size > 1024) {
            return this.convert_bytes_to_human_value(size / 1024, units.kilobytes)
        }

        // converts kilobytes to megabytes
        if (unit == units.kilobytes && size > 1024) {
            
            return this.convert_bytes_to_human_value(size / 1024, units.megabytes)
        }

        // converts megabytes to gigabyte
        if (unit == units.megabytes && size > 1024) {
            
            return this.convert_bytes_to_human_value(size / 1024, units.gigabytes)
        }

        // return size with no decimals
        if (size.toFixed(decimals) % 1 === 0) {
            return [size, unit].join(" ")
        }

        // return size with decimals
        return [size.toFixed(decimals), unit].join(" ")
        

    }

    /*
    database_read

    database_collection_read
    database_collection_create
    database_collection_delete

    database_collection_documents
    database_collection_document_read
    database_collection_document_create
    database_collection_document_update
    database_collection_document_delete
    database_collection_document_search

    */

    // · Return information about database including a list of collections
    database_read(schema) {

        schema = this.parse_schema(schema)

        return (async() => {

            let database = this.mongodb.client.db(schema.database)

            let collections = (await database.listCollections().toArray()).map(collection => {
                return {
                    name: collection.name
                }
            })

            // get database statistics in bytes
            let information = await database.stats()

            information = {
                database_name: information.db,
                database_collection_count: information.collections,
                database_collection_document_count: information.objects,
                database_uncompressed_data_size: {
                    bytes: information.dataSize,
                    human: this.convert_bytes_to_human_value(information.dataSize),
                },
                database_storage_size: {
                    bytes: information.storageSize,
                    human: this.convert_bytes_to_human_value(information.storageSize)
                },
                document_average_size: {
                    bytes: this.convert_bytes_to_human_value(information.avgObjSize),
                    human: information.avgObjSize
                },
                indexes: information.indexes,
                indexes_size: {
                    bytes: information.indexSize,
                    human: this.convert_bytes_to_human_value(information.indexSize)
                },
                filesystem_available_space: {
                    bytes: information.fsTotalSize - information.fsUsedSize,
                    human: this.convert_bytes_to_human_value(information.fsTotalSize - information.fsUsedSize)
                }
            }

            return new Promise((resolve, reject) => {

                return resolve({
                    information: information,
                    collections: collections
                })

            })

        })()

    }

    // · Create a new collection and database if it does not exist
    database_collection_create(schema) {

        schema = this.parse_schema(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            return database.createCollection(schema.collection)

        }).catch(error => {

            console.log(error)

        })

    }

    // · Return information of a collection
    database_collection_read(schema) {

        schema = this.parse_schema(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)

            let collection = database.collection(schema.collection)

            return collection.stats()

        }).then(collection_stats => {

            return new Promise((resolve, reject) => {

                return resolve({
                    ok: collection_stats.ok,
                    database_collection_document_count: collection_stats.count,
                    database_collection_uncompressed_data_size: {
                        bytes: collection_stats.size,
                        human: this.convert_bytes_to_human_value(collection_stats.size)
                    },
                    document_average_size: {
                        bytes: collection_stats.avgObjSize || 0,
                        human: this.convert_bytes_to_human_value(collection_stats.avgObjSize)
                    }
                })

            })

        }).catch(error => {
            console.log(error)
        })

    }


    // · Delete a collection and all documents
    database_collection_delete(schema) {

        schema = this.parse_schema(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)
            return collection.drop()

        }).catch(error => {
            console.log(error)
        })

    }

    // · Return all documents in a collection
    _database_collection_documents(schema, query = {}) {

        return this.aggregate(
            this.parse_schema(schema),           // schema
            this.aggregationPipelineQuery(query) // pipeline
        )

    }

    // · Create a new document in a collection
    database_collection_document_create(schema, document) {

        schema = this.parse_schema(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)

            document.datetime = new Date()

            return collection.insertOne(document)

        }).then(document_insert_result => {

            return new Promise((resolve, reject) => {

                return resolve({
                    n: document_insert_result.result.n,
                    ok: document_insert_result.result.ok,
                    id: document_insert_result.insertedId
                })

            })

        })

    }

    
    // · Get data inside of given radius
    _data_within_radius(schema, query) {

        schema = this.parse_schema(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            
            let collection = database.collection(schema.collection)

            collection.createIndex({ location: "2dsphere" });

            let radius_of_earth_in_miles = 3963.2
            let radius_of_earth_in_km = 6378.1
            let radio_to_search = 0

            /*
            To convert distance to radians, simply divide the distance
            value to the radius of the sphere (earth), where:
            3963.2 is radius of earth in Miles.
            6378.1 is radius of earth in Km.

            example for 1 kilometer and 1 mile
            let radio_miles = 1 / 3963.2
            let radio_km = 1 / 6378.1
            */

            if (query["kilometers"]) {
                radio_to_search = query.kilometers/radius_of_earth_in_km
            }

            return collection.aggregate([  
                { $geoNear: 
                    { 
                        near: {
                            "type" : "Point",
                            "coordinates" : [ 
                                -90.67118835, 
                                14.57496452
                            ]
                        }, 
                        distanceField: "dist.calculated", 
                        maxDistance: 50000.00,  
                        spherical: true, 
                        distanceMultiplier: 1/1609.344
                    }
                }
            ])

            /*
            return collection.find({
                "location": {
                    $nearSphere: {
                        $geometry: {
                            "type" : "Point",
                            "coordinates" : [ 
                                -90.67118835, 
                                14.57496452
                            ]
                        }, 
                        $maxDistance: 50000.00
                    }
                }
            })
            */ 

            /*
            return collection.find({
                "location": {
                    $geoWithin: {
                        $centerSphere: [[query.latitude, query.longitude], radio_to_search]
                    }
                }
            })
            */

        })

    }


    // · 
    aggregate(schema, aggregation_pipeline) {

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)
            let aggregation = collection.aggregate(aggregation_pipeline)

            return aggregation.toArray()

        }).then(documents => {

            return new Promise((resolve, reject) => {

                var total = 0
                
                if (documents[0].documents.length > 0) {
                    total = documents[0].records[0].total
                }

                return resolve({
                    records: {
                        total: total,
                        found: documents[0].documents.length
                    },
                    documents: documents[0].documents
                })

            })

        }).catch(error => {

            console.log(error)

        })

    }


    // · 
    aggregationPipelineQuery(query) {

        var pipeline = [{

            // Processes multiple aggregation pipelines 
            // within a single stage on the same set of input documents.
            "$facet": {

                // rows range found
                "documents": [
                    { "$match": {}, },
                    { "$sort": { "datetime": -1 } },
                    { "$skip": query.skip ? parseInt(query.skip) : 0 },
                    { "$limit": query.limit ? parseInt(query.limit) : 1000 }
                ],

                // total rows found
                "records": [{ "$count": "total" }]

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
        if (query.last && query.last != "" && query.last > 0) {
            pipeline[0]["$facet"].documents[1]["$sort"]["datetime"] = -1
            pipeline[0]["$facet"].documents[3]["$limit"] = parseInt(query.last)
        }

        return pipeline

    }

}


// · 
module.exports = LesliNodeJSMongoDBQuery
