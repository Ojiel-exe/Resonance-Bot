const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const blacklistuser = new Schema({
    id: reqString,
})

module.exports = model('blacklistuser', blacklistuser)