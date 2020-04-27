
let LesliNodeJSMongoDBWrapper2 = require("./src/lesli-nodejs-mongodb-geospatial")

var database2 = new LesliNodeJSMongoDBWrapper2({
    enabled: false,
    host: "localhost",
    port: "27017",
    namespace: "project-raven"
})

database2.data_within_radius({
    database: "devices",
    collection: "ldonis66"
}, {
    longitude: 14.5591851,
    latitude: -90.7513728,
    kilometers: 8.82
}).then(result => {
    result.toArray().then(result => {
        console.log(result)
    })
}).catch(error => {
    console.log(error)
})
