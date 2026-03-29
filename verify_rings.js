const fs = require('fs');
const content = fs.readFileSync('src/data/engagement-rings.ts', 'utf8');

// Extract all rings
const ringMatches = content.matchAll(/{\s*"id":\s*"(ring-[^"]+)"[^}]*?"slug":\s*"(ring-[^"]+)"[^}]*?"shape":\s*"([^"]+)"[^}]*?"settingStyle":\s*"([^"]+)"/gs);

const rings = {};
for (const match of ringMatches) {
  const [, id, slug, shape, settingStyle] = match;
  if (slug === id) {
    rings[slug] = { shape, settingStyle };
  }
}

// Rings that need shape changes
const shapeChanges = {
  'ring-ainsley': 'pear',
  'ring-amor': 'pear',
  'ring-brooke': 'pear',
  'ring-brooklyn': 'princess',
  'ring-chantelle': 'marquise',
  'ring-eliana': 'emerald',
  'ring-ellie': 'radiant',
  'ring-hannah': 'marquise',
  'ring-jacinta': 'pear',
  'ring-josephine': 'radiant',
  'ring-kyla': 'radiant',
  'ring-liberty': 'radiant',
  'ring-miller': 'emerald',
  'ring-morgan': 'pear',
  'ring-parker': 'emerald',
  'ring-polly': 'pear',
  'ring-raleigh': 'emerald',
  'ring-salma': 'marquise',
  'ring-sophia': 'princess',
  'ring-willow': 'radiant'
};

// Rings that should keep halo
const keepHalo = [
  'ring-analyce',
  'ring-arielle',
  'ring-kirsten',
  'ring-madeline',
  'ring-nola',
  'ring-phoebe',
  'ring-savannah'
];

console.log('=== SHAPE VERIFICATION ===');
let shapeOk = true;
for (const [ring, expectedShape] of Object.entries(shapeChanges)) {
  const actual = rings[ring]?.shape;
  const status = actual === expectedShape ? '✓' : '✗';
  if (actual !== expectedShape) shapeOk = false;
  console.log(`${status} ${ring}: expected ${expectedShape}, got ${actual}`);
}

console.log('\n=== SETTING STYLE VERIFICATION ===');
let styleOk = true;

// Check halo rings
for (const ring of keepHalo) {
  const actual = rings[ring]?.settingStyle;
  const status = actual === 'halo' ? '✓' : '✗';
  if (actual !== 'halo') styleOk = false;
  console.log(`${status} ${ring}: expected halo, got ${actual}`);
}

// Check tahlia
const tahlia = rings['ring-tahlia']?.settingStyle;
const tahliaStatus = tahlia === 'toi_et_moi' ? '✓' : '✗';
if (tahlia !== 'toi_et_moi') styleOk = false;
console.log(`${tahliaStatus} ring-tahlia: expected toi_et_moi, got ${tahlia}`);

// Check for any remaining bezel or east_west
const bezelCount = Object.values(rings).filter(r => r.settingStyle === 'bezel').length;
const eastWestCount = Object.values(rings).filter(r => r.settingStyle === 'east_west').length;
console.log(`\nBezel count: ${bezelCount} (should be 0)`);
console.log(`East-west count: ${eastWestCount} (should be 0)`);

if (bezelCount > 0 || eastWestCount > 0) styleOk = false;

console.log(`\n=== SUMMARY ===`);
console.log(`Shape updates: ${shapeOk ? 'PASS' : 'FAIL'}`);
console.log(`Setting style updates: ${styleOk ? 'PASS' : 'FAIL'}`);
console.log(`Overall: ${shapeOk && styleOk ? 'PASS' : 'FAIL'}`);
