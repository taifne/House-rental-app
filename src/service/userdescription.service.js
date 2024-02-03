const userDescriptionModel = require('../models/userDescriotionModel');

// Create
const createDescription = async (descriptionData) => {
  try {
    const newDescription = new userDescriptionModel(descriptionData);
    const savedDescription = await newDescription.save();
    return savedDescription;
  } catch (error) {
    throw new Error('Error creating description');
  }
};

// Read
const getDescriptionById = async (descriptionId) => {
  try {
    const description = await userDescriptionModel.findById(descriptionId);
    return description;
  } catch (error) {
    throw new Error('Description not found');
  }
};

// Update
const updateDescription = async (descriptionId, updatedData) => {
  try {
    const updatedDescription = await userDescriptionModel.findByIdAndUpdate(descriptionId, updatedData, { new: true });
    return updatedDescription;
  } catch (error) {
    throw new Error('Error updating description');
  }
};

// Delete
const deleteDescription = async (descriptionId) => {
  try {
    await userDescriptionModel.findByIdAndDelete(descriptionId);
    return 'Description deleted successfully';
  } catch (error) {
    throw new Error('Error deleting description');
  }
};

module.exports = {
  createDescription,
  getDescriptionById,
  updateDescription,
  deleteDescription,
};
