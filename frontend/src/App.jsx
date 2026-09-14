import { Routes, Route, Link } from 'react-router-dom';
import logoImg from './assets/logo.jpg';
import { EraNavbar } from './components/EraNavbar';
import { SearchBar } from './components/SearchBar';
import { Footer } from './components/Footer';
import { EraGallery } from './pages/EraGallery';
import { PhotoDetail } from './pages/PhotoDetail';
import { PhotographerDetail } from './pages/PhotographerDetail';
import { Login } from './pages/Login';
import { AdminAddPhoto } from './pages/AdminAddPhoto';
import './App.css';

export default function App() {
  return (
    <div style={styles.appContainer}>
      <header className="site-header" style={styles.header}>
        <div className="header-top" style={styles.headerTop}>
          <Link to="/" className="brand-link" style={styles.brandLink}>
            <img className="brand-logo" src={logoImg} alt="Câmara Escura Logo" style={styles.logo} />
            <div>
              <h1 className="brand-title" style={styles.title}>Câmara Escura</h1>
              <p className="brand-subtitle" style={styles.subtitle}>Estudos & História da Fotografia</p>
            </div>
          </Link>
          <Link to="/login" className="admin-link" style={styles.adminLink}>Área Admin</Link>
        </div>

        <SearchBar />
        <EraNavbar />
      </header>

      <main style={styles.mainContent}>
       <Routes>
  <Route path="/" element={<EraGallery />} />
  <Route path="/epoca/:era" element={<EraGallery />} />
  <Route path="/foto/:id" element={<PhotoDetail />} />
  <Route path="/fotografo/:username" element={<PhotographerDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin/cadastrar" element={<AdminAddPhoto />} />
  <Route path="/admin/editar/:id" element={<AdminAddPhoto />} /> {/* Rota de edição */}
</Routes>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  appContainer: {
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '24px 5% 16px 5%',
    backgroundColor: '#121212',
    borderBottom: '1px solid #222',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  brandLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    textDecoration: 'none',
    color: 'inherit',
  },
  adminLink: {
    color: '#e5ba43',
    textDecoration: 'none',
    fontSize: '0.9rem',
    border: '1px solid #e5ba43',
    padding: '6px 12px',
    borderRadius: '4px',
  },
  logo: {
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: '#e5ba43',
    fontStyle: 'italic',
    margin: 0,
    fontSize: '1rem',
  },
  mainContent: {
    flex: 1,
  },
};