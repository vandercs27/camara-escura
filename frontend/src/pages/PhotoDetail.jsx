import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

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

      const API_URL = 'https://camara-escura-backend.onrender.com/api';
const eraParam = era ? era : 'todas';
// Exemplo no fetch:
const response = await fetch(`${API_URL}/photos/era/${eraParam}`);

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

      const response = await fetch(`http://localhost:5000/api/photos/${photo._id || photo.id}`, {
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
            src={photo.imageUrl}
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
            {photo.photographer} ({photo.year})
          </p>

          <div style={styles.badgeContainer}>
            <span style={styles.badge}>Mídia: {photo.medium || 'N/A'}</span>
            <span style={styles.badge}>Época: {photo.era || 'N/A'}</span>
          </div>

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
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px',
    color: '#fff',
  },
  topActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  adminButtons: {
    display: 'flex',
    gap: '10px',
  },
  backLink: {
    color: '#e5ba43',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: '#e5ba43',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    alignItems: 'start',
  },
  imageColumn: {
    backgroundColor: '#111',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #222',
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: '600px',
    objectFit: 'contain',
    borderRadius: '4px',
    display: 'block',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '2.2rem',
    margin: '0 0 6px 0',
    fontWeight: '600',
  },
  author: {
    color: '#e5ba43',
    fontSize: '1.2rem',
    fontStyle: 'italic',
    margin: '0 0 16px 0',
  },
  badgeContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  badge: {
    backgroundColor: '#222',
    border: '1px solid #333',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    color: '#aaa',
  },
  divider: {
    borderColor: '#333',
    margin: '20px 0',
    width: '100%',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#fff',
    marginBottom: '8px',
    borderLeft: '3px solid #e5ba43',
    paddingLeft: '8px',
  },
  text: {
    color: '#ccc',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    margin: 0,
  },
};