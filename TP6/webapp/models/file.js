var mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    date: String,
    file: String,
    size: String,
    desc: String,
    type: String,
})

module.exports = mongoose.model('file',fileSchema)