const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'esewa', 'khalti'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate id and order number
orderSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
  if (!this.orderNumber) {
    // Generate order number like #1001, #1002, etc.
    const timestamp = Date.now().toString().slice(-4);
    this.orderNumber = `#${timestamp}`;
  }
  next();
});

// Index for better query performance
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
