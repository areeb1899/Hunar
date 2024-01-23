const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middleware/middlewares')
const User = require('../../models/User')



router.post('/listing/:listingId/like', isLoggedIn, async (req, res) => {
    const { listingId } = req.params;

    //grabbing the current logged in user
    const user = req.user
    const isLiked = user.wishlist.includes(listingId);


    //checking for the liked items
    if (isLiked) {
        //by default false, removing the item from the wishlist
        req.user = await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: listingId } });
    } else {
        //adding the item into the wishlist
        req.user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: listingId } });
    }

    //getting item id in response (optional)
    res.send(req.params.listingId)

})




module.exports = router;