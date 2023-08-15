const mongoose = require('mongoose')

const userShecma =  mongoose.Schema({
    password : {type : String, required : true},
    email : {type : String, required : true}
})


const User = mongoose.model('user', userShecma)


module.exports = {User}