const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

let prefix = new Schema({
    _id: reqString,
    Prefix: String,
})

module.exports = model('prefix', prefix)