const fs = require('fs');
const appFile = './src/App.jsx';
let text = fs.readFileSync(appFile, 'utf8');

// 1. Add state variable
if (!text.includes('const [hoveredCard, setHoveredCard] = useState(null);')) {
  text = text.replace(
    /const \[activePlayerId, setActivePlayerId\] = useState\(1\);/,
    "const [activePlayerId, setActivePlayerId] = useState(1);\n  const [hoveredCard, setHoveredCard] = useState(null);"
  );
}

// 2. Add Huge Hovered Card Preview before closing main App div
if (!text.includes('Huge Hovered Card Preview')) {
  // Find the last closing tag of the main container (App). It's before `export default function App() {` ends.
  // We can search for `{/* Bottom Panel: Player Board and Cards in Hand */}` or just inject it right before the last `</div>` of the return statement.
  text = text.replace(
    /<\/div>\s*\}\s*$/m,
    `      {/* Huge Hovered Card Preview */}
      <AnimatePresence>
        {hoveredCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              width: '300px',
              height: '420px',
              borderRadius: '16px',
              backgroundImage: \`url(\${IMAGES[hoveredCard.deck]})\`,
              backgroundSize: '1000% 700%',
              backgroundPositionX: \`\${(hoveredCard.idx % 10) * 11.11}%\`,
              backgroundPositionY: \`\${Math.floor(hoveredCard.idx / 10) * 16.66}%\`,
              border: '3px solid var(--neon-cyan)',
              boxShadow: '0 0 30px rgba(0,229,255,0.6), 0 20px 40px rgba(0,0,0,0.8)',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  }
`
  );
}

// 3. Add onMouseEnter / onMouseLeave to the 3 card locations.
// A. All Cards Modal (around line 3262)
text = text.replace(
  /className="card-hover-scale"\s*onMouseEnter=\{\(e\) => e.currentTarget.style.transform = 'scale\(1.05\)'\}\s*onMouseLeave=\{\(e\) => e.currentTarget.style.transform = 'scale\(1\)'\}/g,
  `className="card-hover-scale"
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; setHoveredCard({ deck: selectedDeck, idx }); }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; setHoveredCard(null); }}`
);

// B. Tucked cards (around line 3680)
// They are rendered with: <div key={\`tucked-\${i}\`} className="tucked-card" ... title={...}>
text = text.replace(
  /className="tucked-card"([\s\S]*?)title=\{\`수입 카드 #\$\{card\.idx \+ 1\}/g,
  `className="tucked-card"
                    onMouseEnter={() => setHoveredCard({ deck: card.deck, idx: card.idx })}
                    onMouseLeave={() => setHoveredCard(null)}$1title={\`수입 카드 #\${card.idx + 1}`
);

// C. Hand cards (around line 3755)
// They have: 
// onMouseEnter={e => {
//   if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'var(--neon-cyan)';
// }}
// onMouseLeave={e => {
//   if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
// }}
text = text.replace(
  /onMouseEnter=\{e => \{\s*if \(\!isSelectingIncomeTuck\) e\.currentTarget\.style\.borderColor = 'var\(--neon-cyan\)';\s*\}\}\s*onMouseLeave=\{e => \{\s*if \(\!isSelectingIncomeTuck\) e\.currentTarget\.style\.borderColor = 'rgba\(255,255,255,0\.15\)';\s*\}\}/g,
  `onMouseEnter={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                      setHoveredCard({ deck: card.deck, idx: card.idx });
                    }}
                    onMouseLeave={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      setHoveredCard(null);
                    }}`
);

fs.writeFileSync(appFile, text);
console.log("Hover zoom added to App.jsx.");
