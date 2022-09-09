const mongoose=require('mongoose');
//const validator=require('validator');

const URLSchema = new mongoose.Schema({
    original_url:{
        type:String,
        required:true, 
        //validate:(value)=>validator.isURL(value)
    },
    short_url:Number
})

module.exports=mongoose.model('URL',URLSchema);