const axios = require('axios');
const { translateToPt } = require('../utils/translator');

const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';

const getHistoricalPhotosFromWiki = async (query = 'Historical photography', limit = 24) => {
  try {
    const response = await axios.get(WIKIMEDIA_API_URL, {
      params: {
        action: 'query',
        generator: 'search',
        gsrsearch: `filetype:bitmap ${query}`,
        gsrlimit: limit,
        prop: 'imageinfo',
        iiprop: 'url|extmetadata|timestamp',
        format: 'json',
        origin: '*',
      },
    });

    const pages = response.data.query?.pages || {};

    const photos = await Promise.all(
      Object.values(pages).map(async (page) => {
        const info = page.imageinfo?.[0] || {};
        const metadata = info.extmetadata || {};

        const rawTitle =
          metadata.ObjectName?.value ||
          metadata.ImageDescription?.value?.replace(/<[^>]+>/g, '') ||
          page.title.replace('File:', '').replace(/\.[^/.]+$/, '');

        const translatedTitle = await translateToPt(rawTitle.substring(0, 120));
        const authorRaw = metadata.Artist?.value?.replace(/<[^>]+>/g, '') || 'Acervo Wikimedia Commons';

        return {
          id: `wiki-${page.pageid}`,
          title: translatedTitle || 'Fotografia Histórica Registrada',
          photographer: authorRaw.split('\n')[0].substring(0, 50),
          year: metadata.DateTimeOriginal?.value?.substring(0, 4) || 'Século XX',
          medium: metadata.Medium?.value?.replace(/<[^>]+>/g, '') || 'Placa de Vidro / Negativo de Época',
          imageUrl: info.url,
        };
      })
    );

    return photos.filter((p) => p.imageUrl);
  } catch (error) {
    console.error('Erro na API da Wikimedia:', error.message);
    return [];
  }
};

module.exports = { getHistoricalPhotosFromWiki };