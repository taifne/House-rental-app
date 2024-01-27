const houseCategoryModel = require('../models/houseCategoryModel'); // Assuming the Type model is in a file called Type.js

// Create a new type
async function createType(name, img, routeName) {
    try {
        const newType = new houseCategoryModel({
            name,
            img,
            routeName
        });
        const savedType = await newType.save();
        return savedType;
    } catch (error) {
        throw error;
    }
}

// Get a type by ID
async function getTypeById(typeId) {
    try {
        const type = await houseCategoryModel.findById(typeId);
        return type;
    } catch (error) {
        throw error;
    }
}

// Update a type by ID
async function updateType(typeId, update) {
    try {
        const updatedType = await houseCategoryModel.findByIdAndUpdate(typeId, update, { new: true });
        return updatedType;
    } catch (error) {
        throw error;
    }
}

// Delete a type by ID
async function deleteType(typeId) {
    try {
        const deletedType = await houseCategoryModel.findByIdAndDelete(typeId);
        return deletedType;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createType,
    getTypeById,
    updateType,
    deleteType
};
