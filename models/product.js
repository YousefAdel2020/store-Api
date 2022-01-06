const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'the name of product is required']
    },
    price:{
        type:Number,
        required:[true,'the price of product is required']
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:4.5
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    company:{
        type:String,
        enum:{
            values:['ikea','liddy','marcos','caressa'],
            message:'{VALUE} is not supported'
        }
        //enum:['ikea','liddy','marcos','caressa'] //set of values available
    }
});


module.exports=mongoose.model('product',productSchema);