const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const custom = new Schema({
    Guild: reqString,
    Command: reqString,
    Content: reqString
})

module.exports = model('custom', custom)