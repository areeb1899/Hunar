const {Schema,model,default:mongoose}=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const cartSchema=new Schema({
  _id:false,
  name:String,
  price:Number,
  listingId:mongoose.Schema.Types.ObjectId,
  image:String,
  qty:{
    type:Number,
    default:1
  }
})
const userSchema=new Schema({
  email:String,
  role: {
    type: String,
    enum: ['seller', 'buyer', 'admin']
  },
  cart:[cartSchema]

},{versionKey:false,timestamps:true});

userSchema.plugin(passportLocalMongoose);

const User=model('User',userSchema);


module.exports=User;
