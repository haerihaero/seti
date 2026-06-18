import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';

import imgMainBoard from '../img/cropped_세티본판.png';

import imgTechBoard from '../img/기술판.png';
import imgTopBoard from '../img/cropped_세티상단.png';
export default function MainBoard() {
  const {
    setSelectedProbeId, setZoomImage, jupiterSlots, sectors, alignBorderX, alignBorderY, alignBorderScale, shuffledQuadrants, IMAGES, alignRingOffset, signalTokens, setActiveSectorPopup, sectorDataTokens, alignX, alignY, alignScale, visibleDials, ring1Angle, ring2Angle, ring3Angle, selectedProbeId, probes, alignDial1Scale, alignDial2Scale, alignDial3Scale, alignRing1Radius, alignRing2Radius, alignRing3Radius, isEditMode, setSelectedSpaceId, moveTo, activePlayerId, activeSectorPopup, setSectorDataTokens, toggleSignalToken, addCardToHand, playCard
  } = useGame();

  return (
    <>
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
                    objectFit: 'contain',
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
                     if (!visibleDials.includes(dialNum)) return null;
                     const angle = dialNum === 0 ? 0 : dialNum === 1 ? ring1Angle : dialNum === 2 ? ring2Angle : ring3Angle;
                     const imgUrl = dialNum === 1 ? IMAGES.ring1 : dialNum === 2 ? IMAGES.ring2 : dialNum === 3 ? IMAGES.ring3 : null;
                     
                     // Get all topmost spaces across the entire board
                     const topmostSpaces = getTopmostSpaces(ring1Angle, ring2Angle, ring3Angle, visibleDials);
                     
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
                           
                                                      {/* Space Wedges SVG Overlay */}
                           <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 25, overflow: 'visible' }}>
                             {shouldShowDialSpaces(dialNum, visibleDials) && dialSpaces.map(space => {
                               const rOffset = space.radiusOffset || 0;
                               const rIn = (space.ring === 1 ? alignRing1Radius - 6 : space.ring === 2 ? alignRing2Radius - 5 : alignRing3Radius - 6) + rOffset;
                               const rOut = (space.ring === 1 ? alignRing1Radius + 5 : space.ring === 2 ? alignRing2Radius + 6 : alignRing3Radius + 6) + rOffset;
                               const angleDeg = space.angle + (space.angleOffset || 0);
                               let spanHalf = 22.5;
                               if (space.span !== undefined) spanHalf = space.span / 2;
                               else if (space.dial === 1) spanHalf = 36; // 5 wedges = 72 deg
                               else if (space.dial === 2) spanHalf = 22.5; // 8 wedges = 45 deg
                               else if (space.dial === 3) spanHalf = 11.25; // 16 wedges = 22.5 deg
                               const startAngle = angleDeg - spanHalf;
                               const endAngle = angleDeg + spanHalf;
                               const isHighlighted = adjSpaces.some(s => s.id === space.id);
                               
                               return (
                                 <path
                                   key={`wedge-${space.id}`}
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
                                     filter: isHighlighted ? `drop-shadow(0 0 4px ${space.color})` : 'none'
                                   }}
                                 >
                                   <title>{space.name || space.id}</title>
                                 </path>
                               );
                             })}
                           </svg>
                           
                           {/* Space Nodes */}
                           {shouldShowDialSpaces(dialNum, visibleDials) && dialSpaces.map(space => {
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
                                    justifyContent: 'center',
                                    zIndex: 30
                                 }}>
                                    
                                    
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
                                          className={`physical-token ${isSelected ? 'selected' : ''}`}
                                          style={{
                                            position: 'absolute',
                                            transform: `translate(${px}px, ${py}px) ${isSelected ? 'scale(1.25)' : 'scale(1)'}`,
                                            width: probe.type === 'orbiter' ? '24px' : '20px',
                                            height: probe.type === 'orbiter' ? '24px' : '20px',
                                            borderRadius: probe.type === 'orbiter' ? '50%' : '50%', /* Made all tokens circular discs like physical board game */
                                            background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${color} 40%, #111111 110%)`,
                                            color: color,
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            fontFamily: 'Orbitron',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: probe.playerId === activePlayerId ? 'pointer' : 'default',
                                            zIndex: isSelected ? 45 : 40,
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


    </>
  );
}
