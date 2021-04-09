import express from 'express';
import data from './data';
import config from './config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute'; 
import dotenv from 'dotenv';

dotenv.config();
const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true
}).catch(error => console.log(error.reason));


const app = express();
app.use(bodyParser.json());
app.use("/api/users", userRoute);

app.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    res.send(data.products.find(x=>x._id === productId));
});

app.get("/api/products", (req, res) => {
    
    res.send(data.products);
});

app.listen(5000, () => {console.log("server started at http://localhost:5000")})