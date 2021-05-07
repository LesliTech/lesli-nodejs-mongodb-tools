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
let assert = require("assert")


// · 
const LesliNodeJSMongoDBQueryDatabaseCollection = require("../../src/query/database-collection.js")


// · 
var collection = new LesliNodeJSMongoDBQueryDatabaseCollection({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "project-raven"
})


// · 
const schema = {
    database: "buckets",
    collection: "ldonis"
}


describe("Test helper parse_schema", () => {

    it("should return database info", done => {

        collection.index(schema).then(result => {
            console.log(result)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            done()
        })

    })

})
