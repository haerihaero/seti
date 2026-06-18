import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';

import MainBoard from './MainBoard';
import imgTopBoard from '../img/cropped_세티상단.png';
import imgBottomBoard from '../img/cropped_세티하단.png';
import imgTechBoard from '../img/기술판.png';
import imgAlienBoard from '../img/alien.png';
import imgAlienRevealed from '../img/alien_revealed.png';

export default function MainContentArea() {
  const {
    randomizeSectors, saveGameState, loadGameState, lastSavedTime, setAlignMode, alignMode, alignX, setAlignX, alignY, setAlignY, alignScale, setAlignScale, alignRingOffset, setAlignRingOffset, alignRing1Radius, setAlignRing1Radius, alignRing2Radius, setAlignRing2Radius, alignRing3Radius, setAlignRing3Radius, alignDial1Scale, setAlignDial1Scale, alignDial2Scale, setAlignDial2Scale, alignDial3Scale, setAlignDial3Scale, alignBorderX, setAlignBorderX, alignBorderY, setAlignBorderY, alignBorderScale, setAlignBorderScale, alignDialX, setAlignDialX, alignDialY, setAlignDialY, alignDialScale, setAlignDialScale, alignDialStep, setAlignDialStep, dialCoords, setDialCoords, alienLeftX, setAlienLeftX, alienLeftY, setAlienLeftY, alienLeftScale, setAlienLeftScale, alienRightX, setAlienRightX, alienRightY, setAlienRightY, alienRightScale, setAlienRightScale, topBoardWidthRatio, setTopBoardWidthRatio, topBoardImgHeight, setTopBoardImgHeight, bottomBoardWidthRatio, setBottomBoardWidthRatio, bottomBoardImgHeight, setBottomBoardImgHeight, setLeftAlienTrack, setRightAlienTrack, setLeftAlienManualReveal, setRightAlienManualReveal, setActiveMovementPoints, setSectorDataTokens, activeTab, containerRef, setRightBoardTab, rightBoardTab, setZoomImage, renderTopBoardSlotsOverlay, isLeftAlienRevealed, isRightAlienRevealed, leftAlienTrack, cycleAlienTrackSlot, rightAlienTrack, IMAGES, orbitStep, bottomBoardTokens, takeTechToken, triggerOrbit, setPlayersData, credits, probes, setProbes, SPACES, activeMovementPoints, ring1Angle, ring2Angle, ring3Angle, upgradeProbe, recallFromJupiter, setSelectedDeck, selectedDeck, addCardToHand, ACTION_DESCRIPTIONS, applyScanBonus, playCard
  } = useGame();

  const [isOrbiting, setIsOrbiting] = React.useState(false);

  return (
    <>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 5px 0' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--neon-magenta)' }}>공전 토큰 다이얼 정렬</span>
                <button 
                  onClick={() => {
                    setAlignDialX(27.5);
                    setAlignDialY(50.0);
                    setAlignDialScale(22.0);
                    setDialCoords({
                      0: { x: 54, y: 90 }, // 공전 1 (6시)
                      1: { x: 82, y: 42 }, // 공전 2 (2시)
                      2: { x: 18, y: 66 }  // 공전 3 (9시)
                    });
                    alert("공전 다이얼 정렬 값이 초기화되었습니다.");
                  }}
                  style={{
                    background: 'rgba(255, 0, 127, 0.15)',
                    border: '1px solid var(--neon-magenta)',
                    color: 'var(--neon-magenta)',
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  다이얼 개별 초기화
                </button>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>다이얼 X: {alignDialX}%</label>
                <input type="range" min="0" max="100" step="0.1" value={alignDialX} onChange={e => setAlignDialX(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label>다이얼 Y: {alignDialY}%</label>
                <input type="range" min="0" max="100" step="0.1" value={alignDialY} onChange={e => setAlignDialY(parseFloat(e.target.value))} style={{ width: '100%' }} />
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
                  type="range" min="-100" max="200" step="0.5" 
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
                  type="range" min="-100" max="200" step="0.5" 
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
              <div style={{ marginBottom: '8px' }}>
                <label>하단 보드 이미지 높이 (%): {bottomBoardImgHeight}%</label>
                <input type="range" min="50" max="100" step="1" value={bottomBoardImgHeight} onChange={e => setBottomBoardImgHeight(parseInt(e.target.value))} style={{ width: '100%' }} />
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
                  setTopBoardImgHeight(75);
                  setBottomBoardWidthRatio(1.906);
                  setBottomBoardImgHeight(80);
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
              
              <MainBoard />
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
                      width: '100%',
                      height: 'auto',
                      alignSelf: 'center'
                    }}
                    title="클릭하여 확대 보기"
                  >
                    {/* Top Edge Hover Zone for auto-reveal */}
                    <div 
                      onMouseEnter={() => {
                        const container = document.getElementById('top-board-inner-container');
                        const btn = document.getElementById('alien-board-toggle-btn');
                        if (container && btn) {
                          container.style.transform = 'translateY(55%)';
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
                        if (container.style.transform === 'translateY(55%)') {
                          container.style.transform = 'translateY(0%)';
                          e.currentTarget.innerHTML = '▲ 외계인 보드 보기';
                        } else {
                          container.style.transform = 'translateY(55%)';
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
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0 0 11px 11px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
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
                              height: 'auto',
                              opacity: 0.85,
                              pointerEvents: 'auto',
                              display: 'block'
                            }}
                          />
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            {renderTopBoardSlotsOverlay()}
                          </div>
                        </div>
                      </div>
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
                      width: '100%',
                      height: 'auto',
                      alignSelf: 'center'
                    }}
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
                    <div 
                      id="bottom-board-inner-container"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: `${bottomBoardImgHeight}%`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <img 
                        src={imgBottomBoard} 
                        alt="Bottom Board"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill',
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
                        height: `${alignDialScale * bottomBoardWidthRatio * (100 / bottomBoardImgHeight)}%`, // Compensate for parent ratio & image height scaling to keep dial perfectly square
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
                    <button 
                      onClick={() => {
                        if (isOrbiting) return;
                        setIsOrbiting(true);
                        triggerOrbit();
                        setTimeout(() => setIsOrbiting(false), 1000);
                      }} 
                      disabled={isOrbiting}
                      className="neon-btn neon-btn-magenta" 
                      style={{ 
                        width: '100%', 
                        padding: '6px 0', 
                        fontSize: '13px',
                        opacity: isOrbiting ? 0.5 : 1,
                        cursor: isOrbiting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isOrbiting ? "공전 중..." : "공전 실행 (다이얼 전진)"}
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
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(2.2)'; e.currentTarget.style.zIndex = 1000; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 'auto'; }}
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

    </>
  );
}
