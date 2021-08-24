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


// · 
const LesliNodeJSMongoDBQueryDatabaseCollection = require("../../src/query/database-collection.js")


// · 
var collection = new LesliNodeJSMongoDBQueryDatabaseCollection({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "mongodb-tools"
})


// · 
const schema = {
    database: "buckets",
    collection: "collection-test-"+(new Date()).getTime(),
    new_collection_name: `testing-${(new Date()).getTime()}`
}

// · 
const schema_parsed = collection.schema_parse(schema)

describe("query.database-collection", () => {

    it("should return collection read", done => {

        collection.read(schema).then(result => {

            expect(result).to.have.property("ok")
            expect(result).to.have.property("document_average_size")
            expect(result).to.have.property("database_collection_document_count")
            expect(result).to.have.property("database_collection_uncompressed_data_size")

            expect(result.document_average_size).to.have.property("bytes")
            expect(result.document_average_size).to.have.property("string")
            expect(result.database_collection_uncompressed_data_size).to.have.property("bytes")
            expect(result.database_collection_uncompressed_data_size).to.have.property("string")

        }).finally(() => {
            done()
        })

    })

})

describe("query.database-collection 2", () => {

    it("should return collection create", done => {

        collection.create(schema).then(result => {

            expect(result).to.be.an("object")
            expect(result).to.have.property("s")
            expect(result.s).to.be.an("object")

            done()
        })

    })

})


// describe("query.database-collection 3", () => {

//     it("should return collection delete", done => {

//         collection.delete(schema).then(result => {

//             expect(result).to.be.a("boolean")
//             expect(result).to.be.equal(true)

//             done()
//         })

//     })

// })

describe("query.database-collection 4", () => {

    it("expected a collection with new name", (done) => {

        collection.rename(schema).then(result => {

            expect(result).to.be.an("object")
            expect(result).to.have.property("db")
            expect(result).to.have.property("collection")

            expect(result.db).to.be.a("string")
            expect(result.collection).to.be.a("string")

            expect(result.db).to.equal(`mongodb-tools-${schema.database}`)

            done()
        })

    })

})

describe("query.database-collection 5", () => {

    it("expected all documents from a collection", (done) => {

        collection.list_documents(schema).then(result => {

            expect(result).to.be.an("array")

            done()
        })

    })

})