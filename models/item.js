const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    condition: {type: String, enum: ['New', 'Used', 'Refurbished', 'Damaged', 'Parts'], required: [true, 'Condition is required']},
    price: {type: Number, required: [true, 'Price is required'], min: 0.01},
    offers: {type: Number, default: 0},
    image: {type: String, required: [true, 'Image is required']},
    description: {type: String, required: [true, 'Description is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    isActive: {type: Boolean, default: true}
})

module.exports = mongoose.model('Item', itemSchema);

