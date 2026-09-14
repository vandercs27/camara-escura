import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotographer, resolveImageUrl } from '../services/api';
import { PhotoCard } from '../components/PhotoCard';

export function PhotographerDetail() {
  const { username } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotographer() {
      try {
        const data = await getPhotographer(username);
        setPhotographer(data);
      } catch (error) {
        console.error('Erro ao carregar fotógrafo:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPhotographer();
  }, [username]);

  if (loading) {
    return <div style={styles.container}><p style={{ color: '#888' }}>Buscando portfólio do fotógrafo...</p></div>;
  }

  if (!photographer) {
    return <div style={styles.container}><p style={{ color: '#e53935' }}>Fotógrafo não encontrado.</p></div>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>← Voltar ao Acervo</Link>

      <div style={styles.profileHeader}>
        {photographer.profileImage && (
          <img
  src={resolveImageUrl(photographer.profileImage)}
  alt={photographer.name}
  referrerPolicy="no-referrer" 
/>
        )}
        <div>
          <h1 style={styles.name}>{photographer.name}</h1>
          <p style={styles.meta}>📍 {photographer.location} • 📷 {photographer.totalPhotos} Obras registradas</p>
          <p style={styles.bio}>{photographer.bio}</p>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Galeria do Autor</h2>
      <div style={styles.grid}>
        {photographer.photos.map((photo) => (
          <PhotoCard key={photo.id} photo={{ ...photo, photographer: photographer.name }} />
        ))}
      </div>
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
  backButton: {
    color: '#d4af37',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '24px',
  },
  profileHeader: {
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
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontSize: '1.8rem',
    margin: '0 0 8px 0',
    color: '#fff',
  },
  meta: {
    color: '#d4af37',
    fontSize: '0.9rem',
    margin: '0 0 12px 0',
  },
  bio: {
    color: '#ccc',
    lineHeight: '1.5',
    margin: 0,
    fontSize: '0.95rem',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    marginBottom: '20px',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
};