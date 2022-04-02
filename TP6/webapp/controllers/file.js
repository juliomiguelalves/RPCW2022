const mongoose = require('mongoose')
var File = require('../models/file')


module.exports.list=() =>{
    return File
        .find()
        .sort({file:1})
        .exec()
}

module.exports.lookup= id =>{
    return File
        .findOne({file:file})
        .exec()
}

module.exports.insert = file =>{
    var newFile = new File(file)
    return newFile.save()
}


module.exports.delete = file =>{
    return File
        .deleteOne({file:file})
        .exec()
}