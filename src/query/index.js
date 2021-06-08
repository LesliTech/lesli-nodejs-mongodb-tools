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



/*

database_read

database_collections
database_collection_read
database_collection_create
database_collection_delete

database_collection_document_find
database_collection_document_create
database_collection_document_update
database_collection_document_delete

database_collection_document_find -> options {
    last: 1..N,
    page: 1,
    perPage: 15,
    order: "desc",
    orderColumn: "name"
}

*/



// · 
exports.database = require("./database");
exports.collection = require("./database-collection")
exports.document = require("./database-collection-document")
