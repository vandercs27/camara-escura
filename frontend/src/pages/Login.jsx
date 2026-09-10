import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      // Salva os dados do usuário e o token no localStorage
      localStorage.setItem('adminUser', JSON.stringify(data));
      navigate('/admin/cadastrar');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Acesso Restrito - Admin</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #333',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#fff',
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#3d1212',
    color: '#e74c3c',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#aaa',
    fontSize: '0.9rem',
  },
  input: {
    padding: '10px 12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#e5ba43',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
  },
};