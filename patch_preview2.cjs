const fs = require('fs');
const appFile = './src/App.jsx';
let lines = fs.readFileSync(appFile, 'utf8').split(/\r?\n/);

const injection = `      {/* Huge Hovered Card Preview */}
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
      </AnimatePresence>`;

// Insert before the last 3 lines
lines.splice(lines.length - 3, 0, injection);

fs.writeFileSync(appFile, lines.join('\n'));
console.log("Injected huge preview container.");
