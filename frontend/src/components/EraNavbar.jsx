import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function EraNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const eras = [
    { id: 'todas', label: 'Todas as Épocas', path: '/' },
    { id: 'seculo-19', label: 'Século XIX', path: '/epoca/seculo-19' },
    { id: 'anos-1900-1920', label: '1900 - 1920', path: '/epoca/anos-1900-1920' },
    { id: 'anos-1930-1950', label: '1930 - 1950', path: '/epoca/anos-1930-1950' },
    { id: 'anos-1960-1980', label: '1960 - 1980', path: '/epoca/anos-1960-1980' },
    { id: 'contemporanea', label: 'Contemporânea', path: '/epoca/contemporanea' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redireciona para a busca geral
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div style={styles.headerContainer}>
      {/* Formulário de Busca por Foto, Estilo ou Fotógrafo */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar foto, tema ou username de fotógrafo..."
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Pesquisar
        </button>
      </form>

      {/* Menu de Épocas */}
      <nav style={styles.nav}>
        {eras.map((era) => (
          <NavLink
            key={era.id}
            to={era.path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            {era.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    margin: '16px 0',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    maxWidth: '520px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#d4af37',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  nav: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    color: '#0f0f0f',
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
    fontWeight: 'bold',
  },
};