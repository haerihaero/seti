const fs = require('fs');

const appFile = './src/App.jsx';
let content = fs.readFileSync(appFile, 'utf8');

// Use exact string replacement to avoid regex issues
content = content.replace(
  "aspectRatio: '1581/1183'",
  "width: '100%', aspectRatio: '473/220'"
);

// We need to find the tech slots array and modify it
// Let's replace the whole slot config loop inside the tech board
const oldLoopStart = `{Object.entries(TECH_SLOTS_CONFIG).map(([key, config]) => {
                const isActive = upgradedTechSlots[key];
                const hasToken = facedownRewards.some(r => r.key === key);
                
                return (
                  <div
                    key={key}`;

const newLoopStart = `{Object.entries(TECH_SLOTS_CONFIG).map(([key, config]) => {
                const isActive = upgradedTechSlots[key];
                const hasToken = facedownRewards.some(r => r.key === key);
                
                return (
                  <div
                    key={key}`;

const search1 = "backgroundColor: isActive ? config.color : 'transparent',";
const repl1 = "backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',";

const search2 = "border: isActive \n                        ? '1.5px solid #ffeb3b' \n                        : hasToken \n                          ? '1.5px dashed var(--neon-green)' \n                          : '1px dashed rgba(255,255,255,0.15)',";
const repl2 = "border: isActive ? '2px solid #ffeb3b' : hasToken ? '2px dashed var(--neon-green)' : '1px solid transparent',";

const search3 = "boxShadow: isActive \n                        ? '0 0 6px #ffeb3b, inset 0 0 4px rgba(0,0,0,0.5)' \n                        : hasToken \n                          ? '0 0 8px rgba(57, 255, 20, 0.4)' \n                          : 'none',";
const repl3 = "boxShadow: isActive ? '0 0 10px #ffeb3b, inset 0 0 10px rgba(0,229,255,0.5)' : hasToken ? '0 0 8px rgba(57, 255, 20, 0.4)' : 'none',";

const search4 = "color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'rgba(255,255,255,0.25)',";
const repl4 = "color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'transparent',";

const search5 = "{config.label}";
const repl5 = "{isActive ? '✓' : (hasToken ? '장착 대기' : '')}";

// Let's just do a blanket regex replacement but catch whitespace
content = content.replace(/backgroundColor:\s*isActive\s*\?\s*config\.color\s*:\s*'transparent',/g, repl1);
content = content.replace(/border:\s*isActive[\s\S]*?\?\s*'1\.5px solid #ffeb3b'[\s\S]*?:\s*hasToken[\s\S]*?\?\s*'1\.5px dashed var\(--neon-green\)'[\s\S]*?:\s*'1px dashed rgba\(255,255,255,0\.15\)',/g, repl2);
content = content.replace(/boxShadow:\s*isActive[\s\S]*?\?\s*'0 0 6px #ffeb3b, inset 0 0 4px rgba\(0,0,0,0\.5\)'[\s\S]*?:\s*hasToken[\s\S]*?\?\s*'0 0 8px rgba\(57, 255, 20, 0\.4\)'[\s\S]*?:\s*'none',/g, repl3);
content = content.replace(/color:\s*isActive\s*\?\s*'white'\s*:\s*hasToken\s*\?\s*'var\(--neon-green\)'\s*:\s*'rgba\(255,255,255,0\.25\)',/g, repl4);

// For {config.label}, we only want to replace it inside the tech board slots
let techBoardIdx = content.indexOf('Technology Board');
if (techBoardIdx > -1) {
  let nextConfigLabel = content.indexOf('{config.label}', techBoardIdx);
  if (nextConfigLabel > -1) {
    content = content.substring(0, nextConfigLabel) + repl5 + content.substring(nextConfigLabel + "{config.label}".length);
  }
}

fs.writeFileSync(appFile, content);
console.log("Patched App.jsx!");
