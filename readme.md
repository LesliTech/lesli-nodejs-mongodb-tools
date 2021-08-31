<p align="center">
    <img width="175" alt="LesliTech logo" src="https://cdn.lesli.tech/leslitech/brand/leslitech-logo.svg" />
</p>

<h3 align="center">MongoDB tools for Node.js applications</h3>

<hr/>

Version 0.4.0 



#### Installation
--------
```
npm install lesli-nodejs-mongodb-tools --save  
```



* [Get starter](./docs/get-starter.md)
* [Database query](./docs/database-query.md)
* [Geolocation](./docs/geolocation.md)



#### Website & documentation
-------

This software is completely free and open source

* Issue tracker: [https://github.com/LesliTech/lesli-nodejs-mongodb-tools/issues](https://github.com/LesliTech/lesli-nodejs-mongodb-tools/issues)



### API
------
```js
let { database: Database, collection: Collection, document: Document } = require("lesli-nodejs-mongodb-tools")
```



#### Usage
------
Before start using the library, create instances of `Database`, `Collection` and `Document`.
```js
    let database = new Document(configuration.database)
    let collection = new Collection(configuration.database)
    let document = new Document(configuration.database)
```

##### Defining a schema
A `schema` will help us to manage our mongodb inserts, is basicly an object with properties: **database** and **collection**.
Example:

```js
    const schema = {
        database: "buckets",
        collection: "tests"
    }
```

In the next mongodb methods will be necessary to send a schema as arguments.

##### Database methods
------
###### database.read(schema)
Returns an object with information about a database specified by the given `schema`.

```js
    let get_database_information = async(schema) => {

        // Getting information from database
        let information = await database.read(schema)
        console.log(information)
    }
```

All of these methods return promises, so you can use `async` and `await` or only promises with `then` and `catch`.
Let's see another example:

```js
    database.read(schema).then(result => {
        
        // Getting information from database
        let information = result
        console.log(information)

    }).catch(error => {
        console.log(error)
    })
```

###### database.delete(schema)
Return `true` value if the database was deleted successfully. 
Example:

```js
    let delete_database = async(schema) => {
        // Delete all information about a database given
        let is_deleted = await database.delete(schema)

        if(is_delete){
            console.log("Database has been deleted successful")
        }

    }

```



##### Collection methods
------
###### collection.read(schema)
Read information about a collection by the given `schema`.
Example:

```js
    let read_collection = async(schema) => await collection.read(schem)
```

###### collection.create(schema)
Creates new collection and returns a cursor with information about the collection created. 
Example:

```js
    let create_collection = async(schema) => await collection.create(schema)
```

###### collection.delete(schema)
Delete a collection, returns `true` if everything was successful.
Example:

```js
    let delete_collection = async(schema) => await collection.delete(schema)
```

###### collection.rename(schema)
Change the current collection name and put the new by the given `schema`, you have to add a new property into the `schema` object named `new_collection_name`.
Example:

```js
    const schema = {
        database: "buckets",
        collection: "tests",
        new_collection_name: "new-collection-name"
    }
```

This method returns an object with database information, such as the new name of the collection and the database name.
Example:

```js
    let rename_collection = async(schema) => {

        let information = await collection.rename(schema

        // Show changes
        console.log(information) // { db: "database_name", collection: "new_collection_name" }
    })
```



##### Document methods
------
###### document.create(schema, document)
Create document into the specified collection by the given `schema`. `Document` should be an object or JSON with properties key => value that you want to save. Returns information about if everything happened correctly.
Example:

```js
    let save_document = async(schema, document) => {
        let new_document = await document.create(schema, document)

        // Show information
        console.log(new_document) // { n: 1, ok: 1, id: ObjectId }
    }

    save_document(schema, { "name": "bob", "lastname": "sponge" })
```

###### document.find(schema, query?)
Finds documents into the database and collection specified by the given `schema`. With `query` argument is possible to add aggregation pipelines, so you can add a custom query.
Example: 

```js
    let find_document = async(schema, query = {}) => await document.find(schema, query)
```

###### document.first(schema, query?)
Returns the first document found.
Example:

```js
    let first_document = async(schema, query = {}) => await document.find(schema, query) // {}
```

###### document.delete(schema, query)
Delete document in a collection, returns an object with information about if everything happend correctly. Should receive `query` argument to filter what document do you want to delete.
Example:

```js
    let delete_document = async(schema, query) => await document.delete(schema, query)
    
    delete_document({ "name": "bob" })
```

###### document.list(schema)
Returns all documents in a collection. If there are not documents, returns an empty array.

```js
    let list_documents = async(schema) => await document.list(schema)
```



### License  
------
Software developed in [Guatemala](http://visitguatemala.com/) by [LesliTech](https://www.lesli.tech) distributed under the *General Public License v 3.0* you can read the full license [here](http://www.gnu.org/licenses/gpl-3.0.html)
