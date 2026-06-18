import React from 'react';
import EditPanel from './EditPanel';
import TopHeader from './TopHeader';
import MainContentArea from './MainContentArea';
import BottomPlayerPanel from './BottomPlayerPanel';

export default function GameBoard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '16px', boxSizing: 'border-box', gap: '16px' }}>
      <EditPanel />
      <TopHeader />
      <MainContentArea />
      <BottomPlayerPanel />
    </div>
  );
}
