import React from 'react';

export function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p style={styles.brand}>📷 Câmara Escura</p>
        <p style={styles.text}>
          Acervo digital dedicado aos estudos e à preservação da história da fotografia.
        </p>
        <p style={styles.copyright}>
          © {new Date().getFullYear()} Câmara Escura. Desenvolvido com React, Node.js & Unsplash API.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #222',
    color: '#888',
    padding: '32px 10%',
    marginTop: '60px',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  brand: {
    fontSize: '1.1rem',
    color: '#d4af37',
    fontWeight: 'bold',
    margin: 0,
  },
  text: {
    fontSize: '0.85rem',
    color: '#aaa',
    margin: 0,
  },
  copyright: {
    fontSize: '0.75rem',
    color: '#555',
    marginTop: '8px',
  },
};