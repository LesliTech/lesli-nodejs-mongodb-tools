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

describe("query.database-collection-document", () => {

    it("expected a document created successfully", (done)=> {

        document.create(schema, {"username": "bob", "email": "bob@gmail.com"}).then(result => {
            // -
            expect(result).to.have.property("n")
            expect(result).to.have.property("ok")
            expect(result).to.have.property("id")

            expect(result.n).to.be.equal(1)

            expect(result.ok).to.be.equal(1)

            expect(result.id).to.be.an("object")

            done()
        })

    })

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

    it("expected the first document", (done) => {

        document.first(schema).then(result => {
            // -
            expect(result).to.be.an("object")
            expect(result).to.have.property("_id")
            expect(result).to.have.property("datetime")

            expect(result._id).to.be.an("object")
            expect(result.datetime).to.be.a("date")

            done()
        })

    })

    it("expected a document updated", (done) => {

        document.update(schema, {"username": "bob"}, {"username": "rocky"}).then(result => {
            // -
            expect(result).to.be.an("object")
            expect(result).to.have.property("n")
            expect(result).to.have.property("ok")
            expect(result).to.have.property("updatedCount")

            expect(result.n).to.be.a("number")
            expect(result.ok).to.be.a("number")
            expect(result.updatedCount).to.be.a("number")

            expect(result.n).to.be.equal(1)
            expect(result.ok).to.be.equal(1)
            expect(result.updatedCount).to.be.equal(1)

            done()
        })

    })

    it("expected all documents from a collection", (done) => {

        document.list(schema).then(result => {
            // -
            expect(result).to.be.an("array")

            done()
        })

    })

    it("expected a document deleted", (done) => {

        document.delete(schema, {"username": "rocky"}).then(result => {
            // -
            expect(result).to.be.an("object")
            expect(result).to.have.property("n")
            expect(result).to.have.property("deletedCount")

            expect(result.n).to.be.a("number")
            expect(result.ok).to.be.a("number")
            expect(result.deletedCount).to.be.a("number")
            expect(result.deletedCount).to.be.equal(1)
            
            done()
        })

    })

})