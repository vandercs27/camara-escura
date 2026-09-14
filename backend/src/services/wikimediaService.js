const axios = require('axios');

const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';
const CURATED_PHOTOGRAPHERS = [
  'Louis Daguerre',
  'William Henry Fox Talbot',
  'Eadweard Muybridge',
  'Julia Margaret Cameron',
  'Nadar',
  'Eugene Atget',
  'Alfred Stieglitz',
  'Edward Steichen',
  'Man Ray',
  'Tina Modotti',
  'Dorothea Lange',
  'Walker Evans',
  'Ansel Adams',
  'Berenice Abbott',
  'Gordon Parks',
  'Vivian Maier',
];
let curatedCache = { expiresAt: 0, photos: [] };
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

const fetchPhotographerWorks = async (searchExpression, limit) => {
  const response = await axios.get(WIKIMEDIA_API_URL, {
    params: {
      action: 'query',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${searchExpression}`,
      gsrlimit: limit,
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

  return Object.values(response.data.query?.pages || {});
};

const mapLicensedPhoto = (page) => {
  const info = page.imageinfo?.[0] || {};
  const metadata = info.extmetadata || {};
  const license = cleanMetadata(
    metadata.LicenseShortName?.value || metadata.License?.value || ''
  );

  if (!info.url || !hasAllowedLicense(license)) return null;

  const rawTitle = cleanMetadata(
    metadata.ObjectName?.value ||
      metadata.ImageDescription?.value ||
      page.title.replace('File:', '').replace(/\.[^/.]+$/, '')
  );
  const author = cleanMetadata(metadata.Artist?.value || 'Autor não identificado');
  const description = cleanMetadata(metadata.ImageDescription?.value || '');
  const year = cleanMetadata(metadata.DateTimeOriginal?.value || '')
    .match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[1] || 'Data não informada';

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
};

const getHistoricalPhotosFromWiki = async (query, limit = 48) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 48, 1), 100);
  if (!query && curatedCache.expiresAt > Date.now()) {
    return curatedCache.photos.slice(0, safeLimit);
  }

  const searchTerms = query ? [String(query).trim()] : CURATED_PHOTOGRAPHERS;
  const searchGroups = [];
  for (let index = 0; index < searchTerms.length; index += 4) {
    searchGroups.push(searchTerms.slice(index, index + 4));
  }
  const pagesBySearch = await Promise.all(searchGroups.map((group) => {
    const searchExpression = group.length === 1
      ? `"${group[0]}"`
      : group.map((term) => `"${term}"`).join(' OR ');
    return fetchPhotographerWorks(searchExpression, query ? safeLimit : 16);
  }));
  const photos = pagesBySearch
    .flat()
    .map(mapLicensedPhoto)
    .filter(Boolean);
  const uniquePhotos = [...new Map(photos.map((photo) => [photo.id, photo])).values()];

  if (!query) {
    curatedCache = {
      expiresAt: Date.now() + 10 * 60 * 1000,
      photos: uniquePhotos,
    };
  }

  return uniquePhotos.slice(0, safeLimit);
};

module.exports = { getHistoricalPhotosFromWiki };