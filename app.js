if(process.env.NODE_ENV !="production") {
  require("dotenv").config();
}
// console.log(process.env) // remove this after you've confirmed it is working

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const{isLoggedIn}=require("./middleware.js");
// now setting up ejs //

const path= require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //body parser
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); // to serve static files to client
const dbUrl=process.env.ATLASDB_URL;

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});

main().then(()=>{console.log("Connected to DB")}).catch(err => console.log(err));



async function main() {
  await mongoose.connect(dbUrl);

}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE ", err);
});


// session options

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly:true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for flash
app.use((req,res,next)=>{
  res.locals.success=req.flash("Success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


// app.get("/demouser", async(req,res)=>{
//   let fakeUser= new User({
//     email: "student@gmail.com",
//     username:"Agent47"
//   });

//   let registeredUser= await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// root route // 

// app.get("/",(req,res)=>{
//     res.send("Hi, I am Root "); 
// });

// a middleware for handling asynchronous errors

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found !!"));
});

app.use((err,req,res,next)=> {
  let{statusCode=500, message="Something went wrong!!"}= err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs",{message});
});

