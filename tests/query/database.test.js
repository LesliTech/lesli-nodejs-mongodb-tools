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
var expect = require("chai").expect;
const { resourceUsage } = require("process")


// · 
const LesliNodeJSMongoDBQueryDatabase = require("../../src/query/database.js")


// · 
var database = new LesliNodeJSMongoDBQueryDatabase({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "mongodb-tools"
})


// · 
const schema = {
    database: "tests"
}


describe("Test helper parse_schema", () => {

    before(async function () {
    })

    it("should return database read", done => {

        database.read(schema).then(result => {

            expect(result).to.have.property("information")
            expect(result.information).to.have.property("database_name")
            expect(result.information).to.have.property("database_collection_count")
            expect(result.information).to.have.property("database_collection_document_count")
            expect(result.information).to.have.property("database_uncompressed_data_size")
            expect(result.information).to.have.property("database_storage_size")
            expect(result.information).to.have.property("document_average_size")

        }).finally(() => {
            done()
        })

    })

})
