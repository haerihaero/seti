const fs = require('fs');
const appFile = './src/App.jsx';
let text = fs.readFileSync(appFile, 'utf8');

// 1. Remove the huge corner preview we added previously
text = text.replace(/\{\/\* Huge Hovered Card Preview \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/, '');

// 2. Remove the setHoveredCard logic from hand cards since they will zoom in place
// We will also remove it from tucked cards just to be clean, or keep it. Let's just remove the hoveredCard state completely.
text = text.replace(/const \[hoveredCard, setHoveredCard\] = useState\(null\);\n\s*/g, '');

// 3. For Hand Cards Container: remove overflowX: 'auto', add flexWrap or just let it be visible
text = text.replace(
  /<div style=\{\{\s*flex: 1,\s*display: 'flex',\s*gap: '12px',\s*overflowX: 'auto',\s*paddingBottom: '4px',\s*alignItems: 'center'\s*\}\}>/g,
  `<div style={{ flex: 1, display: 'flex', gap: '-20px', overflow: 'visible', paddingBottom: '4px', alignItems: 'center' }}>`
);

// 4. For Hand Cards themselves: change whileHover and onMouseEnter/Leave
// We need to restore the borderColor logic and remove setHoveredCard
text = text.replace(
  /whileHover=\{\{ y: -15, zIndex: 100, scale: 1\.05 \}\}/g,
  `whileHover={{ y: -120, zIndex: 1000, scale: 2.2 }}`
);

text = text.replace(
  /onMouseEnter=\{e => \{\s*if \(\!isSelectingIncomeTuck\) e\.currentTarget\.style\.borderColor = 'var\(--neon-cyan\)';\s*setHoveredCard\(\{ deck: card\.deck, idx: card\.idx \}\);\s*\}\}\s*onMouseLeave=\{e => \{\s*if \(\!isSelectingIncomeTuck\) e\.currentTarget\.style\.borderColor = 'rgba\(255,255,255,0\.15\)';\s*setHoveredCard\(null\);\s*\}\}/g,
  `onMouseEnter={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }}`
);

// We should also ensure the hand cards have transformOrigin: 'bottom center' so they grow upwards and don't get cut off at the bottom of the screen.
text = text.replace(
  /flexShrink: 0,\s*width: '140px',\s*height: '196px',/g,
  `flexShrink: 0,
                      width: '140px',
                      height: '196px',
                      transformOrigin: 'bottom center',`
);

fs.writeFileSync(appFile, text);
console.log("Reverted corner preview and made hand cards zoom in place.");
