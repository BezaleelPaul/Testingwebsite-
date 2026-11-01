const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '..', 'public', 'textures', 'planets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const textures = [
  // Three.js Official NASA Blue Marble & Earth PBR set
  {
    name: 'earth_day_2k.jpg',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  },
  {
    name: 'earth_normal_2k.jpg',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  },
  {
    name: 'earth_specular_2k.jpg',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  },
  {
    name: 'earth_clouds_1k.png',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  },
  {
    name: 'earth_night_2k.png',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
  },
  {
    name: 'moon_1k.jpg',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  },
  // High quality Solar System maps via threex.planets CDN
  {
    name: 'mars_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsmap1k.jpg',
  },
  {
    name: 'jupiter_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/jupitermap.jpg',
  },
  {
    name: 'saturn_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnmap.jpg',
  },
  {
    name: 'saturn_ring.png',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnringcolor.jpg',
  },
  {
    name: 'venus_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusmap.jpg',
  },
  {
    name: 'mercury_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/mercurymap.jpg',
  },
  {
    name: 'sun_1k.jpg',
    url: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/sunmap.jpg',
  },
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, item.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[SKIP] ${item.name} already exists (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
      return resolve();
    }

    const file = fs.createWriteStream(dest);

    function fetchUrl(targetUrl, redirects = 0) {
      if (redirects > 5) {
        return reject(new Error('Too many redirects'));
      }
      https.get(targetUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return fetchUrl(response.headers.location, redirects + 1);
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`HTTP ${response.statusCode} for ${targetUrl}`));
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(dest).size;
          console.log(`[OK] ${item.name} (${(sz / 1024).toFixed(1)} KB)`);
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }

    fetchUrl(item.url);
  });
}

async function run() {
  console.log(`Downloading ${textures.length} planetary texture maps...`);
  for (const item of textures) {
    try {
      await downloadFile(item);
    } catch (err) {
      console.error(`[ERR] ${item.name}: ${err.message}`);
    }
  }
  console.log('Finished texture download pipeline.');
}

run();
