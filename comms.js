// Tools for smart programmers
// version 0.0.1

const process = require('process');
const os = require('os');
const myPackage = require('./package.json')

exports.log = (type, msg) => {
    log(type, msg)
}
function log(type, msg) {
    const ahora = new Date().toString().slice(16, 24)
    console.log(`${ahora} ${type}: ${msg}`)
}
exports.logstart = () => {
    log('start', `${myPackage.name} v.${myPackage.version} @ ${os.hostname()} with ${process.platform} ${os.arch()} `)
    log('start', `${os.cpus().length} x ${os.cpus()[0].model} cpus.`)
    log('start', 'id del proceso: ' + process.pid)
    log('start', `Node ${process.version} at ${process.execPath} => ${process.cwd()}`)
}

exports.logstop = () => {
    log('stop', `Tiempo de procesos ${process.uptime()} segundos.`)
}

exports.getNowDate = function () {
    const date = new Date()
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()

    const now = `${year}-${month}-${day}_${hour}-${minute}-${seconds}`
    return now
}
