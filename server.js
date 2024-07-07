import express from "express";
import colors from "colors";
import dotenv from 'dotenv'
import pg from "pg";
import authRoute from './routes/authRoute.js'
import bodyParser from 'body-parser';
import cors from 'cors'
import morgan from "morgan";
import categoryRoute  from './routes/categoryRoute.js'
import productRoutes from './routes/productRoutes.js'
//configure env 
dotenv.config();
//rest
const app=express()
app.use(bodyParser.urlencoded({ extended: false }));
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//database connection
try {
    const db = new pg.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    db.connect();
} catch (error) {
    console.log("Error retrieving data from database");
}

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/auth/products",productRoutes)
//rest api
app.get('/',(req,res)=>{
    res.send({
        message:'Welcome to ecommerce app'
    })
})

//port 
const port=8000;

app.listen(port,()=>{
    console.log(`Server is running on ${port}`.bgCyan.white);
})