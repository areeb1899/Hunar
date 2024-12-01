const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const path = require('path'); // Import the path module
const ejsMate = require('ejs-mate'); // Import the ejs-mate module
const methodOverride = require('method-override'); // Import the method-override module
const flash = require('connect-flash');
const session = require('express-session');
const { NotFoundError } = require('./core/APIerror')
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_DATABASE_URL,
    touchAfter: 24 * 3600, // time period in seconds
    autoRemove: 'native',
    ttl: 14 * 24 * 60 * 60
})

const sessionConfig = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.engine('ejs', ejsMate); // Configure ejs-mate as the EJS renderer
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 5000 })); // Parse incoming URL-encoded form data
app.use(express.json({ parameterLimit: 5000, limit: '10mb' })); // Parse incoming JSON body data
app.use(methodOverride('_method')); // Enable support for overriding HTTP methods
app.use(session(sessionConfig)); //express sessions
app.use(flash()); //flash messages and to use flash we need to establish express session
app.use(passport.initialize());
app.use(passport.session()); //for persistent login

//Routes & API
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/hunar');
const paymentAPI = require('./core/payment');
const reviewRoutes = require('./routes/reviewRoutes')
const productLikeAPI=require('./routes/api/productLike')

//authentication
passport.use("local", new LocalStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // The line below sets up a variable 'currentUser' 
    // in the response context, allowing information 
    // about the authenticated user to be used in views.
    // This is often used with user authentication.
    res.locals.currentUser = req.user; //important line *
    next();
})




app.use(productRoute); //using the router function in route folder
app.use(userRoute);
app.use(paymentAPI);
app.use(reviewRoutes);
app.use(productLikeAPI); //wishlist API
// additional routes 


//about us route

app.get('/about', (req, res) => {
    res.render('products/aboutUs');
})

//contact us
app.get('/contact', (req, res) => {
    res.render('products/contactUs')
})

app.post('/contact',(req,res)=>{
    req.flash('success','Thank you for contacting! Your response has been submitted')
    res.redirect('/contact');

})

//shipping & returns
app.get('/shipping-and-returns', (req, res) => {
    res.render('products/shipping&returns')
})


//FAQs
app.get('/faqs', (req, res) => {
    res.render('products/faqs')
})

app.all('*', (req, res, next) => next(new NotFoundError('You are requesting a wrong path.')))


// custom error handling middleware
app.use((error, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = error
    res.status(status).render('error', { message,status });
})


module.exports = app; // Export the Express application
