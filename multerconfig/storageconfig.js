import multer from "multer";

//storage config

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        const filename =`image- ${Date.now()}.${file.originalname}`
        callback(null,filename);
    }
});

const filefilter =(req,file,callback)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/webp" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")
    {
        callback(null,true);
    }
    else
    {
        callback(null,false);
        return callback(new Error("Only .png .jpg & .jpeg Allowed"))
    }
}

export const upload=multer({
    storage:storage,
    fileFilter:filefilter
 })

 