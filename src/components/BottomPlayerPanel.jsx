import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';

import imgTechBoard from '../img/기술판.png';
import imgTopBoard from '../img/cropped_세티상단.png';
export default function BottomPlayerPanel() {
  const {
    IMAGES, activePlayerId, setActivePlayerId, setCredits, credits, setEnergy, energy, setPrestige, prestige, setScore, score, dataCount, setDataCount, triggerIncreaseIncome, isSelectingIncomeTuck, facedownRewards, upgradeTechSlot, TECH_ACTIONS, isTechEditMode, selectedTechActionId, setSelectedTechActionId, TECH_SLOTS_CONFIG, upgradedTechSlots, handleSlotClick, tuckedCards, getCardIncome, hand, handleCardClick, zoomImage, setZoomImage, downgradeTechSlot, renderTopBoardSlotsOverlay
  } = useGame();

  return (
    <>
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
              width: '100%', aspectRatio: '473/220',
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

              {/* Tech Board Action Buttons Overlay */}
              {TECH_ACTIONS.map(action => {
                const isAvailable = true; // TODO: Implement actual availability logic
                const isSelected = isTechEditMode && selectedTechActionId === action.id;
                
                return (
                  <div 
                    key={action.id}
                    title={`${action.name} (비용: ${action.cost})`}
                    onClick={(e) => {
                      if (isTechEditMode) {
                        e.stopPropagation();
                        setSelectedTechActionId(action.id);
                      } else if (isAvailable) {
                        e.stopPropagation();
                        // Mock action execution for now
                        console.log(`Action clicked: ${action.name}`);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${action.left}%`,
                      top: `${action.top}%`,
                      width: `${action.width}%`,
                      height: `${action.height}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: isTechEditMode || isAvailable ? 'pointer' : 'not-allowed',
                      border: isSelected ? '2px dashed var(--neon-magenta)' : (isTechEditMode ? '1px dashed rgba(255,255,255,0.5)' : 'none'),
                      backgroundColor: isTechEditMode ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                      backdropFilter: !isTechEditMode && !isAvailable ? 'brightness(0.5)' : 'none',
                      transition: 'all 0.2s',
                      zIndex: 30,
                      borderRadius: action.shape === 'circle' ? '50%' : '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isTechEditMode && isAvailable) {
                        e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(0, 229, 255, 0.5), 0 0 10px rgba(0, 229, 255, 0.5)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTechEditMode) {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translate(-50%, -50%)';
                      }
                    }}
                  />
                );
              })}

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
                      backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      border: isActive ? '2px solid #ffeb3b' : hasToken ? '2px dashed var(--neon-green)' : '1px solid transparent',
                      borderRadius: '2px',
                      boxShadow: isActive ? '0 0 10px #ffeb3b, inset 0 0 10px rgba(0,229,255,0.5)' : hasToken ? '0 0 8px rgba(57, 255, 20, 0.4)' : 'none',
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
                      color: isActive ? 'white' : hasToken ? 'var(--neon-green)' : 'transparent',
                      textAlign: 'center', 
                      scale: '0.85', 
                      lineHeight: 1.1 
                    }}>
                      {isActive ? '✓' : (hasToken ? '장착 대기' : '')}
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
                    className="tucked-card" style={{ transition: "all 0.2s", transformOrigin: "bottom center" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(2.2) translateY(-40px)'; e.currentTarget.style.zIndex = 1000; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 'auto'; }}
                    style={{
                      position: 'absolute',
                      bottom: '-35px', // tucking depth
                      right: `${10 + i * 22}px`, // stack overlap offset
                      width: '75px',
                      height: '105px',
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

          <div style={{ flex: 1, display: 'flex', gap: '-20px', overflow: 'visible', paddingBottom: '4px', alignItems: 'center' }}>
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
                    whileHover={{ y: -120, zIndex: 1000, scale: 2.2 }}
                    onClick={() => handleCardClick(i)}
                    className={isSelectingIncomeTuck ? "gold-glow-pulse" : ""}
                    style={{
                      flexShrink: 0,
                      width: '140px',
                      height: '196px',
                      transformOrigin: 'bottom center',
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

                  {/* Tech Board Action Buttons Overlay */}
                  {TECH_ACTIONS.map(action => {
                    const isAvailable = true; // TODO: Implement actual availability logic
                    const isSelected = isTechEditMode && selectedTechActionId === action.id;
                    
                    return (
                      <div 
                        key={action.id}
                        title={`${action.name} (비용: ${action.cost})`}
                        onClick={(e) => {
                          if (isTechEditMode) {
                            e.stopPropagation();
                            setSelectedTechActionId(action.id);
                          } else if (isAvailable) {
                            e.stopPropagation();
                            // Mock action execution for now
                            console.log(`Action clicked: ${action.name}`);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          left: `${action.left}%`,
                          top: `${action.top}%`,
                          width: `${action.width}%`,
                          height: `${action.height}%`,
                          transform: 'translate(-50%, -50%)',
                          cursor: isTechEditMode || isAvailable ? 'pointer' : 'not-allowed',
                          border: isSelected ? '2px dashed var(--neon-magenta)' : (isTechEditMode ? '1px dashed rgba(255,255,255,0.5)' : 'none'),
                          backgroundColor: isTechEditMode ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                          backdropFilter: !isTechEditMode && !isAvailable ? 'brightness(0.5)' : 'none',
                          transition: 'all 0.2s',
                          zIndex: 30,
                          borderRadius: action.shape === 'circle' ? '50%' : '8px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isTechEditMode && isAvailable) {
                            e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(0, 229, 255, 0.5), 0 0 10px rgba(0, 229, 255, 0.5)';
                            e.currentTarget.style.transform = 'translate(-50%, -50%) translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isTechEditMode) {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translate(-50%, -50%)';
                          }
                        }}
                      />
                    );
                  })}

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
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '90vw', maxHeight: '80vh' }}>
                <img 
                  src={zoomImage.src} 
                  alt={zoomImage.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    display: 'block'
                  }}
                />
                {zoomImage.src === imgTopBoard && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
                      {renderTopBoardSlotsOverlay()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
    
    </>
  );
}
