import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotoById } from '../services/api';

export function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhoto() {
      try {
        const data = await getPhotoById(id);
        setPhoto(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes da foto:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPhoto();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#888' }}>Carregando ficha técnica e metadados...</p>
      </div>
    );
  }

  if (!photo) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#e53935' }}>Fotografia não encontrada.</p>
        <Link to="/" style={styles.backButton}>← Voltar ao Acervo</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>← Voltar ao Acervo</Link>

      <div style={styles.contentGrid}>
        {/* Imagem em Destaque */}
        <div style={styles.imageWrapper}>
          <img src={photo.imageUrl} alt={photo.title} style={styles.image} />
        </div>

        {/* Informações e Ficha Técnica */}
        <div style={styles.infoWrapper}>
          <h1 style={styles.title}>{photo.title}</h1>

          {/* Nome e Link do Fotógrafo */}
          <div style={styles.photographerBox}>
            <span style={styles.photographerLabel}>Autor:</span>
            {photo.username ? (
              <Link to={`/fotografo/${photo.username}`} style={styles.photographerLink}>
                👤 {photo.photographer}
              </Link>
            ) : (
              <span style={styles.photographerName}>{photo.photographer}</span>
            )}
            <p style={styles.photographerBio}>{photo.photographerBio}</p>
          </div>

          <hr style={styles.divider} />

          {/* Ficha Técnica / EXIF */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📷 Ficha Técnica (EXIF)</h3>
            <p style={styles.text}>{photo.technicalNotes}</p>
          </div>

          {/* Dados de Composição */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📐 Análise & Localização</h3>
            <p style={styles.text}>{photo.compositionAnalysis}</p>
          </div>

          {/* Período */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🗓️ Ano / Período</h3>
            <span style={styles.tag}>{photo.year}</span>
          </div>
        </div>
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
    fontSize: '0.95rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    alignItems: 'start',
  },
  imageWrapper: {
    backgroundColor: '#181818',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #222',
  },
  image: {
    width: '100%',
    maxHeight: '75vh',
    objectFit: 'contain',
    borderRadius: '4px',
    display: 'block',
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#fff',
    margin: 0,
    lineHeight: '1.2',
  },
  photographerBox: {
    backgroundColor: '#181818',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
  },
  photographerLabel: {
    color: '#888',
    fontSize: '0.85rem',
    display: 'block',
    marginBottom: '4px',
  },
  photographerLink: {
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  photographerName: {
    color: '#d4af37',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  photographerBio: {
    color: '#bbb',
    fontSize: '0.9rem',
    marginTop: '8px',
    marginBottom: 0,
    lineHeight: '1.4',
  },
  divider: {
    borderColor: '#222',
    margin: '10px 0',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sectionTitle: {
    fontSize: '1rem',
    color: '#d4af37',
    margin: 0,
  },
  text: {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: 0,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    color: '#d4af37',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
};