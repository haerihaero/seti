const fs = require('fs');
const appFile = './src/App.jsx';
let text = fs.readFileSync(appFile, 'utf8');

text = text.replace(/onMouseEnter=\{\(e\) => \{ e\.currentTarget\.style\.transform = 'scale\(1\.05\)'; setHoveredCard\(\{ deck: selectedDeck, idx \}\); \}\}/g, "onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(2.2)'; e.currentTarget.style.zIndex = 1000; }}");
text = text.replace(/onMouseLeave=\{\(e\) => \{ e\.currentTarget\.style\.transform = 'scale\(1\)'; setHoveredCard\(null\); \}\}/g, "onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 'auto'; }}");

text = text.replace(/onMouseEnter=\{\(\) => setHoveredCard\(\{ deck: card\.deck, idx: card\.idx \}\)\}/g, "onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(2.2) translateY(-40px)'; e.currentTarget.style.zIndex = 1000; }}");
text = text.replace(/onMouseLeave=\{\(\) => setHoveredCard\(null\)\}/g, "onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 'auto'; }}");

// Add transition for tucked cards and modal cards so the hover is smooth
text = text.replace(/className="tucked-card"\n\s*onMouseEnter/g, 'className="tucked-card" style={{ transition: "all 0.2s", transformOrigin: "bottom center" }}\n                    onMouseEnter');

fs.writeFileSync(appFile, text);
console.log("Cleaned up setHoveredCard and added native scaling.");
