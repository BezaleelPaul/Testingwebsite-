const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '..', 'public', 'textures', 'planets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = [
  {
    name: 'uranus_1k.jpg',
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusmap.jpg'
  },
  {
    name: 'uranus_ring.png',
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusringcolour.jpg'
  },
  {
    name: 'neptune_1k.jpg',
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/neptunemap.jpg'
  },
  {
    name: 'pluto_1k.jpg',
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/plutomap1k.jpg'
  }
];

files.forEach(f => {
  const dest = path.join(dir, f.name);
  const file = fs.createWriteStream(dest);
  https.get(f.url, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved ${f.name} (${fs.statSync(dest).size} bytes)`);
      });
    } else {
      console.log(`Failed ${f.name}: HTTP ${res.statusCode}`);
    }
  }).on('error', err => {
    console.error(`Error ${f.name}:`, err.message);
  });
});
