const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqStrings = {
    type: String,
    default: null
}

const reqBoolean = {
    type: Boolean,
    default : false,
}

const afk = new Schema({
    Guild: reqString,
    User : reqString,
    AFK : reqBoolean,
    Reason : reqStrings
})

module.exports = model('afk', afk)