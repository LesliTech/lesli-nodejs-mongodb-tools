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
class LesliNodeJSMongoDBQueryDatabase extends LesliMongoDB {



    // · 
    constructor(config) {
        super(config)
    }


    
    // · 
    info = (schema) => this._database_read(schema)
    read = (schema) => this._database_read(schema)



    // · Return information about database including a list of collections
    _database_read(schema) {

        schema = this.schema_parse(schema)

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
                    string: converter.bytes_to_human(information.dataSize)
                },
                database_storage_size: {
                    bytes: information.storageSize,
                    human: converter.bytes_to_human(information.storageSize)
                },
                document_average_size: {
                    bytes: information.avgObjSize,
                    human: converter.bytes_to_human(information.avgObjSize)
                },
                indexes: information.indexes,
                indexes_size: {
                    bytes: information.indexSize,
                    human: converter.bytes_to_human(information.indexSize)
                },
                filesystem_available_space: {
                    bytes: information.fsTotalSize - information.fsUsedSize,
                    human: converter.bytes_to_human(information.fsTotalSize - information.fsUsedSize)
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

}


// · 
module.exports = LesliNodeJSMongoDBQueryDatabase
