const express=require('express');
const cors=require('cors')
const app=express();


// port 
const PORT=process.env.PORT || 4000;

// env file load 
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



//dbconnection
const dbconnection=require('./Config/dbconnection');
dbconnection();

//route mount
const authrouter=require('./routes/authroute')
app.use('/api/auth/',authrouter);
const eventroute=require('./routes/eventroute');
app.use('/api/event',eventroute);
const bookingroutes=require('./routes/bookingroute');
app.use('/api/booking',bookingroutes);

// token verifaction
app.get('/api/auth/verify/:token',(req,res)=>{
    res.redirect(`/verify-success.html?token=${req.params.token}`)
})

// server port
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}
);