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
const { aggregation_pipeline_query } = require("../utils")



// · 
class LesliNodeJSMongoDBQueryDatabaseCollectionDocument extends LesliMongoDB {



    // · 
    constructor(config) {
        super(config)
    }



    // · 
    find = (schema, query = {}) => this._database_collection_document_find(schema, query)
    first = (schema, query = {}) => this._database_collection_document_first(schema, query)
    update = (schema, query = {}) => this._database_collection_document_find(schema, query)
    delete = (schema, query = {}) => this._database_collection_document_find(schema, query)
    create = (schema, document) => this._database_collection_document_create(schema, document)



    // · Find documents in the database
    _database_collection_document_find(schema, query={}) {

        var schema = this.schema_parse(schema)
        var aggregation_query = aggregation_pipeline_query(query)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)
            let aggregation = collection.aggregate(aggregation_query)

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


    // · Find documents in the database
    _database_collection_document_first(schema) {

        var schema = this.schema_parse(schema)

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

}


// · 
module.exports = LesliNodeJSMongoDBQueryDatabaseCollectionDocument
