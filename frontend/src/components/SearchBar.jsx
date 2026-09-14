import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SearchBar() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim();

    if (cleanTerm) {
      navigate(`?search=${encodeURIComponent(cleanTerm)}`);
    } else {
      navigate('');
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Buscar por título, fotógrafo ou técnica..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        style={styles.input}
      />
      <button type="submit" className="search-button" style={styles.button}>
        Buscar
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    margin: '16px auto',
    maxWidth: '500px',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '20px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#e5ba43',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};