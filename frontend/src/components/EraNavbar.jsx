import { Link, useLocation } from 'react-router-dom';

export function EraNavbar() {
  const location = useLocation();

  const eras = [
    { id: 'todas', label: 'Todas as Épocas', path: '/' },
    { id: 'seculo-19', label: 'Século XIX', path: '/epoca/seculo-19' },
    { id: 'anos-1900-1920', label: '1900 - 1920', path: '/epoca/anos-1900-1920' },
    { id: 'anos-1930-1950', label: '1930 - 1950', path: '/epoca/anos-1930-1950' },
    { id: 'anos-1960-1980', label: '1960 - 1980', path: '/epoca/anos-1960-1980' },
    { id: 'contemporanea', label: 'Contemporânea', path: '/epoca/contemporanea' },
  ];

  return (
    <nav className="era-navbar" style={styles.container}>
      {eras.map((item) => {
        // Compara o caminho atual do navegador com o caminho do item
        const isActive =
          location.pathname === item.path ||
          (item.path === '/' && location.pathname === '');

        return (
          <Link
            key={item.id}
            to={item.path}
            className="era-link"
            style={{
              ...styles.tabLink,
              ...(isActive ? styles.activeTabLink : {}),
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '20px 0',
    position: 'relative',
    zIndex: 10,
  },
  tabLink: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'all 0.2s ease',
  },
  activeTabLink: {
    backgroundColor: '#e5ba43',
    color: '#000',
    fontWeight: 'bold',
    borderColor: '#e5ba43',
  },
};