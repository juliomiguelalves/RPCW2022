var Para = require('../models/para')
var mongoose = require('mongoose')
module.exports.listar= function(){
        return Para
            .find()
            .exec()
}

module.exports.inserir = function(p){
    var d = new Date().toISOString().substring(0,16)
    p.data = d
    var newPara = new Para(p)
    return newPara.save()
}

module.exports.delete = function(id){
    return Para.deleteOne({_id:id}).exec()
}

module.exports.editar = function(id,data){
    var d = new Date().toISOString().substring(0,16)
    return Para
            .updateOne({_id:id},{data:d, para: data.para})
}