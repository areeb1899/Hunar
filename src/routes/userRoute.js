const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Listing = require('../models/Product');
const { isLoggedIn } = require('../middleware/middlewares');


router.get('/register', (req, res) => {
    res.render('user/signup');
})

router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, role });
    await User.register(newUser, password);
    res.redirect('/login');
})

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
        return res.redirect('/register');
    });
})


router.post('/cart/:listingId', isLoggedIn, async (req, res) => {
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
    res.redirect(`/listing/${listingId}`)



})

router.get('/cart', isLoggedIn, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    console.log(totalCartAmount)
    res.render('user/cart',{cart:user.cart})

})


module.exports = router;