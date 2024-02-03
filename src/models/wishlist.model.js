const mongoose = require("mongoose");

// mongoose.plugin(slug);
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    name: {
        type: String,
        require: true,
        index: true,
        unique: false,
        sparse: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "Users"
    },
    room: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Room"
    }],
    display: [{ type: String }]
});
const wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = wishlist;
