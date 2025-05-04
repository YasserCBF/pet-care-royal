import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setError('');
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data.message || 'Error en el servidor');
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--rosa-pastel), var(--azul-cielo))', padding: '50px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--blanco-crema)', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(232, 236, 239, 0.2)' }}>
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center' }}>Iniciar Sesión - Pet Care Royal</h2>
        {error && <p style={{ background: 'var(--melocoton-suave)', color: 'var(--gris-oscuro)', padding: '10px', borderRadius: '5px' }}>{error}</p>}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ background: 'var(--oro-suave)', color: 'var(--gris-oscuro)', padding: '12px 24px', borderRadius: '5px', border: 'none', cursor: 'pointer', width: '100%' }}
          onMouseOver={(e) => (e.target.style.background = 'var(--azul-cielo)')}
          onMouseOut={(e) => (e.target.style.background = 'var(--oro-suave)')}
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;