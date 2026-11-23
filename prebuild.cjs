const fs = require('fs');
if (fs.existsSync('index.dev.html')) {
  fs.copyFileSync('index.dev.html', 'index.html');
}
