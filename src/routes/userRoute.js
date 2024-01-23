const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const mongoose = require('mongoose')
const Listing = require('../models/Product');
const { isLoggedIn, redirectToHomeIfLoggedIn } = require('../middleware/middlewares');
const catchAsync = require('../core/catchAsync')


//registration secret for signing up as a seller
const registration_secret = process.env.REGISTRATION_SECRET;

//register page
router.get('/register', redirectToHomeIfLoggedIn,(req, res) => {
    res.render('user/signup');
})

//register as a seller or buyer
router.post('/register', catchAsync(async (req, res) => {
    const { name, username, email, password, role, secret } = req.body;

    // Check if the provided secret matches the predefined secret
    if (role === 'seller' && secret === registration_secret || role === 'buyer') {
        const newUser = new User({ name, username, email, role });
        await User.register(newUser, password);

        req.flash('success', 'You are registered successfully! Please login to continue.');
        res.redirect('/login');

    }
    req.flash('error', 'Invalid secret for seller registration.');
    return res.redirect('/register');



}));


//login page 
router.get('/login', redirectToHomeIfLoggedIn, (req, res) => {
    res.render('user/login');
})


//login through passport-local 
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash('success', 'You are now logged in, welcome again!');
        res.redirect('/')



    })


//logout the user
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'There was a problem while logging you out.')
            return res.redirect('/');
        }
        req.flash('success', 'you are successfully logged out.')
        return res.redirect('/login');
    });
})



//google authentication route
//login through passport-google-oauth2

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'] //what we want from the user
}))

router.get('/auth/google/listing', passport.authenticate('google', {
    successRedirect: '/listing', //success route
    failureRedirect: '/login' //failure route
}))



// Cart Routes 
// cart page 
router.get('/cart', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    res.render('user/cart', { cart: user.cart, totalCartAmount: totalCartAmount })

}));


// Adding items to cart 
router.post('/cart/:listingId', isLoggedIn, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    const currentUser = await User.findById(req.user._id);
    const existingCartItem = currentUser.cart.find((item) => item.listingId.equals(listing._id));
    if (existingCartItem) {
        existingCartItem.qty++ //increase the qty of the same item
    } else {
        currentUser.cart.push({ listingId: listing._id, name: listing.name, price: listing.price, image: listing.image });

    }

    await currentUser.save();
    req.flash('success', 'Item Added to cart successfully')
    res.redirect(`/listing/${listingId}`)

}));


// Remove item from cart
router.delete('/cart/:listingId', isLoggedIn, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    const currentUser = await User.findById(req.user._id);

    // Remove the item from the user's cart
    currentUser.cart = currentUser.cart.filter(item => !item.listingId.equals(listingId)); await currentUser.save();
    req.flash('success', 'Item removed from cart successfully');
    res.redirect('/cart');
}));





//profile page 
router.get('/profile', async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId);
    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    res.render('user/profile', { cart: user.cart, totalCartAmount: totalCartAmount })
})

// Delete user account
router.delete('/users/:userId', isLoggedIn, catchAsync(async (req, res) => {
    const { userId } = req.params;
    //checking if the user is same as logged in user
    if (req.user._id.toString() === userId) {
        await User.findByIdAndDelete(userId);

        req.flash('success', 'Your account has been deleted successfully.');
        res.redirect('/'); // Redirect to login after deleting the account

    }

    //if fails to match the criteria 
    req.flash('error', 'You are not authorized to delete this account.');
    return res.redirect('/register');
}));



module.exports = router;