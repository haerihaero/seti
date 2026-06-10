const fs = require('fs');

const appCode = fs.readFileSync('src/App.jsx', 'utf8');
const lines = appCode.split('\n');

const injectStartIdx = lines.findIndex(l => l.includes('if (!grid[key] || grid[key].dial < space.dial) {'));
const injectEndIdx = lines.findIndex(l => l.includes('const launchProbe = () => {'));

if (injectStartIdx === -1 || injectEndIdx === -1) {
  console.log("Could not find boundaries!");
  process.exit(1);
}

const partA = lines.slice(0, injectStartIdx + 1).join('\n');
const partE = lines.slice(injectEndIdx).join('\n');

const partB = `         grid[key] = space;
      }
   });
   return Object.values(grid);
};

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [, forceUpdate] = useState({});

  const updateSpaceField = (id, field, value) => {
    const space = SPACES.find(s => s.id === id);
    if (space) {
      space[field] = value;
      forceUpdate({});
    }
  };
`;

const partC = fs.readFileSync('recover1.txt', 'utf8');
const partD = fs.readFileSync('recover2.txt', 'utf8');

const finalCode = partA + '\n' + partB + partC + '\n' + partD + '\n' + partE;

fs.writeFileSync('src/App.jsx', finalCode, 'utf8');
console.log("App.jsx restored successfully. Length: " + finalCode.length);
