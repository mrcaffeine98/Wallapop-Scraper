const API = require("./src/API/API.js")
const def = require("./def.js")
const comms = require("./comms.js")
const config = require('./config.js')
const mongo = require('./src/mongo/mongo.js')
const fs = require('fs')
async function main(collection) {
    comms.logstart()
    //Filters that are going to be applied to wallapop
    let wallapopFilters
    try {
        wallapopFilters = fs.readFileSync(`./src/filters/${collection}.json`)
    } catch (e) {
        return console.error("Add filters to the collection" + collection)
    }
    //Find all items that match the criteria
    const itemsFound = await API.fetch(wallapopFilters)
    //Add new properties to items found
    const itemsFound_modified = addProperties(itemsFound)
    ///Open mongo
    const markusDB = await mongo.collection(config.mongoURL, config.database, 'markus')
    //Uptade items to MongoDB
    //TODO Problema con al asyncronia sale de la funcion antes de que se termine
    const updateResult = updateToMongo(markusDB, itemsFound_modified.search_objects)
    //Close mongo
    //mongo.close(markusDB)
    var temp = 1
    comms.logstop()
}
async function analizeWallapopFilters(collection) {
    comms.logstart()
    let wallapopFilters
    try {
        wallapopFilters = JSON.parse(fs.readFileSync(`./src/filters/${collection}.json`))
    } catch (e) {
        return console.error("Add filters to the collection" + collection)
    }
    //Find all items that match the criteria
    let itemsFound = []
    for (let filter of wallapopFilters) {
        const fetchedData = await API.fetch(filter)
        //Add the property filter to each item
        for (item of fetchedData.search_objects) {
            item.filter = filter
        }
        itemsFound = itemsFound.concat(fetchedData)
    }
    //Add new properties to all items
    for (let item of itemsFound) {
        item = addProperties(item)
    }
    ///Open mongo
    const coll = await mongo.collection(config.mongoURL, config.database, collection)
    comms.log("info", "writingFiles")
    for (let item of itemsFound) {
        const updateResult = await updateToMongo(coll, item.search_objects)
    }
    await comms.delay(2).then((value) => {
        mongo.close(coll)
        comms.logstop()
    }
    )
}
/** Add properties to items
 * @param  {Object} input
 * @return Object same with extra properties
 */
function addProperties(input,) {
    item
    for (let item of input.search_objects) {
        item.search_point = input.search_point
        item.time = {
            "found": comms.getNowDate(),
            "pending": null,
            "sold": null,
            "reserved": null,
            "banned": null,
            "expired": null,
            "onhold": null
        }
    }
    return input

}
/**Adds new items found to mongo collection
 * @param  {} collection
 * @param  {array} items Has to be an array with all objects to add
 */
async function updateToMongo(collection, items) {
    const updates = []
    for (let item of items) {
        const found = await mongo.findOne(collection, { "web_slug": item.web_slug })
        if (found === null) {
            //The unique identifier for each item is web_slug, so am using it to create a unique id for mongo
            updates.push(mongo.replaceOne(collection, { "web_slug": item.web_slug }, item))
        } else {
            // If its found then check if any propertie is able to update
            const { itemResult, update } = checkStatus(item, found)
            if (update === true) {
                updates.push(mongo.replaceOne(collection, { "web_slug": item.web_slug }, itemResult));
            }
        }
    }
    Promise.all(updates).then(values => {
        // mongo.close(collection)
        //TODO this mongo should be outside the function, at main
        return updates
    })

}
/** Check the status of the item found, add properties
 * @param  {Object} item Item found by Scraper
 * @param  {Object} found Item found in mongoDB
 * @return {Object} { itemResult, update }
 */
function checkStatus(item, found) {
    let itemResult = item
    const flags = item.flags
    const time = item.time
    let update = false
    if (flags.pending === true && found.time.pending === null) {
        itemResult.time.pending = comms.getNowDate()
        update = true
    } if (flags.sold === true && found.time.sold === null) {
        itemResult.time.sold = comms.getNowDate()
        update = true
    } if (flags.reserved === true && found.time.reserved === null) {
        itemResult.time.reserved = comms.getNowDate()
        update = true
    } if (flags.banned === true && found.time.banned === null) {
        itemResult.time.banned = comms.getNowDate()
        update = true
    } if (flags.expired === true && found.time.expired === null) {
        itemResult.time.expired = comms.getNowDate()
        update = true
    } if (flags.onhold === true && found.time.onhold === null) {
        itemResult.time.onhold = comms.getNowDate()
        update = true
    }
    return { "itemResult": itemResult, "update": update }
}
/**Insert new filter that will be applied
 * @param  {string} url
 * @param  {string} collection
 */
function insertNewFilter(url, collection) {
    //https://es.wallapop.com/app/search?keywords=markus&filters_source=quick_filters&latitude=40.47954&longitude=-3.70052&max_sale_price=100&order_by=newest&distance=10000
    const newFilter = {}
    const url1 = url.split("?")
    const url2 = url1[1].split("&")
    for (let item of url2) {
        const param = item.split("=")
        newFilter[param[0]] = param[1]
    }
    try {
        const data = fs.readFileSync(`./src/filters/${collection}.json`)
        let json = JSON.parse(data)
        json.push(newFilter)
        fs.writeFileSync(`./src/filters/${collection}.json`, JSON.stringify(json))
    } catch (e) {
        fs.writeFileSync(`./src/filters/${collection}.json`, JSON.stringify([newFilter]))
    }
}
// main()
// insertNewFilter("https://es.wallapop.com/app/search?keywords=ddr4%2016%20gb%20sodim&filters_source=search_box&latitude=40.47954&longitude=-3.70052&distance=50000&max_sale_price=100", "itemsToBuy")
analizeWallapopFilters("itemsToBuy")