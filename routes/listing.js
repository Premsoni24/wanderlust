const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js'); //listing.js
const {isLoggedIn , isOwner, validateListing}=require('../midelware.js');
const listingcontroller = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');

const upload = multer({ storage });


router
.route('/')
.get(wrapAsync(listingcontroller.index))
 .post(  isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, wrapAsync(listingcontroller.createListing));

// New Route
router.get('/new',isLoggedIn, listingcontroller.rendernewForm);
 
// Search Route
router.get('/search', wrapAsync(listingcontroller.search));


router
.route('/:id')
.get( wrapAsync(listingcontroller.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.destroyListing));



//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontroller.renderEditForm));


// router.put('/:id',
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingcontroller.updateListing));


module.exports= router;