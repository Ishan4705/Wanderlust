const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.reviewPosting=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("Success","New Review  posted!!");
    // console.log("New Review Saved");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview=(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // #pull method is used to delete an object from an array of a document
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
});