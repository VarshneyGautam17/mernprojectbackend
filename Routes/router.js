import express  from "express";
import {upload} from "../multerconfig/storageconfig.js"
import {userexport,userstatus,userpost,userget,singleuserget,edituserget,useredit, userdelete,adminpost,adminlogin} from "../Controllers/usersControllers.js";
const router= new express.Router();

//Roter 
router.post("/user/register",upload.single("user_profile"),userpost);
router.post("/admin/register",adminpost);
router.post("/admin/login",adminlogin);
router.get("/user/details",userget);
router.get("/userprofile/:id",singleuserget);
router.get("/edit/:id",edituserget);
router.put("/user/edit/:id",upload.single("user_profile"),useredit);
router.delete("/user/delete/:id",userdelete);
router.put("/user/status/:id",userstatus);
router.get("/userexport",userexport); 

export default router; 