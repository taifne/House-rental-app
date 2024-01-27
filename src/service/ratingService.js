const ratingModel = require('../models/ratingModel'); // Assuming the Rating model is in a file called Rating.js

// Create a new rating
async function createRating(ownerId, value, star, roomId, hostId) {
    try {
        const newRating = new ratingModel({
            owner: ownerId,
            value,
            star,
            room: roomId,
            host: hostId
        });
        const savedRating = await newRating.save();
        return savedRating;
    } catch (error) {
        throw error;
    }
}

// Get a rating by ID
async function getRatingById(ratingId) {
    try {
        const rating = await ratingModel.findById(ratingId).populate('owner').populate('room').populate('host');
        return rating;
    } catch (error) {
        throw error;
    }
}

// Update a rating by ID
async function updateRating(ratingId, update) {
    try {
        const updatedRating = await ratingModel.findByIdAndUpdate(ratingId, update, { new: true });
        return updatedRating;
    } catch (error) {
        throw error;
    }
}

// Delete a rating by ID
async function deleteRating(ratingId) {
    try {
        const deletedRating = await ratingModel.findByIdAndDelete(ratingId);
        return deletedRating;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRating,
    getRatingById,
    updateRating,
    deleteRating
};
