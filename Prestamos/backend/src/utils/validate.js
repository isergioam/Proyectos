function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0
}

function isPositiveInteger(value) {
    const number = Number(value)
    return Number.isInteger(number) && number > 0
}

module.exports = {
    isNonEmptyString,
    isPositiveInteger
}