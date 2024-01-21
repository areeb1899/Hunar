const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Listing = require('../models/Product');
const catchAsync = require('../core/catchAsync');

router.post('/listing/:id/reviews', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = new Review({ rating, comment });
    const product = await Listing.findById(id);
    product.reviews.push(review);
    await review.save();
    await product.save();
    req.flash('success', 'Review submitted!')
    res.redirect(`/listing/${id}`);
}))


router.delete('/listing/:listingId/reviews/:reviewId', catchAsync(async (req, res) => {
    const { listingId, reviewId } = req.params;
    try {
        await Review.findByIdAndDelete(reviewId);
        const updatedListing = await Listing.findByIdAndUpdate(listingId,
            { $pull: { reviews: reviewId } },
            { new: true }
        );
        req.flash('success','Review deleted successfully')
        res.redirect(`/listing/${listingId}`)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
   
}));


module.exports = router;