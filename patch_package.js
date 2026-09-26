const fs = require('fs');

const pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pjson.allowScripts) {
  pjson.allowScripts = {};
}
pjson.allowScripts['esbuild'] = true;

fs.writeFileSync('package.json', JSON.stringify(pjson, null, 2));
console.log('Patched package.json');
