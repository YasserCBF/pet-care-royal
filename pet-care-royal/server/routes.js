const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Pet, Service, Booking } = require('./models');
const { auth, role } = require('./middleware');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email 
 
 });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Crear mascota (solo clientes)
router.post('/pets', auth, role(['client']), async (req, res) => {
  try {
    const { name, species, breed, age, specialNeeds } = req.body;
    const pet = new Pet({ name, species, breed, age, specialNeeds, owner: req.user.id });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar mascotas del usuario
router.get('/pets', auth, role(['client']), async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Crear servicio (solo cuidadores)
router.post('/services', auth, role(['caregiver']), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const service = new Service({ name, description, price, caregiver: req.user.id });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar servicios
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().populate('caregiver', 'email');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Crear reserva (solo clientes)
router.post('/bookings', auth, role(['client']), async (req, res) => {
  try {
    const { pet, service, date } = req.body;
    const booking = new Booking({ pet, service, date, client: req.user.id });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar reservas del usuario
router.get('/bookings', auth, role(['client', 'caregiver']), async (req, res) => {
  try {
    const query = req.user.role === 'client' ? { client: req.user.id } : { service: { $in: await Service.find({ caregiver: req.user.id }).select('_id') } };
    const bookings = await Booking.find(query).populate('pet service client');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;