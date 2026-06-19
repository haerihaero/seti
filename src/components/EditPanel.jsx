import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Radio, HelpCircle, User, Compass, Database, RotateCcw, ChevronRight, Sparkles, Plus, Minus, Info, Settings, Code, FileText } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { IMAGES, DEFAULT_SECTORS, ACTION_DESCRIPTIONS, TECH_SLOTS_CONFIG } from '../constants';
import { shouldShowDialSpaces, getPhysicalSector, getAdjacentSpaces, findSpaceAtRingSector, getTopmostSpaces, getWedgePath } from '../utils/boardUtils';



export default function EditPanel() {
  const {
    setIsEditMode, isEditMode, setIsTechEditMode, setIsTopEditMode, isTechEditMode, isTopEditMode, selectedTopSlotId, setSelectedTopSlotId, TOP_SLOTS, selectedTechActionId, setSelectedTechActionId, TECH_ACTIONS, setVisibleDials, visibleDials, selectedSpaceId, setSelectedSpaceId, SPACES, updateSpaceField, forceUpdate, saveGameState
  } = useGame();

  return (
    <>
      {/* Edit Mode Toggle & Panel */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => { setIsEditMode(!isEditMode); setIsTechEditMode(false); setIsTopEditMode(false); }}
          style={{ background: isEditMode ? 'var(--neon-magenta)' : 'var(--neon-cyan)', color: '#000', fontWeight: 'bold', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isEditMode ? '⚙️ 보드판 편집 종료' : '⚙️ 보드판 편집'}
        </button>
        <button 
          onClick={() => { setIsTechEditMode(!isTechEditMode); setIsEditMode(false); setIsTopEditMode(false); }}
          style={{ background: isTechEditMode ? 'var(--neon-magenta)' : 'var(--neon-green)', color: '#000', fontWeight: 'bold', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isTechEditMode ? '⚙️ 기술판 편집 종료' : '⚙️ 기술판 편집'}
        </button>
        <button 
          onClick={() => { setIsTopEditMode(!isTopEditMode); setIsEditMode(false); setIsTechEditMode(false); }}
          style={{ background: isTopEditMode ? 'var(--neon-magenta)' : 'var(--neon-gold)', color: '#000', fontWeight: 'bold', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isTopEditMode ? '⚙️ 상단 보드 편집 종료' : '⚙️ 상단 보드 편집'}
        </button>
      </div>

      {isTopEditMode && (
        <div style={{ position: 'fixed', top: '50px', right: '10px', zIndex: 9999, background: 'rgba(0,0,0,0.9)', border: '1px solid var(--neon-magenta)', padding: '12px', borderRadius: '8px', color: 'white', width: '320px', fontSize: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
          <h4 style={{margin: '0 0 10px 0', color: 'var(--neon-gold)'}}>상단 보드 궤도선 편집 모드</h4>
          <select 
            value={selectedTopSlotId || ''} 
            onChange={e => setSelectedTopSlotId(e.target.value)}
            style={{width: '100%', padding: '6px', marginBottom: '12px', background: '#222', color: '#fff', border: '1px solid #555'}}
          >
            <option value="">편집할 궤도 칸 선택...</option>
            {TOP_SLOTS.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.name}</option>
            ))}
          </select>
          {selectedTopSlotId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>Left 위치: {TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.left || 0}%</label>
              <input type="range" min="0" max="100" step="0.1" value={TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.left || 0} onChange={e => {
                const slot = TOP_SLOTS.find(a=>a.id===selectedTopSlotId);
                if(slot) { slot.left = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <label>Top 위치: {TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.top || 0}%</label>
              <input type="range" min="0" max="100" step="0.1" value={TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.top || 0} onChange={e => {
                const slot = TOP_SLOTS.find(a=>a.id===selectedTopSlotId);
                if(slot) { slot.top = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <label>크기 (Size): {TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.width || 0}%</label>
              <input type="range" min="1" max="15" step="0.1" value={TOP_SLOTS.find(a=>a.id===selectedTopSlotId)?.width || 0} onChange={e => {
                const slot = TOP_SLOTS.find(a=>a.id===selectedTopSlotId);
                if(slot) { slot.width = parseFloat(e.target.value); slot.height = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <button 
                onClick={() => {
                  saveGameState(true);
                  fetch('/api/save-top-board-slots', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(TOP_SLOTS)
                  }).then(res => res.json()).then(data => {
                    if(data.success) alert('저장 성공!'); else alert('저장 실패!');
                  });
                }}
                style={{ marginTop: '10px', padding: '8px', background: 'var(--neon-gold)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                현재 위치 설정 저장하기 💾
              </button>
            </div>
          )}
        </div>
      )}

      {isTechEditMode && (
        <div style={{ position: 'fixed', top: '50px', right: '10px', zIndex: 9999, background: 'rgba(0,0,0,0.9)', border: '1px solid var(--neon-magenta)', padding: '12px', borderRadius: '8px', color: 'white', width: '320px', fontSize: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
          <h4 style={{margin: '0 0 10px 0', color: 'var(--neon-cyan)'}}>기술판 액션 편집 모드</h4>
          <select 
            value={selectedTechActionId || ''} 
            onChange={e => setSelectedTechActionId(e.target.value)}
            style={{width: '100%', padding: '6px', marginBottom: '12px', background: '#222', color: '#fff', border: '1px solid #555'}}
          >
            <option value="">편집할 버튼 선택...</option>
            {TECH_ACTIONS.map(action => (
              <option key={action.id} value={action.id}>{action.name} ({action.id})</option>
            ))}
          </select>
          {selectedTechActionId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>Left 위치: {TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.left || 0}%</label>
              <input type="range" min="0" max="100" step="0.5" value={TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.left || 0} onChange={e => {
                const act = TECH_ACTIONS.find(a=>a.id===selectedTechActionId);
                if(act) { act.left = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <label>Top 위치: {TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.top || 0}%</label>
              <input type="range" min="0" max="100" step="0.5" value={TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.top || 0} onChange={e => {
                const act = TECH_ACTIONS.find(a=>a.id===selectedTechActionId);
                if(act) { act.top = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <label>너비 (Width): {TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.width || 0}%</label>
              <input type="range" min="1" max="30" step="0.5" value={TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.width || 0} onChange={e => {
                const act = TECH_ACTIONS.find(a=>a.id===selectedTechActionId);
                if(act) { act.width = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <label>높이 (Height): {TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.height || 0}%</label>
              <input type="range" min="1" max="30" step="0.5" value={TECH_ACTIONS.find(a=>a.id===selectedTechActionId)?.height || 0} onChange={e => {
                const act = TECH_ACTIONS.find(a=>a.id===selectedTechActionId);
                if(act) { act.height = parseFloat(e.target.value); forceUpdate({}); }
              }} />
              <button 
                onClick={() => {
                  saveGameState(true);
                  fetch('/api/save-tech-actions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(TECH_ACTIONS)
                  }).then(res => res.json()).then(data => {
                    if(data.success) alert('저장 성공!'); else alert('저장 실패!');
                  });
                }}
                style={{ marginTop: '10px', padding: '8px', background: 'var(--neon-green)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                현재 위치 설정 저장하기 💾
              </button>
            </div>
          )}
        </div>
      )}

      {isEditMode && (
        <div style={{ position: 'fixed', top: '50px', right: '10px', zIndex: 9999, background: 'rgba(0,0,0,0.9)', border: '1px solid var(--neon-magenta)', padding: '12px', borderRadius: '8px', color: 'white', width: '320px', fontSize: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '12px', borderBottom: '1px solid #555', paddingBottom: '12px' }}>
            <h4 style={{margin: '0 0 10px 0', color: 'var(--neon-cyan)'}}>태양계 가시성 필터</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
               <button onClick={() => setVisibleDials([0, 1])} style={{padding: '4px', background: visibleDials.includes(1) && visibleDials.length === 2 ? 'var(--neon-cyan)' : '#444', color: visibleDials.includes(1) && visibleDials.length === 2 ? 'black' : 'white', borderRadius: '4px', border: 'none'}}>1번 태양계 보기</button>
               <button onClick={() => setVisibleDials([0, 2])} style={{padding: '4px', background: visibleDials.includes(2) && visibleDials.length === 2 ? 'var(--neon-cyan)' : '#444', color: visibleDials.includes(2) && visibleDials.length === 2 ? 'black' : 'white', borderRadius: '4px', border: 'none'}}>2번 태양계 보기</button>
               <button onClick={() => setVisibleDials([0, 3])} style={{padding: '4px', background: visibleDials.includes(3) && visibleDials.length === 2 ? 'var(--neon-cyan)' : '#444', color: visibleDials.includes(3) && visibleDials.length === 2 ? 'black' : 'white', borderRadius: '4px', border: 'none'}}>3번 태양계 보기</button>
               <button onClick={() => setVisibleDials([0])} style={{padding: '4px', background: visibleDials.length === 1 && visibleDials.includes(0) ? 'var(--neon-cyan)' : '#444', color: visibleDials.length === 1 && visibleDials.includes(0) ? 'black' : 'white', borderRadius: '4px', border: 'none'}}>4번 태양계(바닥) 보기</button>
               <button onClick={() => setVisibleDials([0, 1, 2, 3])} style={{gridColumn: '1 / span 2', padding: '4px', background: visibleDials.length === 4 ? 'var(--neon-cyan)' : '#444', color: visibleDials.length === 4 ? 'black' : 'white', borderRadius: '4px', border: 'none'}}>전체 보기</button>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
             <h4 style={{margin: '0 0 10px 0'}}>편집할 칸 선택 (현재 보이는 태양계)</h4>
             <select 
                value={selectedSpaceId || ''} 
                onChange={(e) => setSelectedSpaceId(e.target.value)}
                style={{width:'100%', marginBottom:'8px', background:'#222', color:'var(--neon-magenta)', padding: '6px', border: '1px solid var(--neon-magenta)', borderRadius: '4px'}}
             >
                <option value="">-- 보드판에서 칸을 클릭하거나 선택 --</option>
                {SPACES.filter(s => shouldShowDialSpaces(s.dial, visibleDials)).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.dial === 0 ? 4 : s.dial}번 태양계 - {s.id} ({s.planet || s.type})
                  </option>
                ))}
             </select>
          </div>

          {selectedSpaceId ? (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
              <h4 style={{margin: '0 0 10px 0', color: 'var(--neon-gold)'}}>칸 상세 편집: {selectedSpaceId}</h4>
              
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
                  updateSpaceField(selectedSpaceId, 'color', val === 'mic' ? 'var(--neon-green)' : val === 'asteroid' ? 'red' : val === 'hidden' ? 'transparent' : 'black');
                }}
                style={{width:'100%', marginBottom:'8px', background:'#333', color:'white'}}
              >
                <option value="normal">일반 이동칸 (검은색)</option>
                <option value="mic">명성칸 (녹색)</option>
                <option value="asteroid">소행성칸 (적색)</option>
                <option value="hidden">숨김 (투명화, 사용안함)</option>
              </select>

              <label>각도 변경 (위치 수정): {SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0}</label>
              <input type="range" min="-180" max="180" step="0.5" value={SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0} onChange={(e) => updateSpaceField(selectedSpaceId, 'angleOffset', parseFloat(e.target.value))} style={{width: '100%', marginBottom:'8px'}} />
              
              <label>반지름 변경 (위치 수정): {SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0}%</label>
              <input type="range" min="-30" max="30" step="0.1" value={SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0} onChange={(e) => updateSpaceField(selectedSpaceId, 'radiusOffset', parseFloat(e.target.value))} style={{width: '100%', marginBottom:'8px'}} />
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => updateSpaceField(selectedSpaceId, 'angleOffset', (SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0) - 0.5)} style={{flex: 1, padding: '4px'}}>각도 -0.5</button>
                <button onClick={() => updateSpaceField(selectedSpaceId, 'angleOffset', (SPACES.find(s=>s.id===selectedSpaceId)?.angleOffset || 0) + 0.5)} style={{flex: 1, padding: '4px'}}>각도 +0.5</button>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px', marginBottom: '8px' }}>
                <button onClick={() => updateSpaceField(selectedSpaceId, 'radiusOffset', (SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0) - 0.5)} style={{flex: 1, padding: '4px'}}>반지름 -0.5</button>
                <button onClick={() => updateSpaceField(selectedSpaceId, 'radiusOffset', (SPACES.find(s=>s.id===selectedSpaceId)?.radiusOffset || 0) + 0.5)} style={{flex: 1, padding: '4px'}}>반지름 +0.5</button>
              </div>
            </div>
          ) : (
             <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                보드판에서 편집할 칸(원)을 클릭하거나, 위 드롭다운에서 선택하세요.
             </div>
          )}

          <button onClick={() => { 
            saveGameState(true);
            const data = JSON.stringify(SPACES, null, 2);
            console.log(data);
            
            // Try saving to backend file directly
            fetch('/api/save-spaces', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: data
            })
            .then(res => res.json())
            .then(resData => {
              if (resData.success) {
                alert("🎉 설정 파일(src/spaces.json)에 직접 성공적으로 저장되었습니다! \n자동으로 보드판이 갱신됩니다.");
              } else {
                throw new Error(resData.error || '알 수 없는 오류');
              }
            })
            .catch(err => {
              console.error(err);
              // Fallback to clipboard
              navigator.clipboard.writeText(data).then(() => {
                alert("서버 저장에 실패하여 클립보드 복사로 대체되었습니다! \n\n오류: " + err.message + "\n\n콘솔 로그를 복사하여 spaces.json 파일에 직접 저장하셔도 됩니다.");
              }).catch(() => {
                alert("클립보드 복사 및 서버 저장 모두 실패했습니다. F12 콘솔 창에서 복사해주세요.");
              });
            });
          }} style={{width:'100%', padding:'10px', marginTop: '10px', background: 'var(--neon-gold)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>현재 설정 파일(src/spaces.json)에 직접 저장 💾</button>
        </div>
      )}
      

    </>
  );
}
