import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { API_URL, resolveImageUrl } from '../services/api';

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
       // Obtém a URL do backend enviada pelo Render (ou usa o localhost como fallback se estiver testando no PC)
const eraParam = era ? era : 'todas';
const response = await fetch(`${API_URL}/photos/era/${eraParam}`);

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
            src={resolveImageUrl(photo.imageUrl) || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
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
  // 1. A grade responsiva dos cards
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px',
  },

  // 2. Estilo do card de cada foto (Link)
  card: {
    backgroundColor: '#141414',
    border: '1px solid #222',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },

  // 3. Imagem com tamanho e proporção fixos (evita desalinhamento)
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    display: 'block',
    borderBottom: '1px solid #222',
  },

  // 4. Container de textos dentro do card
  cardInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flexGrow: 1,
  },

  // 5. Título da foto
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.3',
  },

  // 6. Autor e Ano
  cardAuthor: {
    fontSize: '0.9rem',
    color: '#e5ba43',
    fontStyle: 'italic',
    margin: 0,
  },

  // 7. Badge de técnica (Mídia)
  cardMedium: {
    alignSelf: 'flex-start',
    marginTop: 'auto',
    fontSize: '0.75rem',
    color: '#aaa',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    padding: '4px 8px',
    borderRadius: '4px',
  },
};