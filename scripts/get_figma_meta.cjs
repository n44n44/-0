const https = require('https');
const fs = require('fs');

const url = 'https://www.figma.com/design/CRxgGJ2f4fFAw43J9nCFNc/Untitled?node-id=4-7';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const metaOg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
    console.log('OG Image:', metaOg ? metaOg[1] : 'None');
    const twitterImg = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/i);
    console.log('Twitter Image:', twitterImg ? twitterImg[1] : 'None');
    
    // Check if there are schema or other metadata
    const schemaMatches = html.match(/"thumbnailUrl":\s*"([^"]*)"/i);
    console.log('Thumbnail URL:', schemaMatches ? schemaMatches[1] : 'None');
  });
}).on('error', e => console.error(e));

