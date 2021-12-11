const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

let messagecounters = new Schema({
      Guild : reqString,
      userID: reqString,
      messages: Number
})

module.exports = model('messagecounters', messagecounters)