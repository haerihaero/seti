import React from 'react';
import EditPanel from './EditPanel';
import TopHeader from './TopHeader';
import MainContentArea from './MainContentArea';
import BottomPlayerPanel from './BottomPlayerPanel';
import { useGame } from '../contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameBoard() {
  const { toasts = [] } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '16px', boxSizing: 'border-box', gap: '16px' }}>
      <EditPanel />
      <TopHeader />
      <MainContentArea />
      <BottomPlayerPanel />
      
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(5, 10, 25, 0.95)',
                border: '1px solid var(--neon-cyan)',
                borderLeft: '4px solid var(--neon-cyan)',
                color: '#fff',
                padding: '16px 20px',
                borderRadius: '6px',
                boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
                fontFamily: 'Orbitron, "Noto Sans KR", sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                minWidth: '300px',
                maxWidth: '450px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
