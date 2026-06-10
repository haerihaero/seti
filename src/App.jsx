import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, 
  ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText
} from 'lucide-react';

// Reconstructed image URLs from CSV
const IMAGES = {
  mainBoard: 'https://steamusercontent-a.akamaihd.net/ugc/10758507460286351143/217C6D026D7A234880280031D2AB1FB628159C0A/',
  border: 'https://steamusercontent-a.akamaihd.net/ugc/44573776976171558/ECFE22414BBFA1AEA40BBAA144764970B287886B/',
  ring1: 'https://steamusercontent-a.akamaihd.net/ugc/44573776976190891/84552BDC8D1EFE1560C9166B08DF51627A7CA0A4/',
  ring2: 'https://steamusercontent-a.akamaihd.net/ugc/44573776976198358/73D540401C8684DE6B7E0FF1859FC87A765E38EE/',
  ring3: 'https://steamusercontent-a.akamaihd.net/ugc/44573776976200261/CB4E26AED01CB89883AC6B52FFB079ECAB3F71F0/',
  playerBoard: 'https://steamusercontent-a.akamaihd.net/ugc/44575044588596358/74943C0459A01837C88F55DE5C3F331817BB26D6/',
  startMarker: 'https://steamusercontent-a.akamaihd.net/ugc/11922044724187866/0F9C6F1F04ADC7C0A536A64D8576D98561A4E119/',
  passMarker: 'https://steamusercontent-a.akamaihd.net/ugc/11922044724184366/8F8335452732DCBEF4E465D0A5A2269692AACD31/',
  deck1: 'https://steamusercontent-a.akamaihd.net/ugc/2918016258649837/AD031D1FB5D442B64635646318A5A67D9BD1E3F5/',
  deck2: 'https://steamusercontent-a.akamaihd.net/ugc/2918016258620792/F8C6D09C8B4613D622BD2D964A010672B4F0910F/',
  deck3: 'https://steamusercontent-a.akamaihd.net/ugc/2918016258650094/AF95B3A0E263C973605653DF7BB9EF00D57E0111/',
  playerCardNew: 'https://steamusercontent-a.akamaihd.net/ugc/44574410596490910/926D8D970E3B1CC84CB6624A4A7408B994CBB68A/',
  alienHiddenBoard: 'https://steamusercontent-a.akamaihd.net/ugc/11921410605496773/B37E584FA5A524411127A7475422886381CAF840/'
};

import imgMainBoard from './img/cropped_세티본판.png';
import imgTopBoard from './img/cropped_세티상단.png';
import imgBottomBoard from './img/cropped_세티하단.png';
import imgTechBoard from './img/기술판.png';
import imgAlienBoard from './img/alien.png';
import imgAlienRevealed from './img/alien_revealed.png';

const DEFAULT_SECTORS = [
  { id: 'proxima', name: 'PROXIMA CENTAURI', color: 'rgba(255, 60, 60, 0.12)', glow: 'rgba(255, 60, 60, 0.8)', bonus: '명성 +1, 데이터 +1', dataTokensRequired: 6 },
  { id: 'kepler', name: 'KEPLER 22', color: 'rgba(30, 144, 255, 0.12)', glow: 'rgba(30, 144, 255, 0.8)', bonus: '크레딧 +2', dataTokensRequired: 6 },
  { id: 'barnard', name: 'BARNARD\'S STAR', color: 'rgba(255, 140, 0, 0.12)', glow: 'rgba(255, 140, 0, 0.8)', bonus: '에너지 +2', dataTokensRequired: 5 },
  { id: 'virginis', name: '61 VIRGINIS', color: 'rgba(139, 69, 19, 0.12)', glow: 'rgba(139, 69, 19, 0.8)', bonus: '데이터 +2', dataTokensRequired: 5 },
  { id: 'beta_pictoris', name: 'BETA PICTORIS', color: 'rgba(148, 0, 211, 0.12)', glow: 'rgba(148, 0, 211, 0.8)', bonus: '카드 1장', dataTokensRequired: 6 },
  { id: 'sirius', name: 'SIRIUS A', color: 'rgba(0, 255, 255, 0.12)', glow: 'rgba(0, 255, 255, 0.8)', bonus: '명성 +2', dataTokensRequired: 4 },
  { id: 'vega', name: 'VEGA', color: 'rgba(245, 245, 245, 0.12)', glow: 'rgba(245, 245, 245, 0.8)', bonus: '에너지 +1, 크레딧 +1', dataTokensRequired: 5 },
  { id: 'procyon', name: 'PROCYON', color: 'rgba(0, 250, 154, 0.12)', glow: 'rgba(0, 250, 154, 0.8)', bonus: '승점 +2', dataTokensRequired: 5 }
];

// Help text for each main action
const ACTION_DESCRIPTIONS = {
  launch: {
    title: '탐사선 발사 (Launch Probe)',
    cost: '크레딧 2',
    effect: '내 말(탐사선) 1개를 지구 칸에 배치합니다. 우주에 탐사선은 최대 1개만 있을 수 있습니다.'
  },
  orbit: {
    title: '행성 궤도 탐사 (Orbit)',
    cost: '크레딧 1 + 에너지 1',
    effect: '행성에 위치한 탐사선을 궤도선으로 변환하고 해당 행성의 궤도 보너스를 즉시 획득합니다. 첫 궤도선이라면 3점을 얻습니다.'
  },
  land: {
    title: '행성 착륙 (Land)',
    cost: '에너지 3 (궤도선 존재시 2)',
    effect: '행성에 위치한 탐사선을 착륙선으로 변환하고 행성 중앙의 보너스 및 점수를 얻습니다. 첫 착륙시 데이터도 획득합니다.'
  },
  scan: {
    title: '근거리 항성 스캔 (Scan)',
    cost: '크레딧 1 + 에너지 2',
    effect: '구역에 신호 마커를 배치해 데이터를 획득하고 외계 생명체의 흔적을 찾습니다.'
  },
  analyze: {
    title: '데이터 분석 (Analyze Data)',
    cost: '에너지 1',
    effect: '컴퓨터의 윗줄 6칸이 데이터로 가득 찼을 때 분석하여, 외계 생명체 발견 칸에 마커를 배치합니다.'
  }
};

const TECH_SLOTS_CONFIG = {
  launch: { label: '발사', coords: { left: '15%', top: '32%' }, color: '#ff7043', name: '우주선 발사 업그레이드' },
  scan: { label: '이동/스캔', coords: { left: '28%', top: '32%' }, color: '#ffa726', name: '탐사선 이동/스캔 업그레이드' },
  probe: { label: '탐사선', coords: { left: '41%', top: '32%' }, color: '#ffb74d', name: '탐사선 업그레이드' },
  base: { label: '기지', coords: { left: '54%', top: '32%' }, color: '#ffa726', name: '기지 건설 업그레이드' },
  landing: { label: '위성착륙', coords: { left: '67%', top: '32%' }, color: '#e64a19', name: '위성 착륙 업그레이드' },
  tempSlot: { label: '임시', coords: { left: '80%', top: '32%' }, color: '#388e3c', name: '임시 업그레이드' },
  sigEarth: { label: '신호지구', coords: { left: '20%', top: '55%' }, color: '#ba68c8', name: '신호 지구 업그레이드' },
  sigMercury: { label: '신호수성', coords: { left: '35%', top: '55%' }, color: '#ba68c8', name: '신호 수성 업그레이드' },
  sigHand: { label: '신호카드', coords: { left: '50%', top: '55%' }, color: '#ba68c8', name: '신호 카드 업그레이드' },
  sigSat: { label: '신호위성', coords: { left: '65%', top: '55%' }, color: '#ba68c8', name: '신호 위성 업그레이드' },
  sigSat2: { label: '신호위성2', coords: { left: '80%', top: '55%' }, color: '#ba68c8', name: '신호 위성 2 업그레이드' },
  blue1: { label: '연구 1', coords: { left: '35%', top: '80%' }, color: '#29b6f6', name: '청색 연구 1 업그레이드' },
  blue2: { label: '연구 2', coords: { left: '50%', top: '80%' }, color: '#29b6f6', name: '청색 연구 2 업그레이드' },
  blue3: { label: '연구 3', coords: { left: '65%', top: '80%' }, color: '#29b6f6', name: '청색 연구 3 업그레이드' }
};

let SPACES = [
  // BASE BOARD (Dial 0 - Static)
  { id: 'b_r2_0', dial: 0, ring: 2, initialSector: 0, type: 'normal', color: 'black', angle: 0, angleOffset: 0 },
  { id: 'b_r2_1', dial: 0, ring: 2, initialSector: 1, type: 'normal', color: 'black', angle: 45, angleOffset: 15 },
  { id: 'b_r2_2', dial: 0, ring: 2, initialSector: 2, type: 'asteroid', color: 'red', angle: 90, angleOffset: 30 },
  { id: 'b_r2_3', dial: 0, ring: 2, initialSector: 3, type: 'normal', color: 'black', angle: 135, angleOffset: 0 },
  { id: 'b_r2_4', dial: 0, ring: 2, initialSector: 4, type: 'asteroid', color: 'red', angle: 180, angleOffset: 0 },
  { id: 'b_r2_5', dial: 0, ring: 2, initialSector: 5, type: 'asteroid', color: 'red', angle: 225, angleOffset: 0 },
  { id: 'b_r2_6', dial: 0, ring: 2, initialSector: 6, type: 'normal', color: 'black', angle: 270, angleOffset: 10 },
  { id: 'b_r2_7', dial: 0, ring: 2, initialSector: 7, type: 'asteroid', color: 'red', angle: 315, angleOffset: 0 },

  { id: 'b_r3_0', dial: 0, ring: 3, initialSector: 0, type: 'normal', color: 'black', angle: 0, angleOffset: 15 },
  { id: 'b_r3_1', dial: 0, ring: 3, initialSector: 1, type: 'normal', color: 'black', angle: 45, angleOffset: 0 },
  { id: 'neptune', dial: 0, ring: 3, initialSector: 2, type: 'normal', color: 'black', angle: 90, angleOffset: -5 },
  { id: 'b_r3_3', dial: 0, ring: 3, initialSector: 3, type: 'normal', color: 'black', angle: 135, angleOffset: 0 },
  { id: 'b_r3_4', dial: 0, ring: 3, initialSector: 4, type: 'normal', color: 'black', angle: 180, angleOffset: 0 },
  { id: 'b_r3_5', dial: 0, ring: 3, initialSector: 5, type: 'asteroid', color: 'red', angle: 225, angleOffset: 0 },
  { id: 'b_r3_6', dial: 0, ring: 3, initialSector: 6, type: 'normal', color: 'black', angle: 270, angleOffset: -5 },
  { id: 'b_r3_7', dial: 0, ring: 3, initialSector: 7, type: 'normal', color: 'black', angle: 315, angleOffset: 5 },

  // DIAL 1 (Inner, Yellow) 
  { id: 'earth', dial: 1, ring: 3, initialSector: 7, type: 'earth', color: 'orange', angle: 315, angleOffset: 35, radiusOffset: -10 },
  { id: 'venus', dial: 1, ring: 2, initialSector: 5, type: 'mic', color: 'var(--neon-green)', angle: 225, angleOffset: -15, radiusOffset: 5 },
  { id: 'mercury', dial: 1, ring: 2, initialSector: 3, type: 'mic', color: 'var(--neon-green)', angle: 135, angleOffset: 115, radiusOffset: 5 },
  { id: 'd1_empty_45', dial: 1, ring: 2, initialSector: 1, type: 'normal', color: 'black', angle: 45, angleOffset: -15 },

  // DIAL 2 (Middle, Red)
  { id: 'mars', dial: 2, ring: 2, initialSector: 5, type: 'mic', color: 'var(--neon-green)', angle: 225, angleOffset: -30, radiusOffset: 5 },
  { id: 'd2_r2_ast_1', dial: 2, ring: 2, initialSector: 3, type: 'asteroid', color: 'red', angle: 135, angleOffset: 0 },
  { id: 'd2_r2_ast_2', dial: 2, ring: 2, initialSector: 7, type: 'asteroid', color: 'red', angle: 315, angleOffset: 0 },

  // DIAL 3 (Outer, Blue)
  { id: 'comet', dial: 3, ring: 1, initialSector: 6, type: 'mic', color: 'var(--neon-green)', angle: 270, angleOffset: -160, radiusOffset: -5 },
  { id: 'jupiter', dial: 3, ring: 3, initialSector: 1, type: 'mic', color: 'var(--neon-green)', angle: 45, angleOffset: -85, radiusOffset: 5 },
  { id: 'saturn', dial: 3, ring: 3, initialSector: 4, type: 'mic', color: 'var(--neon-green)', angle: 180, angleOffset: -5, radiusOffset: 5 },
  { id: 'uranus', dial: 3, ring: 3, initialSector: 7, type: 'normal', color: 'black', angle: 315, angleOffset: 90, radiusOffset: 5 },
];

const getPhysicalSector = (space, ring1Angle, ring2Angle, ring3Angle) => {
   const angle = space.dial === 0 ? 0 : space.dial === 1 ? ring1Angle : space.dial === 2 ? ring2Angle : ring3Angle;
   const sectorsRotated = Math.round(angle / 45);
   return (space.initialSector + sectorsRotated + 8) % 8;
};

const getAdjacentSpaces = (currentSpaceId, ring1Angle, ring2Angle, ring3Angle) => {
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

const findSpaceAtRingSector = (ring, initialSector) => {
  // Dial numbers mapping: Dial 1 -> Ring 1, Dial 2 -> Ring 2, Dial 3 -> Ring 3
  const dial = ring;
  let s = SPACES.find(sp => sp.dial === dial && sp.ring === ring && sp.initialSector === initialSector);
  if (!s) {
    s = SPACES.find(sp => sp.dial === 0 && sp.ring === ring && sp.initialSector === initialSector);
  }
  return s;
};

// Returns only the topmost spaces visible at any given ring/sector
const getTopmostSpaces = (ring1Angle, ring2Angle, ring3Angle) => {
   const grid = {};
   SPACES.forEach(space => {
      const pSec = getPhysicalSector(space, ring1Angle, ring2Angle, ring3Angle);
      const key = `${space.ring}-${pSec}`;
      if (!grid[key] || grid[key].dial < space.dial) {
         grid[key] = space;
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
  // 4-Player Master State
  const [playersData, setPlayersData] = useState({
    1: { credits: 4, energy: 3, prestige: 4, score: 1, dataCount: 0, tuckedCards: [], facedownRewards: [], probePosition: 'earth', upgradedTechSlots: {
      launch: false, scan: false, probe: false, base: false, landing: false, tempSlot: false,
      sigEarth: false, sigMercury: false, sigHand: false, sigSat: false, sigSat2: false,
      blue1: false, blue2: false, blue3: false
    }, hand: [
      { deck: 'deck1', idx: 0, title: '시작 카드 1' },
      { deck: 'deck1', idx: 12, title: '시작 카드 2' },
      { deck: 'deck1', idx: 24, title: '시작 카드 3' }
    ] },
    2: { credits: 4, energy: 3, prestige: 4, score: 1, dataCount: 0, tuckedCards: [], facedownRewards: [], probePosition: null, upgradedTechSlots: {
      launch: false, scan: false, probe: false, base: false, landing: false, tempSlot: false,
      sigEarth: false, sigMercury: false, sigHand: false, sigSat: false, sigSat2: false,
      blue1: false, blue2: false, blue3: false
    }, hand: [] },
    3: { credits: 4, energy: 3, prestige: 4, score: 1, dataCount: 0, tuckedCards: [], facedownRewards: [], probePosition: null, upgradedTechSlots: {
      launch: false, scan: false, probe: false, base: false, landing: false, tempSlot: false,
      sigEarth: false, sigMercury: false, sigHand: false, sigSat: false, sigSat2: false,
      blue1: false, blue2: false, blue3: false
    }, hand: [] },
    4: { credits: 4, energy: 3, prestige: 4, score: 1, dataCount: 0, tuckedCards: [], facedownRewards: [], probePosition: null, upgradedTechSlots: {
      launch: false, scan: false, probe: false, base: false, landing: false, tempSlot: false,
      sigEarth: false, sigMercury: false, sigHand: false, sigSat: false, sigSat2: false,
      blue1: false, blue2: false, blue3: false
    }, hand: [] }
  });

  const [activePlayerId, setActivePlayerId] = useState(1);

  // Derived states for active player
  const activePlayer = playersData[activePlayerId] || playersData[1];
  const credits = activePlayer.credits;
  const energy = activePlayer.energy;
  const prestige = activePlayer.prestige;
  const score = activePlayer.score;
  const dataCount = activePlayer.dataCount;
  const tuckedCards = activePlayer.tuckedCards;
  const hand = activePlayer.hand;
  const facedownRewards = activePlayer.facedownRewards;
  const upgradedTechSlots = activePlayer.upgradedTechSlots;
  const probePosition = activePlayer.probePosition;

  // Custom setters for backwards compatibility
  const setCredits = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], credits: typeof val === 'function' ? val(p[activePlayerId].credits) : val }
  }));
  const setEnergy = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], energy: typeof val === 'function' ? val(p[activePlayerId].energy) : val }
  }));
  const setPrestige = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], prestige: typeof val === 'function' ? val(p[activePlayerId].prestige) : val }
  }));
  const setScore = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], score: typeof val === 'function' ? val(p[activePlayerId].score) : val }
  }));
  const setDataCount = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], dataCount: typeof val === 'function' ? val(p[activePlayerId].dataCount) : val }
  }));
  const setTuckedCards = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], tuckedCards: typeof val === 'function' ? val(p[activePlayerId].tuckedCards) : val }
  }));
  const setHand = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], hand: typeof val === 'function' ? val(p[activePlayerId].hand) : val }
  }));
  const setFacedownRewards = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], facedownRewards: typeof val === 'function' ? val(p[activePlayerId].facedownRewards) : val }
  }));
  const setUpgradedTechSlots = (val) => setPlayersData(p => ({
    ...p,
    [activePlayerId]: { ...p[activePlayerId], upgradedTechSlots: typeof val === 'function' ? val(p[activePlayerId].upgradedTechSlots) : val }
  }));

  // Signal marker token states
  const [signalTokens, setSignalTokens] = useState({
    proxima: [],
    kepler: [],
    barnard: [],
    virginis: [],
    beta_pictoris: [],
    sirius: [],
    vega: [],
    procyon: []
  });
  const [activeSectorPopup, setActiveSectorPopup] = useState(null);

  const [round, setRound] = useState(1);
  const [orbitStep, setOrbitStep] = useState(0); // 0 = standby, 1 = ring1, 2 = ring1+2, 3 = ring1+2+3
  const [sectors, setSectors] = useState(DEFAULT_SECTORS);
  const [shuffledQuadrants, setShuffledQuadrants] = useState([0, 1, 2, 3]);
  const [jupiterSlots, setJupiterSlots] = useState([
    { id: 'jup_orbit', name: '목성 궤도 진입점', type: 'orbit', score: 3, energyCost: 1, creditsCost: 1, probeId: null, color: 'var(--neon-green)', label: 'O' },
    { id: 'jup_core', name: '목성 대기/본체 내부', type: 'land', score: 7, energyCost: 2, creditsCost: 0, probeId: null, color: 'var(--neon-gold)', label: 'L' },
    { id: 'io_slot', name: '위성 이오 (IO)', type: 'land', score: 10, energyCost: 4, creditsCost: 0, probeId: null, color: 'var(--neon-magenta)', label: 'L' },
    { id: 'europa_slot', name: '위성 유로파 (EUROPA)', type: 'land', score: 7, energyCost: 2, creditsCost: 0, probeId: null, color: 'var(--neon-cyan)', label: 'L' },
    { id: 'ganymede_slot', name: '위성 가니메데 (GANYMEDE)', type: 'land', score: 12, energyCost: 5, creditsCost: 0, probeId: null, color: 'var(--neon-magenta)', label: 'L' },
    { id: 'callisto_slot', name: '위성 칼리스토 (CALLISTO)', type: 'land', score: 13, energyCost: 4, creditsCost: 0, probeId: null, color: 'var(--neon-cyan)', label: 'L' }
  ]);

  // Ring angles (0-360 deg)
  const [ring1Angle, setRing1Angle] = useState(0);
  const [ring2Angle, setRing2Angle] = useState(0);
  const [ring3Angle, setRing3Angle] = useState(0);

  // Probe positions
  const [probes, setProbes] = useState([
    { id: 1, type: 'probe', spaceId: 'earth', playerId: 1 }
  ]);

  const [isSelectingIncomeTuck, setIsSelectingIncomeTuck] = useState(false);

  const getCardIncome = (deck, idx) => {
    const credits = (idx % 3) + 1; // 1 to 3
    const energy = ((idx + 1) % 2) + 1; // 1 to 2
    const data = (idx % 2); // 0 to 1
    return { credits, energy, data };
  };

  const triggerIncreaseIncome = () => {
    if (isSelectingIncomeTuck) {
      setIsSelectingIncomeTuck(false);
      return;
    }
    if (hand.length === 0) {
      alert("수입으로 꽂을 카드가 손패에 없습니다! 카드를 드로우하세요.");
      return;
    }
    setIsSelectingIncomeTuck(true);
  };

  const tuckCardForIncome = (cardIndex) => {
    const card = hand[cardIndex];
    setTuckedCards(prev => [...prev, card]);
    setHand(prev => prev.filter((_, i) => i !== cardIndex));
    setIsSelectingIncomeTuck(false);
    const income = getCardIncome(card.deck, card.idx);
    alert(`[${card.title || '카드 ' + (card.idx + 1)}] 카드를 수입으로 꽂았습니다!\n+${income.credits} CR, +${income.energy} EN, +${income.data} DATA`);
    // update players data
    setPlayersData(prev => {
      const pData = prev[activePlayerId || 1] || prev[1];
      return {
        ...prev,
        [activePlayerId || 1]: {
          ...pData,
          credits: Math.min(10, (pData.credits || 0) + income.credits),
          energy: Math.min(10, (pData.energy || 0) + income.energy),
          dataCount: (pData.dataCount || 0) + income.data
        }
      };
    });
  };

  const moveTo = (probeId, targetSpaceId) => {
    let cost = 1;
    const targetSpace = SPACES.find(s => s.id === targetSpaceId);
    if (targetSpace && targetSpace.type === 'deep_space') cost += 1;
    if (targetSpace && targetSpace.type === 'gas_giant') cost += 2;

    if (activeMovementPoints < cost) {
      alert(`필요 이동력: ${cost} MP, 현재 남은 이동력: ${activeMovementPoints} MP\n이동력이 부족합니다.`);
      return;
    }

    // Check microphone prestige reward (Ring 1: 6, 7 | Ring 3: 1, 3, 5, 7)
    if (targetSpace) {
      const targetPhysical = getPhysicalSector(targetSpace, ring1Angle, ring2Angle, ring3Angle);
      const isMicrophone = (targetSpace.ring === 1 && (targetPhysical === 6 || targetPhysical === 7)) || 
                           (targetSpace.ring === 3 && (targetPhysical === 1 || targetPhysical === 3 || targetPhysical === 5 || targetPhysical === 7));
      
      if (isMicrophone) {
        setPlayersData(prev => {
          const pData = prev[playerId];
          const newPrestige = Math.min((pData.prestige || 0) + 1, 10);
          return {
            ...prev,
            [playerId]: { ...pData, prestige: newPrestige }
          };
        });
        alert(`[마이크 아이콘 진입] 플레이어 P${playerId}의 명성이 1 증가했습니다!`);
      }
    }

    // Deduct movement points
    if (activeMovementPoints > 0) {
      setActiveMovementPoints(prev => Math.max(prev - cost, 0));
    }

    setProbes(prev => prev.map(p => {
      if (p.id !== probeId) return p;
      return { ...p, spaceId: targetSpaceId };
    }));
    
    setSelectedProbeId(null);
  };

  // Convert probe to orbiter or lander
  const upgradeProbe = (probeId, type) => {
    setProbes(prev => prev.map(p => {
      if (p.id !== probeId) return p;
      return { ...p, type };
    }));
  };
  const handleCardClick = (cardIndex) => {
    if (isSelectingIncomeTuck) {
      tuckCardForIncome(cardIndex);
    } else {
      playCard(cardIndex);
    }
  };

  // Card deck catalog explorer
  const [selectedDeck, setSelectedDeck] = useState('deck1');
  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'cards' | 'help'
  const [rightBoardTab, setRightBoardTab] = useState('top'); // 'top' | 'bottom'

  const [alignMode, setAlignMode] = useState(false);
  const [alignDialStep, setAlignDialStep] = useState(0); // Active dial step for coordinate adjustment (0=공전 1, 1=공전 2, 2=공전 3)
  const [alignX, setAlignX] = useState(50.0); // Center of the main board horizontally
  const [alignY, setAlignY] = useState(50.0); // Center of the main board vertically
  const [alignScale, setAlignScale] = useState(44.0); // Scale of the solar system rings
  const [alignRingOffset, setAlignRingOffset] = useState(-90); // Rotation offset
  const [alignRing1Radius, setAlignRing1Radius] = useState(22.0); // Orbit 1 radius
  const [alignRing2Radius, setAlignRing2Radius] = useState(32.0); // Orbit 2 radius
  const [alignRing3Radius, setAlignRing3Radius] = useState(44.0); // Orbit 3 radius
  const [alignDial1Scale, setAlignDial1Scale] = useState(39.3); // Dial 1 image scale
  const [alignDial2Scale, setAlignDial2Scale] = useState(60.3); // Dial 2 image scale
  const [alignDial3Scale, setAlignDial3Scale] = useState(100.0); // Dial 3 image scale
  
  // Dial alignment for orbit tracker on the bottom board
  const [alignDialX, setAlignDialX] = useState(27.5);
  const [alignDialY, setAlignDialY] = useState(50.0);
  const [alignDialScale, setAlignDialScale] = useState(22.0);
  const [dialCoords, setDialCoords] = useState({
    0: { x: 54, y: 90 }, // 공전 1 (6시)
    1: { x: 82, y: 42 }, // 공전 2 (2시)
    2: { x: 18, y: 66 }  // 공전 3 (9시)
  });

  // Outer Border alignment (Kepler, Vega, Proxima, etc.)
  const [alignBorderX, setAlignBorderX] = useState(50.7); // Center of the outer border horizontally
  const [alignBorderY, setAlignBorderY] = useState(50.0); // Center of the outer border vertically
  const [alignBorderScale, setAlignBorderScale] = useState(76.7); // Scale of the outer border ring

  // Alien Board alignment coordinates
  const [alienLeftX, setAlienLeftX] = useState(34.5);
  const [alienLeftY, setAlienLeftY] = useState(96.0);
  const [alienLeftScale, setAlienLeftScale] = useState(21.5);
  const [alienRightX, setAlienRightX] = useState(72.3);
  const [alienRightY, setAlienRightY] = useState(96.0);
  const [alienRightScale, setAlienRightScale] = useState(21.5);

  // Top/Bottom Board layout aspect ratio & image scale states
  const [topBoardWidthRatio, setTopBoardWidthRatio] = useState(0.98);
  const [topBoardImgHeight, setTopBoardImgHeight] = useState(63);
  const [bottomBoardWidthRatio, setBottomBoardWidthRatio] = useState(1.906);

  // Alien Board track slots & reveal states
  const [leftAlienTrack, setLeftAlienTrack] = useState([null, null, null]);
  const [rightAlienTrack, setRightAlienTrack] = useState([null, null, null]);
  const [leftAlienManualReveal, setLeftAlienManualReveal] = useState(false);
  const [rightAlienManualReveal, setRightAlienManualReveal] = useState(false);

  // Sector data tokens state mapping sector ID to count of tokens
  const [sectorDataTokens, setSectorDataTokens] = useState({
    proxima: 6,
    kepler: 6,
    barnard: 5,
    virginis: 6,
    beta_pictoris: 5,
    sirius: 5,
    vega: 4,
    procyon: 5
  });

  // Active temporary movement points for probe actions
  const [activeMovementPoints, setActiveMovementPoints] = useState(0);

  // Selected probe on board for highlighting adjacent movements
  const [selectedProbeId, setSelectedProbeId] = useState(null);

  const isLeftAlienTrackFilled = leftAlienTrack.every(slot => slot !== null);
  const isLeftAlienRevealed = leftAlienManualReveal || isLeftAlienTrackFilled;

  const isRightAlienTrackFilled = rightAlienTrack.every(slot => slot !== null);
  const isRightAlienRevealed = rightAlienManualReveal || isRightAlienTrackFilled;

  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [zoomImage, setZoomImage] = useState(null); // null | { src: string, title: string }

  const [activeActionInfo, setActiveActionInfo] = useState(null);

  // Technology tokens state
  const [bottomBoardTokens, setBottomBoardTokens] = useState({
    orange1: { id: 'orange1', name: '우주선 발사 업그레이드', category: 'orange', slotIndex: 0, count: 2, vp: 2, key: 'launch' },
    orange2: { id: 'orange2', name: '탐사선 이동/스캔 업그레이드', category: 'orange', slotIndex: 1, count: 2, vp: 2, key: 'scan' },
    orange3: { id: 'orange3', name: '기지 건설 업그레이드', category: 'orange', slotIndex: 2, count: 2, vp: 2, key: 'base' },
    orange4: { id: 'orange4', name: '위성 착륙 업그레이드', category: 'orange', slotIndex: 3, count: 2, vp: 3, key: 'landing' },
    
    purple1: { id: 'purple1', name: '신호 지구 업그레이드', category: 'purple', slotIndex: 0, count: 2, vp: 2, key: 'sigEarth' },
    purple2: { id: 'purple2', name: '신호 수성 업그레이드', category: 'purple', slotIndex: 1, count: 2, vp: 2, key: 'sigMercury' },
    purple3: { id: 'purple3', name: '신호 카드 업그레이드', category: 'purple', slotIndex: 2, count: 2, vp: 2, key: 'sigHand' },
    purple4: { id: 'purple4', name: '신호 위성 업그레이드', category: 'purple', slotIndex: 3, count: 2, vp: 2, key: 'sigSat' },
    
    blue1: { id: 'blue1', name: '청색 연구 1 업그레이드', category: 'blue', slotIndex: 0, count: 2, vp: 2, key: 'blue1' },
    blue2: { id: 'blue2', name: '청색 연구 2 업그레이드', category: 'blue', slotIndex: 1, count: 2, vp: 2, key: 'blue2' },
    blue3: { id: 'blue3', name: '청색 연구 3 업그레이드', category: 'blue', slotIndex: 2, count: 2, vp: 2, key: 'blue3' },
    blue4: { id: 'blue4', name: '청색 연구 4 업그레이드', category: 'blue', slotIndex: 3, count: 2, vp: 2, key: 'blue4' }
  });
  // Technology tokens functions
  const takeTechToken = (tokenId) => {
    const token = bottomBoardTokens[tokenId];
    if (!token) return;
    if (token.count <= 0) {
      alert("이 슬롯에는 더 이상 기술 토큰이 없습니다!");
      return;
    }

    setBottomBoardTokens(prev => ({
      ...prev,
      [tokenId]: { ...prev[tokenId], count: prev[tokenId].count - 1 }
    }));

    const newReward = {
      id: `${tokenId}_${Date.now()}`,
      tokenId: token.id,
      name: token.name,
      category: token.category,
      slotIndex: token.slotIndex,
      vp: token.vp,
      key: token.key,
      faceUp: false
    };

    setFacedownRewards(prev => [...prev, newReward]);
    alert(`하단 보드에서 [${token.name}] 토큰을 가져왔습니다! (개인 보드의 뒷면 보상 인벤토리에 추가되었습니다. 승점: ${token.vp}점)`);
  };

  const upgradeTechSlot = (rewardId) => {
    const reward = facedownRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (upgradedTechSlots[reward.key]) {
      alert(`이미 개인 기술판의 해당 슬롯(${reward.name})이 업그레이드되어 있습니다!`);
      return;
    }

    setUpgradedTechSlots(prev => ({
      ...prev,
      [reward.key]: true
    }));

    setFacedownRewards(prev => prev.filter(r => r.id !== rewardId));
    alert(`[${reward.name}] 토큰을 앞면으로 돌려 개인 기술판의 슬롯에 장착했습니다! 해당 행동이 업그레이드되었습니다.`);
  };

  const downgradeTechSlot = (key) => {
    const tokenData = Object.values(bottomBoardTokens).find(t => t.key === key);
    if (!tokenData) return;

    setUpgradedTechSlots(prev => ({
      ...prev,
      [key]: false
    }));

    const newReward = {
      id: `${tokenData.id}_${Date.now()}`,
      tokenId: tokenData.id,
      name: tokenData.name,
      category: tokenData.category,
      slotIndex: tokenData.slotIndex,
      vp: tokenData.vp,
      key: tokenData.key,
      faceUp: false
    };

    setFacedownRewards(prev => [...prev, newReward]);
    alert(`개인 기술판에서 [${tokenData.name}] 토큰을 해제하여 뒷면 보상 인벤토리로 되돌렸습니다.`);
  };

  const handleSlotClick = (key) => {
    if (upgradedTechSlots[key]) {
      downgradeTechSlot(key);
    } else {
      const reward = facedownRewards.find(r => r.key === key);
      if (reward) {
        upgradeTechSlot(reward.id);
      } else {
        const tokenNameMap = {
          launch: '우주선 발사 업그레이드',
          scan: '탐사선 이동/스캔 업그레이드',
          base: '기지 건설 업그레이드',
          landing: '위성 착륙 업그레이드',
          sigEarth: '신호 지구 업그레이드',
          sigMercury: '신호 수성 업그레이드',
          sigHand: '신호 카드 업그레이드',
          sigSat: '신호 위성 업그레이드',
          blue1: '청색 연구 1 업그레이드',
          blue2: '청색 연구 2 업그레이드',
          blue3: '청색 연구 3 업그레이드'
        };
        alert(`장착할 수 있는 [${tokenNameMap[key] || key}] 토큰이 없습니다!\\n하단 공전 보드에서 먼저 해당 기술 토큰을 획득하세요.`);
      }
    }
  };

  // ResizeObserver hook
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const mainBoardWidth = Math.min(width - 40, 720); 
        setBoardSize({ width: mainBoardWidth, height: mainBoardWidth });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeTab]);

  // Trigger Solar System Orbit
  const triggerOrbit = () => {
    const nextStep = (orbitStep + 1) % 3;
    let newRing1Angle = ring1Angle;
    let newRing2Angle = ring2Angle;
    let newRing3Angle = ring3Angle;

    if (nextStep === 1) {
      // Moving to Orbit 2: Rotate Ring 1
      newRing1Angle = ring1Angle - 45;
    } else if (nextStep === 2) {
      // Moving to Orbit 3: Rotate Rings 1+2
      newRing1Angle = ring1Angle - 45;
      newRing2Angle = ring2Angle - 45;
    } else if (nextStep === 0) {
      // Moving to Orbit 1 of the next round: Rotate Rings 1+2+3, and advance round
      newRing1Angle = ring1Angle - 45;
      newRing2Angle = ring2Angle - 45;
      newRing3Angle = ring3Angle - 45;
    }

    // Check for rotating rings and has probes
    const ring1Rotated = newRing1Angle !== ring1Angle;
    const ring2Rotated = newRing2Angle !== ring2Angle;

    const ring1ProbesCount = probes.filter(p => {
      const s = SPACES.find(sp => sp.id === p.spaceId);
      return s && s.ring === 1;
    }).length;
    const ring2ProbesCount = probes.filter(p => {
      const s = SPACES.find(sp => sp.id === p.spaceId);
      return s && s.ring === 2;
    }).length;

    if ((ring1Rotated && ring1ProbesCount > 0) || (ring2Rotated && ring2ProbesCount > 0)) {
      setProbes(prev => prev.map(p => {
        const s = SPACES.find(sp => sp.id === p.spaceId);
        if (s && s.ring === 1 && ring1Rotated) {
          const diff = newRing1Angle - newRing2Angle;
          const steps = Math.round(diff / 45);
          const newSector = ((s.initialSector + steps) % 8 + 8) % 8;
          const targetSpace = findSpaceAtRingSector(2, newSector);
          if (targetSpace) return { ...p, spaceId: targetSpace.id };
        }
        if (s && s.ring === 2 && ring2Rotated) {
          const diff = newRing2Angle - newRing3Angle;
          const steps = Math.round(diff / 45);
          const newSector = ((s.initialSector + steps) % 8 + 8) % 8;
          const targetSpace = findSpaceAtRingSector(3, newSector);
          if (targetSpace) return { ...p, spaceId: targetSpace.id };
        }
        return p;
      }));

      let alertMsgs = [];
      if (ring1Rotated && ring1ProbesCount > 0) {
        alertMsgs.push(`1번 궤도 ➡️ 2번 궤도 (${ring1ProbesCount}개)`);
      }
      if (ring2Rotated && ring2ProbesCount > 0) {
        alertMsgs.push(`2번 궤도 ➡️ 3번 궤도 (${ring2ProbesCount}개)`);
      }
      alert(`[공전 물리 작용] 원판 회전으로 인해 탐사선이 외곽 궤도로 밀려났습니다:\n${alertMsgs.join('\n')}`);
    }

    setRing1Angle(newRing1Angle);
    setRing2Angle(newRing2Angle);
    setRing3Angle(newRing3Angle);
    setOrbitStep(nextStep);
    
    if (nextStep === 0) {
      setRound(r => Math.min(r + 1, 5));
    }
    setScore(s => s + 1); // VP gain for active player

    // Process income from tucked cards for ALL players on orbit dial progression
    setPlayersData(prev => {
      const updated = { ...prev };
      let alertedAny = false;
      let msg = "공전 제어로 라운드가 진행되며 플레이어들의 수입을 정산했습니다:\n";
      
      [1, 2, 3, 4].forEach(pid => {
        const p = updated[pid];
        if (p.tuckedCards && p.tuckedCards.length > 0) {
          let addedCredits = 0;
          let addedEnergy = 0;
          let addedData = 0;
          p.tuckedCards.forEach(card => {
            const income = getCardIncome(card.deck, card.idx);
            addedCredits += income.credits;
            addedEnergy += income.energy;
            addedData += income.data;
          });
          
          updated[pid] = {
            ...p,
            credits: Math.min(p.credits + addedCredits, 10),
            energy: Math.min(p.energy + addedEnergy, 10),
            dataCount: Math.min(p.dataCount + addedData, 6)
          };
          msg += `- 플레이어 ${pid}: 크레딧 +${addedCredits}, 에너지 +${addedEnergy}, 데이터 +${addedData}\n`;
          alertedAny = true;
        }
      });
      
      if (alertedAny) {
        alert(msg);
      }
      return updated;
    });
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const randomizeSectors = () => {
    setSectors(shuffleArray(DEFAULT_SECTORS));
    setShuffledQuadrants(shuffleArray([0, 1, 2, 3]));
  };

  // Auto-load saved state on startup
  React.useEffect(() => {
    const saved = localStorage.getItem('seti_game_state_v3') || localStorage.getItem('seti_game_state_v2');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.ring1Angle !== undefined) setRing1Angle(state.ring1Angle);
        if (state.ring2Angle !== undefined) setRing2Angle(state.ring2Angle);
        if (state.ring3Angle !== undefined) setRing3Angle(state.ring3Angle);
        if (state.orbitStep !== undefined) setOrbitStep(state.orbitStep);
        if (state.sectors !== undefined) setSectors(state.sectors);
        if (state.shuffledQuadrants !== undefined) setShuffledQuadrants(state.shuffledQuadrants);
        
        if (state.alignX !== undefined) setAlignX(state.alignX);
        if (state.alignY !== undefined) setAlignY(state.alignY);
        if (state.alignScale !== undefined) setAlignScale(state.alignScale);
        if (state.alignRingOffset !== undefined) setAlignRingOffset(state.alignRingOffset);
        if (state.alignRing1Radius !== undefined) setAlignRing1Radius(parseFloat(state.alignRing1Radius));
        if (state.alignRing2Radius !== undefined) setAlignRing2Radius(parseFloat(state.alignRing2Radius));
        if (state.alignRing3Radius !== undefined) setAlignRing3Radius(parseFloat(state.alignRing3Radius));
        if (state.alignDial1Scale !== undefined) setAlignDial1Scale(parseFloat(state.alignDial1Scale));
        if (state.alignDial2Scale !== undefined) setAlignDial2Scale(parseFloat(state.alignDial2Scale));
        if (state.alignDial3Scale !== undefined) setAlignDial3Scale(parseFloat(state.alignDial3Scale));
        if (state.alignDialX !== undefined) setAlignDialX(state.alignDialX);
        if (state.alignDialY !== undefined) setAlignDialY(state.alignDialY);
        if (state.alignDialScale !== undefined) setAlignDialScale(state.alignDialScale);
        if (state.dialCoords !== undefined) setDialCoords(state.dialCoords);
        if (state.alignBorderX !== undefined) setAlignBorderX(state.alignBorderX);
        if (state.alignBorderY !== undefined) setAlignBorderY(state.alignBorderY);
        if (state.alignBorderScale !== undefined) setAlignBorderScale(state.alignBorderScale);

        if (state.alienLeftX !== undefined) setAlienLeftX(parseFloat(state.alienLeftX));
        if (state.alienLeftY !== undefined) setAlienLeftY(parseFloat(state.alienLeftY));
        if (state.alienLeftScale !== undefined) setAlienLeftScale(parseFloat(state.alienLeftScale));
        if (state.alienRightX !== undefined) setAlienRightX(parseFloat(state.alienRightX));
        if (state.alienRightY !== undefined) setAlienRightY(parseFloat(state.alienRightY));
        if (state.alienRightScale !== undefined) setAlienRightScale(parseFloat(state.alienRightScale));

        if (state.topBoardWidthRatio !== undefined) setTopBoardWidthRatio(parseFloat(state.topBoardWidthRatio));
        if (state.topBoardImgHeight !== undefined) setTopBoardImgHeight(parseInt(state.topBoardImgHeight));
        if (state.bottomBoardWidthRatio !== undefined) setBottomBoardWidthRatio(parseFloat(state.bottomBoardWidthRatio));
        
        if (state.leftAlienTrack !== undefined) setLeftAlienTrack(state.leftAlienTrack);
        if (state.rightAlienTrack !== undefined) setRightAlienTrack(state.rightAlienTrack);
        if (state.leftAlienManualReveal !== undefined) setLeftAlienManualReveal(state.leftAlienManualReveal);
        if (state.rightAlienManualReveal !== undefined) setRightAlienManualReveal(state.rightAlienManualReveal);
        if (state.sectorDataTokens !== undefined) setSectorDataTokens(state.sectorDataTokens);
        if (state.activeMovementPoints !== undefined) setActiveMovementPoints(state.activeMovementPoints);
        
        if (state.playersData !== undefined) {
          setPlayersData(state.playersData);
        } else {
          // Fallback for older saves
          setPlayersData(prev => ({
            ...prev,
            1: {
              credits: state.credits !== undefined ? state.credits : prev[1].credits,
              energy: state.energy !== undefined ? state.energy : prev[1].energy,
              prestige: state.prestige !== undefined ? state.prestige : prev[1].prestige,
              score: state.score !== undefined ? state.score : prev[1].score,
              dataCount: state.dataCount !== undefined ? state.dataCount : prev[1].dataCount,
              tuckedCards: state.tuckedCards !== undefined ? state.tuckedCards : prev[1].tuckedCards,
              facedownRewards: state.facedownRewards !== undefined ? state.facedownRewards : prev[1].facedownRewards,
              upgradedTechSlots: state.upgradedTechSlots !== undefined ? state.upgradedTechSlots : prev[1].upgradedTechSlots,
              hand: state.hand !== undefined ? state.hand : prev[1].hand
            }
          }));
        }

        if (state.activePlayerId !== undefined) setActivePlayerId(state.activePlayerId);
        if (state.signalTokens !== undefined) setSignalTokens(state.signalTokens);
        
        if (state.round !== undefined) setRound(state.round);
        if (state.probes !== undefined) setProbes(state.probes);
        if (state.jupiterSlots !== undefined) setJupiterSlots(state.jupiterSlots);
        if (state.bottomBoardTokens !== undefined) setBottomBoardTokens(state.bottomBoardTokens);
        
        if (state.savedTime !== undefined) {
          setLastSavedTime(state.savedTime);
        } else {
          setLastSavedTime("자동로드");
        }
      } catch (e) {
        console.error("Auto-load failed", e);
      }
    }
  }, []);

  const saveGameState = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const gameState = {
      ring1Angle,
      ring2Angle,
      ring3Angle,
      orbitStep,
      sectors,
      shuffledQuadrants,
      alignX,
      alignY,
      alignScale,
      alignRingOffset,
      alignRing1Radius,
      alignRing2Radius,
      alignRing3Radius,
      alignDial1Scale,
      alignDial2Scale,
      alignDial3Scale,
      alignDialX,
      alignDialY,
      alignDialScale,
      dialCoords,
      alignBorderX,
      alignBorderY,
      alignBorderScale,
      alienLeftX,
      alienLeftY,
      alienLeftScale,
      alienRightX,
      alienRightY,
      alienRightScale,
      topBoardWidthRatio,
      topBoardImgHeight,
      bottomBoardWidthRatio,
      leftAlienTrack,
      rightAlienTrack,
      leftAlienManualReveal,
      rightAlienManualReveal,
      sectorDataTokens,
      activeMovementPoints,
      playersData,
      activePlayerId,
      signalTokens,
      round,
      probes,
      jupiterSlots,
      bottomBoardTokens,
      savedTime: timeStr
    };
    localStorage.setItem('seti_game_state_v3', JSON.stringify(gameState));
    setLastSavedTime(timeStr);
    alert("현재 원판 위치, 공전토큰 위치, 구역판 및 게임 상태가 저장되었습니다!");
  };

  const loadGameState = () => {
    const saved = localStorage.getItem('seti_game_state_v3');
    if (!saved) {
      alert("저장된 데이터가 없습니다!");
      return;
    }
    try {
      const state = JSON.parse(saved);
      if (state.ring1Angle !== undefined) setRing1Angle(state.ring1Angle);
      if (state.ring2Angle !== undefined) setRing2Angle(state.ring2Angle);
      if (state.ring3Angle !== undefined) setRing3Angle(state.ring3Angle);
      if (state.orbitStep !== undefined) setOrbitStep(state.orbitStep);
      if (state.sectors !== undefined) setSectors(state.sectors);
      if (state.shuffledQuadrants !== undefined) setShuffledQuadrants(state.shuffledQuadrants);
      
      if (state.alignX !== undefined) setAlignX(state.alignX);
      if (state.alignY !== undefined) setAlignY(state.alignY);
      if (state.alignScale !== undefined) setAlignScale(state.alignScale);
      if (state.alignRingOffset !== undefined) setAlignRingOffset(state.alignRingOffset);
      if (state.alignRing1Radius !== undefined) setAlignRing1Radius(parseFloat(state.alignRing1Radius));
      if (state.alignRing2Radius !== undefined) setAlignRing2Radius(parseFloat(state.alignRing2Radius));
      if (state.alignRing3Radius !== undefined) setAlignRing3Radius(parseFloat(state.alignRing3Radius));
      if (state.alignDial1Scale !== undefined) setAlignDial1Scale(parseFloat(state.alignDial1Scale));
      if (state.alignDial2Scale !== undefined) setAlignDial2Scale(parseFloat(state.alignDial2Scale));
      if (state.alignDial3Scale !== undefined) setAlignDial3Scale(parseFloat(state.alignDial3Scale));
      if (state.alignDialX !== undefined) setAlignDialX(state.alignDialX);
      if (state.alignDialY !== undefined) setAlignDialY(state.alignDialY);
      if (state.alignDialScale !== undefined) setAlignDialScale(state.alignDialScale);
      if (state.dialCoords !== undefined) setDialCoords(state.dialCoords);
      if (state.alignBorderX !== undefined) setAlignBorderX(state.alignBorderX);
      if (state.alignBorderY !== undefined) setAlignBorderY(state.alignBorderY);
      if (state.alignBorderScale !== undefined) setAlignBorderScale(state.alignBorderScale);

      if (state.alienLeftX !== undefined) setAlienLeftX(parseFloat(state.alienLeftX));
      if (state.alienLeftY !== undefined) setAlienLeftY(parseFloat(state.alienLeftY));
      if (state.alienLeftScale !== undefined) setAlienLeftScale(parseFloat(state.alienLeftScale));
      if (state.alienRightX !== undefined) setAlienRightX(parseFloat(state.alienRightX));
      if (state.alienRightY !== undefined) setAlienRightY(parseFloat(state.alienRightY));
      if (state.alienRightScale !== undefined) setAlienRightScale(parseFloat(state.alienRightScale));

      if (state.topBoardWidthRatio !== undefined) setTopBoardWidthRatio(parseFloat(state.topBoardWidthRatio));
      if (state.topBoardImgHeight !== undefined) setTopBoardImgHeight(parseInt(state.topBoardImgHeight));
      if (state.bottomBoardWidthRatio !== undefined) setBottomBoardWidthRatio(parseFloat(state.bottomBoardWidthRatio));

      if (state.leftAlienTrack !== undefined) setLeftAlienTrack(state.leftAlienTrack);
      if (state.rightAlienTrack !== undefined) setRightAlienTrack(state.rightAlienTrack);
      if (state.leftAlienManualReveal !== undefined) setLeftAlienManualReveal(state.leftAlienManualReveal);
      if (state.rightAlienManualReveal !== undefined) setRightAlienManualReveal(state.rightAlienManualReveal);
      if (state.sectorDataTokens !== undefined) setSectorDataTokens(state.sectorDataTokens);
      if (state.activeMovementPoints !== undefined) setActiveMovementPoints(state.activeMovementPoints);
      
      if (state.playersData !== undefined) {
        setPlayersData(state.playersData);
      } else {
        // Fallback for older saves
        setPlayersData(prev => ({
          ...prev,
          1: {
            credits: state.credits !== undefined ? state.credits : prev[1].credits,
            energy: state.energy !== undefined ? state.energy : prev[1].energy,
            prestige: state.prestige !== undefined ? state.prestige : prev[1].prestige,
            score: state.score !== undefined ? state.score : prev[1].score,
            dataCount: state.dataCount !== undefined ? state.dataCount : prev[1].dataCount,
            tuckedCards: state.tuckedCards !== undefined ? state.tuckedCards : prev[1].tuckedCards,
            facedownRewards: state.facedownRewards !== undefined ? state.facedownRewards : prev[1].facedownRewards,
            upgradedTechSlots: state.upgradedTechSlots !== undefined ? state.upgradedTechSlots : prev[1].upgradedTechSlots,
            hand: state.hand !== undefined ? state.hand : prev[1].hand
          }
        }));
      }

      if (state.activePlayerId !== undefined) setActivePlayerId(state.activePlayerId);
      if (state.signalTokens !== undefined) setSignalTokens(state.signalTokens);
      
      if (state.round !== undefined) setRound(state.round);
      if (state.probes !== undefined) setProbes(state.probes);
      if (state.jupiterSlots !== undefined) setJupiterSlots(state.jupiterSlots);
      if (state.bottomBoardTokens !== undefined) setBottomBoardTokens(state.bottomBoardTokens);
      
      if (state.savedTime !== undefined) {
        setLastSavedTime(state.savedTime);
      } else {
        setLastSavedTime("로드됨");
      }
      
      alert("저장된 게임판 배치 상태를 정상적으로 불러왔습니다!");
    } catch (e) {
      alert("로딩 중 오류가 발생했습니다: " + e.message);
    }
  };

  const joinJupiterSlot = (slotId, probeId) => {
    // Check satellite landing permission (Io, Europa, Ganymede, Callisto)
    const satelliteSlotIds = ['io_slot', 'europa_slot', 'ganymede_slot', 'callisto_slot'];
    if (satelliteSlotIds.includes(slotId) && !upgradedTechSlots.landing) {
      alert("위성 착륙 권한이 없습니다! 개인 기술판에 [위성 착륙 업그레이드] 토큰을 장착해야 이 위성에 착륙이 가능합니다. (네 번째 이미지처럼 기술판에 토큰을 올려놓으세요.)");
      return;
    }

    const slot = jupiterSlots.find(s => s.id === slotId);
    if (!slot) return;
    
    if (slot.probeId !== null) {
      alert("이미 다른 탐사선이 배치되어 있는 슬롯입니다!");
      return;
    }
    
    const probe = probes.find(p => p.id === probeId);
    if (!probe) return;
    
    if (slot.type === 'orbit' && probe.type !== 'orbiter') {
      alert("이 슬롯에는 궤도선(O)만 진입할 수 있습니다! 탐사선을 궤도선으로 변환해 주세요.");
      return;
    }
    if (slot.type === 'land' && probe.type !== 'lander') {
      alert("이 슬롯에는 착륙선(L)만 진입할 수 있습니다! 탐사선을 착륙선으로 변환해 주세요.");
      return;
    }
    
    if (credits < slot.creditsCost || energy < slot.energyCost) {
      alert(`자원이 부족합니다! 필요 자원 - 크레딧: ${slot.creditsCost}, 에너지: ${slot.energyCost}`);
      return;
    }
    
    setCredits(c => c - slot.creditsCost);
    setEnergy(e => e - slot.energyCost);
    setScore(s => s + slot.score);
    
    setJupiterSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, probeId: probeId };
      }
      return s;
    }));
    
    setProbes(prev => prev.map(p => {
      if (p.id === probeId) {
        return { ...p, ring: 'jupiter', sector: slotId };
      }
      return p;
    }));
  };

  const recallFromJupiter = (slotId) => {
    const slot = jupiterSlots.find(s => s.id === slotId);
    if (!slot || slot.probeId === null) return;
    
    const pid = slot.probeId;
    
    setJupiterSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, probeId: null };
      }
      return s;
    }));
    
    setProbes(prev => prev.map(p => {
      if (p.id === pid) {
        return { ...p, spaceId: 'earth', ring: undefined, sector: undefined };
      }
      return p;
    }));
  };

  const toggleSignalToken = (sectorId, playerId) => {
    if (!sectorId) return;

    let isScannedNow = false;
    setSignalTokens(prev => {
      const current = prev[sectorId] || [];
      const isAlreadyScanned = current.includes(playerId);
      isScannedNow = !isAlreadyScanned;
      
      let next = [];
      if (isAlreadyScanned) {
        next = current.filter(id => id !== playerId);
      } else {
        next = [...current, playerId];
      }

      return {
        ...prev,
        [sectorId]: next
      };
    });

    // Handle token adjustments outside target state update to prevent React loop warnings
    if (isScannedNow) {
      setSectorDataTokens(dt => {
        const currentDT = dt[sectorId] || 0;
        if (currentDT > 0) {
          setPlayersData(prevPlayers => ({
            ...prevPlayers,
            [playerId]: { ...prevPlayers[playerId], dataCount: Math.min(prevPlayers[playerId].dataCount + 1, 6) }
          }));
          return {
            ...dt,
            [sectorId]: currentDT - 1
          };
        }
        return dt;
      });

      if (playerId === activePlayerId) {
        const sector = sectors.find(s => s.id === sectorId);
        if (sector) {
          applyScanBonus(sector);
        }
      }
    } else {
      setSectorDataTokens(dt => ({
        ...dt,
        [sectorId]: Math.min((dt[sectorId] || 0) + 1, 10)
      }));
      setPlayersData(prevPlayers => ({
        ...prevPlayers,
        [playerId]: { ...prevPlayers[playerId], dataCount: Math.max(prevPlayers[playerId].dataCount - 1, 0) }
      }));
    }
  };

  const cycleAlienTrackSlot = (side, index) => {
    const setTrack = side === 'left' ? setLeftAlienTrack : setRightAlienTrack;
    setTrack(prev => {
      const next = [...prev];
      const currentVal = next[index];
      let nextVal = null;
      if (currentVal === null) nextVal = 1;
      else if (currentVal === 1) nextVal = 2;
      else if (currentVal === 2) nextVal = 3;
      else if (currentVal === 3) nextVal = 4;
      else nextVal = null;
      next[index] = nextVal;
      return next;
    });
  };

  const applyScanBonus = (sector) => {
    const bonus = sector.bonus;
    if (!bonus) return;

    let rewardMsg = [];
    if (bonus.includes("명성 +1")) { setPrestige(p => Math.min(p + 1, 10)); rewardMsg.push("명성 +1"); }
    if (bonus.includes("명성 +2")) { setPrestige(p => Math.min(p + 2, 10)); rewardMsg.push("명성 +2"); }
    if (bonus.includes("데이터 +1")) { setDataCount(d => Math.min(d + 1, 6)); rewardMsg.push("데이터 +1"); }
    if (bonus.includes("데이터 +2")) { setDataCount(d => Math.min(d + 2, 6)); rewardMsg.push("데이터 +2"); }
    if (bonus.includes("크레딧 +1")) { setCredits(c => Math.min(c + 1, 10)); rewardMsg.push("크레딧 +1"); }
    if (bonus.includes("크레딧 +2")) { setCredits(c => Math.min(c + 2, 10)); rewardMsg.push("크레딧 +2"); }
    if (bonus.includes("에너지 +1")) { setEnergy(e => Math.min(e + 1, 10)); rewardMsg.push("에너지 +1"); }
    if (bonus.includes("에너지 +2")) { setEnergy(e => Math.min(e + 2, 10)); rewardMsg.push("에너지 +2"); }
    if (bonus.includes("승점 +2")) { setScore(s => s + 2); rewardMsg.push("승점 +2"); }
    if (bonus.includes("카드 1장")) { 
      addCardToHand('deck1', Math.floor(Math.random() * 20));
      rewardMsg.push("카드 1장 드로우");
    }

    alert(`[${sector.name}] 스캔 마커가 배치되었습니다!\n(보너스 획득 -> ${rewardMsg.join(', ')})`);
  };

  // Add Card to Hand from explorer
  const addCardToHand = (deck, idx) => {
    if (hand.length >= 8) {
      alert("핸드 제한은 라운드 종료시에만 4장이지만, 화면 크기를 위해 8장까지만 보관해둘 수 있습니다!");
      return;
    }
    setHand(prev => [...prev, { deck, idx, title: `카드 ${idx + 1}` }]);
  };

  // Play a card from hand
  const playCard = (cardIndex) => {
    const card = hand[cardIndex];
    setEnergy(e => Math.min(e + 1, 10));
    setCredits(c => Math.min(c + 1, 10));
    setScore(s => s + 2);
    setHand(prev => prev.filter((_, i) => i !== cardIndex));
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '16px', boxSizing: 'border-box', gap: '16px' }}>

      {/* Edit Mode Toggle & Panel */}
      <button 
        onClick={() => setIsEditMode(!isEditMode)}
        style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: isEditMode ? 'var(--neon-magenta)' : 'var(--neon-cyan)', color: '#000', fontWeight: 'bold', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isEditMode ? '⚙️ 편집 모드 종료 (콘솔 출력)' : '⚙️ 보드판 편집 모드'}
      </button>

      {isEditMode && (
        <div style={{ position: 'fixed', top: '50px', right: '10px', zIndex: 9999, background: 'rgba(0,0,0,0.9)', border: '1px solid var(--neon-magenta)', padding: '12px', borderRadius: '8px', color: 'white', width: '280px', fontSize: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '12px', borderBottom: '1px solid #555', paddingBottom: '12px' }}>
            <h4 style={{margin: '0 0 10px 0', color: 'var(--neon-magenta)'}}>새로운 칸(동그라미) 추가</h4>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
               <button onClick={() => addSpaceToRing(1)} style={{flex: 1, padding: '4px', background: '#444', color: 'white', border: '1px solid #666', borderRadius: '4px'}}>1번 태양계</button>
               <button onClick={() => addSpaceToRing(2)} style={{flex: 1, padding: '4px', background: '#444', color: 'white', border: '1px solid #666', borderRadius: '4px'}}>2번 태양계</button>
               <button onClick={() => addSpaceToRing(3)} style={{flex: 1, padding: '4px', background: '#444', color: 'white', border: '1px solid #666', borderRadius: '4px'}}>3번 태양계</button>
            </div>
          </div>

          {selectedSpaceId ? (
            <>
              <h4 style={{margin: '0 0 10px 0'}}>칸 편집: {selectedSpaceId}</h4>
              
              <label style={{display:'block', marginBottom:'4px'}}>행성 매핑 (상단 보드와 연동)</label>
              <select 
                value={SPACES.find(s=>s.id===selectedSpaceId)?.planet || 'none'} 
                onChange={(e) => updateSpaceField(selectedSpaceId, 'planet', e.target.value === 'none' ? undefined : e.target.value)}
                style={{width:'100%', marginBottom:'8px', background:'#333', color:'white'}}
              >
                <option value="none">없음 (일반 우주)</option>
                <option value="earth">지구 (Earth)</option>
                <option value="venus">금성 (Venus)</option>
                <option value="mercury">수성 (Mercury)</option>
                <option value="mars">화성 (Mars)</option>
                <option value="jupiter">목성 (Jupiter)</option>
                <option value="saturn">토성 (Saturn)</option>
                <option value="uranus">천왕성 (Uranus)</option>
                <option value="neptune">해왕성 (Neptune)</option>
              </select>

              <label style={{display:'block', marginBottom:'4px'}}>칸 종류 (type)</label>
              <select 
                value={SPACES.find(s=>s.id===selectedSpaceId)?.type || 'normal'} 
                onChange={(e) => {
                  const val = e.target.value;
                  updateSpaceField(selectedSpaceId, 'type', val);
                  updateSpaceField(selectedSpaceId, 'color', val === 'mic' ? 'var(--neon-green)' : val === 'asteroid' ? 'red' : 'black');
                }}
                style={{width:'100%', marginBottom:'8px', background:'#333', color:'white'}}
              >
                <option value="normal">일반 이동칸 (검은색)</option>
                <option value="mic">명성칸 (녹색)</option>
                <option value="asteroid">소행성칸 (적색)</option>
              </select>

              <label>각도 변경 (위치 수정): {SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0}</label>
              <input type="range" min="-180" max="180" step="0.5" value={SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0} onChange={(e) => updateSpaceField(selectedSpaceId, 'angleOffset', parseFloat(e.target.value))} style={{width: '100%', marginBottom:'8px'}} />
              
              <label>반지름 변경 (위치 수정): {SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0}%</label>
              <input type="range" min="-20" max="20" step="0.1" value={SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0} onChange={(e) => updateSpaceField(selectedSpaceId, 'radiusOffset', parseFloat(e.target.value))} style={{width: '100%', marginBottom:'8px'}} />
            </>
          ) : (
             <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                보드판에서 편집할 칸(원)을 클릭하거나, 상단의 버튼으로 새 칸을 추가하세요.
             </div>
          )}

          <button onClick={() => { console.log(JSON.stringify(SPACES, null, 2)); alert("전체 SPACES 설정이 브라우저 콘솔에 출력되었습니다!"); }} style={{width:'100%', padding:'8px', marginTop: '10px', background: 'var(--neon-gold)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px'}}>현재 설정 콘솔 출력 및 저장 대기</button>
        </div>
      )}
      
      {/* Top Header Cockpit */}
      <header className="glass-panel" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 229, 255, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Compass className="animate-spin-slow" style={{ color: 'var(--neon-cyan)', width: '28px', height: '28px' }} />
          <h1 className="title-sci-fi" style={{ margin: 0, fontSize: '28px' }}>SETI 웹 보드게임</h1>
          <span style={{ fontSize: '14px', background: 'rgba(0,229,255,0.1)', border: '1px solid var(--neon-cyan)', padding: '2px 8px', borderRadius: '4px', color: 'var(--neon-cyan)', marginLeft: '12px' }}>
            프로토타입 v1.0
          </span>
        </div>
        
        {/* Top Info display */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>라운드</div>
            <div style={{ fontSize: '20px', fontFamily: 'Orbitron', color: 'var(--neon-gold)', fontWeight: 'bold' }}>{round} / 5</div>
          </div>
          
          <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          
          {/* Active Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('board')} 
              className="neon-btn" 
              style={{ background: activeTab === 'board' ? 'var(--neon-cyan)' : 'transparent', color: activeTab === 'board' ? '#060813' : 'var(--neon-cyan)', padding: '6px 12px', fontSize: '15px' }}
            >
              <Compass size={16} style={{ marginRight: '6px', display: 'inline' }} />
              태양계 보드
            </button>
            <button 
              onClick={() => setActiveTab('cards')} 
              className="neon-btn neon-btn-magenta" 
              style={{ background: activeTab === 'cards' ? 'var(--neon-magenta)' : 'transparent', color: activeTab === 'cards' ? '#060813' : 'var(--neon-magenta)', padding: '6px 12px', fontSize: '15px' }}
            >
              <FileText size={16} style={{ marginRight: '6px', display: 'inline' }} />
              전체 카드 목록
            </button>
            <button 
              onClick={() => setActiveTab('help')} 
              className="neon-btn neon-btn-gold" 
              style={{ background: activeTab === 'help' ? 'var(--neon-gold)' : 'transparent', color: activeTab === 'help' ? '#060813' : 'var(--neon-gold)', padding: '6px 12px', fontSize: '15px' }}
            >
              <HelpCircle size={16} style={{ marginRight: '6px', display: 'inline' }} />
              게임 규칙
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, gap: '16px', overflow: 'hidden', minHeight: 0 }}>
        
        {/* Left Side: Dynamic Board View */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', padding: '12px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--neon-cyan)' }} />
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>태양계 성간 관측소</span>
              <button 
                onClick={randomizeSectors}
                className="neon-btn neon-btn-magenta"
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  marginLeft: '12px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '24px'
                }}
              >
                <Sparkles size={11} />
                성간 지도 랜덤화
              </button>
              
              <button 
                onClick={saveGameState}
                className="neon-btn neon-btn-gold"
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  marginLeft: '6px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '24px'
                }}
              >
                배치 저장
              </button>
              <button 
                onClick={loadGameState}
                className="neon-btn"
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  marginLeft: '6px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '24px',
                  borderColor: 'var(--neon-cyan)',
                  color: 'var(--neon-cyan)'
                }}
              >
                배치 불러오기
              </button>
              {lastSavedTime && (
                <span style={{ 
                  fontSize: '10px', 
                  color: 'var(--neon-green)', 
                  background: 'rgba(57, 255, 20, 0.1)', 
                  border: '1px solid var(--neon-green)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '8px',
                  height: '24px',
                  boxSizing: 'border-box',
                  fontFamily: 'Orbitron',
                  textShadow: '0 0 5px var(--neon-green)'
                }}>
                  ● SAVED: {lastSavedTime}
                </span>
              )}
            </div>
            
            {/* Alignment Help Toggle */}
            <button 
              onClick={() => setAlignMode(!alignMode)}
              style={{
                background: alignMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 0, 127, 0.1)',
                border: '1px solid ' + (alignMode ? 'var(--neon-cyan)' : 'var(--neon-magenta)'),
                color: alignMode ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
                fontSize: '13px',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: alignMode ? '0 0 10px rgba(0, 229, 255, 0.3)' : '0 0 8px rgba(255, 0, 127, 0.2)',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              <Settings size={13} />
              {alignMode ? "정렬기 닫기" : "원판/외계인판 위치 조절"}
            </button>
          </div>

          {/* Real-time ring alignment controls */}
          {alignMode && (
            <div style={{
              position: 'absolute', top: '50px', left: '20px', zIndex: 100, 
              background: 'rgba(5, 10, 25, 0.95)', border: '1px solid var(--neon-cyan)',
              padding: '12px', borderRadius: '8px', width: '280px', fontSize: '13px',
              maxHeight: 'calc(100% - 70px)',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--neon-cyan)' }}>보드판 / 외계인판 정렬 도구</div>
              <div style={{ marginBottom: '6px' }}>
                <label>원판 가로 중심 (X): {alignX}%</label>
                <input type="range" min="10" max="90" step="0.1" value={alignX} onChange={e => setAlignX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>원판 세로 중심 (Y): {alignY}%</label>
                <input type="range" min="10" max="90" step="0.1" value={alignY} onChange={e => setAlignY(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>원판 크기 비율 (Scale): {alignScale}%</label>
                <input type="range" min="10" max="95" step="0.1" value={alignScale} onChange={e => setAlignScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>원판 회전 보정 (Offset): {alignRingOffset}도</label>
                <input type="range" min="-180" max="180" step="1" value={alignRingOffset} onChange={e => setAlignRingOffset(parseInt(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>원판 궤도 반지름 조절 (Orbit Radii)</div>
              <div style={{ marginBottom: '6px' }}>
                <label>1번 궤도 반지름 (Ring 1): {alignRing1Radius}%</label>
                <input type="range" min="10" max="60" step="0.5" value={alignRing1Radius} onChange={e => setAlignRing1Radius(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>2번 궤도 반지름 (Ring 2): {alignRing2Radius}%</label>
                <input type="range" min="15" max="70" step="0.5" value={alignRing2Radius} onChange={e => setAlignRing2Radius(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>3번 궤도 반지름 (Ring 3): {alignRing3Radius}%</label>
                <input type="range" min="20" max="90" step="0.5" value={alignRing3Radius} onChange={e => setAlignRing3Radius(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>원판 이미지 크기 조절 (Dial Image Scales)</div>
              <div style={{ marginBottom: '6px' }}>
                <label>1번 원판 크기 (Dial 1): {alignDial1Scale}%</label>
                <input type="range" min="10" max="150" step="0.5" value={alignDial1Scale} onChange={e => setAlignDial1Scale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>2번 원판 크기 (Dial 2): {alignDial2Scale}%</label>
                <input type="range" min="10" max="150" step="0.5" value={alignDial2Scale} onChange={e => setAlignDial2Scale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>3번 원판 크기 (Dial 3): {alignDial3Scale}%</label>
                <input type="range" min="10" max="150" step="0.5" value={alignDial3Scale} onChange={e => setAlignDial3Scale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>테두리판 정렬 도구</div>
              <div style={{ marginBottom: '6px' }}>
                <label>테두리 가로 중심 (X): {alignBorderX}%</label>
                <input type="range" min="10" max="90" step="0.1" value={alignBorderX} onChange={e => setAlignBorderX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>테두리 세로 중심 (Y): {alignBorderY}%</label>
                <input type="range" min="10" max="90" step="0.1" value={alignBorderY} onChange={e => setAlignBorderY(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>테두리 크기 비율 (Scale): {alignBorderScale}%</label>
                <input type="range" min="10" max="95" step="0.1" value={alignBorderScale} onChange={e => setAlignBorderScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ margin: '10px 0 5px 0', fontWeight: 'bold', color: 'var(--neon-magenta)' }}>공전 토큰 다이얼 정렬</div>
              <div style={{ marginBottom: '6px' }}>
                <label>다이얼 X: {alignDialX}%</label>
                <input type="range" min="50" max="100" step="0.1" value={alignDialX} onChange={e => setAlignDialX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>다이얼 Y: {alignDialY}%</label>
                <input type="range" min="50" max="100" step="0.1" value={alignDialY} onChange={e => setAlignDialY(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>다이얼 크기 (Scale): {alignDialScale}%</label>
                <input type="range" min="5" max="30" step="0.1" value={alignDialScale} onChange={e => setAlignDialScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              
              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-gold)' }}>
                단계별 공전마커 개별 정렬
              </div>
              
              {/* Step Tab selector */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[0, 1, 2].map((stepIdx) => {
                  const labels = ["공전 1", "공전 2", "공전 3"];
                  const isSelected = alignDialStep === stepIdx;
                  return (
                    <button
                      key={stepIdx}
                      onClick={() => {
                        setAlignDialStep(stepIdx);
                      }}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: '10px',
                        background: isSelected ? 'rgba(255, 170, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid ' + (isSelected ? 'var(--neon-gold)' : 'rgba(255,255,255,0.1)'),
                        color: isSelected ? 'var(--neon-gold)' : '#ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 'bold' : 'normal'
                      }}
                    >
                      {labels[stepIdx]}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginBottom: '6px' }}>
                <label>
                  {alignDialStep === 0 ? "공전 1 (1)" : alignDialStep === 1 ? "공전 2 (2)" : "공전 3 (3)"} X: {dialCoords[alignDialStep]?.x}%
                </label>
                <input 
                  type="range" min="0" max="100" step="0.5" 
                  value={dialCoords[alignDialStep]?.x || 50} 
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setDialCoords(prev => ({
                      ...prev,
                      [alignDialStep]: { ...prev[alignDialStep], x: val }
                    }));
                  }} 
                  style={{ width: '100%' }} 
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>
                  {alignDialStep === 0 ? "공전 1 (1)" : alignDialStep === 1 ? "공전 2 (2)" : "공전 3 (3)"} Y: {dialCoords[alignDialStep]?.y}%
                </label>
                <input 
                  type="range" min="0" max="100" step="0.5" 
                  value={dialCoords[alignDialStep]?.y || 50} 
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setDialCoords(prev => ({
                      ...prev,
                      [alignDialStep]: { ...prev[alignDialStep], y: val }
                    }));
                  }} 
                  style={{ width: '100%' }} 
                />
              </div>

              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-magenta)' }}>외계인 보드판 정렬 도구</div>
              <div style={{ marginBottom: '6px' }}>
                <label>왼쪽 외계인 가로 (X): {alienLeftX}%</label>
                <input type="range" min="0" max="100" step="0.1" value={alienLeftX} onChange={e => setAlienLeftX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>왼쪽 외계인 세로 (Y): {alienLeftY}%</label>
                <input type="range" min="-50" max="150" step="0.5" value={alienLeftY} onChange={e => setAlienLeftY(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>왼쪽 외계인 크기 (Scale): {alienLeftScale}%</label>
                <input type="range" min="10" max="40" step="0.1" value={alienLeftScale} onChange={e => setAlienLeftScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>오른쪽 외계인 가로 (X): {alienRightX}%</label>
                <input type="range" min="0" max="100" step="0.1" value={alienRightX} onChange={e => setAlienRightX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>오른쪽 외계인 세로 (Y): {alienRightY}%</label>
                <input type="range" min="-50" max="150" step="0.5" value={alienRightY} onChange={e => setAlienRightY(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>오른쪽 외계인 크기 (Scale): {alienRightScale}%</label>
                <input type="range" min="10" max="40" step="0.1" value={alienRightScale} onChange={e => setAlienRightScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ margin: '10px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: 'var(--neon-green)' }}>상단/하단 보드 비율 및 크기 조절</div>
              <div style={{ marginBottom: '6px' }}>
                <label>상단 보드 가로 비율 (Aspect Ratio): {topBoardWidthRatio}</label>
                <input type="range" min="0.8" max="2.0" step="0.01" value={topBoardWidthRatio} onChange={e => setTopBoardWidthRatio(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>상단 보드 이미지 높이 (%): {topBoardImgHeight}%</label>
                <input type="range" min="50" max="100" step="1" value={topBoardImgHeight} onChange={e => setTopBoardImgHeight(parseInt(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label>하단 보드 가로 비율 (Aspect Ratio): {bottomBoardWidthRatio}</label>
                <input type="range" min="1.0" max="3.0" step="0.01" value={bottomBoardWidthRatio} onChange={e => setBottomBoardWidthRatio(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                중앙 태양계 보드 원판들과 상단 외계인 보드판이 배경에 잘 맞도록 정렬하는 도구입니다.
              </div>
              <button
                onClick={() => {
                  setAlignX(50.0);
                  setAlignY(50.0);
                  setAlignScale(44.0);
                  setAlignRingOffset(-90);
                  setAlignRing1Radius(22.0);
                  setAlignRing2Radius(32.0);
                  setAlignRing3Radius(44.0);
                  setAlignDial1Scale(39.3);
                  setAlignDial2Scale(60.3);
                  setAlignDial3Scale(100.0);
                  setAlignDialX(27.5);
                  setAlignDialY(50.0);
                  setAlignDialScale(22.0);
                  setDialCoords({
                    0: { x: 54, y: 90 }, // 공전 1 (6시)
                    1: { x: 82, y: 42 }, // 공전 2 (2시)
                    2: { x: 18, y: 66 }  // 공전 3 (9시)
                  });
                  setAlignBorderX(50.7);
                  setAlignBorderY(50.0);
                  setAlignBorderScale(76.7);
                  setAlienLeftX(34.5);
                  setAlienLeftY(96.0);
                  setAlienLeftScale(21.5);
                  setAlienRightX(72.3);
                  setAlienRightY(96.0);
                  setAlienRightScale(21.5);
                   setTopBoardWidthRatio(0.98);
                  setTopBoardImgHeight(63);
                  setBottomBoardWidthRatio(1.906);
                  setLeftAlienTrack([null, null, null]);
                  setRightAlienTrack([null, null, null]);
                  setLeftAlienManualReveal(false);
                  setRightAlienManualReveal(false);
                  setActiveMovementPoints(0);
                  setSectorDataTokens({
                    proxima: 6,
                    kepler: 6,
                    barnard: 5,
                    virginis: 6,
                    beta_pictoris: 5,
                    sirius: 5,
                    vega: 4,
                    procyon: 5
                  });
                }}
                className="neon-btn"
                style={{
                  width: '100%',
                  padding: '6px 0',
                  fontSize: '11px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  color: 'var(--neon-cyan)',
                  border: '1px solid var(--neon-cyan)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                정렬 값 기본값으로 초기화 (Reset)
              </button>
            </div>
          )}

          {activeTab === 'board' ? (
            <div ref={containerRef} style={{ 
              flex: 1, 
              position: 'relative', 
              background: '#020308', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}>
              
              {/* Left Column: Main Board (Forced perfect square) */}
              <div 
                onClick={() => setSelectedProbeId(null)}
                style={{
                  height: '100%',
                  aspectRatio: '1/1',
                  maxWidth: '55%',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#04060e',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                  boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)',
                  flexShrink: 0
                }}
              >
                {/* Title Header & Zoom Button */}
                <div style={{
                  position: 'absolute', top: '10px', left: '12px', zIndex: 10,
                  display: 'flex', gap: '6px', alignItems: 'center'
                }}>
                  <div style={{
                    background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--neon-cyan)',
                    padding: '3px 8px', borderRadius: '4px', color: 'var(--neon-cyan)',
                    fontSize: '11px', fontWeight: 'bold', fontFamily: 'Orbitron'
                  }}>
                    SETI MAIN BOARD (세티 본판)
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomImage({ src: imgMainBoard, title: '세티 본판 (Main Board)' });
                    }}
                    style={{
                      background: 'rgba(0, 229, 255, 0.15)',
                      border: '1px solid var(--neon-cyan)',
                      borderRadius: '4px',
                      color: 'var(--neon-cyan)',
                      padding: '3px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Orbitron',
                      textShadow: '0 0 5px var(--neon-cyan)',
                      boxShadow: '0 0 5px rgba(0, 229, 255, 0.2)'
                    }}
                  >
                    🔎 크게 보기
                  </button>
                </div>

                <img 
                  src={imgMainBoard} 
                  alt="Main Board"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                  filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.15))',
                    opacity: 0.85
                  }}
                />

                {/* Jupiter & Moons mini overview badge on the board */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  bottom: '20px',
                  background: 'rgba(5, 10, 25, 0.9)',
                  border: '1px solid var(--neon-gold)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  zIndex: 25,
                  fontSize: '12px',
                  fontFamily: 'Orbitron',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ color: 'var(--neon-gold)', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}>목성계 조인 현황</div>
                  {jupiterSlots.filter(s => s.probeId !== null).length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>조인된 탐사선 없음</div>
                  ) : (
                    jupiterSlots.filter(s => s.probeId !== null).map(s => (
                      <div key={s.id} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '10px' }}>
                        <span style={{ color: s.color }}>●</span>
                        <span>{s.name.split(' ')[0]}: P#{s.probeId}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Central Border Board containing the 4 quadrants and background sectors (Forced perfect square) */}
                <div style={{
                  position: 'absolute',
                  left: `${alignBorderX}%`,
                  top: `${alignBorderY}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${alignBorderScale}%`,
                  aspectRatio: '1/1',
                  height: 'auto',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 15,
                  pointerEvents: 'none'
                }}>
                  {/* Randomized Interstellar Sectors Background Glow */}
                  {sectors.map((sec, idx) => {
                    const rot = idx * 45;
                    return (
                      <div
                        key={sec.id}
                        style={{
                          position: 'absolute',
                          width: '200%',
                          height: '200%',
                          left: '-50%',
                          top: '-50%',
                          background: `radial-gradient(circle at 50% 50%, transparent 40%, ${sec.color} 53%, transparent 72%)`,
                          clipPath: 'polygon(50% 50%, 100% 29.3%, 100% 70.7%)',
                          transform: `rotate(${rot}deg)`,
                          transformOrigin: '50% 50%',
                          pointerEvents: 'none',
                          zIndex: 1,
                          opacity: 0.8,
                          transition: 'background 0.5s ease'
                        }}
                      />
                    );
                  })}

                  {/* Reconstructed Randomized Interstellar 4-Piece Ring Board */}
                  {[0, 1, 2, 3].map(i => {
                    const j = shuffledQuadrants[i];
                    const clips = [
                      'polygon(49.5% 50.5%, 100.5% 50.5%, 100.5% -0.5%, 49.5% -0.5%)',      // Quadrant 0 (Top-Right)
                      'polygon(49.5% 49.5%, 100.5% 49.5%, 100.5% 100.5%, 49.5% 100.5%)',  // Quadrant 1 (Bottom-Right)
                      'polygon(50.5% 49.5%, -0.5% 49.5%, -0.5% 100.5%, 50.5% 100.5%)',      // Quadrant 2 (Bottom-Left)
                      'polygon(50.5% 50.5%, -0.5% 50.5%, -0.5% -0.5%, 50.5% -0.5%)'           // Quadrant 3 (Top-Left)
                    ];
                    const angleDelta = (i - j) * 90;
                    return (
                      <img 
                        key={`ring-piece-${i}`}
                        src={IMAGES.border}
                        style={{
                          position: 'absolute',
                          width: '101%',
                          height: '101%',
                          zIndex: 13,
                          pointerEvents: 'none',
                          clipPath: clips[j],
                          transform: `rotate(${alignRingOffset + angleDelta}deg)`,
                          transformOrigin: '50% 50%',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                    );
                  })}

                  {/* Clickable Sector Target Zones & Signal Tokens Overlay */}
                  {sectors.map((sec, idx) => {
                    const angle = idx * 45 + alignRingOffset + 22.5;
                    const rad = (angle * Math.PI) / 180;
                    const r = 44; // radius in % from center of border board
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    
                    const tokens = signalTokens[sec.id] || [];
                    const pColors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                    
                    return (
                      <div
                        key={`sector-target-${sec.id}`}
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${x}% - 22px)`,
                          top: `calc(50% + ${y}% - 22px)`,
                          width: '44px',
                          height: '44px',
                          zIndex: 25,
                          pointerEvents: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSectorPopup({ sectorId: sec.id, sectorName: sec.name });
                          }}
                          style={{
                            background: 'rgba(5, 10, 25, 0.85)',
                            border: '1.5px solid ' + sec.glow,
                            boxShadow: `0 0 10px ${sec.glow}`,
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: sec.glow,
                            transition: 'transform 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          title={`${sec.name} 스캔 설정 (보너스: ${sec.bonus})`}
                        >
                          <Radio size={12} />
                        </button>

                        {/* Data Tokens Stack Badge */}
                        {sectorDataTokens[sec.id] !== undefined && sectorDataTokens[sec.id] > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              background: 'radial-gradient(circle, #00e5ff 0%, #006064 100%)',
                              border: '1px solid var(--neon-cyan)',
                              boxShadow: '0 0 6px var(--neon-cyan), inset 0 0 4px rgba(0,229,255,0.6)',
                              color: 'white',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              fontFamily: 'Orbitron',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 30,
                              pointerEvents: 'none',
                              textShadow: '0 1px 1px rgba(0,0,0,0.6)'
                            }}
                            title={`${sec.name}에 남은 데이터 토큰: ${sectorDataTokens[sec.id]}개`}
                          >
                            {sectorDataTokens[sec.id]}
                          </div>
                        )}
                        
                        {/* Arranged Signal Discs */}
                        <div style={{
                          display: 'flex',
                          gap: '2px',
                          position: 'absolute',
                          bottom: '-12px',
                          justifyContent: 'center',
                          width: '60px'
                        }}>
                          {tokens.map(pid => (
                            <div
                              key={pid}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: pColors[pid],
                                border: '1px solid #fff',
                                boxShadow: `0 0 5px ${pColors[pid]}`,
                                color: '#000',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1
                              }}
                              title={`P${pid} 스캔 완료`}
                            >
                              신
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Circular Solar System containing rotating rings (Forced perfect square) */}
                <div style={{
                  position: 'absolute',
                  left: `${alignX}%`,
                  top: `${alignY}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${alignScale}%`,
                  aspectRatio: '1/1',
                  height: 'auto',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20
                }}>
                  
                  {/* Rotating Dials Overlay */}
                  {[0, 1, 2, 3].map(dialNum => {
                     const angle = dialNum === 0 ? 0 : dialNum === 1 ? ring1Angle : dialNum === 2 ? ring2Angle : ring3Angle;
                     const imgUrl = dialNum === 1 ? IMAGES.ring1 : dialNum === 2 ? IMAGES.ring2 : dialNum === 3 ? IMAGES.ring3 : null;
                     
                     // Get all topmost spaces across the entire board
                     const topmostSpaces = getTopmostSpaces(ring1Angle, ring2Angle, ring3Angle);
                     
                     // Filter to only render the nodes that belong to THIS dial AND are topmost!
                     const dialSpaces = topmostSpaces.filter(s => s.dial === dialNum);
                     
                     // Get active highlights for this dial
                     let adjSpaces = [];
                     if (selectedProbeId) {
                        const selProbe = probes.find(p => p.id === selectedProbeId);
                        if (selProbe && selProbe.spaceId) {
                           adjSpaces = getAdjacentSpaces(selProbe.spaceId, ring1Angle, ring2Angle, ring3Angle);
                           // Only highlight if it's the topmost space
                           adjSpaces = adjSpaces.filter(adj => topmostSpaces.some(t => t.id === adj.id));
                        }
                     }

                     return (
                        <div key={`dial-${dialNum}`} style={{
                           position: 'absolute',
                           width: '100%',
                           height: '100%',
                           transform: `rotate(${angle + alignRingOffset}deg)`,
                           transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                           pointerEvents: 'none',
                           zIndex: dialNum === 0 ? 10 : 20 - dialNum
                        }}>
                           {imgUrl && (
                               <img 
                                  src={imgUrl} 
                                  alt={`dial-${dialNum}`} 
                                  style={{ 
                                     position: 'absolute', 
                                     width: `${dialNum === 1 ? alignDial1Scale : dialNum === 2 ? alignDial2Scale : alignDial3Scale}%`, 
                                     height: `${dialNum === 1 ? alignDial1Scale : dialNum === 2 ? alignDial2Scale : alignDial3Scale}%`, 
                                     left: '50%',
                                     top: '50%',
                                     transform: 'translate(-50%, -50%)',
                                     opacity: 1 
                                  }} 
                               />
                            )}
                           
                           {/* Space Nodes */}
                           {dialSpaces.map(space => {
                              const baseR = space.ring === 1 ? alignRing1Radius : space.ring === 2 ? alignRing2Radius : alignRing3Radius; const r = baseR + (space.radiusOffset || 0);
                              const rad = ((space.angle + (space.angleOffset || 0)) * Math.PI) / 180;
                              const x = Math.cos(rad) * r;
                              const y = Math.sin(rad) * r;
                              
                              const isHighlighted = adjSpaces.some(s => s.id === space.id);
                              
                              // Find probes on this space
                              const spaceProbes = probes.filter(p => p.spaceId === space.id && p.ring !== 'jupiter');
                              
                              return (
                                 <div key={space.id} style={{
                                    position: 'absolute',
                                    left: `calc(50% + ${x}%)`,
                                    top: `calc(50% + ${y}%)`,
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                 }}>
                                    {/* The Node Circle */}
                                    <div 
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
                                      className={isHighlighted ? 'pulse-slow' : ''}
                                      style={{
                                        width: '28px', 
                                        height: '28px', 
                                        borderRadius: '50%',
                                        border: `2.5px solid ${space.color}`,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        cursor: isHighlighted ? 'pointer' : 'default',
                                        boxShadow: isHighlighted ? `0 0 15px ${space.color}, inset 0 0 10px ${space.color}` : 'none',
                                        transition: 'all 0.3s',
                                        zIndex: isHighlighted ? 35 : 30
                                    }}></div>
                                    
                                    {/* Probes on this Node */}
                                    {spaceProbes.map((probe, gIdx) => {
                                      const pColors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                                      const color = pColors[probe.playerId] || pColors[1];
                                      const gLen = spaceProbes.length;
                                      
                                      // Arrange multiple probes
                                      let px = 0; let py = 0;
                                      if (gLen > 1) {
                                        const pr = 12;
                                        const pRad = (gIdx / gLen) * Math.PI * 2;
                                        px = Math.cos(pRad) * pr;
                                        py = Math.sin(pRad) * pr;
                                      }
                                      
                                      const label = probe.type === 'probe' ? '탐' : probe.type === 'orbiter' ? '궤' : '착';
                                      const isSelected = selectedProbeId === probe.id;
                                      
                                      return (
                                        <div 
                                          key={probe.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (probe.playerId === activePlayerId) {
                                              setSelectedProbeId(prev => prev === probe.id ? null : probe.id);
                                            }
                                          }}
                                          style={{
                                            position: 'absolute',
                                            transform: `translate(${px}px, ${py}px) ${isSelected ? 'scale(1.25)' : 'scale(1)'}`,
                                            width: probe.type === 'orbiter' ? '24px' : '20px',
                                            height: probe.type === 'orbiter' ? '24px' : '20px',
                                            borderRadius: probe.type === 'orbiter' ? '50%' : '4px',
                                            backgroundColor: '#0a0e1e',
                                            color: color,
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            fontFamily: 'Orbitron',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: isSelected 
                                              ? `0 0 20px #fff, 0 0 10px ${color}, inset 0 0 6px ${color}` 
                                              : `0 0 10px ${color}, inset 0 0 4px ${color}`,
                                            border: isSelected ? '2.5px solid white' : `2px solid ${color}`,
                                            cursor: probe.playerId === activePlayerId ? 'pointer' : 'default',
                                            zIndex: isSelected ? 45 : 40,
                                            transition: 'transform 0.15s ease'
                                          }}
                                          title={`Probe #${probe.id} (P${probe.playerId})`}
                                        >
                                          {label}
                                        </div>
                                      );
                                    })}
                                 </div>
                              );
                           })}
                        </div>
                     );
                  })}

                  {/* The Sun / Center Star */}
                  <div style={{
                    position: 'absolute',
                    width: '12%',
                    height: '12%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffe600 0%, #ff6600 70%, transparent 100%)',
                    boxShadow: '0 0 25px #ffaa00, inset 0 0 10px white',
                    zIndex: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                  </div>
                </div>

                {/* Active Sector Scan Popup */}
                {activeSectorPopup && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    width: '260px',
                    background: 'rgba(5, 10, 25, 0.95)',
                    border: '2px solid var(--neon-cyan)',
                    borderRadius: '8px',
                    boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)',
                    padding: '16px',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px', fontFamily: 'Orbitron' }}>
                        🛰️ {activeSectorPopup.sectorName}
                      </div>
                      <button
                        onClick={() => setActiveSectorPopup(null)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: 1
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      이 구역을 스캔한 플레이어를 설정하세요. 스캔 시 보너스를 획득합니다.
                    </div>

                    {/* Data Tokens Count Modifier */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'var(--neon-cyan)' }}>●</span> 데이터 토큰 개수
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSectorDataTokens(prev => ({
                              ...prev,
                              [activeSectorPopup.sectorId]: Math.max((prev[activeSectorPopup.sectorId] || 0) - 1, 0)
                            }));
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            width: '20px',
                            height: '20px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                          -
                        </button>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: 'Orbitron',
                          color: 'var(--neon-cyan)',
                          fontWeight: 'bold',
                          minWidth: '20px',
                          textAlign: 'center',
                          textShadow: '0 0 5px var(--neon-cyan)'
                        }}>
                          {sectorDataTokens[activeSectorPopup.sectorId] || 0}
                        </span>
                        <button
                          onClick={() => {
                            setSectorDataTokens(prev => ({
                              ...prev,
                              [activeSectorPopup.sectorId]: Math.min((prev[activeSectorPopup.sectorId] || 0) + 1, 10)
                            }));
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            width: '20px',
                            height: '20px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[1, 2, 3, 4].map(pid => {
                        const colors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                        const tokens = signalTokens[activeSectorPopup.sectorId] || [];
                        const isScanned = tokens.includes(pid);
                        return (
                          <button
                            key={pid}
                            onClick={() => toggleSignalToken(activeSectorPopup.sectorId, pid)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 12px',
                              fontSize: '12px',
                              background: isScanned ? `rgba(${pid === 1 ? '0,229,255' : pid === 2 ? '57,255,20' : pid === 3 ? '186,104,200' : '255,167,38'}, 0.15)` : 'rgba(255,255,255,0.02)',
                              border: '1px solid ' + (isScanned ? colors[pid] : 'rgba(255,255,255,0.1)'),
                              color: colors[pid],
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>플레이어 {pid} (P{pid})</span>
                            <span style={{ fontSize: '10px' }}>{isScanned ? "● 스캔 완료" : "○ 미스캔"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Top/Bottom Boards and Orbit Controls (Scrollable stacked list) */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                height: '100%',
                overflowY: 'auto',
                paddingRight: '4px',
                minWidth: 0
              }}>
                {/* Tab Switcher for Top/Bottom Board */}
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  background: 'rgba(5, 10, 25, 0.6)',
                  padding: '4px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 229, 255, 0.15)',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => setRightBoardTab('top')}
                    style={{
                      flex: 1,
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontFamily: 'Orbitron',
                      fontWeight: 'bold',
                      background: rightBoardTab === 'top' ? 'rgba(255, 0, 127, 0.15)' : 'transparent',
                      color: rightBoardTab === 'top' ? 'var(--neon-magenta)' : '#888',
                      border: '1px solid ' + (rightBoardTab === 'top' ? 'var(--neon-magenta)' : 'transparent'),
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: rightBoardTab === 'top' ? '0 0 8px rgba(255, 0, 127, 0.25)' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    🌌 상단 보드 (Top Board)
                  </button>
                  <button
                    onClick={() => setRightBoardTab('bottom')}
                    style={{
                      flex: 1,
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontFamily: 'Orbitron',
                      fontWeight: 'bold',
                      background: rightBoardTab === 'bottom' ? 'rgba(255, 170, 0, 0.12)' : 'transparent',
                      color: rightBoardTab === 'bottom' ? 'var(--neon-gold)' : '#888',
                      border: '1px solid ' + (rightBoardTab === 'bottom' ? 'var(--neon-gold)' : 'transparent'),
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: rightBoardTab === 'bottom' ? '0 0 8px rgba(255, 170, 0, 0.25)' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    🪐 하단 보드 (Bottom Board)
                  </button>
                </div>

                {rightBoardTab === 'top' && (
                  /* Top Board */
                  <div 
                    onClick={() => setZoomImage({ src: imgTopBoard, title: '세티 상단 보드 (Top Board)' })}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      const container = document.getElementById('top-board-inner-container');
                      const btn = document.getElementById('alien-board-toggle-btn');
                      if (container && btn) {
                        container.style.transform = 'translateY(0%)';
                        btn.innerHTML = '▲ 외계인 보드 보기';
                      }
                    }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 0, 127, 0.25)',
                      boxShadow: '0 0 15px rgba(255, 0, 127, 0.1)',
                      background: '#04060e',
                      aspectRatio: `${topBoardWidthRatio} / 1`,
                      cursor: 'zoom-in',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                      height: '100%',
                      maxHeight: 'calc(100% - 46px)',
                      width: 'auto',
                      maxWidth: '100%',
                      alignSelf: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    title="클릭하여 확대 보기"
                  >
                    {/* Top Edge Hover Zone for auto-reveal */}
                    <div 
                      onMouseEnter={() => {
                        const container = document.getElementById('top-board-inner-container');
                        const btn = document.getElementById('alien-board-toggle-btn');
                        if (container && btn) {
                          container.style.transform = 'translateY(32%)';
                          btn.innerHTML = '▼ 상단 보드 복귀';
                        }
                      }}
                      style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '15%', zIndex: 15
                      }}
                      title="마우스를 올리면 숨겨진 외계인 보드가 나타납니다"
                    />
                    
                    {/* Alien Board Reveal Toggle Button */}
                    <button
                      id="alien-board-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const container = document.getElementById('top-board-inner-container');
                        if (container.style.transform === 'translateY(32%)') {
                          container.style.transform = 'translateY(0%)';
                          e.currentTarget.innerHTML = '▲ 외계인 보드 보기';
                        } else {
                          container.style.transform = 'translateY(32%)';
                          e.currentTarget.innerHTML = '▼ 상단 보드 복귀';
                        }
                      }}
                      style={{
                        position: 'absolute', top: '10px', left: '12px', zIndex: 20,
                        background: 'rgba(57, 255, 20, 0.15)', border: '1px solid var(--neon-green)',
                        padding: '5px 10px', borderRadius: '4px', color: 'var(--neon-green)',
                        fontSize: '11px', fontWeight: 'bold', fontFamily: 'Orbitron',
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(57, 255, 20, 0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(57, 255, 20, 0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(57, 255, 20, 0.15)'}
                    >
                      ▲ 외계인 보드 보기
                    </button>

                    <div style={{
                      position: 'absolute', top: '10px', right: '12px', zIndex: 10,
                      background: 'rgba(255, 0, 127, 0.15)', border: '1px solid var(--neon-magenta)',
                      padding: '3px 8px', borderRadius: '4px', color: 'var(--neon-magenta)',
                      fontSize: '11px', fontWeight: 'bold', fontFamily: 'Orbitron'
                    }}>
                      TOP BOARD (상단 보드)
                    </div>

                    <div 
                      id="top-board-inner-container"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: `${topBoardImgHeight}%`,
                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    >
                      <img 
                        src={imgTopBoard} 
                        alt="Top Board"
                        onMouseEnter={() => {
                          const container = document.getElementById('top-board-inner-container');
                          const btn = document.getElementById('alien-board-toggle-btn');
                          if (container && btn) {
                            container.style.transform = 'translateY(0%)';
                            btn.innerHTML = '▲ 외계인 보드 보기';
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.85,
                          borderRadius: '0 0 11px 11px',
                          pointerEvents: 'auto'
                        }}
                      />
                      {/* Left Alien Hidden Board */}
                      <img
                        src={isLeftAlienRevealed ? imgAlienRevealed : imgAlienBoard}
                        alt="Alien Board Left"
                        style={{
                          position: 'absolute',
                          bottom: `${alienLeftY}%`,
                          left: `${alienLeftX}%`,
                          width: `${alienLeftScale}%`,
                          height: 'auto',
                          zIndex: 5,
                          pointerEvents: 'none'
                        }}
                      />
                      {/* Right Alien Hidden Board */}
                      <img
                        src={isRightAlienRevealed ? imgAlienRevealed : imgAlienBoard}
                        alt="Alien Board Right"
                        style={{
                          position: 'absolute',
                          bottom: `${alienRightY}%`,
                          left: `${alienRightX}%`,
                          width: `${alienRightScale}%`,
                          height: 'auto',
                          zIndex: 5,
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Left Track Slots */}
                      {leftAlienTrack.map((slotValue, idx) => {
                        const slotLeft = `calc(${alienLeftX}% - 4.8%)`;
                        const multiplier = idx === 0 ? 1.05 : idx === 1 ? 0.40 : -0.25;
                        const slotBottom = `calc(${alienLeftY}% + ${alienLeftScale * multiplier}%)`;
                        const pColors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };

                        return (
                          <div
                            key={`left-alien-slot-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleAlienTrackSlot('left', idx);
                            }}
                            style={{
                              position: 'absolute',
                              left: slotLeft,
                              bottom: slotBottom,
                              transform: 'translate(-50%, 50%)',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: slotValue ? pColors[slotValue] : 'rgba(5, 10, 25, 0.7)',
                              border: `1.5px solid ${slotValue ? '#fff' : 'rgba(0, 229, 255, 0.4)'}`,
                              boxShadow: slotValue ? `0 0 8px ${pColors[slotValue]}` : 'none',
                              color: slotValue ? '#000' : 'rgba(255, 255, 255, 0.25)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 10,
                              transition: 'all 0.15s ease'
                            }}
                            title={`좌측 외계인 트랙 슬롯 #${idx + 1} (클릭하여 신호 토큰 배치)`}
                          >
                            {slotValue ? '신' : '3'}
                          </div>
                        );
                      })}

                      {/* Right Track Slots */}
                      {rightAlienTrack.map((slotValue, idx) => {
                        const slotLeft = `calc(${alienRightX}% + ${alienRightScale}% + 0.8%)`;
                        const multiplier = idx === 0 ? 1.05 : idx === 1 ? 0.40 : -0.25;
                        const slotBottom = `calc(${alienRightY}% + ${alienRightScale * multiplier}%)`;
                        const pColors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };

                        return (
                          <div
                            key={`right-alien-slot-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleAlienTrackSlot('right', idx);
                            }}
                            style={{
                              position: 'absolute',
                              left: slotLeft,
                              bottom: slotBottom,
                              transform: 'translate(-50%, 50%)',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: slotValue ? pColors[slotValue] : 'rgba(5, 10, 25, 0.7)',
                              border: `1.5px solid ${slotValue ? '#fff' : 'rgba(0, 229, 255, 0.4)'}`,
                              boxShadow: slotValue ? `0 0 8px ${pColors[slotValue]}` : 'none',
                              color: slotValue ? '#000' : 'rgba(255, 255, 255, 0.25)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 10,
                              transition: 'all 0.15s ease'
                            }}
                            title={`우측 외계인 트랙 슬롯 #${idx + 1} (클릭하여 신호 토큰 배치)`}
                          >
                            {slotValue ? '신' : '3'}
                          </div>
                        );
                      })}

                      {/* Left Board Manual Toggle Lock */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeftAlienManualReveal(prev => !prev);
                        }}
                        style={{
                          position: 'absolute',
                          left: `calc(${alienLeftX}% + ${alienLeftScale * 0.5}%)`,
                          bottom: `calc(${alienLeftY}% + ${alienLeftScale * 1.8}%)`,
                          transform: 'translate(-50%, 50%)',
                          background: isLeftAlienRevealed ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 0, 127, 0.15)',
                          border: `1px solid ${isLeftAlienRevealed ? 'var(--neon-green)' : 'var(--neon-magenta)'}`,
                          color: isLeftAlienRevealed ? 'var(--neon-green)' : 'var(--neon-magenta)',
                          boxShadow: isLeftAlienRevealed ? '0 0 8px var(--neon-green)' : 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 15
                        }}
                        title={isLeftAlienRevealed ? "클릭하여 좌측 외계인 보드 덮기" : "클릭하여 좌측 외계인 보드 공개"}
                      >
                        {isLeftAlienRevealed ? '🔓' : '🔒'}
                      </button>

                      {/* Right Board Manual Toggle Lock */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRightAlienManualReveal(prev => !prev);
                        }}
                        style={{
                          position: 'absolute',
                          left: `calc(${alienRightX}% + ${alienRightScale * 0.5}%)`,
                          bottom: `calc(${alienRightY}% + ${alienRightScale * 1.8}%)`,
                          transform: 'translate(-50%, 50%)',
                          background: isRightAlienRevealed ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 0, 127, 0.15)',
                          border: `1px solid ${isRightAlienRevealed ? 'var(--neon-green)' : 'var(--neon-magenta)'}`,
                          color: isRightAlienRevealed ? 'var(--neon-green)' : 'var(--neon-magenta)',
                          boxShadow: isRightAlienRevealed ? '0 0 8px var(--neon-green)' : 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 15
                        }}
                        title={isRightAlienRevealed ? "클릭하여 우측 외계인 보드 덮기" : "클릭하여 우측 외계인 보드 공개"}
                      >
                        {isRightAlienRevealed ? '🔓' : '🔒'}
                      </button>
                    </div>
                  </div>
                )}


                {rightBoardTab === 'bottom' && (
                  /* Bottom Board */
                  <div 
                    onClick={() => setZoomImage({ src: imgBottomBoard, title: '세티 하단 공전 보드 (Bottom Board)' })}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 170, 0, 0.25)',
                      boxShadow: '0 0 15px rgba(255, 170, 0, 0.1)',
                      background: '#04060e',
                      aspectRatio: `${bottomBoardWidthRatio}/1`,
                      cursor: 'zoom-in',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                      height: '100%',
                      maxHeight: 'calc(100% - 46px)',
                      width: 'auto',
                      maxWidth: '100%',
                      alignSelf: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="클릭하여 확대 보기"
                  >
                    <div style={{
                      position: 'absolute', top: '10px', right: '12px', zIndex: 10,
                      background: 'rgba(255, 170, 0, 0.15)', border: '1px solid var(--neon-gold)',
                      padding: '3px 8px', borderRadius: '4px', color: 'var(--neon-gold)',
                      fontSize: '11px', fontWeight: 'bold', fontFamily: 'Orbitron'
                    }}>
                      BOTTOM BOARD (하단 공전 보드)
                    </div>
                    <img 
                      src={imgBottomBoard} 
                      alt="Bottom Board"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.85
                      }}
                    />

                    {/* Orbit Token Dial overlay */}
                    <div style={{
                      position: 'absolute',
                      left: `${alignDialX}%`,
                      top: `${alignDialY}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${alignDialScale}%`,
                      height: `${alignDialScale * bottomBoardWidthRatio}%`, // Compensate for parent ratio to keep dial perfectly square
                      zIndex: 25,
                      pointerEvents: alignMode ? 'auto' : 'none'
                    }}>
                      <motion.img 
                        src={IMAGES.passMarker}
                        alt="Orbit Token"
                        initial={false}
                        animate={{
                          left: `${dialCoords[orbitStep]?.x ?? 50}%`,
                          top: `${dialCoords[orbitStep]?.y ?? 50}%`,
                        }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={{
                          position: 'absolute',
                          width: '40%',
                          height: '40%',
                          transform: 'translate(-50%, -50%)',
                          filter: 'drop-shadow(0 0 5px var(--neon-cyan))',
                          zIndex: 26,
                          pointerEvents: 'none'
                        }}
                      />

                      {/* 3 Step alignment target guides (rendered only in alignMode) */}
                      {alignMode && [0, 1, 2].map((stepIdx) => {
                        const isSelected = alignDialStep === stepIdx;
                        const colors = {
                          0: 'var(--neon-cyan)',
                          1: 'var(--neon-green)',
                          2: 'var(--neon-gold)'
                        };
                        const labels = ["공전 1", "공전 2", "공전 3"];
                        
                        return (
                          <div
                            key={stepIdx}
                            style={{
                              position: 'absolute',
                              left: `${dialCoords[stepIdx]?.x ?? 50}%`,
                              top: `${dialCoords[stepIdx]?.y ?? 50}%`,
                              transform: 'translate(-50%, -50%)',
                              width: isSelected ? '34px' : '26px',
                              height: isSelected ? '34px' : '26px',
                              borderRadius: '50%',
                              background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(5, 10, 25, 0.75)',
                              border: `2px solid ${colors[stepIdx]}`,
                              boxShadow: isSelected ? `0 0 10px ${colors[stepIdx]}` : 'none',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: isSelected ? '#fff' : '#ccc',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              zIndex: isSelected ? 30 : 27,
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              transition: 'all 0.15s ease'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setAlignDialStep(stepIdx);
                            }}
                            title={`클릭하여 ${labels[stepIdx]} 좌표 수정`}
                          >
                            <span style={{ fontSize: '8px', lineHeight: 1 }}>{labels[stepIdx]}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Technology Tokens overlay */}
                    {Object.entries(bottomBoardTokens).map(([id, token]) => {
                      let left = '0%';
                      let top = '0%';
                      if (token.category === 'orange') {
                        left = `${42.8 + token.slotIndex * 5.8}%`;
                        top = '37%';
                      } else if (token.category === 'purple') {
                        left = `${67.8 + token.slotIndex * 6.8}%`;
                        top = '21%';
                      } else if (token.category === 'blue') {
                        left = `${67.8 + token.slotIndex * 6.8}%`;
                        top = '63%';
                      }

                      if (token.count === 0) return null;

                      return (
                        <div
                          key={id}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent zoom
                            takeTechToken(id);
                          }}
                          style={{
                            position: 'absolute',
                            left: left,
                            top: top,
                            transform: 'translate(-50%, -50%)',
                            width: '26px',
                            height: '34px',
                            background: 'radial-gradient(circle, #2e7d32 0%, #1b5e20 100%)',
                            border: '2px solid #a5d6a7',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.6), 0 0 5px rgba(165, 214, 167, 0.4)',
                            zIndex: 35,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
                            e.currentTarget.style.borderColor = 'var(--neon-green)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.8), 0 0 10px var(--neon-green)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                            e.currentTarget.style.borderColor = '#a5d6a7';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.6), 0 0 5px rgba(165, 214, 167, 0.4)';
                          }}
                          title={`${token.name} (${token.vp} VP) - 가져오려면 클릭`}
                        >
                          <div style={{ fontSize: '8px', color: '#ffeb3b', fontWeight: 'bold', fontFamily: 'Orbitron', lineHeight: 1 }}>
                            {token.vp}
                          </div>
                          <div style={{ fontSize: '8px', color: '#fff', fontWeight: 'bold', fontFamily: 'Orbitron', marginTop: '2px', lineHeight: 1 }}>
                            x{token.count}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                )}

                </div>

                {/* Space Operations Command Panel */}
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <RotateCcw size={18} style={{ color: 'var(--neon-magenta)' }} />
                    <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Orbitron' }}>우주 작전 사령부</span>
                  </div>

                  {/* Orbit controls */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--neon-magenta)', marginBottom: '4px', fontFamily: 'Orbitron' }}>태양계 공전 제어</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      현재 다이얼: <strong style={{ color: 'var(--neon-cyan)' }}>
                        {orbitStep === 0 ? "1단계 (초기)" : orbitStep === 1 ? "2단계 (1번 회전)" : "3단계 (1+2번 회전)"}
                      </strong>
                    </div>
                    <button onClick={triggerOrbit} className="neon-btn neon-btn-magenta" style={{ width: '100%', padding: '6px 0', fontSize: '13px' }}>
                      공전 실행 (다이얼 전진)
                    </button>
                  </div>

                  {/* Launch controls */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--neon-cyan)', marginBottom: '6px', fontFamily: 'Orbitron' }}>탐사선 발사 (비용: 2크레딧)</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4].map(pid => {
                        const colors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                        return (
                          <button
                            key={pid}
                            onClick={() => {
                              setPlayersData(prev => {
                                const p = prev[pid];
                                if (p.credits < 2) {
                                  alert(`플레이어 ${pid}의 크레딧이 부족합니다!`);
                                  return prev;
                                }
                                const newId = probes.length > 0 ? Math.max(...probes.map(pr => pr.id)) + 1 : 1;
                                setProbes(pr => [...pr, { id: newId, type: 'probe', spaceId: 'earth', playerId: pid }]);
                                return {
                                  ...prev,
                                  [pid]: { ...p, credits: p.credits - 2 }
                                };
                              });
                            }}
                            style={{
                              flex: 1,
                              padding: '4px 0',
                              fontSize: '11px',
                              background: 'rgba(255,255,255,0.03)',
                              color: colors[pid],
                              border: `1px solid ${colors[pid]}`,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            P{pid} 발사
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--neon-gold)', marginBottom: '6px', fontFamily: 'Orbitron' }}>정렬 검증 도구</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          const testProbes = SPACES.map((space, index) => {
                            const playerId = (index % 4) + 1; // Cycle colors
                            return {
                              id: 9999 + index,
                              type: 'probe',
                              spaceId: space.id,
                              playerId: playerId
                            };
                          });
                          setProbes(testProbes);
                          alert("모든 칸에 테스트 탐사선이 배치되었습니다!");
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          fontSize: '11px',
                          background: 'rgba(255,170,0,0.15)',
                          color: 'var(--neon-gold)',
                          border: '1px solid var(--neon-gold)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        모든 칸에 탐사선 배치
                      </button>
                      <button
                        onClick={() => {
                          setProbes([]);
                          alert("모든 테스트 탐사선이 회수되었습니다.");
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          background: 'rgba(255,60,60,0.15)',
                          color: '#ff3c3c',
                          border: '1px solid #ff3c3c',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        회수
                      </button>
                    </div>
                  </div>

                  {/* Probes controller list */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--neon-gold)', fontFamily: 'Orbitron' }}>활성 탐사선 제어 ({probes.length})</div>
                    
                    {/* Temporary Move Points Controller */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      background: 'rgba(5, 10, 25, 0.4)',
                      border: '1px solid rgba(0, 229, 255, 0.15)',
                      borderRadius: '4px',
                      padding: '8px 10px',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>이동 작전 이동력</span>
                        <span style={{ fontSize: '12px', fontFamily: 'Orbitron', fontWeight: 'bold', color: 'var(--neon-cyan)', textShadow: '0 0 5px var(--neon-cyan)' }}>
                          {activeMovementPoints} MP
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {[2, 3, 4].map(mp => (
                          <button
                            key={mp}
                            onClick={() => setActiveMovementPoints(mp)}
                            style={{
                              flex: 1,
                              padding: '2px 0',
                              fontSize: '9px',
                              background: activeMovementPoints === mp ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.03)',
                              color: activeMovementPoints === mp ? '#000' : 'var(--neon-cyan)',
                              border: '1px solid var(--neon-cyan)',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            +{mp} MP
                          </button>
                        ))}
                        <button
                          onClick={() => setActiveMovementPoints(0)}
                          style={{
                            padding: '2px 6px',
                            fontSize: '9px',
                            background: 'rgba(255,60,60,0.15)',
                            color: '#ff3c3c',
                            border: '1px solid #ff3c3c',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          초기화
                        </button>
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                        * 이동력을 설정하면 소행성 지대(돌덩이) 탈출 시 2 MP 소모, 일반 구획 1 MP 소모가 자동 차감됩니다. (0 MP일 때는 제한 없이 자유 이동)
                      </div>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                      {probes.length === 0 ? (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                          우주에 배치된 탐사선이 없습니다.
                        </div>
                      ) : (
                        probes.map(probe => {
                          const colors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                          const color = colors[probe.playerId] || colors[1];
                          const space = SPACES.find(s => s.id === probe.spaceId);
                          const locName = probe.ring === 'jupiter' ? `목성 (${probe.sector})` : 
                                          probe.spaceId === 'earth' ? '지구' : 
                                          space ? `${space.ring}번 궤도, ${getPhysicalSector(space, ring1Angle, ring2Angle, ring3Angle)}구역` :
                                          '지구';
                          
                          // Asteroid detection
                          const isFromAsteroid = space && space.ring === 2 && (space.initialSector === 3 || space.initialSector === 5);
                          const costVal = isFromAsteroid ? 2 : 1;

                          return (
                            <div key={probe.id} style={{ 
                              background: 'rgba(5,10,25,0.4)', 
                              border: `1px solid ${color}`, 
                              borderRadius: '4px', 
                              padding: '6px 8px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                                <span style={{ fontWeight: 'bold', color: color }}>
                                  P{probe.playerId} 탐사선 #{probe.id} ({probe.type.toUpperCase()})
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{locName}</span>
                              </div>
                              
                              {probe.ring !== 'jupiter' && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  <div style={{ fontSize: '10px', color: 'var(--neon-cyan)', padding: '4px', border: '1px solid rgba(0, 229, 255, 0.4)', borderRadius: '3px', background: 'rgba(0, 229, 255, 0.1)', width: '100%', textAlign: 'center', marginBottom: '4px' }}>
                                    보드판의 탐사선을 클릭하면 인접한 이동 가능 구역이 표시됩니다.
                                  </div>
                                  
                                  {probe.type === 'probe' && (
                                    <button
                                      onClick={() => upgradeProbe(probe.id, 'orbiter')}
                                      style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(57,255,20,0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                      궤도선(O)
                                    </button>
                                  )}
                                  {probe.type === 'orbiter' && (
                                    <button
                                      onClick={() => upgradeProbe(probe.id, 'lander')}
                                      style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(255,0,127,0.1)', border: '1px solid var(--neon-magenta)', color: 'var(--neon-magenta)', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                      착륙선(L)
                                    </button>
                                  )}
                                  {probe.type === 'lander' && (
                                    <button
                                      onClick={() => upgradeProbe(probe.id, 'probe')}
                                      style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                      탐사선(P)
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      if (window.confirm("이 탐사선을 우주에서 회수하시겠습니까?")) {
                                        setProbes(prev => prev.filter(p => p.id !== probe.id));
                                      }
                                    }}
                                    style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(255,60,60,0.15)', border: '1px solid #ff3c3c', color: '#ff3c3c', borderRadius: '3px', cursor: 'pointer', marginLeft: 'auto' }}
                                  >
                                    회수
                                  </button>
                                </div>
                              )}
                              {probe.ring === 'jupiter' && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    onClick={() => recallFromJupiter(probe.sector)}
                                    style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(255,170,0,0.15)', border: '1px solid var(--neon-gold)', color: 'var(--neon-gold)', borderRadius: '3px', cursor: 'pointer' }}
                                  >
                                    목성에서 회수
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

              </div>
          ) : activeTab === 'cards' ? (
            /* Card sheet catalog explorer */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                  전체 스프라이트 시트에서 원하는 카드를 클릭하여 개인 핸드로 가져옵니다.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['deck1', 'deck2', 'deck3'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setSelectedDeck(d)}
                      style={{
                        background: selectedDeck === d ? 'rgba(255, 0, 127, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid ' + (selectedDeck === d ? 'var(--neon-magenta)' : 'rgba(255, 255, 255, 0.2)'),
                        color: selectedDeck === d ? 'var(--neon-magenta)' : 'white',
                        padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Orbitron'
                      }}
                    >
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid showing first 20 cards of the selected sheet */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', padding: '8px' }}>
                {Array.from({ length: 20 }).map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => addCardToHand(selectedDeck, idx)}
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#090d16',
                      transition: 'transform 0.2s',
                    }}
                    className="card-hover-scale"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {/* Card slice container */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '1/1.4',
                      backgroundImage: `url(${IMAGES[selectedDeck]})`,
                      backgroundSize: '1000% 700%', // 10 columns, 7 rows
                      backgroundPositionX: `${(idx % 10) * 11.11}%`,
                      backgroundPositionY: `${Math.floor(idx / 10) * 16.66}%`,
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }} />
                    <div style={{ padding: '6px', fontSize: '13px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                      카드 #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Help Rules Tab */
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '16px', lineHeight: '1.6' }}>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--neon-cyan)' }}>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Orbitron', color: 'var(--neon-cyan)' }}>1. 게임 차례 구조</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                  자신의 차례가 되면 <strong>주요 행동을 1번</strong> 하고, 원하는 만큼 <strong>보조 행동</strong>을 할 수 있습니다. 
                  행동할 수 있는 자원이 떨어지거나 더 할 행동이 없으면 <strong>라운드 패스</strong>를 선언합니다.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--neon-magenta)' }}>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Orbitron', color: 'var(--neon-magenta)' }}>2. 태양계 공전 시스템</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                  기술 개발을 하거나, 라운드에서 첫 번째로 패스한 플레이어가 나오면 <strong>태양계가 공전</strong>합니다.
                  첫 공전에는 1번 원판, 두 번째는 2번 원판, 세 번째는 3번 원판을 반시계 방향으로 1칸 회전시킵니다.
                  원판이 회전할 때 <strong>원판 위에 올라탄 탐사선들도 함께 회전하며 위치가 변화</strong>합니다.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--neon-gold)' }}>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Orbitron', color: 'var(--neon-gold)' }}>3. 5대 주요 행동</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  {Object.entries(ACTION_DESCRIPTIONS).map(([key, value]) => (
                    <div key={key} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 'bold', color: 'white' }}>{value.title}</div>
                      <div style={{ fontSize: '13px', color: 'var(--neon-gold)', margin: '2px 0' }}>비용: {value.cost}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{value.effect}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div> {/* Closes Left Side: Dynamic Board View */}
      </div> {/* Closes Main Content Area */}
      {/* Bottom Panel: Player Board and Cards in Hand */}
      <footer className="glass-panel" style={{
        height: '290px',
        backgroundImage: `linear-gradient(rgba(10, 14, 30, 0.9), rgba(10, 14, 30, 0.9)), url(${IMAGES.playerBoard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '12px 16px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        borderTop: '2px solid rgba(0, 229, 255, 0.3)',
        boxSizing: 'border-box'
      }}>
        
        {/* Left Side: Unified Player Board & Technology Board Container */}
        <div style={{ width: '840px', display: 'flex', gap: '16px', height: '100%', flexShrink: 0 }}>
          
          {/* Controls & Resources Sidebar */}
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', flexShrink: 0 }}>
            {/* Player Switcher Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4].map(pid => {
                const colors = { 1: '#00e5ff', 2: '#39ff14', 3: '#ba68c8', 4: '#ffa726' };
                const isActive = activePlayerId === pid;
                return (
                  <button
                    key={pid}
                    onClick={() => setActivePlayerId(pid)}
                    style={{
                      flex: 1,
                      padding: '3px 0',
                      fontSize: '11px',
                      fontFamily: 'Orbitron',
                      fontWeight: 'bold',
                      background: isActive ? colors[pid] : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#000' : colors[pid],
                      border: `1px solid ${colors[pid]}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: isActive ? `0 0 6px ${colors[pid]}` : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    P{pid}
                  </button>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '4px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'Orbitron', color: activePlayerId === 1 ? '#00e5ff' : activePlayerId === 2 ? '#39ff14' : activePlayerId === 3 ? '#ba68c8' : '#ffa726' }}>P{activePlayerId} 개인 사령부</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>자원 & 업그레이드</div>
            </div>

            {/* Resource Monitor */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '4px',
              background: 'rgba(5, 10, 25, 0.6)', 
              border: '1px solid rgba(0, 229, 255, 0.25)', 
              borderRadius: '6px', 
              padding: '6px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Credits */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', fontWeight: 'bold', fontFamily: 'Orbitron', minWidth: '16px' }}>CR</span>
                  <button onClick={() => setCredits(c => Math.max(c - 1, 0))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Minus size={6} /></button>
                  <span style={{ fontSize: '13px', fontFamily: 'Orbitron', color: 'var(--neon-cyan)', fontWeight: 'bold', minWidth: '12px', textAlign: 'center' }}>{credits}</span>
                  <button onClick={() => setCredits(c => Math.min(c + 1, 10))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Plus size={6} /></button>
                </div>
                {/* Energy */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--neon-green)', fontWeight: 'bold', fontFamily: 'Orbitron', minWidth: '16px' }}>EN</span>
                  <button onClick={() => setEnergy(e => Math.max(e - 1, 0))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Minus size={6} /></button>
                  <span style={{ fontSize: '13px', fontFamily: 'Orbitron', color: 'var(--neon-green)', fontWeight: 'bold', minWidth: '12px', textAlign: 'center' }}>{energy}</span>
                  <button onClick={() => setEnergy(e => Math.min(e + 1, 10))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Plus size={6} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Prestige */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--neon-magenta)', fontWeight: 'bold', fontFamily: 'Orbitron', minWidth: '16px' }}>PR</span>
                  <button onClick={() => setPrestige(p => Math.max(p - 1, 0))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Minus size={6} /></button>
                  <span style={{ fontSize: '12px', fontFamily: 'Orbitron', color: 'var(--neon-magenta)', fontWeight: 'bold', minWidth: '28px', textAlign: 'center' }}>{prestige}/10</span>
                  <button onClick={() => setPrestige(p => Math.min(p + 1, 10))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Plus size={6} /></button>
                </div>
                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--neon-gold)', fontWeight: 'bold', fontFamily: 'Orbitron', minWidth: '16px' }}>SC</span>
                  <button onClick={() => setScore(s => Math.max(s - 1, 0))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Minus size={6} /></button>
                  <span style={{ fontSize: '13px', fontFamily: 'Orbitron', color: 'var(--neon-gold)', fontWeight: 'bold', minWidth: '12px', textAlign: 'center' }}>{score}</span>
                  <button onClick={() => setScore(s => s + 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '8px' }}><Plus size={6} /></button>
                </div>
              </div>
            </div>

            {/* Computer Data & Action Buttons */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>컴퓨터 분석기</span>
                <span style={{ fontSize: '12px', fontFamily: 'Orbitron', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>{dataCount} / 6 DT</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => { if (dataCount < 6) setDataCount(c => c + 1); }}
                  className="neon-btn"
                  style={{ flex: 1, padding: '3px 0', fontSize: '10px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}
                >
                  수집 (+1)
                </button>
                <button 
                  onClick={() => {
                    if (dataCount === 6) {
                      setDataCount(0);
                      setScore(s => s + 5);
                      alert("데이터 6개를 분석하여 5점을 획득하고 외계 지성체 흔적을 체크했습니다!");
                    } else {
                      alert("컴퓨터 데이터가 가득 차지 않았습니다! (6개 필요)");
                    }
                  }}
                  className="neon-btn neon-btn-magenta"
                  style={{ flex: 1, padding: '3px 0', fontSize: '10px' }}
                >
                  분석 실행
                </button>
              </div>
            </div>

            {/* Increase Income Action Button */}
            <button 
              onClick={triggerIncreaseIncome}
              className="neon-btn neon-btn-gold"
              style={{
                width: '100%', padding: '5px 0', fontSize: '11px',
                borderColor: isSelectingIncomeTuck ? 'var(--neon-magenta)' : 'var(--neon-gold)',
                boxShadow: isSelectingIncomeTuck ? '0 0 10px var(--neon-magenta)' : 'none',
                animation: isSelectingIncomeTuck ? 'pulse 1s infinite' : 'none'
              }}
            >
              {isSelectingIncomeTuck ? "꽂을 카드 선택 중... (취소)" : "수입 올리기 (카드 꽂기)"}
            </button>

            {/* Facedown Rewards Inventory (대기 중인 기술 토큰) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--neon-magenta)', fontWeight: 'bold', fontFamily: 'Orbitron', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>대기 보상 창고 ({facedownRewards.length})</span>
                {facedownRewards.length > 0 && <span className="animate-pulse" style={{ color: 'var(--neon-magenta)', fontSize: '8px' }}>●</span>}
              </div>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px', 
                background: 'rgba(5, 10, 25, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '4px', 
                padding: '4px',
                boxSizing: 'border-box'
              }}>
                {facedownRewards.length === 0 ? (
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>대기 중인 기술 토큰이 없습니다.</span>
                ) : (
                  facedownRewards.map(reward => (
                    <div 
                      key={reward.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '3px 6px', 
                        borderRadius: '3px', 
                        fontSize: '10px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px', color: '#fff' }} title={reward.name}>
                        {reward.name.length > 12 ? reward.name.substring(0, 10) + '..' : reward.name}
                      </span>
                      <button 
                        onClick={() => upgradeTechSlot(reward.id)}
                        style={{ 
                          background: 'rgba(57, 255, 20, 0.15)', 
                          color: 'var(--neon-green)', 
                          border: '1px solid var(--neon-green)', 
                          padding: '1px 5px', 
                          fontSize: '9px', 
                          borderRadius: '3px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer' 
                        }}
                      >
                        장착
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Large Technology Board Wrapper */}
          <div style={{
            position: 'relative',
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              height: '100%',
              aspectRatio: '1581/1183',
              margin: '0 auto',
            }}>
              <img 
                src={imgTechBoard} 
                alt="Technology Board"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />

              {/* Render active and empty tech slots dynamically from config */}
              {Object.entries(TECH_SLOTS_CONFIG).map(([key, config]) => {
                const isActive = upgradedTechSlots[key];
                const hasToken = facedownRewards.some(r => r.key === key);
                
                return (
                  <div
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlotClick(key);
                    }}
                    style={{
                      position: 'absolute',
                      left: config.coords.left,
                      top: config.coords.top,
                      transform: 'translate(-50%, -50%)',
                      width: '7.2%',
                      height: '24%',
                      backgroundColor: isActive ? config.color : 'transparent',
                      border: isActive 
                        ? '1.5px solid #ffeb3b' 
                        : hasToken 
                          ? '1.5px dashed var(--neon-green)' 
                          : '1px dashed rgba(255,255,255,0.15)',
                      borderRadius: '2px',
                      boxShadow: isActive 
                        ? '0 0 6px #ffeb3b, inset 0 0 4px rgba(0,0,0,0.5)' 
                        : hasToken 
                          ? '0 0 8px rgba(57, 255, 20, 0.4)' 
                          : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: (isActive || hasToken) ? 'pointer' : 'default',
                      zIndex: 40,
                      transition: 'all 0.2s',
                    }}
                    title={isActive 
                      ? `${config.name} (클릭하여 업그레이드 해제)` 
                      : hasToken 
                        ? `${config.name} (클릭하여 장착)` 
                        : `${config.name} (대기 중인 토큰 없음)`}
                  >
                    <span style={{ 
                      fontSize: '7px', 
                      fontWeight: 'bold', 
                      color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'rgba(255,255,255,0.25)', 
                      textAlign: 'center', 
                      scale: '0.85', 
                      lineHeight: 1.1 
                    }}>
                      {config.label}
                    </span>
                  </div>
                );
              })}

              {/* Render 6 computer data sockets & blue tokens */}
              {Array.from({ length: 6 }).map((_, i) => {
                const isActive = dataCount >= i + 1;
                const socketLeft = `${6 + i * 4.2}%`;
                const socketTop = '82%';
                
                return (
                  <div
                    key={`data-socket-${i}`}
                    style={{
                      position: 'absolute',
                      left: socketLeft,
                      top: socketTop,
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'rgba(5, 10, 25, 0.6)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      boxShadow: 'inset 0 0 3px rgba(0, 229, 255, 0.2)',
                      zIndex: 38
                    }}
                    title={`컴퓨터 데이터 슬롯 #${i + 1}`}
                  >
                    {isActive && (
                      <div
                        className="data-token-blue"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          fontFamily: 'sans-serif',
                          lineHeight: 1
                        }}
                      >
                        데
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Tucked Income Cards Stack peeking from bottom */}
              {tuckedCards.map((card, i) => {
                const income = getCardIncome(card.deck, card.idx);
                return (
                  <div
                    key={`tucked-${i}`}
                    className="tucked-card"
                    style={{
                      position: 'absolute',
                      bottom: '-35px', // tucking depth
                      right: `${10 + i * 22}px`, // stack overlap offset
                      width: '52px',
                      height: '73px',
                      borderRadius: '4px',
                      backgroundImage: `url(${IMAGES[card.deck]})`,
                      backgroundSize: '1000% 700%',
                      backgroundPositionX: `${(card.idx % 10) * 11.11}%`,
                      backgroundPositionY: `${Math.floor(card.idx / 10) * 16.66}%`,
                      zIndex: 30 + i,
                      cursor: 'pointer'
                    }}
                    title={`수입 카드 #${card.idx + 1} (CR +${income.credits}, EN +${income.energy}, DT +${income.data})`}
                  >
                    {/* Floating Mini Resource Indicators */}
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      background: 'rgba(5, 10, 25, 0.85)',
                      border: '0.5px solid rgba(255, 170, 0, 0.4)',
                      borderRadius: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1px 0',
                      pointerEvents: 'none',
                      fontSize: '7px',
                      fontFamily: 'Orbitron',
                      lineHeight: 1
                    }}>
                      <span style={{ color: 'var(--neon-cyan)', scale: '0.9' }}>+크{income.credits}</span>
                      <span style={{ color: 'var(--neon-green)', scale: '0.9' }}>+에{income.energy}</span>
                      {income.data > 0 && <span style={{ color: 'var(--neon-magenta)', scale: '0.9' }}>+데{income.data}</span>}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '100%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>

        {/* Right Side: Hand Cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, height: '100%' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', alignItems: 'center' }}>
            <span>내 손에 든 카드 ({hand.length}장)</span>
            {isSelectingIncomeTuck ? (
              <span style={{ fontSize: '12px', color: 'var(--neon-gold)', fontWeight: 'bold', animation: 'pulse 1s infinite', border: '1px solid var(--neon-gold)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 170, 0, 0.1)' }}>
                수입으로 꽂을 카드를 선택하세요!
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>클릭 시 플레이(CR+1, EN+1, SC+2)</span>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
            <AnimatePresence>
              {hand.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 'auto', textAlign: 'center' }}>
                  현재 핸드에 카드가 없습니다.<br/>상단 '전체 카드 목록' 탭에서 카드를 드로우하세요!
                </div>
              ) : (
                hand.map((card, i) => (
                  <motion.div
                    key={`${card.deck}-${card.idx}-${i}`}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    whileHover={{ y: -15, zIndex: 100, scale: 1.05 }}
                    onClick={() => handleCardClick(i)}
                    className={isSelectingIncomeTuck ? "gold-glow-pulse" : ""}
                    style={{
                      flexShrink: 0,
                      width: '95px',
                      height: '133px',
                      borderRadius: '6px',
                      backgroundImage: `url(${IMAGES[card.deck]})`,
                      backgroundSize: '1000% 700%',
                      backgroundPositionX: `${(card.idx % 10) * 11.11}%`,
                      backgroundPositionY: `${Math.floor(card.idx / 10) * 16.66}%`,
                      border: isSelectingIncomeTuck ? '2px solid var(--neon-gold)' : '2px solid rgba(255,255,255,0.15)',
                      boxShadow: isSelectingIncomeTuck ? '0 0 12px var(--neon-gold)' : '0 6px 12px rgba(0,0,0,0.5)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelectingIncomeTuck) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }}
                    title={isSelectingIncomeTuck ? "클릭하여 수입 카드로 꽂기" : "클릭하여 플레이"}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </footer>

      {/* Zoom Modal Overlay */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 10, 25, 0.95)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
            backdropFilter: 'blur(8px)',
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          {zoomImage.src === imgTechBoard ? (
            /* Custom Interactive Tech Board Modal */
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '90%',
                maxWidth: '1200px',
                background: 'rgba(10, 15, 30, 0.95)',
                border: '2px solid var(--neon-cyan)',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontFamily: 'Orbitron', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass className="animate-spin-slow" />
                  개인 기술 개발 보드 (Technology Board)
                </h2>
                <button 
                  onClick={() => setZoomImage(null)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  닫기
                </button>
              </div>

              <div style={{ display: 'flex', gap: '24px', minHeight: 0 }}>
                {/* Left side: Interactive Board */}
                <div style={{
                  flex: 2,
                  position: 'relative',
                  aspectRatio: '2.15/1',
                  background: '#04060e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={imgTechBoard} 
                    alt="Technology Board"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />

                  {/* Render active upgraded tokens as overlays on the Tech Board */}
                  {Object.entries(upgradedTechSlots).map(([key, isActive]) => {
                    if (!isActive) return null;

                    // Get coordinates
                    let coords = { left: '0%', top: '0%' };
                    let color = '#ffa726'; // Default orange

                    if (key === 'launch') { coords = { left: '12.8%', top: '37%' }; color = '#ff7043'; }
                    else if (key === 'scan') { coords = { left: '21.0%', top: '37%' }; color = '#ffa726'; }
                    else if (key === 'probe') { coords = { left: '29.2%', top: '37%' }; color = '#ffb74d'; }
                    else if (key === 'base') { coords = { left: '37.4%', top: '37%' }; color = '#ffa726'; }
                    else if (key === 'landing') { coords = { left: '45.6%', top: '37%' }; color = '#e64a19'; }
                    else if (key === 'tempSlot') { coords = { left: '53.8%', top: '37%' }; color = '#388e3c'; }
                    
                    // Purple slots
                    else if (key === 'sigEarth') { coords = { left: '62.0%', top: '37%' }; color = '#ba68c8'; }
                    else if (key === 'sigMercury') { coords = { left: '70.2%', top: '37%' }; color = '#ba68c8'; }
                    else if (key === 'sigHand') { coords = { left: '78.4%', top: '37%' }; color = '#ba68c8'; }
                    else if (key === 'sigSat') { coords = { left: '86.6%', top: '37%' }; color = '#ba68c8'; }
                    else if (key === 'sigSat2') { coords = { left: '94.8%', top: '37%' }; color = '#ba68c8'; }

                    // Blue slots (circles)
                    else if (key === 'blue1') { coords = { left: '37.4%', top: '74%' }; color = '#29b6f6'; }
                    else if (key === 'blue2') { coords = { left: '55.0%', top: '74%' }; color = '#29b6f6'; }
                    else if (key === 'blue3') { coords = { left: '72.6%', top: '74%' }; color = '#29b6f6'; }

                    return (
                      <div
                        key={key}
                        style={{
                          position: 'absolute',
                          left: coords.left,
                          top: coords.top,
                          transform: 'translate(-50%, -50%)',
                          width: '7.2%',
                          height: '24%',
                          backgroundColor: 'transparent',
                          border: '2px solid transparent',
                          borderRadius: '4px',
                          boxShadow: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 40
                        }}
                        onClick={() => downgradeTechSlot(key)}
                        title="클릭하여 업그레이드 해제 (토큰 회수)"
                      >
                        <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'white', textAlign: 'center', lineHeight: 1.1 }}>
                          {key === 'landing' ? "위성 착륙" : 
                           key === 'launch' ? "발사" : 
                           key === 'scan' ? "이동/스캔" : 
                           key === 'probe' ? "탐사선" :
                           key === 'base' ? "기지" : 
                           key === 'sigEarth' ? "신호 지구" :
                           key === 'sigMercury' ? "신호 수성" :
                           key === 'sigHand' ? "신호 카드" :
                           key === 'sigSat' ? "신호 위성" :
                           key === 'blue1' ? "연구 1" :
                           key === 'blue2' ? "연구 2" :
                           "연구 3"}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#39ff14', textShadow: '0 0 5px #000' }}>{isActive ? 'O' : ''}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Right side: Rewards Inventory & Sidebar */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--neon-gold)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', fontFamily: 'Orbitron' }}>
                    뒷면 보상 창고 (Facedown Rewards)
                  </h3>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {facedownRewards.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 'auto', textAlign: 'center' }}>
                        획득한 뒷면 기술 보상이 없습니다.<br/>하단 공전 보드에서 기술 토큰을 획득하세요!
                      </div>
                    ) : (
                      facedownRewards.map((reward) => (
                        <div 
                          key={reward.id}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{reward.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--neon-green)', marginTop: '2px' }}>
                              뒷면 가치: <strong>{reward.vp} VP</strong>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => upgradeTechSlot(reward.id)}
                            style={{
                              background: 'rgba(57, 255, 20, 0.15)',
                              border: '1px solid var(--neon-green)',
                              borderRadius: '4px',
                              color: 'var(--neon-green)',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            장착 (앞면 전환)
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                    * 장착 시 기술의 기능이 활성화됩니다.<br/>
                    * 특히 <strong>[위성 착륙 업그레이드]</strong>를 장착해야만 목성계 위성(이오, 유로파 등)에 착륙할 수 있습니다.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Default Zoom Image View */
            <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                color: 'var(--neon-cyan)', 
                fontFamily: 'Orbitron', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                textShadow: '0 0 10px var(--neon-cyan)',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                userSelect: 'none'
              }}>
                {zoomImage.title} (클릭하여 닫기)
              </div>
              <img 
                src={zoomImage.src} 
                alt={zoomImage.title}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}