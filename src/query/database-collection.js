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
const { schema: schema_tools, bytes_to_human: converter } = require("../utils")



// · 
class LesliNodeJSMongoDBQueryDatabaseCollection extends LesliMongoDB {



    // · 
    constructor(config) {
        super(config)
    }



    // ·  
    read = (schema) => this._database_collection_read(schema)
    create = (schema) => this._database_collection_create(schema)
    delete = (schema) => this._database_collection_delete(schema)
    rename = (schema) => this._database_collection_rename(schema)
    list_documents = (schema) => this._database_collection_documents(schema)


    // · Return information of a collection
    _database_collection_read(schema) {

        schema = this.schema_parse(schema)

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
                        string: converter(collection_stats.size)
                    },
                    document_average_size: {
                        bytes: collection_stats.avgObjSize || 0,
                        string: converter(collection_stats.avgObjSize)
                    }
                })

            })

        }).catch(error => {
            console.log(error)
        })

    }



    // · Create a new collection and database if it does not exist
    _database_collection_create(schema) {

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            return database.createCollection(schema.collection)

        }).catch(error => {

            console.log(error)

        })

    }



    // · Delete a collection and all documents
    _database_collection_delete(schema) {

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)
            return collection.drop()

        }).catch(error => {
            console.log(error)
        })

    }


    // · Rename a collection 
    _database_collection_rename(schema){

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)
            
            return collection.rename(schema.new_collection_name)

        }).then(collection_renamed_result => {
            
            return new Promise((resolve, reject) => {

                return resolve({
                    db: collection_renamed_result.s.namespace.db,
                    collection: collection_renamed_result.s.namespace.collection
                })

            })

        }).catch(error => {

            console.log(error);

        })

    }


    // · Return all documents in a collection
    _database_collection_documents(schema){

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)
            let collection = database.collection(schema.collection)

            return collection.aggregate().toArray()

        }).catch(error => {

            console.log(error);

        })

    }

}


// · 
module.exports = LesliNodeJSMongoDBQueryDatabaseCollection
