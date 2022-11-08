// Easy use of mongoDB
// version 0.0.3

const comms = require('../../comms.js')
const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
//TODO lv 2 SUGERENCIA: Importar libreria mongoose, y trabajar con ella porque es mas sencilla y facil de usar 

// crea conector con la coleccion de la base de datos mongodb
module.exports.collection = async function (mongoURL, database, collection) {
    comms.log('info', 'Connecting to Mongo...')
    const db = await mongoClient.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    comms.log('info', `Opening ${database}...`)
    const dbo = await db.db(database)
    comms.log('info', `Pointing to ${collection}...`)
    const coll = await dbo.collection(collection)
    return { coll: coll, db: db }
}
// cierra el conector con la coleccion de la base de datos mongodb
module.exports.close = async function (db) {
    comms.log('info', 'Disconnecting to Mongo...')
    await db.db.close()
    comms.log('info', `Close mongoDB`)
}

module.exports.findOne = async function (collection, check) {
    // comprueba si existe en la Base de datos, y si no es asi devuelve null
    const dato = await collection.coll.findOne(check)
    return dato
}

module.exports.find = async function (collection, check) {
    // comprueba si existe en la Base de datos, y si no es asi devuelve null
    const dato = await collection.coll.find(check).toArray()
    return dato
}
//Create o replaceOne es lo mismo
module.exports.replaceOne = function (collection, check, info) {
    return collection.coll.replaceOne(check, info, { upsert: true })
}
//Amplia los datos del registro con los contenidos en info
module.exports.updateOne = function (collection, id, info) {
    const o_id = new mongodb.ObjectId(id);
    return collection.coll.updateOne({ '_id': o_id }, { $set: info })
}
//Elimina un elemento de la colleccion  
module.exports.deleteOne = function (collection, check) {
    return collection.coll.deleteOne(check)
}
//Elimina un elemento de la colleccion por ID
module.exports.deleteOneById = function (collection, id) {
    const o_id = new mongodb.ObjectId(id);
    return collection.coll.deleteOne({ '_id': o_id })
}
//Elimina la collección y devuelve si se ha completado, y la cantidad de elementos eliminados
module.exports.deleteCollection = async function (collection) {
    const action = await collection.coll.deleteMany({})
    return action
}