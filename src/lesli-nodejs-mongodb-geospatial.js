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

ProjectRaven - Backend platform for apps, websites and IoT devices

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@contact  <hello@lesli.tech>
@website  <https://lesli.tech>
@license  GPLv3 http://www.gnu.org/licenses/gpl-3.0.en.html

// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
// · 
*/


// · Import frameworks, libraries and tools
// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
const MongoDB = require("mongodb")
const MongoClient = MongoDB.MongoClient
const ObjectId = MongoDB.ObjectID


// · 
class LesliNodeJSMongoDBWrapper {


    // · 
    constructor(config) {
        this.client = new MongoClient("mongodb://"+config.host+":"+config.port, { family: 4, useNewUrlParser: true, useUnifiedTopology: true })
        this.connection = this.client.connect()
        this.namespace = config.namespace
    }

    database_collection_documents(schema, query = {}) {
        return this._database_collection_documents(schema, query)
    }


    // · Parse schema information
    // · Return standard namespace - database -collection structure
    parse_schema(schema) {
        schema = Object.assign({ }, schema)
        schema.database = [this.namespace, schema.database].join('-')
        return schema
    }

    data_within_radius(schema, query) {

        schema = this.parse_schema(schema)

        return this.connection.then(e => {

            let database = this.client.db(schema.database)
            
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

            return collection.find({
                "location": {
                    $geoWithin: {
                        $centerSphere: [[query.latitude, query.longitude], radio_to_search]
                    }
                }
            })

        })

    }

}


// · 
module.exports = LesliNodeJSMongoDBWrapper
