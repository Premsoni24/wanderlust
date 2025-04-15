const Listing = require('../models/listing');
 
 
 
module.exports.index = async (req,res)=>{
   
   const allListing = await Listing.find({});
   res.render('./listings/index.ejs',{allListing});
  
};

module.exports.rendernewForm=  (req,res)=>{
   res.render('./listings/new.ejs');
};


// Your search route
module.exports.search = async (req, res) => {

   const title = req.query.title;

   if (!title) {
     req.flash('error', 'Search term is required');
     return res.redirect('/listings');
   }
 
   try {
     const listing = await Listing.findOne({ title: new RegExp(title, 'i') }); // case-insensitive match
 
     if (listing) {
       res.redirect(`/listings/${listing._id}`);
     } else {
       req.flash('error', `No listing found for "${title}"`);
       res.redirect('/listings');
     }
   } catch (err) {
     console.error('Search error:', err);
     req.flash('error', 'Server error during search');
     res.redirect('/listings');
   }
};
// This route handles the search functionality
module.exports.showListing   = async(req,res)=>{
   let {id}= req.params;
  const listing = await Listing.findById(id)
  .populate({
     path: 'reviews',
  populate: {
     path: 'author',
  },
})
  .populate('owner');
  if(!listing){
   req.flash('error',"Listing you requested for does not exist!");
   res.redirect('/listings');
  }
//    console.log(listing);
  res.render('./listings/show.ejs', {listing});
  
};



module.exports.createListing = async (req,res)=>{
  
let url = req.file.path;
let filename = req.file.filename;   
 console.log(url, "...", filename);
const newlisting = new Listing(req.body.listing);
newlisting.owner = req.user._id;
newlisting.image = {url,filename};
await newlisting.save();
req.flash("success", "New Listing Created!");
res.redirect('/listings'); 
};


module.exports.renderEditForm = async(req,res)=>{
  let {id}= req.params;
  const listing = await Listing.findById(id);
  if(!listing){
   req.flash('error',"Listing you requested for does not exist!");
   res.redirect('/listings');
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace('upload','upload/w_250');
  res.render('listings/edit.ejs',{listing, originalImageUrl});
};


module.exports. updateListing = async (req,res)=>{
 
   let { id } = req.params;
  //  let listing = await Listing.findById(id);
  //   if(!listing.owner.equals(res.locals.currUser._id)){
  //       req.flash('error',"You do not have permission to do edit!");
  //       return res.redirect(`/listings/${id}`);
  //   }
  let listing =   await Listing.findByIdAndUpdate(id, {...req.body.listing});

if(typeof req.file !== 'undefined'){
     let url = req.file.path;
     let filename = req.file.filename; 
     listing.image = {url,filename};
     await listing.save();
}
   req.flash("success", "Listing Updated!");
   res.redirect(`/listings/${id}`);
   
};



module.exports.destroyListing = async (req,res)=>{
  
   let { id }= req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", " Listing Delete!");
   res.redirect('/listings');
  
};


