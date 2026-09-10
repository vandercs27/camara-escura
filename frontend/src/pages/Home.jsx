import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHistoricalPhotos, getPhotosByEra } from '../services/api';
import { EraNavbar } from '../components/EraNavbar';
import { PhotoCard } from '../components/PhotoCard';

export function Home() {
  const { era } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      setLoading(true);
      try {
        let data;
        if (!era || era === 'todas') {
          data = await getHistoricalPhotos();
        } else {
          data = await getPhotosByEra(era);
        }

        if (isMounted) {
          setPhotos(data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar acervo:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [era]);

  return (
    <div style={styles.container}>
      {/* Banner / Header Visual */}
      <div style={styles.header}>
        <h1 style={styles.title}>Câmara Escura</h1>
        <p style={styles.subtitle}>Estudos & História da Fotografia</p>
      </div>

      {/* Navegação por Abas de Épocas */}
      <EraNavbar />

      {/* Grid de Fotos Carregadas Dinamicamente */}
      {loading ? (
        <div style={styles.loadingBox}>
          <p style={{ color: '#888' }}>Carregando acervo histórico...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '32px 5%',
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
    boxSizing: 'border-box',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#e5ba43',
    fontStyle: 'italic',
    margin: 0,
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
};