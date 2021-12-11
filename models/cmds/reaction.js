const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reaction = new Schema({
    Guild: reqString,
    Content1: reqString,
    Content2: reqString
})

module.exports = model('reaction', reaction)