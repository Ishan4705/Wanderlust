const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup=async (req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newuser=new User({email,username});
    const registeredUser=await User.register(newuser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success",`Welcome to Wanderlust ${username}!!`);
        res.redirect("/listings");
    });
    } catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    let{username}=req.body;
    req.flash("Success",`Welcome to Wanderlust ${username}!!`);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","You are Logged out!!")
        res.redirect("/listings");
    });
};