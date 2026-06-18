import { SPACES, DEFAULT_SECTORS } from '../constants';
export const shouldShowDialSpaces = (dialNum, visibleDials) => {
  if (dialNum === 0) {
    return visibleDials.includes(0) && (visibleDials.length === 1 || visibleDials.length === 4);
  }
  return visibleDials.includes(dialNum);
};

export const getPhysicalSector = (space, ring1Angle, ring2Angle, ring3Angle) => {
   const angle = space.dial === 0 ? 0 : space.dial === 1 ? ring1Angle : space.dial === 2 ? ring2Angle : ring3Angle;
   const sectorsRotated = Math.round(angle / 45);
   return (space.initialSector + sectorsRotated + 8) % 8;
};

export const getAdjacentSpaces = (currentSpaceId, ring1Angle, ring2Angle, ring3Angle) => {
   const currentSpace = SPACES.find(s => s.id === currentSpaceId);
   if (!currentSpace) return [];
   
   const currentPhysical = getPhysicalSector(currentSpace, ring1Angle, ring2Angle, ring3Angle);
   const adjSpaces = [];
   
   SPACES.forEach(space => {
      if (space.id === currentSpaceId) return;
      const physical = getPhysicalSector(space, ring1Angle, ring2Angle, ring3Angle);
      
      // CW / CCW on same orbit (ring)
      if (space.ring === currentSpace.ring) {
         if (physical === (currentPhysical + 1) % 8 || physical === (currentPhysical + 7) % 8) {
            adjSpaces.push(space);
         }
      }
      
      // IN / OUT on adjacent orbits
      if (Math.abs(space.ring - currentSpace.ring) === 1) {
         if (physical === currentPhysical) {
            adjSpaces.push(space);
         }
      }
   });
   return adjSpaces;
};

export const findSpaceAtRingSector = (ring, initialSector) => {
  // Dial numbers mapping: Dial 1 -> Ring 1, Dial 2 -> Ring 2, Dial 3 -> Ring 3
  const dial = ring;
  let s = SPACES.find(sp => sp.dial === dial && sp.ring === ring && sp.initialSector === initialSector);
  if (!s) {
    s = SPACES.find(sp => sp.dial === 0 && sp.ring === ring && sp.initialSector === initialSector);
  }
  return s;
};

// Returns only the topmost spaces visible at any given ring/sector
export const getTopmostSpaces = (ring1Angle, ring2Angle, ring3Angle, visibleDials) => {
   const grid = {};
   SPACES.forEach(space => {
      if (visibleDials && !visibleDials.includes(space.dial)) return;
      const pSec = getPhysicalSector(space, ring1Angle, ring2Angle, ring3Angle);
      const key = `${space.ring}-${pSec}`;
      
      if (!grid[key] || space.dial > grid[key].maxDial) {
         grid[key] = { maxDial: space.dial, spaces: [space] };
      } else if (space.dial === grid[key].maxDial) {
         grid[key].spaces.push(space);
      }
   });
   return Object.values(grid).flatMap(g => g.spaces);
};


export const getWedgePath = (x, y, rIn, rOut, startAngle, endAngle) => {
  const startRad = startAngle * Math.PI / 180;
  const endRad = endAngle * Math.PI / 180;
  const p1 = { x: x + Math.cos(startRad)*rOut, y: y + Math.sin(startRad)*rOut };
  const p2 = { x: x + Math.cos(endRad)*rOut, y: y + Math.sin(endRad)*rOut };
  const p3 = { x: x + Math.cos(endRad)*rIn, y: y + Math.sin(endRad)*rIn };
  const p4 = { x: x + Math.cos(startRad)*rIn, y: y + Math.sin(startRad)*rIn };
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", p1.x, p1.y,
    "A", rOut, rOut, 0, largeArcFlag, 1, p2.x, p2.y,
    "L", p3.x, p3.y,
    "A", rIn, rIn, 0, largeArcFlag, 0, p4.x, p4.y,
    "Z"
  ].join(" ");
};

