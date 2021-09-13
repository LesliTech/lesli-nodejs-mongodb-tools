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
let expect = require('chai').expect;

// ·
const LesliNodeJSMongoDBQueryDatabaseCollectionDocument = require("../../src/query/database-collection-document.js")

// ·
let document = new LesliNodeJSMongoDBQueryDatabaseCollectionDocument({
    ensabled: true,
    host: 'localhost',
    port: '27017',
    namespace: "mongodb-tools"
})

// ·
const schema = {
    database: "buckets",
    collection: `collection-test`,
}


// - Tools use for tests
const newDocument = {
    "name": "Bob"
}

// Create document
describe("query.database-collection-document-create", () => {

    before(async function () {
        // Create a document
        this.result = await document.create(schema, newDocument)
        this.idDocument = this.result.id
    })


    it("expected a document created successfully", function () {

        // -
        expect(this.result).to.have.property("n")
        expect(this.result).to.have.property("ok")
        expect(this.result).to.have.property("id")

        expect(this.result.n).to.equal(1)

        expect(this.result.ok).to.equal(1)

        expect(this.result.id).to.an("object")

    })

    after(async function () {
        // Delete the document created
        await document.delete(schema, { "_id": this.idDocument })
    })

})

// Get document
describe("query.database-collection-document-read", () => {

    it("expected documents read", (done) => {

        document.find(schema).then(result => {
            // -
            expect(result).to.be.an("object")

            expect(result).to.have.property("records")
            expect(result).to.have.property("documents")

            expect(result.records).to.be.an("object")
            expect(result.records).to.have.property("total")
            expect(result.records).to.have.property("found")
            expect(result.records.total).to.be.a("number")
            expect(result.records.found).to.be.a("number")

            expect(result.documents).to.be.an("array")

            done()
        })

    })

})

// Get the first document
describe("query.database-collection-document-first", () => {

    before(async function () {
        // Create document
        this.result = await document.create(schema, newDocument)
        this.idDocument = this.result.id

        // Get the first document found
        this.result = await document.first(schema)
    })

    it("expected the first document", function () {

        expect(this.result).to.be.an("object")
        expect(this.result).to.have.property("_id")
        expect(this.result).to.have.property("datetime")
        expect(this.result._id).to.be.an("object")
        expect(this.result.datetime).to.be.a("date")

    })

    after(async function () {
        // Delete the document created
        await document.delete(schema, { "_id": this.idDocument })
    })

})

// Update document
describe("query.database-collection-document-update", () => {

    before(async function () {
        // Create document
        this.result = await document.create(schema, newDocument)
        this.idDocument = this.result.id

        // Update the document created
        this.result = await document.update(schema, { "_id": this.idDocument }, { "name": "Tom" })
    })

    it("expected a document updated", function () {

        expect(this.result).to.have.property("n")
        expect(this.result).to.have.property("ok")
        expect(this.result).to.have.property("updatedCount")

        expect(this.result.n).to.be.a("number")
        expect(this.result.ok).to.be.a("number")
        expect(this.result.updatedCount).to.be.a("number")

        expect(this.result.n).to.be.equal(1)
        expect(this.result.ok).to.be.equal(1)
        expect(this.result.updatedCount).to.be.equal(1)


    })

    after(async function () {
        // Delete the document created
        await document.delete(schema, { "_id": this.idDocument })
    })

})

// List all documents in a collection
describe("query.database-collection-document-list", () => {

    it("expected all documents from a collection", (done) => {

        document.list(schema).then(result => {
            // -
            expect(result).to.be.an("array")

            done()
        })

    })

})

// Delete document
describe("query.database-collection-document-delete", () => {

    before(async function () {
        // Create new document
        this.result = await document.create(schema, newDocument)

        // Delete the document created
        this.result = await document.delete(schema, { "_id": this.result.id })
    })

    it("expected a document deleted", function () {

        expect(this.result).to.be.an("object")
        expect(this.result).to.have.property("n")
        expect(this.result).to.have.property("deletedCount")

        expect(this.result.n).to.be.a("number")
        expect(this.result.ok).to.be.a("number")
        expect(this.result.deletedCount).to.be.a("number")
        expect(this.result.deletedCount).to.be.equal(1)

    })

})