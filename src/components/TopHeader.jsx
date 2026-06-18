import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';



export default function TopHeader() {
  const {
    round, setActiveTab, activeTab
  } = useGame();

  return (
    <>
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


    </>
  );
}
