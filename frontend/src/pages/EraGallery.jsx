import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';

export function EraGallery() {
  const { era } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      setError(null);
      try {
        const eraParam = era ? era : 'todas';
        const response = await fetch(`http://localhost:5000/api/photos/era/${eraParam}`);

        if (!response.ok) {
          throw new Error(`Falha na resposta do servidor (${response.status})`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPhotos(data);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error('Erro ao carregar acervo:', err);
        setError('Não foi possível conectar ao servidor do acervo.');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [era]);

  const filteredPhotos = (photos || []).filter((photo) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const titleMatch = photo?.title?.toLowerCase().includes(term);
    const authorMatch = photo?.photographer?.toLowerCase().includes(term);
    const mediumMatch = photo?.medium?.toLowerCase().includes(term);
    return titleMatch || authorMatch || mediumMatch;
  });

  if (loading) {
    return <div style={styles.message}>Carregando acervo histórico...</div>;
  }

  if (error) {
    return <div style={{ ...styles.message, color: '#e74c3c' }}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      {searchQuery && (
        <p style={styles.searchInfo}>
          Exibindo resultados para: <strong>"{searchQuery}"</strong> ({filteredPhotos.length} encontrada(s))
        </p>
      )}

     {filteredPhotos.length === 0 ? (
  <div style={styles.message}>Nenhuma fotografia encontrada para essa seleção.</div>
) : (
  <div style={styles.grid}>
    {filteredPhotos.map((photo) => {
      const photoId = photo._id || photo.id;

      return (
        <Link key={photoId} to={`/foto/${photoId}`} style={styles.card}>
          <img
            src={photo.imageUrl || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
            alt={photo.title || 'Fotografia'}
            style={styles.image}
          />
          <div style={styles.cardInfo}>
            <h3 style={styles.cardTitle}>{photo.title || 'Título Indisponível'}</h3>
            <p style={styles.cardAuthor}>
              {photo.photographer || 'Autor Desconhecido'} {photo.year ? `(${photo.year})` : ''}
            </p>
            {photo.medium && <span style={styles.cardMedium}>{photo.medium}</span>}
          </div>
        </Link>
      );
    })}
  </div>
)}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 5%',
  },
  searchInfo: {
    textAlign: 'center',
    color: '#e5ba43',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  message: {
    textAlign: 'center',
    color: '#888',
    padding: '40px 0',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  cardInfo: {
    padding: '16px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    margin: '0 0 8px 0',
    color: '#fff',
  },
  cardAuthor: {
    fontSize: '0.9rem',
    color: '#aaa',
    margin: '0 0 8px 0',
  },
  cardMedium: {
    fontSize: '0.8rem',
    color: '#e5ba43',
    backgroundColor: '#262215',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
};