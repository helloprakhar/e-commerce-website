const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    categoryType:{
        type:String,
        required:true
    }
})

Category = mongoose.model('Category', categorySchema);

module.exports = Category;