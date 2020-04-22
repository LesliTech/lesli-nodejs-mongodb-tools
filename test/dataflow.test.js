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


let LesliNodeJSMongoDBWrapper = require("../index")
let assert = require("assert")


var database = new LesliNodeJSMongoDBWrapper({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "mongodb-wrapper"
})

const schema = {
    database: "tests",
    collection: "test"
}


describe("Test helper parse_schema", () => {

    it("should parse schema for test", done => {
        assert.deepEqual(database.parse_schema(schema),  {
            database: "mongodb-wrapper-tests",
            collection: "test"
        })
        done()
    })

})


describe("Test helper convert_bytes_to_human_value", () => {

    it("should convert undefined bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(), "0 bytes")
        done()
    })

    it("should convert null bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(null), "0 bytes")
        done()
    })

    it("should convert -10 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(-10), "0 bytes")
        done()
    })

    it("should convert 0 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(0), "0 bytes")
        done()
    })

    it("should convert 1 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(1), "1 bytes")
        done()
    })

    it("should convert 12 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(12), "12 bytes")
        done()
    })

    it("should convert 123 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(123), "123 bytes")
        done()
    })

    it("should convert 1234 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(1234), "1.21 kilobytes")
        done()
    })

    it("should convert 12345 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(12345), "12.06 kilobytes")
        done()
    })

    it("should convert 123456 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(123456), "120.56 kilobytes")
        done()
    })

    it("should convert 1234567 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(1234567), "1.18 megabytes")
        done()
    })

    it("should convert 12345678 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(12345678), "11.77 megabytes")
        done()
    })

    it("should convert 123456789 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(123456789), "117.74 megabytes")
        done()
    })

    it("should convert 1234567890 bytes to human format", done => {
        assert.equal(database.convert_bytes_to_human_value(1234567890), "1.15 gigabytes")
        done()
    })

})


describe("Test connection to database", () => {

    it("should create a connection to mongodb", done => {
        
        database.connection.then(result => { 
            assert.equal(true, true)
        }).catch(error => {
            return done(error)
        }).finally(done)

    })

})


describe("Test database management", () => {

    it("should create a database", done => {

        database.database_collection_create(schema).then(result => {
            
        }).catch(error => {
            return done(error)
        }).finally(done)

    })

    it("should get database information", done => {

        database.database_read(schema).then(result => {
            //assert.equal(result.length, 1)
            assert.equal(typeof result, "object")
        }).catch(error => {
            return done(error)
        }).finally(done)
        
    })

})


describe("Test database collection management", () => {

    it("should create a database collection", done => {

        database.database_collection_create(schema).then(result => {
            assert.equal(true, true)
        }).catch(error => {
            return done(error)
        }).finally(done)

    })

    it("should read database collection information", done => {

        database.database_collection_read(schema).then(result => {
            //assert.equal(result.length, 1)
            assert.equal(typeof result, "object")
        }).catch(error => {
            return done(error)
        }).finally(done)
        
    })

    it("should delete database collection information", done => {

        database.database_collection_delete(schema).then(result => {
            assert.equal(true, true)
        }).catch(error => {
            return done(error)
        }).finally(done)
        
    })

})


describe("Test database collection document management", () => {

    it("should create a new database collection document", done => {

        // first, create
        database.database_collection_document_create(schema, schema).then(result => {
            
            //console.log(result)

        }).catch(error => {
            return done(error)
        }).finally(done)

    })

    it("should list all database collection documents", done => {

        // first, create
        database.database_collection_documents(schema).then(result => {
            
            //console.log(result)

        }).catch(error => {
            return done(error)
        }).finally(done)

    })

})
