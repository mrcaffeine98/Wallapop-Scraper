const API = require("./API.js")
const def = require("./def.js")
function main() {
    //https://es.wallapop.com/app/search?keywords=markus&filters_source=quick_filters&latitude=40.47954&longitude=-3.70052&max_sale_price=100&order_by=newest&distance=10000
    const itemToFind = {
        keywords: def.parameters.keywords.markus,
        filters_source: def.parameters.filters_source.quick_filter,
        latitude: def.parameters.latitude.monforteDeLemos_75,
        longitude: def.parameters.longitude.monforteDeLemos_75,
        max_sale_price: def.parameters.max_sale_price[100],
        order_by: def.parameters.order_by.closest,
        distance: def.parameters.distance["10km"]
    }
    const result = API.fetch(itemToFind)
    var temp = 1
}
main()