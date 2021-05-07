"use strict"
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

MongoDB tools for Node.js applications

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@contact  <hello@lesli.tech>
@website  <https://lesli.tech>
@license  GPLv3 http://www.gnu.org/licenses/gpl-3.0.en.html

// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
// · 
*/



// · 
const LesliMongoDB = require("../lesli")



// · 
const { schema: schema_tools, converter } = require("../utils")



// · 
class LesliNodeJSMongoDBQueryDatabaseCollectionDocument extends LesliMongoDB {



    // · 
    constructor(config) {
        super(config)
    }



    // · 
    info = (schema, query = {}) => this._database_collection_document_find(schema, query)
    read = (schema, query = {}) => this._database_collection_document_find(schema, query)
    index = (schema, query = {}) => this._database_collection_document_index(schema, query)
    create = (schema, document) => this._database_collection_document_create(schema, document)
    update = (schema, query = {}) => this._database_collection_document_find(schema, query)
    delete = (schema, query = {}) => this._database_collection_document_find(schema, query)

    search = (schema, query = {}) => this._database_collection_document_find(schema, query)
    first = (schema, query = {}) => this._database_collection_document_first(schema)
    find = (schema, query = {}) => this._database_collection_document_find(schema, query)



    // · Return all documents in a collection allowing to filter by query params
    _database_collection_document_index(schema, query) {
        return this.aggregate(
            this.schema_parse(schema),           // schema
            this.aggregationPipelineQuery(query) // pipeline
        )
    }



    // · Find documents in the database
    _database_collection_document_find(schema, options = {}) {

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)

            return collection
                .find(options.query)
                .toArray()

        }).then(result => {

            return new Promise((resolve, reject) => {

                return resolve({
                    records: {
                        total: result.length,
                        found: result.length
                    },
                    documents: result
                })

            })
            
        })

    }


    
    // · Find documents in the database
    _database_collection_document_first(schema) {

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)

            return collection.findOne()

        })

    }



    // · Create a new document in a collection
    _database_collection_document_create(schema, document) {

        schema = this.schema_parse(schema)

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
module.exports = LesliNodeJSMongoDBQueryDatabaseCollectionDocument
