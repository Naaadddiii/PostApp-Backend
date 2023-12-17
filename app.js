import express from "express";
import mongoose from 'mongoose';
import postRouter from "./routes/post-routes";
import router from "./routes/user-routes";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert {type: "json"}; // Import Swagger JSON file

const app = express();
app.use(express.json());

app.use(cors());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Api for Login and SignUp
app.use("/api/user",router);

//Api for Posting Post
app.use("/api/post", postRouter);

app.use('/uploads', express.static('uploads'))

mongoose.connect(
  'mongodb+srv://PadmanabanV:PadmanabanV@postapp.zfcdoz6.mongodb.net/?retryWrites=true&w=majority'
)
.then(()=>app.listen(5000))
.then(()=> 
  console.log("Server started on Localhost 5000 and Connected to the Database")
)
.catch((error)=>console.log(error));


//ATBBFf55YD9E5thcpt27wPL8jbgh3A5C1EEE