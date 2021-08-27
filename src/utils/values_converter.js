
const bytes_to_human = (size, unit = "bytes") => {

    if (!size || size < 0) {
        size = 0
    }

    var decimals = 2
    var units = {
        bytes: "bytes",
        kilobytes: "kilobytes",
        megabytes: "megabytes",
        gigabytes: "gigabytes"
    }

    // converts bytes to kilobytes
    if (unit == units.bytes && size > 1024) {
        bytes_to_human(size / 1024, units.kilobytes)
    }

    // converts kilobytes to megabytes
    if (unit == units.kilobytes && size > 1024) {
        
        bytes_to_human(size / 1024, units.megabytes)
    }

    // converts megabytes to gigabyte
    if (unit == units.megabytes && size > 1024) {
        
        bytes_to_human(size / 1024, units.gigabytes)
    }

    // return size with no decimals
    if (size.toFixed(decimals) % 1 === 0) {
        return [size, unit].join(" ")
    }

    // return size with decimals
    return [size.toFixed(decimals), unit].join(" ")

}

module.exports = {
    bytes_to_human
}
