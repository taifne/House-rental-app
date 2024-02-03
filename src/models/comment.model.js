// Existing code
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  content: String,
  product: { type: Schema.Types.ObjectId, ref: "Room" },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

const Comment = model("Comment", CommentSchema);

// New function to fetch comments for a specific product
Comment.getCommentsForProduct = async function(productId) {
  try {
    const comments = await this.find({ product: productId }).populate('user');
    return comments;
  } catch (error) {
    throw new Error("Error fetching comments for the product");
  }
};

module.exports = Comment;
