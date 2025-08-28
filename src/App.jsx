import React, { useState } from 'react';
import GraphView from './components/GraphView';

function App() {
  const [userCompletedSkills, setUserCompletedSkills] = useState(['basics']);
  const [userPoints, setUserPoints] = useState(50);
  const [userBadges, setUserBadges] = useState(['FIRST_STEP']);

  const addCompletedSkill = (skillId) => {
    if (!userCompletedSkills.includes(skillId)) {
      setUserCompletedSkills([...userCompletedSkills, skillId]);
      setUserPoints(userPoints + 50);
      
      // Award PATH_MASTER badge if all skills completed
      if (userCompletedSkills.length + 1 >= 5) {
        setUserBadges(['FIRST_STEP', 'PATH_MASTER']);
      }
    }
  };

  const resetProgress = () => {
    setUserCompletedSkills([]);
    setUserPoints(0);
    setUserBadges([]);
  };

  return (
    <div className="App" style={{ 
      fontFamily: 'Arial, sans-serif', 
      height: '100vh', 
      display: 'flex',
      backgroundColor: '#f8fafc'
    }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>
            🎯 Gamified Learning Path Graph
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Interactive skill dependency visualization
          </p>
        </header>

        {/* Skill Management Controls */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#374151' }}>Skill Progress Manager</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#6b7280' }}>Completed Skills:</span>
            <span style={{ fontWeight: 'bold', color: '#059669' }}>
              {userCompletedSkills.length} / 5
            </span>
            <button
              onClick={resetProgress}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Reset Progress
            </button>
          </div>
        </div>

        {/* Graph Container */}
        <div style={{ 
          border: '2px solid #e2e8f0', 
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <GraphView userCompletedSkills={userCompletedSkills} />
        </div>

        {/* Instructions */}
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '12px',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '15px' }}>💡 How to Use</h3>
          <ul style={{ color: '#92400e', lineHeight: '1.6' }}>
            <li><strong>Click on skill nodes</strong> to see their details and prerequisites</li>
            <li><strong>Green nodes</strong> = completed skills</li>
            <li><strong>Amber nodes</strong> = skills you can unlock now</li>
            <li><strong>Grey nodes</strong> = skills still locked</li>
            <li><strong>Track progress</strong> in the sidebar with points and badges</li>
          </ul>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div style={{
        width: '300px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #e2e8f0',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* User Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 12px'
          }}>
            👤
          </div>
          <h3 style={{ margin: '0', color: '#1e293b' }}>Student Progress</h3>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            ID: student_001
          </p>
        </div>

        {/* Progress Overview */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 12px', color: '#374151' }}>📊 Progress Overview</h4>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Completed Skills:</span>
              <span style={{ fontWeight: 'bold', color: '#059669' }}>
                {userCompletedSkills.length} / 5
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(userCompletedSkills.length / 5) * 100}%`,
                height: '100%',
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
              {Math.round((userCompletedSkills.length / 5) * 100)}% Complete
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6b7280' }}>Total Points:</span>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⭐ {userPoints}
            </span>
          </div>
        </div>

        {/* Badges Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 12px', color: '#374151' }}>🏆 Badges Earned</h4>
          
          {userBadges.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              No badges yet. Keep learning to earn badges!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userBadges.map((userBadge, index) => {
                const badgeInfo = {
                  'FIRST_STEP': { name: 'First Step', description: 'Completed your first skill!', icon: '🎯' },
                  'PATH_MASTER': { name: 'Path Master', description: 'Completed all skills in the learning path!', icon: '🏆' }
                };
                
                const info = badgeInfo[userBadge];
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <span style={{ fontSize: '20px' }}>{info.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#92400e' }}>{info.name}</div>
                      <div style={{ fontSize: '12px', color: '#a16207' }}>{info.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Skills List */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 12px', color: '#374151' }}>✅ Completed Skills</h4>
          
          {userCompletedSkills.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              No skills completed yet. Start with the basics!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {userCompletedSkills.map((skillId, index) => (
                <div key={index} style={{
                  padding: '6px 8px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                  fontSize: '12px',
                  color: '#166534'
                }}>
                  {skillId === 'basics' ? 'Basics of Computer' : 
                   skillId === 'ms_office' ? 'MS Office' :
                   skillId === 'canva' ? 'Canva' :
                   skillId === 'powerbi' ? 'Power BI' :
                   skillId === 'ai_tools' ? 'AI Tools' : skillId}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
