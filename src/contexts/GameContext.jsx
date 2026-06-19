import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG, SPACES, TECH_ACTIONS, TOP_SLOTS } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTechEditMode, setIsTechEditMode] = useState(false);
  const [isTopEditMode, setIsTopEditMode] = useState(false);
  const [selectedTechActionId, setSelectedTechActionId] = useState(null);
  const [selectedTopSlotId, setSelectedTopSlotId] = useState(null);
  const [visibleDials, setVisibleDials] = useState([0, 1, 2, 3]);
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
  const credits = activePlayer?.credits || 0;
  const energy = activePlayer?.energy || 0;
  const prestige = activePlayer?.prestige || 0;
  const score = activePlayer?.score || 0;
  const dataCount = activePlayer?.dataCount || 0;
  const tuckedCards = activePlayer?.tuckedCards || [];
  const hand = activePlayer?.hand || [];
  const facedownRewards = activePlayer?.facedownRewards || [];
  const upgradedTechSlots = activePlayer?.upgradedTechSlots || {};
  const probePosition = activePlayer?.probePosition || null;

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

  const [probes, setProbes] = useState([
    { id: 1, type: 'probe', spaceId: 'earth', playerId: 1 }
  ]);

  const [toasts, setToasts] = useState([]);

  const showToast = (msg, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

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
    const probe = probes.find(p => p.id === probeId);
    const playerId = probe ? probe.playerId : activePlayerId;
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

  const [topBoardWidthRatio, setTopBoardWidthRatio] = useState(0.98);
  const [topBoardImgHeight, setTopBoardImgHeight] = useState(75);
  const [bottomBoardWidthRatio, setBottomBoardWidthRatio] = useState(1.906);
  const [bottomBoardImgHeight, setBottomBoardImgHeight] = useState(80);

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
      setTimeout(() => {
        if (alertMsgs.length > 0) {
          showToast(`[공전 물리 작용] 원판 회전으로 인해 탐사선이 밀려났습니다:\n${alertMsgs.join('\n')}`, 4000);
        }
      }, 1000);
    }

    setRing1Angle(newRing1Angle);
    setRing2Angle(newRing2Angle);
    setRing3Angle(newRing3Angle);
    setOrbitStep(nextStep);
    
    if (nextStep === 0) {
      setRound(r => Math.min(r + 1, 5));
      
      // Process income from tucked cards for ALL players on round end (transition back to step 0)
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
          setTimeout(() => {
            showToast(msg, 6000);
          }, 1000);
        }
        return updated;
      });
    }
    setScore(s => s + 1); // VP gain for active player
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
        if (state.bottomBoardImgHeight !== undefined) setBottomBoardImgHeight(parseInt(state.bottomBoardImgHeight));
        
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

  const saveGameState = (silent = false) => {
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
      bottomBoardImgHeight,
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
    if (!silent) alert("현재 원판 위치, 공전토큰 위치, 구역판 및 게임 상태가 저장되었습니다!");
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
      if (state.bottomBoardImgHeight !== undefined) setBottomBoardImgHeight(parseInt(state.bottomBoardImgHeight));

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



  const renderTopBoardSlotsOverlay = () => {
    return TOP_SLOTS.map(slot => {
      const isSelected = isTopEditMode && selectedTopSlotId === slot.id;
      // In actual game, check if probe is placed here.
      const hasProbe = false;
      const isAvailable = true; // In actual game, determine if it's placeable

      return (
        <div 
          key={slot.id}
          title={slot.name}
          onClick={(e) => {
            if (isTopEditMode) {
              e.stopPropagation();
              setSelectedTopSlotId(slot.id);
            } else if (isAvailable) {
              e.stopPropagation();
              if (slot.type === 'moon') {
                alert(`${slot.name}: 이 위성에는 탐사선을 1개만 배치할 수 있습니다.`);
              } else {
                alert(`${slot.name}: 탐사선 배치`);
              }
            }
          }}
          style={{
            position: 'absolute',
            left: `${slot.left}%`,
            top: `${slot.top}%`,
            width: `${slot.width}%`,
            height: `${slot.height}%`,
            transform: 'translate(-50%, -50%)',
            cursor: isTopEditMode || isAvailable ? 'pointer' : 'default',
            border: isSelected ? '2px dashed var(--neon-gold)' : (isTopEditMode ? '1px dashed rgba(255,255,255,0.5)' : (hasProbe ? 'none' : '2px dotted rgba(255,255,255,0.4)')),
            backgroundColor: isTopEditMode ? 'rgba(255, 170, 0, 0.2)' : 'transparent',
            borderRadius: slot.shape === 'circle' ? '50%' : '8px',
            zIndex: 30,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isTopEditMode && !hasProbe && isAvailable) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 170, 0, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 170, 0, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isTopEditMode) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        />
      );
    });
  };

  
  return (
    <GameContext.Provider value={{
      IMAGES,
      DEFAULT_SECTORS,
      ACTION_DESCRIPTIONS,
      TECH_SLOTS_CONFIG,
      SPACES,
      TECH_ACTIONS,
      TOP_SLOTS,
      forceUpdate,
      isEditMode,
      setIsEditMode,
      isTechEditMode,
      setIsTechEditMode,
      isTopEditMode,
      setIsTopEditMode,
      selectedTechActionId,
      setSelectedTechActionId,
      selectedTopSlotId,
      setSelectedTopSlotId,
      visibleDials,
      setVisibleDials,
      selectedSpaceId,
      setSelectedSpaceId,
      playersData,
      setPlayersData,
      activePlayerId,
      setActivePlayerId,
      signalTokens,
      setSignalTokens,
      activeSectorPopup,
      setActiveSectorPopup,
      round,
      setRound,
      orbitStep,
      setOrbitStep,
      sectors,
      setSectors,
      shuffledQuadrants,
      setShuffledQuadrants,
      jupiterSlots,
      setJupiterSlots,
      ring1Angle,
      setRing1Angle,
      ring2Angle,
      setRing2Angle,
      ring3Angle,
      setRing3Angle,
      probes,
      setProbes,
      isSelectingIncomeTuck,
      setIsSelectingIncomeTuck,
      selectedDeck,
      setSelectedDeck,
      activeTab,
      setActiveTab,
      rightBoardTab,
      setRightBoardTab,
      alignMode,
      setAlignMode,
      alignDialStep,
      setAlignDialStep,
      alignX,
      setAlignX,
      alignY,
      setAlignY,
      alignScale,
      setAlignScale,
      alignRingOffset,
      setAlignRingOffset,
      alignRing1Radius,
      setAlignRing1Radius,
      alignRing2Radius,
      setAlignRing2Radius,
      alignRing3Radius,
      setAlignRing3Radius,
      alignDial1Scale,
      setAlignDial1Scale,
      alignDial2Scale,
      setAlignDial2Scale,
      alignDial3Scale,
      setAlignDial3Scale,
      alignDialX,
      setAlignDialX,
      alignDialY,
      setAlignDialY,
      alignDialScale,
      setAlignDialScale,
      dialCoords,
      setDialCoords,
      alignBorderX,
      setAlignBorderX,
      alignBorderY,
      setAlignBorderY,
      alignBorderScale,
      setAlignBorderScale,
      alienLeftX,
      setAlienLeftX,
      alienLeftY,
      setAlienLeftY,
      alienLeftScale,
      setAlienLeftScale,
      alienRightX,
      setAlienRightX,
      alienRightY,
      setAlienRightY,
      alienRightScale,
      setAlienRightScale,
      topBoardWidthRatio,
      setTopBoardWidthRatio,
      topBoardImgHeight,
      setTopBoardImgHeight,
      bottomBoardWidthRatio,
      setBottomBoardWidthRatio,
      bottomBoardImgHeight,
      setBottomBoardImgHeight,
      leftAlienTrack,
      setLeftAlienTrack,
      rightAlienTrack,
      setRightAlienTrack,
      leftAlienManualReveal,
      setLeftAlienManualReveal,
      rightAlienManualReveal,
      setRightAlienManualReveal,
      sectorDataTokens,
      setSectorDataTokens,
      activeMovementPoints,
      setActiveMovementPoints,
      selectedProbeId,
      setSelectedProbeId,
      lastSavedTime,
      setLastSavedTime,
      zoomImage,
      setZoomImage,
      activeActionInfo,
      setActiveActionInfo,
      bottomBoardTokens,
      setBottomBoardTokens,
      boardSize,
      setBoardSize,
      updateSpaceField,
      activePlayer,
      credits,
      energy,
      prestige,
      score,
      dataCount,
      tuckedCards,
      hand,
      facedownRewards,
      upgradedTechSlots,
      probePosition,
      setCredits,
      setEnergy,
      setPrestige,
      setScore,
      setDataCount,
      setTuckedCards,
      setHand,
      setFacedownRewards,
      setUpgradedTechSlots,
      getCardIncome,
      triggerIncreaseIncome,
      tuckCardForIncome,
      moveTo,
      upgradeProbe,
      handleCardClick,
      isLeftAlienTrackFilled,
      isLeftAlienRevealed,
      isRightAlienTrackFilled,
      isRightAlienRevealed,
      takeTechToken,
      upgradeTechSlot,
      downgradeTechSlot,
      handleSlotClick,
      containerRef,
      triggerOrbit,
      shuffleArray,
      randomizeSectors,
      saveGameState,
      loadGameState,
      joinJupiterSlot,
      recallFromJupiter,
      toggleSignalToken,
      cycleAlienTrackSlot,
      applyScanBonus,
      addCardToHand,
      playCard,
      renderTopBoardSlotsOverlay,
      toasts,
      showToast
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
