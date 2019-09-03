/*
Lesli

Copyright (c) 2019, Lesli Technologies, S. A.

All the information provided by this website is protected by laws of Guatemala related 
to industrial property, intellectual property, copyright and relative international laws. 
Lesli Technologies, S. A. is the exclusive owner of all intellectual or industrial property
rights of the code, texts, trade mark, design, pictures and any other information.
Without the written permission of Lesli Technologies, S. A., any replication, modification,
transmission, publication is strictly forbidden.
For more information read the license file including with this software.

Lesli Mongodb Wrapper

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@dev      Luis Donis <ldonis@lesli.tech>
@author   LesliTech <hello@lesli.tech>
@license  Propietary - all rights reserved.
@version  GIT: 0.1.0 alpha

// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
//  · 
*/


let LesliMongodbWrapper = require('../index')
let assert = require('assert')



let database = new LesliMongodbWrapper({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "mongodb-wrapper"
})

const schemaCollection = {
    schema: 'tests',
    collection: 'tests'
}


//  · 
// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
describe('Test connection to database', () => {

    it('should create a connection to mongodb', done => {
        
        database.connection.then(result => { 
            assert.equal(true, true)
        }).catch(error => {
            return done(error)
        }).finally(done)

    })

})


//  · 
// ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
describe('Test schema management', () => {


    it('should create schema', done => {

        database.createSchemaCollection(schemaCollection).then(result => {
            
        }).catch(error => {
            return done(error)
        }).finally(done)

    })


    it('should get schema information', done => {

        database.getSchema(schemaCollection).then(result => {
            assert.equal(result.length, 1)
            assert.equal(typeof result, 'object')
        }).catch(error => {
            return done(error)
        }).finally(done)
        
    })


    it('should get schema collection information', done => {

        database.getSchemaCollection(schemaCollection).then(result => {
            assert.equal(typeof result, 'object')
            assert.equal(result.ok, 1)
        }).catch(error => {
            return done(error)
        }).finally(done)

    })


})
