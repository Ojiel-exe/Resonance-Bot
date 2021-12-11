const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const premiumguilds = new Schema({
    Guild: reqString,
    Expire: Number,
    Permanent: Boolean,
})

module.exports = model('premiumguilds', premiumguilds)