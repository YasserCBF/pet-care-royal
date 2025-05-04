import React from 'react';
import Login from './components/Login';
import PetCard from './components/PetCard';
import BookingForm from './components/BookingForm';
import './index.css';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'var(--gris-oscuro)' }}>Pet Care Royal</h1>
      <Login />
      <PetCard />
      <BookingForm />
    </div>
  );
}

export default App;