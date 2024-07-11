const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");

const upload = multer({ storage });



// Validation Schema (Middleware) function

const validateListing=(req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
    if(error){
      // let errMsg=error.details.map((el)=>el.message).join(",");// to separate additional details with comma
      throw new ExpressError(400,error);
    }else{
      next();
    }
};



// Update Route //

// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// Router.route usage //

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)
);

// HOME ROUTE //

// router.get("/",wrapAsync(listingController.index));

// Create Listing // 

router.get("/new",isLoggedIn,listingController.renderNewListingForm);


// Router.route usage //

router
  .route("/:id")
  .get(wrapAsync(listingController.showAllListings))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
);

// Show Route //

// router.get("/:id",wrapAsync(listingController.showAllListings));

// Create Route //

// router.post("/",isLoggedIn, validateListing ,wrapAsync(listingController.createListing));

// EDIT ROUTE //

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

// DELETE ROUTE //

// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;