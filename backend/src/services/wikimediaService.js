const axios = require('axios');

const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';
const ALLOWED_LICENSES = [
  'Public domain',
  'CC0',
  'CC BY',
  'CC BY-SA',
];

const cleanMetadata = (value = '') =>
  value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const hasAllowedLicense = (license) =>
  ALLOWED_LICENSES.some((name) => {
    if (name === 'CC BY') {
      return license === name || license.startsWith(`${name} `);
    }
    return license === name || license.startsWith(`${name} `);
  }) && !/\b(NC|ND)\b/i.test(license);

const getHistoricalPhotosFromWiki = async (query = 'Historical photography', limit = 24) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 50);
  const response = await axios.get(WIKIMEDIA_API_URL, {
    params: {
      action: 'query',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${query}`,
      gsrlimit: safeLimit,
      gsrnamespace: 6,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata|timestamp',
      format: 'json',
      origin: '*',
    },
    timeout: 15000,
    headers: {
      'User-Agent': 'CamaraEscura/1.0 (historical photography educational project)',
    },
  });

  const pages = response.data.query?.pages || {};

  return Object.values(pages)
    .map((page) => {
      const info = page.imageinfo?.[0] || {};
      const metadata = info.extmetadata || {};
      const license = cleanMetadata(
        metadata.LicenseShortName?.value || metadata.License?.value || ''
      );

      if (!info.url || !hasAllowedLicense(license)) {
        return null;
      }

      const rawTitle = cleanMetadata(
        metadata.ObjectName?.value ||
          metadata.ImageDescription?.value ||
          page.title.replace('File:', '').replace(/\.[^/.]+$/, '')
      );
      const author = cleanMetadata(metadata.Artist?.value || 'Autor não identificado');
      const description = cleanMetadata(metadata.ImageDescription?.value || '');
      const year = cleanMetadata(metadata.DateTimeOriginal?.value || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[1] || 'Data não informada';

      return {
        id: `wiki-${page.pageid}`,
        title: rawTitle.substring(0, 160),
        photographer: author.split('\n')[0].substring(0, 120),
        year,
        medium: cleanMetadata(metadata.Medium?.value || 'Técnica não informada'),
        imageUrl: info.url,
        description: description.substring(0, 500),
        source: 'Wikimedia Commons',
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        license,
        licenseUrl: cleanMetadata(metadata.LicenseUrl?.value || ''),
        credit: cleanMetadata(metadata.Credit?.value || author),
      };
    })
    .filter(Boolean);
};

module.exports = { getHistoricalPhotosFromWiki };