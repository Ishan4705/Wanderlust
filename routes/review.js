const express = require("express");
const router=express.Router({mergeParams:true}); // we must use this to extract info from parent routes
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


// Validation Schema (Middleware) function

const validateReview=(req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
    if(error){
      // let errMsg=error.details.map((el)=>el.message).join(",");// to separate additional details with comma
      throw new ExpressError(400,error);
    }else{
      next();
    }
};


// Reviews Routes 

// review posting route

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.reviewPosting));
  
// review deleting route
  
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  

module.exports=router;