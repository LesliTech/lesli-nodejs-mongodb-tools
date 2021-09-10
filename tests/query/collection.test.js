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
    collection: "collection-test",
    new_collection_name: `testing`
}

// ·
const schema_parsed = collection.schema_parse(schema)

describe("query.database-collection", () => {

    before(async function () {
        await collection.delete(schema)
        await collection.create(schema)
        this.result = await collection.read(schema)
    })

    it("should return collection read", function () {

        expect(this.result).to.have.property("ok")
        expect(this.result).to.have.property("document_average_size")
        expect(this.result).to.have.property("database_collection_document_count")
        expect(this.result).to.have.property("database_collection_uncompressed_data_size")

        expect(this.result.document_average_size).to.have.property("bytes")
        expect(this.result.document_average_size).to.have.property("string")
        expect(this.result.database_collection_uncompressed_data_size).to.have.property("bytes")
        expect(this.result.database_collection_uncompressed_data_size).to.have.property("string")

    })

    after(async function () {
        await collection.delete(schema)
    })

})

describe("query.database-collection", () => {

    before(async function () {
        this.result = await collection.create(schema)
    })

    it("should return collection create", function () {

        expect(this.result).to.be.an("object")
        expect(this.result).to.have.property("s")
        expect(this.result.s).to.be.an("object")

    })

    after(async function () {
        await collection.delete(schema)
    })

})


describe("query.database-collection 4", () => {

    before(async function () {
        await collection.create(schema)
        this.result = await collection.rename(schema)
    })

    it("expected a collection with new name", function () {

        expect(this.result).to.be.an("object")
        expect(this.result).to.have.property("db")
        expect(this.result).to.have.property("collection")

        expect(this.result.db).to.be.a("string")
        expect(this.result.collection).to.be.a("string")

        expect(this.result.db).to.equal(`mongodb-tools-${schema.database}`)

    })

    after(async function () {
        await collection.delete({
            database: "buckets",
            collection: schema.new_collection_name,
            new_collection_name: schema.collection
        })
    })

})


describe("query.database-collection 3", () => {

    before(async function () {
        await collection.create(schema)
        this.result = await collection.delete(schema)
    })

    it("should return collection delete", function () {

        expect(this.result).to.be.a("boolean")
        expect(this.result).to.be.equal(true)

    })

})