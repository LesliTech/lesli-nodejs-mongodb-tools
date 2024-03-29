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
const MongoDB = require("mongodb")



// · 
class LesliMongoDB {

    constructor(config) {

        this.mongodb = { }

        this.namespace = config.namespace

        this.mongodb.client = new MongoDB.MongoClient("mongodb://"+config.host+":"+config.port, { family: 4, useNewUrlParser: true, useUnifiedTopology: true })
        
        this.mongodb.connection = this.mongodb.client.connect()

    }

    schema_parse(schema) {
        schema = Object.assign({ }, schema)
        schema.database = [this.namespace, schema.database].join('-')
        return schema
    }

    query(request={}) {

        options["pagination"] = {
            page: 1,
            perPage: 10
        }

        options["order"] = {
            order: "desc",
            orderBy: "id"
        }

        return options

    }
    
}



// · 
module.exports = LesliMongoDB
