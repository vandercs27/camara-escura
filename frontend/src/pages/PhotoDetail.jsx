import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL, resolveImageUrl } from '../services/api';

export function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const adminUser = JSON.parse(localStorage.getItem('adminUser'));
  useEffect(() => {
    async function fetchPhotoDetail() {
      try {
        setLoading(true);
        setError(null);

        // ✅ Busca os detalhes da fotografia pelo ID recebido na URL
        const endpoint = id.startsWith('wiki-')
          ? `${API_URL}/photos/licensed/${id}`
          : id.startsWith('met-')
            ? `${API_URL}/photos/modern/${id}`
            : id.startsWith('aic-')
              ? `${API_URL}/photos/modern/${id}`
          : `${API_URL}/photos/${id}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Erro ao carregar fotografia (${response.status})`);
        }

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Fotografia não encontrada.');
        }

        setPhoto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPhotoDetail();
    }
  }, [id]);
  
    
  const handleDelete = async () => {
    const confirmed = window.confirm('Tem certeza de que deseja remover esta fotografia do acervo?');
    if (!confirmed) return;

    setDeleting(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('adminUser'));
      const token = storedUser?.token;

      const response = await fetch(`${API_URL}/photos/${photo._id || photo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar fotografia.');
      }

      alert('Fotografia removida com sucesso!');
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#ccc' }}>Carregando obra...</div>;
  }

  if (error || !photo) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#ccc' }}>
        <p style={{ color: '#e74c3c' }}>{error || 'Obra não localizada.'}</p>
        <Link to="/" style={{ color: '#e5ba43' }}>← Voltar para a Galeria Principal</Link>
      </div>
    );
  }

  const photoId = photo._id || photo.id;

  return (
    <div style={styles.container}>
      <div style={styles.topActions}>
        <Link to="/" style={styles.backLink}>← Voltar ao acervo</Link>

        {adminUser && adminUser.token && (
          <div style={styles.adminButtons}>
            <Link to={`/admin/editar/${photoId}`} style={styles.editBtn}>
              Editar
            </Link>
            <button onClick={handleDelete} disabled={deleting} style={styles.deleteBtn}>
              {deleting ? 'Removendo...' : 'Excluir Foto'}
            </button>
          </div>
        )}
      </div>

      <div style={styles.grid}>
        <div style={styles.imageColumn}>
          <img
            src={resolveImageUrl(photo.imageUrl)}
            alt={photo.title || 'Fotografia'}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=Imagem+Indispon%C3%ADvel';
            }}
          />
        </div>

        <div style={styles.infoColumn}>
          <h2 style={styles.title}>{photo.title}</h2>
          <p style={styles.author}>
            <Link to={`/fotografo/${encodeURIComponent(photo.photographer)}`} style={styles.authorLink}>
              {photo.photographer}
            </Link> ({photo.year})
          </p>

          <div style={styles.badgeContainer}>
            <span style={styles.badge}>Mídia: {photo.medium || 'N/A'}</span>
            <span style={styles.badge}>Época: {photo.era || 'N/A'}</span>
            {photo.license && <span style={styles.badge}>Licença: {photo.license}</span>}
          </div>
          {photo.sourceUrl && (
            <p style={styles.source}>
              Fonte: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.source || 'Wikimedia Commons'}</a>
              {photo.credit ? ` · Crédito: ${photo.credit}` : ''}
            </p>
          )}

          <hr style={styles.divider} />

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Contexto Histórico</h3>
            <p style={styles.text}>
              {photo.historicalContext || 'Contexto histórico em fase de catalogação.'}
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Biografia do Fotógrafo</h3>
            <p style={styles.text}>
              {photo.photographerBio || 'Informações biográficas não informadas.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 24px',
    color: '#e5e5e5',
  },
  topActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  backLink: {
    color: '#e5ba43',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'opacity 0.2s ease',
  },
  adminButtons: {
    display: 'flex',
    gap: '12px',
  },
  editBtn: {
    backgroundColor: '#e5ba43',
    color: '#000',
    padding: '8px 20px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '8px 20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 1fr)',
    gap: '48px',
    alignItems: 'start',
    backgroundColor: '#121212',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  },
  imageColumn: {
    backgroundColor: '#080808',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #1f1f1f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: '650px',
    objectFit: 'contain',
    borderRadius: '8px',
    display: 'block',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '2.4rem',
    fontFamily: "'Playfair Display', 'Georgia', serif",
    margin: '0 0 8px 0',
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'capitalize',
    letterSpacing: '0.5px',
  },
  author: {
    color: '#e5ba43',
    fontSize: '1.25rem',
    fontStyle: 'italic',
    margin: '0 0 20px 0',
    textTransform: 'capitalize',
  },
  authorLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  source: {
    color: '#999',
    fontSize: '0.85rem',
  },
  badgeContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  badge: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2e2e2e',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    color: '#bbb',
    letterSpacing: '0.5px',
  },
  divider: {
    borderColor: '#222',
    margin: '24px 0',
    width: '100%',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#ffffff',
    marginBottom: '10px',
    borderLeft: '3px solid #e5ba43',
    paddingLeft: '12px',
    fontWeight: '600',
  },
  text: {
    color: '#b0b0b0',
    lineHeight: '1.7',
    fontSize: '0.95rem',
    margin: 0,
  },
};