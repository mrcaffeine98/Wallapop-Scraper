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

