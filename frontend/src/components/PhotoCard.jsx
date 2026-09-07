import React from 'react';
import { Link } from 'react-router-dom';

export function PhotoCard({ photo }) {
  return (
    <div style={styles.card}>
      <Link to={`/foto/${photo.id}`} style={{ textDecoration: 'none' }}>
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          style={styles.image}
          loading="lazy"
        />
      </Link>
      <div style={styles.content}>
        <h3 style={styles.title} title={photo.title}>
          {photo.title}
        </h3>

        {photo.username ? (
          <Link to={`/fotografo/${photo.username}`} style={styles.photographerLink}>
            👤 {photo.photographer}
          </Link>
        ) : (
          <p style={styles.photographer}>{photo.photographer}</p>
        )}

        <p style={styles.year}>{photo.year}</p>
        
        {photo.medium && (
          <span style={styles.tag} title={photo.medium}>
            {photo.medium}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    height: '420px', // Altura fixa e padronizada para todos os cards
  },
  image: {
    width: '100%',
    height: '220px', // Altura fixa da imagem
    objectFit: 'cover',
    backgroundColor: '#111',
    cursor: 'pointer',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    justifyContent: 'space-between', // Distribui o conteúdo internamente sem esticar o card
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    color: '#fff',
    lineHeight: '1.3',
    // Trunca textos com mais de 2 linhas
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '2.6em', 
  },
  photographerLink: {
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  photographer: {
    margin: 0,
    color: '#aaa',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  year: {
    margin: 0,
    color: '#888',
    fontSize: '0.8rem',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    color: '#d4af37',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
};