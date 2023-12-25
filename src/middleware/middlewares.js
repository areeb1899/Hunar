const Product = require('../models/Product')

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to login first!')
        return res.redirect('/login');
    }
    return next();
}


const isProductAuthor = (async (req, res,next) => {
    const {listingId } = req.params;
    const product = await Product.findById(listingId);
    const currentUserId = req.user._id;
    // console.log(product.author)
    if (!currentUserId || !product.author.equals(currentUserId)) {
        req.flash('error', 'Access Denied');
        return res.redirect(`/listing/${listingId}`)
    }

    return next();


})


module.exports={
    isLoggedIn,
    isProductAuthor
}