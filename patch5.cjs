const fs = require('fs');
const appFile = './src/App.jsx';
let text = fs.readFileSync(appFile, 'utf8');

// The hand cards
text = text.replace(/width: '95px',\s*height: '133px',/g, "width: '140px',\n                      height: '196px',");

// The tucked cards (maybe increase them slightly too, from 52x73 to 75x105)
text = text.replace(/width: '52px',\s*height: '73px',/g, "width: '75px',\n                      height: '105px',");

fs.writeFileSync(appFile, text);
console.log("Card sizes increased.");
