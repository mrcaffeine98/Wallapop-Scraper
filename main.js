const API = require("./src/API/API.js")
const def = require("./def.js")
const comms = require("./comms.js")
const config = require('./config.js')
const mongo = require('./src/mongo/mongo.js')
async function main() {
    comms.logstart()
    //Filters that are going to be applied to wallapop
    const markus = {
        'keywords': def.parameters.keywords.markus,
        'filters_source': def.parameters.filters_source.quick_filter,
        'latitude': def.parameters.latitude.monforteDeLemos_75,
        'longitude': def.parameters.longitude.monforteDeLemos_75,
        'max_sale_price': def.parameters.max_sale_price[100],
        'order_by': def.parameters.order_by.newest,
        'distance': def.parameters.distance["10km"]
    }
    //Find all items that match the criteria
    const itemsFound = await API.fetch(markus)
    //Add new properties to items found
    const itemsFound_modified = addProperties(itemsFound)
    ///Open mongo
    const markusDB = await mongo.collection(config.mongoURL, config.database, 'markus')
    //Uptade items to MongoDB
    //TODO Problema con al asyncronia sale de la funcion antes de que se termine
    const updateResult = await updateToMongo(markusDB, itemsFound_modified.search_objects)
    //Close mongo
    //mongo.close(markusDB)
    var temp = 1
    comms.logstop()
}
/** Add properties to items
 * @param  {Object} input
 * @return Object same with extra properties
 */
function addProperties(input) {
    for (let item of input.search_objects) {
        item.search_point = input.search_point
        item.time = {
            "found": comms.getNowDate(),
            "reserved": "",
            "sold": '',
            "expired": ""
        }
    }
    return input

}
/**Adds new items found to mongo collection
 * @param  {} collection
 * @param  {array} items Has to be an array with all objects to add
 */
function updateToMongo(collection, items) {
    const updates = []
    for (let item of items) {
        //The unique identifier for each item is web_slug, so am using it to create a unique id for mongo
        updates.push(mongo.replaceOne(collection, { "web_slug": item.web_slug }, item))
    }
    Promise.all(updates).then(values => {
        //TODO this mogno should be outside the function, at main
        mongo.close(collection)
        return updates
    })

}
main()
