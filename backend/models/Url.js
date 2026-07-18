const mongoose=require('mongoose');
const shortid=require('shortid');

const urlSchema=new mongoose.Schema({
    urlCode:{type:String,required:true,default:shortid.generate},
    longUrl:{type:String,required:true},
    shortUrl:{type:String,required:true},
    clicks:{type:String,default:Date.now}
});
module.exports=mongoose.model('Url',urlSchema);