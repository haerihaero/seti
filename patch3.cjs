const fs = require('fs');

const appFile = './src/App.jsx';
const lines = fs.readFileSync(appFile, 'utf8').split('\n');

let insideTechSlotsMap = false;

for (let i = 0; i < lines.length; i++) {
  // 1. Fix Aspect Ratio for Tech Board Wrapper
  if (lines[i].includes("aspectRatio: '1581/1183',") && lines[i-1].includes("height: '100%',") && lines[i-2].includes("position: 'relative',") && lines[i+2].includes("<img")) {
    lines[i] = "              width: '100%', aspectRatio: '473/220',";
  }

  // 2. Hide Borders/Backgrounds for Empty Slots
  if (lines[i].includes("Object.entries(TECH_SLOTS_CONFIG).map")) {
    insideTechSlotsMap = true;
  }
  
  if (insideTechSlotsMap && lines[i].includes("</button>")) {
    // We exited the area, wait, there's no button in the slots config map...
    // Actually the slots config map ends around the computer data sockets
  }
  if (insideTechSlotsMap && lines[i].includes("Render 6 computer data sockets")) {
    insideTechSlotsMap = false;
  }

  if (insideTechSlotsMap) {
    if (lines[i].includes("backgroundColor: isActive ? config.color : 'transparent',")) {
      lines[i] = "                      backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',";
    }
    if (lines[i].includes("border: isActive")) {
      // It spans multiple lines, so we replace the next 4 lines
      if (lines[i+1].includes("? '1.5px solid #ffeb3b'") && lines[i+4].includes(": '1px dashed rgba(255,255,255,0.15)',")) {
        lines[i] = "                      border: isActive ? '2px solid #ffeb3b' : hasToken ? '2px dashed var(--neon-green)' : '1px solid transparent',";
        lines[i+1] = "";
        lines[i+2] = "";
        lines[i+3] = "";
        lines[i+4] = "";
      }
    }
    if (lines[i].includes("boxShadow: isActive")) {
      if (lines[i+1].includes("? '0 0 6px #ffeb3b, inset 0 0 4px rgba(0,0,0,0.5)'") && lines[i+4].includes(": 'none',")) {
        lines[i] = "                      boxShadow: isActive ? '0 0 10px #ffeb3b, inset 0 0 10px rgba(0,229,255,0.5)' : hasToken ? '0 0 8px rgba(57, 255, 20, 0.4)' : 'none',";
        lines[i+1] = "";
        lines[i+2] = "";
        lines[i+3] = "";
        lines[i+4] = "";
      }
    }
    if (lines[i].includes("color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'rgba(255,255,255,0.25)',")) {
      lines[i] = "                      color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'transparent',";
    }
    if (lines[i].includes("{config.label}")) {
      lines[i] = "                      {isActive ? '✓' : (hasToken ? '장착 대기' : '')}";
    }
  }
}

// Remove empty lines created by multi-line replacements
const newContent = lines.filter(l => l !== "").join('\n');
fs.writeFileSync(appFile, newContent);
console.log("Patched App.jsx accurately by line matching!");
