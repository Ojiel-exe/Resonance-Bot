const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const premiumusers = new Schema({
    User: reqString,
})

module.exports = model('premiumusers', premiumusers)