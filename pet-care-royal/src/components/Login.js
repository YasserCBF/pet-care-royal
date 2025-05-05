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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role,
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.href = '/profile';
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--rosa-pastel), var(--cian-suave))',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="form-container"
        style={{
          background: 'var(--blanco-crema)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'} - Pet Care Royal
        </h2>
        {error && (
          <p
            style={{
              background: 'var(--coral-suave)',
              color: 'var(--gris-oscuro)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: 'var(--gris-perla)',
              border: '1px solid var(--lavanda-claro)',
              padding: '12px',
              borderRadius: '8px',
              width: '100%',
              color: 'var(--gris-oscuro)',
              fontSize: '16px',
            }}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: 'var(--gris-perla)',
              border: '1px solid var(--lavanda-claro)',
              padding: '12px',
              borderRadius: '8px',
              width: '100%',
              color: 'var(--gris-oscuro)',
              fontSize: '16px',
            }}
            required
            disabled={loading}
          />
        </div>
        {isRegister && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                background: 'var(--gris-perla)',
                border: '1px solid var(--lavanda-claro)',
                padding: '12px',
                borderRadius: '8px',
                width: '100%',
                color: 'var(--gris-oscuro)',
                fontSize: '16px',
              }}
              disabled={loading}
            >
              <option value="client">Cliente</option>
              <option value="caregiver">Cuidador</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          style={{
            background: 'linear-gradient(90deg, var(--oro-suave), var(--melocoton-suave))',
            color: 'var(--gris-oscuro)',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontSize: '16px',
            fontWeight: '600',
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
        <p style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <span
            className="link"
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