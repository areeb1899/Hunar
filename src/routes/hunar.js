const express = require('express');
const router = express.Router();
const Listing = require('../models/Product');
const {BadRequestError}=require('../core/APIerror')
const { isLoggedIn, isProductAuthor } = require('../middleware/middlewares');
// const seedProducts=require('../seeds/products');
const catchAsync = require('../core/catchAsync');


//show landing page on opening the server
router.get('/', (req, res) => {
    res.render('products/landingPage')

})

//showing the listings
router.get('/listing', catchAsync(async (req, res) => {
    const listings = await Listing.find({});
    // await seedProducts();
    res.render('products/listing', { listings });
}));

// new listing 
router.get('/listing/new', isLoggedIn, catchAsync((req, res) => {
    res.render('products/newListing');
}));

// show single listing 
router.get('/listing/:listingId', isLoggedIn, async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate('reviews');
    if (!listing) {
        throw new BadRequestError(`Product with this id: ${id} doesn't exists.`);
    }
    res.render('products/show', { listing });
})

//create route
router.post('/listing', isLoggedIn, catchAsync(async (req, res) => {
    const { name, description, image, price } = req.body;
    const currentUser = req.user;
    await Listing.create({ name, description, image, price, author: currentUser._id });
    res.redirect('/listing');
}));

// show created route 
router.patch('/listing/:listingId', isLoggedIn, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    const { name, image, description, price } = req.body;
    await Listing.findByIdAndUpdate(listingId, { name, image, description, price })
   
    res.redirect('/listing');
}));

//edit listing
router.get('/listing/:listingId/edit', isLoggedIn, isProductAuthor, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    res.render('products/edit', { listing });
}));


//update listing
router.patch('/listing/:listingId', isLoggedIn, isProductAuthor, catchAsync(async (req, res) => {
    const { listingId } = req.params
    console.log(listingId)
    const { name, price, description, image } = req.body;
    await Product.findByIdAndUpdate(listingId, { name, price, description, image });
    res.redirect(`/listing/${listingId}`);

}));

//delete listing
router.delete('/listing/:listingId', isLoggedIn, isProductAuthor, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    await Listing.findByIdAndDelete(listingId);
    res.redirect('/listing');
}));




module.exports = router;