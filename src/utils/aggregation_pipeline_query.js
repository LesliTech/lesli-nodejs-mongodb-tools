"use strict"
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
module.exports = function(query) {

    var pipeline = [{

        // Processes multiple aggregation pipelines 
        // within a single stage on the same set of input documents.
        "$facet": {

            // rows range found
            "documents": [
                { "$match": { }},
                { "$sort": query.sort || { "datetime": -1 } },
                { "$skip": query.skip ? parseInt(query.skip) : 0 },
                { "$limit": query.limit ? parseInt(query.limit) : 1000 }
            ],

            // total rows found
            "records": [{ "$count": "total" }]

        }

    }]


    // Filter by specific field -> change to to column
    // query['match'] = { key: value }
    if (query.match) {
        pipeline[0]["$facet"].documents[0]["$match"] = query.match
    }


    // Get N last records
    if (query.last && query.last != "" && query.last > 0) {
        pipeline[0]["$facet"].documents[3]["$limit"] = parseInt(query.last)
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

    //
    return pipeline

}
