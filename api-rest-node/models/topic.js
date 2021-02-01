'use strict'

const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de Commet
var CommentSchema= Schema({
    content: { type:String,  trim:true, require:true},
    date: { type: Date, default: Date.now},
    user: {  type: Schema.ObjectId, ref:'User'},

});

var Comment= mongoose.model('Comment', CommentSchema);


var TopicSchema= Schema({
    title : { type:String,  trim:true, require:true},
    content: { type:String, trim:true, require:true},
    code: { type:String,  trim:true, require:true},
    lang:  { type:String, trim:true },
    date: { type: Date, default: Date.now},
    user:{ type:Schema.ObjectId, ref:'User'},
    comments:[CommentSchema]
        },{ 	versionKey:false,
              timestamps:true,      
  });

  //crear paginacion
  TopicSchema.plugin(mongoosePaginate);

module.exports=mongoose.model('Topic', TopicSchema);