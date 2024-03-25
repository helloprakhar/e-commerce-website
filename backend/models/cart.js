const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  cartItems: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number, required: true }
    }
  ],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
