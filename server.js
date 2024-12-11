require('dotenv').config();
const express =require('express')
const mongoose = require('mongoose');
const router = require('./routes/authRoutes');
const routerCategory = require('./routes/dashboard/categoryRoutes');
const productRoutes = require('./routes/dashboard/productRoutes')
const sellerRoutes = require('./routes/dashboard/sellerRoutes')
const bodyParser =require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { dbConnect } = require('./utiles/db');
const app= express();
dbConnect()
var corsOptions = {
    origin: ['http://localhost:3000'], 
    credentials:true,
 
  }
   
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', router)
app.use('/api', routerCategory)
app.use('/api', productRoutes)
app.use('/api', sellerRoutes)
app.get('/', (req,res)=>{
    res.send('Hello')
})



app.listen(process.env.PORT || 5000, ()=>{
    console.log(`the server running on port ${process.env.PORT}`)
})  
 