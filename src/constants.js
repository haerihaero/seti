export const IMAGES = {
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

export const DEFAULT_SECTORS = [
  { id: 'proxima', name: 'PROXIMA CENTAURI', color: 'rgba(255, 60, 60, 0.12)', glow: 'rgba(255, 60, 60, 0.8)', bonus: '명성 +1, 데이터 +1', dataTokensRequired: 6 },
  { id: 'kepler', name: 'KEPLER 22', color: 'rgba(30, 144, 255, 0.12)', glow: 'rgba(30, 144, 255, 0.8)', bonus: '크레딧 +2', dataTokensRequired: 6 },
  { id: 'barnard', name: "BARNARD'S STAR", color: 'rgba(255, 140, 0, 0.12)', glow: 'rgba(255, 140, 0, 0.8)', bonus: '에너지 +2', dataTokensRequired: 5 },
  { id: 'virginis', name: '61 VIRGINIS', color: 'rgba(139, 69, 19, 0.12)', glow: 'rgba(139, 69, 19, 0.8)', bonus: '데이터 +2', dataTokensRequired: 5 },
  { id: 'beta_pictoris', name: 'BETA PICTORIS', color: 'rgba(148, 0, 211, 0.12)', glow: 'rgba(148, 0, 211, 0.8)', bonus: '카드 1장', dataTokensRequired: 6 },
  { id: 'sirius', name: 'SIRIUS A', color: 'rgba(0, 255, 255, 0.12)', glow: 'rgba(0, 255, 255, 0.8)', bonus: '명성 +2', dataTokensRequired: 4 },
  { id: 'vega', name: 'VEGA', color: 'rgba(245, 245, 245, 0.12)', glow: 'rgba(245, 245, 245, 0.8)', bonus: '에너지 +1, 크레딧 +1', dataTokensRequired: 5 },
  { id: 'procyon', name: 'PROCYON', color: 'rgba(0, 250, 154, 0.12)', glow: 'rgba(0, 250, 154, 0.8)', bonus: '승점 +2', dataTokensRequired: 5 }
];

export const ACTION_DESCRIPTIONS = {
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

export const TECH_SLOTS_CONFIG = {
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

import initialSpaces from './spaces.json';
import initialTechActions from './tech_actions.json';
import initialTopSlots from './top_board_slots.json';

export const SPACES = JSON.parse(JSON.stringify(initialSpaces));
export const TECH_ACTIONS = JSON.parse(JSON.stringify(initialTechActions));
export const TOP_SLOTS = JSON.parse(JSON.stringify(initialTopSlots));
