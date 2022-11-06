//Modulo que se encarga de hacer llamadas a la API de Wallapop

const axios = require('axios')
const fs = require('fs')
const comms = require('./comms.js')

/**Funcion que se encarga de hacer llamadas a la API de wallapop
 * @param  {Object} parameters Es un objeto que contiene por propiedades los parametros de la URL
 * @return Object with all found
 */
exports.fetch = function (parameters) {
    const url = createURL(parameters)
    axios.get(url)
        .then(function response(response) {
            //save the old result   
            const result_old = response
            const result = response.data
            fs.writeFile('./WallapopItems.json', JSON.stringify(response.data), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            const dateTime = comms.getNowDate()
            fs.writeFile(`./data_backup/${dateTime}WallapopItems.json`, JSON.stringify(response.data), function (err) {
                if (err) throw err;
            });
            return JSON.stringify(response.data)
        })
        .catch(function (error) {
            console.log(error);
            return error
        });
    //Also save result in a file



}
/** Creates the url
 * https://es.wallapop.com/app/search?keywords=markus&filters_source=quick_filters&latitude=40.47954&longitude=-3.70052&max_sale_price=100&order_by=newest&distance=10000
 * @param  {object} obj Object that contain all the parameters
 * @returns {string} URL
 */

function createURL(obj) {
    //TODO La funcion fallara si al principio no se le pasa un keyword por el ?
    const search_url_base = "https://api.wallapop.com/api/v3/general/search?"
    let url = search_url_base;
    if (obj.keywords) {
        url += "keywords="
        url += obj.keywords
    }
    if (obj.filters_source) {
        url += "&filters_source="
        url += obj.filters_source
    }
    if (obj.latitude) {
        url += "&latitude="
        url += obj.latitude
    }
    if (obj.longitude) {
        url += "&longitude="
        url += obj.longitude
    }
    if (obj.min_sale_price) {
        url += "&min_sale_price="
        url += obj.min_sale_price
    }
    if (obj.max_sale_price) {
        url += "&max_sale_price="
        url += obj.max_sale_price
    }
    /*
    if (obj.order_by) {
        url += "&order_by="
        url += obj.order_by
    }
    */
    /*
    if (obj.distance) {
        url += "&distance="
        url += obj.distance
    }
    */
    return url
}