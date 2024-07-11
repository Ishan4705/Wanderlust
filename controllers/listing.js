const Listing=require("../models/listing.js");
// const mbxGeocoding=require("@maptiler/geocoding-control/maptilersdk");
// const maptoken=process.env.MAP_TOKEN;

module.exports.index=async(req,res)=>{
    const All_listings= await Listing.find({});
    res.render("listings/index.ejs",{All_listings});
};


module.exports.renderNewListingForm=(req,res)=>{
    res.render("listings/create.ejs");
    // console.log("rf");
};


module.exports.showAllListings=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
      path: "reviews",
      populate:{
        path:"author"},
      }).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does't exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    // let {title,description,price,location,country,image}=req.body;
    // a better way would be
      // if(!req.body.listing){
      //   throw ExpressError(400,"Send valid Data for listing");
      // }
      // let result=listingSchema.validate(req.body);
      // console.log(result);
      let url=req.file.path;
      let filename=req.file.filename;
      // console.log(url,"..",filename);
      const newlisting= new Listing(req.body.listing);
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      await newlisting.save();
      req.flash("Success","New Listing Created!!");
      res.redirect("/listings");
};


module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does't exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Success","Listing Deleted!!");
    res.redirect("/listings");
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    // let listing=await Listing.findById(id);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    };
    req.flash("Success","Listing Updated!!");
    res.redirect("/listings");
};