const {Schema,model,default:mongoose}=require('mongoose');

const orderSchema=new Schema({
    _id:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    price:{
        type:Number,
        min:0
    },
    paymentStatus:{
        type:Boolean,
        default:false
    }

},{timestamps:true,versionKey:false});

const Order=model('Order',orderSchema);

module.exports=Order;