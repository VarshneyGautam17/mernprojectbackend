import 'dotenv/config';
import express, { Router } from 'express';
import "./db/conn.js"
import cors from "cors"; 
import router from "./Routes/router.js"
const app=express();

const PORT =6010;

app.use(cors());
app.use(express.json());
app.use(router);
app.use("/uploads",express.static("./uploads"));
app.use("/files",express.static("./public/files"));

app.listen(PORT,()=>{
    console.log(`server start at port no ${PORT}`);
})