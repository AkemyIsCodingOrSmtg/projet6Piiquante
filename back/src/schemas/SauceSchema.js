const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        min: 0,
        default: 0
    },
    dislikes: {
        type: Number,
        min: 0,
        default: 0
    },
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId }],
    usersDisliked: [{ type: mongoose.Schema.Types.ObjectId }],
});

sauceSchema.plugin(uniqueValidator);
const SauceModel = mongoose.model('sauce', sauceSchema); 
module.exports = SauceModel;