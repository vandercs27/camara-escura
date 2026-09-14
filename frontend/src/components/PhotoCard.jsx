import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';

export function PhotoCard({ photo }) {
  const photoId = photo._id || photo.id;

  return (
    <div style={styles.card}>
      <Link to={`/foto/${photoId}`} style={styles.link}>
        <div style={styles.imageContainer}>
          <img
            src={resolveImageUrl(photo.imageUrl)}
            alt={photo.title}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indispon%C3%ADvel';
            }}
          />
        </div>
        <div style={styles.content}>
          <h3 style={styles.title}>{photo.title}</h3>
          <p style={styles.meta}>
            {photo.photographer} • {photo.year}
          </p>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  imageContainer: {
    width: '100%',
    height: '240px',
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '1.1rem',
    color: '#fff',
  },
  meta: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#e5ba43',
  },
};