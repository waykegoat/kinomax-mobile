const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

// 1. Copy dist/index.html to root
fs.copyFileSync('dist/index.html', 'index.html');

// 2. Copy dist/assets to root assets
copyRecursive('dist/assets', 'assets');

// 3. Copy dist to docs
copyRecursive('dist', 'docs');

// 4. Ensure .nojekyll in all deployment targets
fs.writeFileSync('.nojekyll', '');
fs.writeFileSync('docs/.nojekyll', '');
fs.writeFileSync('dist/.nojekyll', '');

console.log('Postbuild: Synced assets and index.html across root, docs, and dist.');
