import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotosByEra } from '../services/api';
import { PhotoCard } from '../components/PhotoCard';
import { EraNavbar } from '../components/EraNavbar';

export function EraGallery() {
  const { era } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const eraTitles = {
    'seculo-19': 'Século XIX — Primeiros Daguerreótipos e Heliografias',
    'anos-1900-1920': '1900 a 1920 — Pictorialismo e Documentarismo Social',
    'anos-1930-1950': '1930 a 1950 — Era de Ouro do Fotojornalismo',
    'anos-1960-1980': '1960 a 1980 — Fotografia Analógica e Pop',
    'contemporanea': 'Fotografia Contemporânea e Arte Digital',
  };

  useEffect(() => {
    async function loadEraPhotos() {
      setLoading(true);
      try {
        const data = await getPhotosByEra(era);
        setPhotos(data);
      } catch (error) {
        console.error('Erro ao carregar acervo da época:', error);
      } finally {
        setLoading(false);
      }
    }
    loadEraPhotos();
  }, [era]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/logo.jpg" alt="Câmara Escura" style={styles.logo} />
        </Link>
        <h1 style={styles.brandTitle}>Câmara Escura</h1>
        <p style={styles.tagline}>Navegação Histórica por Época</p>

        <EraNavbar />
      </header>

      <main>
        <h2 style={styles.sectionTitle}>{eraTitles[era] || 'Acervo por Época'}</h2>

        {loading ? (
          <p style={styles.loading}>Filtrando acervo histórico...</p>
        ) : (
          <div style={styles.grid}>
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f0f0f',
    color: '#e0e0e0',
    minHeight: '100vh',
    padding: '32px 10%',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid #222',
  },
  logo: {
    width: '160px',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  brandTitle: {
    fontSize: '2.2rem',
    color: '#f0f0f0',
    margin: 0,
  },
  tagline: {
    fontSize: '0.95rem',
    color: '#d4af37',
    fontStyle: 'italic',
    marginTop: '6px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '24px',
    color: '#ccc',
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