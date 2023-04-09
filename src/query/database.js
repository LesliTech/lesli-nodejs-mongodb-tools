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
class LesliNodeJSMongoDBQueryDatabase extends LesliMongoDB {



    // · 
    constructor(config) {
        super(config)
    }


    
    // · 
    read = (schema) => this._database_read(schema)
    delete = (schema) => this._database_delete(schema)


    // · Return information about database including a list of collections
    _database_read(schema) {

        // cache database raw name before build the schema
        let database_name = schema.database.toString()

        schema = this.schema_parse(schema)

        return (async() => {

            let database = this.mongodb.client.db(schema.database)

            // get database statistics in bytes
            let information = await database.stats()

            let result = {
                information: {
                    database_name: information.db,
                    database_collection_count: information.collections,
                    database_collection_document_count: information.objects,
                    database_uncompressed_data_size: {
                        bytes: information.dataSize,
                        string: converter(information.dataSize)
                    },
                    database_storage_size: {
                        bytes: information.storageSize,
                        string: converter(information.storageSize)
                    },
                    document_average_size: {
                        bytes: information.avgObjSize,
                        string: converter(information.avgObjSize)
                    },
                    indexes: information.indexes,
                    indexes_size: {
                        bytes: information.indexSize,
                        string: converter(information.indexSize)
                    },
                    filesystem_available_space: {
                        bytes: information.fsTotalSize - information.fsUsedSize,
                        string: converter(information.fsTotalSize - information.fsUsedSize)
                    }
                }
            }

            result[database_name] = (await database.listCollections().toArray()).map(collection => {
                return {
                    name: collection.name
                }
            })

            return new Promise((resolve, reject) => {

                return resolve(result)

            })

        })()

    }

    _database_delete(schema){

        schema = this.schema_parse(schema)

        return this.mongodb.connection.then(e => {

            let database = this.mongodb.client.db(schema.database)

            return database.dropDatabase()

        }).catch(error => {

            console.log(error);

        })

    }

}


// · 
module.exports = LesliNodeJSMongoDBQueryDatabase
