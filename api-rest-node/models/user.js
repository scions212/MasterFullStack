'use strict'

const mongoose=require('mongoose');
var Schema = mongoose.Schema;

var UserSchema= Schema({
    name : { type:String,  trim:true, require:true},
    surname: { type:String,  trim:true, require:true},
    role: { type:String, trim:true, require:true},
    email: { type:String, unique:true, trim:true, require:true},
    password:  { type:String, trim:true, required: [true,'El Password debe ser mas de 6 caracteres']},
   // nPhone: { type:String, trim:true, required: [true,'El Numero debe insertar el umero de telefono']},
    photoProfile:{ type:String, default:'Image.png'},
        },{ 	versionKey:false,
              timestamps:true,      
  });

  UserSchema.methods.toJSON = function(){
    var obj = this.toObject();

    delete obj.password;

    return obj;
  }

module.exports=mongoose.model('User', UserSchema);