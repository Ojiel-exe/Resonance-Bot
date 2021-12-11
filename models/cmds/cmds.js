const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const cmd = new Schema({
    _id: reqString,
    Cmds: Array
})

module.exports = model('cmd', cmd)