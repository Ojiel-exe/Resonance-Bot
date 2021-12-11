const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const donation = new Schema({
    _id: reqString,
    Channel1: reqString,
    Channel2: reqString,
})

module.exports = model('donation', donation)