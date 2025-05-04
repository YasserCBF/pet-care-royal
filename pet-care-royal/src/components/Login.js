import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setError('');
      window.location.href = '/profile';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--rosa-pastel), var(--azul-cielo))', padding: '50px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--blanco-crema)', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(232, 236, 239, 0.2)' }}>
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center' }}>{isRegister ? 'Registrarse' : 'Iniciar Sesión'} - Pet Care Royal</h2>
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
        {isRegister && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--gris-oscuro)' }}>Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            >
              <option value="client">Cliente</option>
              <option value="caregiver">Cuidador</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          style={{ background: 'var(--oro-suave)', color: 'var(--gris-oscuro)', padding: '12px 24px', borderRadius: '5px', border: 'none', cursor: 'pointer', width: '100%' }}
          onMouseOver={(e) => (e.target.style.background = 'var(--azul-cielo)')}
          onMouseOut={(e) => (e.target.style.background = 'var(--oro-suave)')}
        >
          {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
        <p style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginTop: '10px' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <span
            style={{ color: 'var(--azul-cielo)', cursor: 'pointer' }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;