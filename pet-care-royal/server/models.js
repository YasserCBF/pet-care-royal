const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'caregiver', 'admin'], default: 'client' },
});

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  specialNeeds: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  caregiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const bookingSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Pet: mongoose.model('Pet', petSchema),
  Service: mongoose.model('Service', serviceSchema),
  Booking: mongoose.model('Booking', bookingSchema),
};

// me confundi una que dos veces en la ultima "const" y el "module.export".