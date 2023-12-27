import mongoose from "mongoose";
import validator from "validator";

const usersSchema = new mongoose.Schema({
    fname:{
        type :String,
        required:true,
        trime:true
    },
    lname:{
        type :String,
        required:true,
        trime:true
    },
    mobile: {
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    email:{
        type :String,
        required:true,
        trime:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw Error("not valid email");
        }
    },
    location: {
        type :String,
        required:true,
        trime:true
    },
    gender:{
     type:String,
     required:true   
    },
    image:{
        type:String,
        required:true
    },
    selectedOption:{
        type:Object,
        required:true
    },
    datecreated:Date,
    dateupdated:Date,
    vehicle_number:{
        type :String,
        required:true,
        trime:true
    },
});
 
const users=new mongoose.model("users",usersSchema);

export default users;