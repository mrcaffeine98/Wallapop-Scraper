// const API = require('./API.js')
const OFFERS_URL = "https://es.wallapop.com/coches-segunda-mano"
async function fetchURL() {
    const webdriver = require("selenium-webdriver");

    // Require webdriver for chrome
    // browser called chromedriver
    require("chromedriver");

    // Build new window of chrome
    let driver = new webdriver.Builder()
        .forBrowser("chrome").build();

    // Open geeksforgeeks using get method
    const a = await driver.get("https://www.geeksforgeeks.org/");
    var tmep = 1
}
// fetchURL()