const express= require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");

//Router.route application// 

// for signup //

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup)
);

// for login //

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login)
);

router.get("/logout",userController.logout);


module.exports=router;


// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login));

