const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const mongoose = require('mongoose')
const Listing = require('../models/Product');
const { isLoggedIn } = require('../middleware/middlewares');
const catchAsync = require('../core/catchAsync')

const registration_secret = process.env.REGISTRATION_SECRET;

router.get('/register', (req, res) => {
    res.render('user/signup');
})

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



// Delete user account
router.delete('/users/:userId', isLoggedIn, catchAsync(async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    // Ensure the logged-in user matches the target user
    if (req.user._id.toString() === userId) {


        await User.findByIdAndDelete(userId);

        req.flash('success', 'Your account has been deleted successfully.');
        // req.logout(); // Log out the user after account deletion
        res.redirect('/login'); // Redirect to login or home page

    }
    req.flash('error', 'You are not authorized to delete this account.');
    return res.redirect('/register');


    // Find the user and delete the account

}));




router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash('success', 'You are now logged in, welcome again!');
        res.redirect('/')

    })

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

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/auth/google/listing', passport.authenticate('google', {
    successRedirect: '/listing',
    failureRedirect: '/login'
}))



// Cart Routes 


// Adding items to cart 
router.post('/cart/:listingId', isLoggedIn, catchAsync(async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    const currentUser = await User.findById(req.user._id);
    const existingCartItem = currentUser.cart.find((item) => item.listingId.equals(listing._id));
    if (existingCartItem) {
        existingCartItem.qty++
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
    currentUser.cart = currentUser.cart.filter(item => !item.listingId.equals(listingId));

    await currentUser.save();
    req.flash('success', 'Item removed from cart successfully');
    res.redirect('/cart');
}));


// cart page 
router.get('/cart', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    // console.log(totalCartAmount)

    res.render('user/cart', { cart: user.cart, totalCartAmount: totalCartAmount })

}));



router.get('/profile', async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId);
    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    res.render('user/profile', { cart: user.cart, totalCartAmount: totalCartAmount })
})

module.exports = router;