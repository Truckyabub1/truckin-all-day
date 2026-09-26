import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('src/data/rights_catalog.json');
const outputPath = path.resolve('amuse_catalog_transfer.json');

function generateAmuseManifest() {
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const manifest = {
    title: "Amuse Catalog Transfer Manifest",
    targetAccountOwner: catalogData.catalogOwner,
    royaltyDistribution: `${catalogData.royaltySharePercent}% to ${catalogData.catalogOwner}`,
    generatedAt: new Date().toISOString(),
    artists: catalogData.artists.map(artist => ({
      artistName: artist.artistName,
      spotifyArtistUrl: `https://open.spotify.com/artist/${artist.spotifyId}`,
      appleArtistUrl: `https://music.apple.com/us/artist/${artist.appleArtistId}`,
      rightsOwner: artist.rightsOwner,
      split: "100% Brydan Carey"
    }))
  };

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Amuse Transfer Manifest successfully generated at: ${outputPath}`);
}

generateAmuseManifest();
