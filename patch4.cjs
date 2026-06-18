const fs = require('fs');
const appFile = './src/App.jsx';
let text = fs.readFileSync(appFile, 'utf8');

text = text.replace("aspectRatio: '1581/1183',", "width: '100%', aspectRatio: '473/220',");

fs.writeFileSync(appFile, text);
console.log("Replaced 1581/1183");
