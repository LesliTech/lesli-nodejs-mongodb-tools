<p align="center">
    <img width="175" alt="LesliTech logo" src="https://cdn.lesli.tech/leslitech/brand/leslitech-logo.svg" />
</p>

<h3 align="center">MongoDB tools for Node.js applications</h3>

<hr/>

**Version 0.6.0** 

## Table of Contents
* [Installation](#installation)
* [Website & documentation](#website--documentation)
* [Get starter](#get-starter)
* [Usage](#usage)
    - [Database query](#database-queries)
    - [Collection query](#collection-queries)
    - [Document query](#document-queries)
* [Unit tests](#unit-tests)
    - [Execute all unit tests](#execute-all-unit-tests)
    - [Execute specific unit tests](#execute-specific-unit-tests)
* [Geolocation](./docs/geolocation.md)

### Installation
--------
```console
$  npm install lesli-nodejs-mongodb-tools --save  
```

### Website & documentation
-------

This software is completely free and open source 

* Issue tracker: [https://github.com/LesliTech/lesli-nodejs-mongodb-tools/issues](https://github.com/LesliTech/lesli-nodejs-mongodb-tools/issues)



## Get starter
------
First of all, import `lesli-nodejs-mongodb-tools`.  
```js
let { database: Database, collection: Collection, document: Document } = require("lesli-nodejs-mongodb-tools")
```



### Usage
------
Before start using the library, create instances of `Database`, `Collection` and `Document`.  
```js
    let database = new Document(configuration.database)
    let collection = new Collection(configuration.database)
    let document = new Document(configuration.database)
```

> `configuration.database` comes from [lesli-nodejs-configuration](https://www.npmjs.com/package/lesli-nodejs-configuration)

#### Define a schema
A `schema` will help us to manage our mongodb inserts, is basically an object with properties: **database** and **collection**.  <br />
Example:

```js
    const schema = {
        database: "buckets",
        collection: "tests"
    }
```

> In the next mongodb methods will be necessary to send a schema as arguments.  

### Database queries
------
#### database.read(schema)
Return an object with information about a database specified by the given `schema`.  

```js
    let get_database_information = async(schema) => {

        // Getting information from database
        let information = await database.read(schema)
        console.log(information)
    }
```

All of these methods return promises, so you can use `async` and `await` or only promises with `then` and `catch`.  <br />
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

#### database.delete(schema)
Return `true` if the database was deleted successfully.  <br />
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



### Collection queries
------
#### collection.read(schema)
Read information about a collection by the given `schema`.  <br />
Example:

```js
    let read_collection = async(schema) => await collection.read(schema)
```

#### collection.create(schema)
Create new collection and return a cursor with information about the collection created.  <br />
Example:

```js
    let create_collection = async(schema) => await collection.create(schema)
```

#### collection.delete(schema)
Delete a collection, return `true` if everything was successful.  <br />
Example:

```js
    let delete_collection = async(schema) => await collection.delete(schema)
```

#### collection.rename(schema)
Change the current collection name and put the new by the given `schema`, you have to add a new property into the `schema` object called `new_collection_name`.  <br />
Example:

```js
    const schema = {
        database: "buckets",
        collection: "tests",
        new_collection_name: "new-collection-name"
    }
```

This method will return an object with database information, such as the new name of the collection and the database name.  <br />
Example:

```js
    let rename_collection = async(schema) => {

        let information = await collection.rename(schema

        // Show changes
        console.log(information) // { db: "database_name", collection: "new_collection_name" }
    })
```



### Document queries
------
#### document.create(schema, document)
Create document into the specified collection by the given `schema`. `document` should be an object or JSON with properties key => value that you want to save. Return information about if everything happened correctly.  <br />
Example:

```js
    let save_document = async(schema, document) => {
        let new_document = await document.create(schema, document)

        // Show information
        console.log(new_document) // { n: 1, ok: 1, id: ObjectId }
    }

    save_document(schema, { "name": "bob", "lastname": "sponge" })
```

#### document.find(schema, query?)
Find documents into the database and collection specified by the given `schema`. With `query` argument is possible to add aggregation pipelines, so you can add a custom query.  <br />
Example: 

```js
    let find_document = async(schema, query = {}) => await document.find(schema, query)
```

#### document.first(schema, query?)
Return the first document found.  <br />
Example:

```js
    let first_document = async(schema, query = {}) => await document.first(schema, query) // {}
```


#### document.update(schema, query, document)
Update one document in the database. You can filter by the given `query`, related to the data you want to update and `document` the new data. 
In the `query` argument you have tu send an object or JSON with the property `_id` that you want to update.   
For example, we are going to update the document created previously.

```js
    let query = {
        "_id": "an_id" // _id should be a valid id of MongoDB
    }

    let document = {
        "name": "Tom",
        "lastname": "Mate"
    }

    let update_one = async(schema, query, document) =>  await document.update(schema, query, document)

    // Call function
    update_one(schema, query, document)
```

#### document.delete(schema, query)
Delete document in a collection, returns an object with information about if everything happend correctly. Should receive `query` argument to filter what document do you want to delete. In the `query` argument you have tu send an object or JSON with the property `_id` that you want to delete.  <br />
Example:

```js
    let query = {
        "_id": "an_id" // _id should be a valid id of MongoDB
    }

    let delete_document = async(schema, query) => await document.delete(schema, query)
    
    delete_document(schema, query)
```

#### document.list(schema)
Return all documents in a collection. If there are not documents, returns an empty array.   <br />
Example:
```js
    let list_documents = async(schema) => await document.list(schema)
```


### Unit tests
------
This library implements unit tests with [Mocha JS](https://mochajs.org/) and [Chai JS](https://www.chaijs.com/api/bdd/) to validate if all methods saw previously work correctly. There are unit tests for `Database`, `Collection` and `Document`. You can test each of their methods.  

#### Execute all unit tests
If you want to test if all methods work correctly, run the next command in your MAC/Linux terminal or Windows CMD.  <br />

```console
$  npm run test
```

#### Execute specific unit tests
You can run specific uni tests either for `Database`, `Collection` or `Document`.  <br />
Run the next commands:

##### Execute unit tests for Databases
```console
$  npm run test:query:database
```

##### Execute unit tests for Collections
```console
$  npm run test:query:collection
```

##### Execute unit tests for Documents
```console
$  npm run test:query:document
```

###### Execute uni tests for Utils
These tests are useful for the others tests.  <br />

```console
$  npm run test:utils
```

### License  
------
Software developed in [Guatemala](http://visitguatemala.com/) by [LesliTech](https://www.lesli.tech) distributed under the *General Public License v 3.0* you can read the full license [here](http://www.gnu.org/licenses/gpl-3.0.html)
