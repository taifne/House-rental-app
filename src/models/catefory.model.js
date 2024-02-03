const mongoose = require("mongoose");

// mongoose.plugin(slug);
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        require: true,
        index: true,
        unique: true,
        sparse: true,
    },
    img: {
        type: String,

    },
    routeName: {
        type: String,
    }



});
const category = mongoose.model("HouseCategory", categorySchema);
module.exports = category;
