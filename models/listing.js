const mongoose = require('mongoose');

const Schema = mongoose.Schema;
exports.Schema = Schema;
const review = require("./review.js");
const { object } = require('joi');




const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
    //    type: String,
    //    set:(v)=> v === ''? 'https://tse4.mm.bing.net/th?id=OIP.Y64zo6idinAtdWb-NOktKQHaHa&pid=Api&P=0&h=180':v,
    url: String, 
    filename: String,
        
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});
exports.listingSchema = listingSchema;


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        try {
            await review.deleteMany({_id: {$in: listing.reviews}});
        } catch (error) {
            console.error("Error deleting reviews: ", error);
        }
    }
});
const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;

