


module.exports = function(query) {

    var pipeline = [{

        // Processes multiple aggregation pipelines 
        // within a single stage on the same set of input documents.
        "$facet": {

            // rows range found
            "documents": [
                { "$match": { }},
                { "$sort": { "datetime": -1 } },
                { "$skip": query.skip ? parseInt(query.skip) : 0 },
                { "$limit": query.limit ? parseInt(query.limit) : 1000 }
            ],

            // total rows found
            "records": [{ "$count": "total" }]

        }

    }]


    // Filter by specific field -> change to to column
    // TODO: fix this
    if (query.column && query.column != "") {
        pipeline[0]["$facet"].documents[0]["$match"][column] = query.text
    }

    // Filter by specific field -> change to to column
    if (query.match) {
        pipeline[0]["$facet"].documents[0]["$match"] = query.match
    }

    // Select specific fields
    if (query.project) {
        pipeline[0]["$facet"].documents.push({"$project": query.project })
    }


    // Return records between range of time
    if ((query.dateStart && query.dateStart != "") || (query.dateEnd && query.dateEnd != "")) {
        pipeline[0]["$facet"].rows[0]["$match"]["datetime"] = {
            "$gte": query.dateStart ? parseInt(query.dateStart) : 0,
            "$lte": query.dateEnd ? parseInt(query.dateEnd) : Date.now(),
        }
    }


    // Get N last records
    if (query.last && query.last != "" && query.last > 0) {
        pipeline[0]["$facet"].documents[1]["$sort"]["datetime"] = -1
        pipeline[0]["$facet"].documents[3]["$limit"] = parseInt(query.last)
    }

    return pipeline

}
