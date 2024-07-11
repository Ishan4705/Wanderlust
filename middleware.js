const Listing=require("./models/listing");
const Review=require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //if user is not logged in then only we have to save our request.redirect or req.originalURl
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.originalUrl);
        req.flash("error","You must be loggged in!!");
        return res.redirect("/login");
    }
    next();
};

// the only problem with above methods that passport can reset the redirect path so we need to save to locals

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
