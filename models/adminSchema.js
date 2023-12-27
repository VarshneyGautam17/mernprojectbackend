import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{
        type :String,
        required:true,
        trime:true
    },
    password:{
        type :String,
        required:true,
        trime:true
    },
    newpassword: {
        type:String,
        required:true,
        trime:true
    }
});
 
const admin=new mongoose.model("admins",adminSchema);

export default admin;