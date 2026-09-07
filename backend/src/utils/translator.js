const translate = require('translate');

// Configura o motor de tradução do Google (gratuito)
translate.engine = 'google';

/**
 * Traduz um texto para o português de forma assíncrona
 */
const translateToPt = async (text) => {
  if (!text || text === 'N/A' || text.trim() === '') {
    return 'Fotografia sem descrição';
  }

  try {
    const translated = await translate(text, { from: 'en', to: 'pt' });
    return translated;
  } catch (error) {
    console.error('Erro ao traduzir texto:', error.message);
    return text; // Retorna o texto original em inglês caso a API de tradução falhe
  }
};

module.exports = { translateToPt };