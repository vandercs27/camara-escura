import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHistoricalPhotos, searchPhotographer } from './services/api';
import { PhotoCard } from './components/PhotoCard';
import { EraNavbar } from './components/EraNavbar';
import { Footer } from './components/Footer';
import { PhotoDetail } from './pages/PhotoDetail';
import { PhotographerDetail } from './pages/PhotographerDetail';
import { EraGallery } from './pages/EraGallery';

function Home() {
  const [photos, setPhotos] = useState([]);
  const [photographerInfo, setPhotographerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const term = searchParams.get('search') || 'vintage photography';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setPhotographerInfo(null);

      try {
        if (term && term !== 'vintage photography') {
          try {
            const profile = await searchPhotographer(term);
            if (profile && profile.photos && Array.isArray(profile.photos) && profile.photos.length > 0) {
              setPhotographerInfo(profile);
              setPhotos(profile.photos);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Segue para a busca geral caso não encontre um perfil exato
          }
        }

        const data = await getHistoricalPhotos(term);
        setPhotos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [term]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/logo.jpg" alt="Câmara Escura" style={styles.logo} />
        </Link>
        <h1 style={styles.brandTitle}>Câmara Escura</h1>
        <p style={styles.tagline}>Estudos & História da Fotografia</p>

        <EraNavbar />
      </header>

      <main style={styles.main}>
        {photographerInfo ? (
          <div style={styles.photographerHeader}>
            {photographerInfo.profileImage && (
              <img src={photographerInfo.profileImage} alt={photographerInfo.name} style={styles.avatar} />
            )}
            <div>
              <h2 style={styles.photographerName}>{photographerInfo.name}</h2>
              <p style={styles.photographerMeta}>
                📍 {photographerInfo.location} • 📷 {photographerInfo.totalPhotos} Obras Registradas
              </p>
              <p style={styles.photographerBio}>{photographerInfo.bio}</p>
            </div>
          </div>
        ) : (
          <h2 style={styles.sectionTitle}>
            {term !== 'vintage photography' ? `Resultados para: "${term}"` : 'Acervo Fotográfico'}
          </h2>
        )}

        {loading ? (
          <p style={styles.loading}>Buscando fotografias e dados do acervo...</p>
        ) : photos.length === 0 ? (
          <p style={styles.loading}>Nenhuma fotografia ou fotógrafo encontrado para o termo pesquisado.</p>
        ) : (
          <div style={styles.grid}>
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/epoca/:era" element={<EraGallery />} />
      <Route path="/foto/:id" element={<PhotoDetail />} />
      <Route path="/fotografo/:username" element={<PhotographerDetail />} />
    </Routes>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f0f0f',
    color: '#e0e0e0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 10% 0 10%',
    borderBottom: '1px solid #222',
  },
  logo: {
    width: '180px',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  brandTitle: {
    fontSize: '2.5rem',
    color: '#f0f0f0',
    margin: 0,
  },
  tagline: {
    fontSize: '1rem',
    color: '#d4af37',
    fontStyle: 'italic',
    marginTop: '8px',
  },
  main: {
    padding: '32px 10%',
    flex: 1,
  },
  sectionTitle: {
    fontSize: '1.4rem',
    marginBottom: '24px',
    color: '#ccc',
  },
  photographerHeader: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    backgroundColor: '#181818',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #2a2a2a',
    marginBottom: '32px',
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  photographerName: {
    fontSize: '1.8rem',
    margin: '0 0 8px 0',
    color: '#fff',
  },
  photographerMeta: {
    color: '#d4af37',
    fontSize: '0.85rem',
    margin: '0 0 10px 0',
  },
  photographerBio: {
    color: '#ccc',
    lineHeight: '1.5',
    margin: 0,
    fontSize: '0.95rem',
  },
  loading: {
    color: '#888',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
};