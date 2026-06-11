const fs = require('fs');

const appFile = './src/App.jsx';
let content = fs.readFileSync(appFile, 'utf8');

const targetStr = '{/* Space Nodes */}';

if (content.includes(targetStr) && !content.includes('Space Wedges SVG Overlay')) {
  const svgInjection = `                           {/* Space Wedges SVG Overlay */}
                           <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 25, overflow: 'visible' }}>
                             {shouldShowDialSpaces(dialNum, visibleDials) && dialSpaces.map(space => {
                               const rIn = space.ring === 1 ? 8 : space.ring === 2 ? alignRing2Radius - 5 : alignRing3Radius - 6;
                               const rOut = space.ring === 1 ? alignRing1Radius + 5 : space.ring === 2 ? alignRing2Radius + 6 : alignRing3Radius + 6;
                               const angleDeg = space.angle + (space.angleOffset || 0);
                               const startAngle = angleDeg - 22.5;
                               const endAngle = angleDeg + 22.5;
                               const isHighlighted = adjSpaces.some(s => s.id === space.id);
                               
                               return (
                                 <path
                                   key={\`wedge-\${space.id}\`}
                                   d={getWedgePath(50, 50, rIn, rOut, startAngle, endAngle)}
                                   fill={isHighlighted ? 'rgba(0, 229, 255, 0.2)' : (space.type === 'hidden' ? 'transparent' : 'rgba(0, 0, 0, 0.4)')}
                                   stroke={isHighlighted ? '#fff' : space.color}
                                   strokeWidth={isHighlighted ? "0.6" : "0.3"}
                                   pointerEvents="auto"
                                   onClick={(e) => {
                                     if (isEditMode) {
                                       e.stopPropagation();
                                       setSelectedSpaceId(space.id);
                                       return;
                                     }
                                     if (isHighlighted) {
                                       e.stopPropagation();
                                       moveTo(selectedProbeId, space.id);
                                     }
                                   }}
                                   style={{
                                     cursor: isHighlighted || isEditMode ? 'pointer' : 'default',
                                     transition: 'all 0.3s',
                                     filter: isHighlighted ? \`drop-shadow(0 0 4px \${space.color})\` : 'none'
                                   }}
                                 >
                                   <title>{space.name || space.id}</title>
                                 </path>
                               );
                             })}
                           </svg>
                           
                           {/* Space Nodes */}`;
  content = content.replace(targetStr, svgInjection);
  fs.writeFileSync(appFile, content);
  console.log("Successfully patched App.jsx with wedges SVG");
} else {
  console.log("Could not find target string or SVG already injected.");
}
