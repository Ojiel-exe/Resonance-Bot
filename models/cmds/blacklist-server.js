const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const blacklistserver = new Schema({
    _id: reqString
})

module.exports = model('blacklistserver', blacklistserver)