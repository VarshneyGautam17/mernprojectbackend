import users from "../models/usersSchema.js";
import admin from "../models/adminSchema.js";
import moment from "moment";
import csv from "fast-csv";
import fs from "fs";

const BASE_URL=process.env.BASE_URL;



//admin login

const adminlogin= async(req,res)=>{
  try{

    const {username,password}=req.body;
    const userdata=await admin.findOne({username});
    if(!userdata)
    {
      return res.status(500).json({message:"Invaild Credentials"})
    }
    if(userdata.password != password)
    {
      return res.status(401).json({message:"password does not match "+password+" "+userdata.password});
    }
    res.status(200).json({message:"Login Successfully"});
  }
  catch (err){
    res.status(500).json({message:"Error : "+err})
    console.log(err);
  }
}





//register admin
const adminpost = async (req, res) => {
  const { username,password,newpassword } = req.body;
  if (
    !username ||
    !password ||
    !newpassword
  ) {
    res.status(401).json("All the fields are required");
  }
  try {
    const peradmin = await admin.findOne({ username: username });
    if (peradmin) {
      res.status(401).json("This User Already Exists ");
    } else {
      const adminData = new admin({
        username,
        password,
        newpassword
      });
      await adminData.save();
      res.status(200).json(adminData);
    }
  } catch (err) {
    res.status(401).json(err);
    console.log("Error From UserControllers " + err);
  }
};



 
//register user
const userpost = async (req, res) => {
  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, status,vehicle_number } = req.body;
  if (
    !fname ||
    !lname ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !status ||
    !vehicle_number
  ) {
    res.status(401).json("All the fields are required");
  }
  try {
    const peruser = await users.findOne({ email: email });
    if (peruser) {
      res.status(401).json("This User Already Exists ");
    } else {
      const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      const userData = new users({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        selectedOption: status,
        image: file,
        datecreated,
        vehicle_number
      });
      await userData.save();
      res.status(200).json(userData);
    }
  } catch (err) {
    res.status(401).json(err);
    console.log("Error From UserControllers " + err);
  }
};

//usersget

const userget = async (req, res) => {
    const search = req.query.search || "";
    const gender = req.query.gender || "";
    const status = req.query.selectedOption || "";
    const sort = req.query.sort || "";
    const page= req.query.page || 1;
    const Item_Per_page = 5;


    const query = {
      fname: { $regex: search, $options: "i" },
    };
    if (gender !== "All") {
      query.gender = gender;
    }
    if (status !== "All") {
      query.selectedOption = status;
    }
    try {
    const skip = (page-1)*Item_Per_page;
    
    const count= await users.countDocuments(query);
    const pageCount = Math.ceil(count/Item_Per_page);
    const usersdata = await users
      .find(query)
      .sort({ datecreated: sort === "new" ? -1 : 1 } )
      .limit(Item_Per_page)
      .skip(skip);
    
    
      res.status(200).json({
        Pagination:{count,pageCount},
        usersdata
      });
  } catch (error) {
    res.status(401).json(error);
  }
};

const singleuserget = async (req, res) => {
  const { id } = req.params;
  try {
    const usersdata = await users.findOne({ _id: id });
    res.status(200).json(usersdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

const edituserget = async (req, res) => {
  const { id } = req.params;
  try {
    const usersdata = await users.findOne({ _id: id });
    res.status(200).json(usersdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

const useredit = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    mobile,
    gender,
    location,
    selectedOption,
    user_profile,
    vehicle_number
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;
  const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
  try {
    const updateuser = await users.findByIdAndUpdate(
      { _id: id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        selectedOption,
        image: file,
        dateupdated: dateUpdated,
        vehicle_number
      },
      {
        new: true,
      }
    );
    await updateuser.save();
    res.status(200).json(updateuser);
  } catch (error) {
    res.status(401).json(error);
  }
};
const userdelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(deleteuser);
  } catch (error) {
    res.status(401).json(error);
  }
};

const userstatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const userstatusupdate = await users.findByIdAndUpdate(
      { _id: id },
      { selectedOption: data },
      { new: true }
    );
    res.status(200).json(userstatusupdate);
  } catch (error) {
    res.status(401).json("error in controllers " + error);
  }
};

const userexport = async (req, res) => {
  try {
    const usersdata = await users.find();
    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }

      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export");
      }
    }
    const writablestream = fs.createWriteStream(
      "public/files/export/users.csv"
    );

    csvStream.pipe(writablestream);
    writablestream.on("finish", function () {
      res.status(200).json({
        downloadUrl: `${BASE_URL}/files/export/users.csv`,
      });
    });

    if(usersdata.length > 0)
    {
      usersdata.map((user)=>{
        csvStream.write({
              FirstName:user.fname ? user.fname:"-",
              LastName:user.lname ? user.lname:"-",
              Email:user.email ?user.email:"-",
              Phone:user.mobile ?user.mobile:"-",
              Gender:user.gender ?user.gender:"-",
              Vehicle:user.selectedOption ?user.selectedOption:"-",
              VehicleNumber:user.vehicle_number ? user.vehicle_number:"-",
              Profile:user.image ?user.image:"-",
              Location:user.location? user.location:"-",
              DateCreated:user.datecreated  ?user.datecreated:"-",
              DateUpdated:user.dateUpdated ?user.dateUpdated:"-"
        })
      })

    }
    csvStream.end();
    writablestream.end();
  } catch (error) {
    res.status(401).json(error);
  }
};

export {
  userexport,
  userstatus,
  userpost,
  userget,
  singleuserget,
  edituserget,
  useredit,
  userdelete,
  adminpost,
  adminlogin
};
