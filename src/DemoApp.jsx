import React, { useState, useEffect } from 'react';
import GraphView from './GraphView';
import UserProgressSidebar from './UserProgressSidebar';

function DemoApp() {
  const [userId, setUserId] = useState('student_001');
  const [completedSkills, setCompletedSkills] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Available skills from your Flask backend
  const availableSkills = [
    'basics_computer',
    'ms_office', 
    'canva',
    'power_bi',
    'ai_tools'
  ];

  const completeSkill = (skillId) => {
    if (!completedSkills.includes(skillId)) {
      setCompletedSkills([...completedSkills, skillId]);
    }
  };

  const resetProgress = () => {
    setCompletedSkills([]);
  };

  // Handle progress updates from GraphView
  const handleProgressUpdate = (newCompletedSkills) => {
    setCompletedSkills(newCompletedSkills);
  };

  // Handle user ID change
  const handleUserIdChange = (newUserId) => {
    setUserId(newUserId);
    setCompletedSkills([]); // Reset progress for new user
  };

  const getSkillDisplayName = (skillId) => {
    const skillMap = {
      'basics_computer': 'Basics of Computer',
      'ms_office': 'MS Office',
      'canva': 'Canva',
      'power_bi': 'Power BI',
      'ai_tools': 'AI Tools'
    };
    return skillMap[skillId] || skillId;
  };

  return (
    <div className="demo-app" style={{ fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex' }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>
            🎯 Gamified Learning Path Graph
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Interactive skill dependency visualization with progress tracking
          </p>
        </header>

        {/* User Management */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '12px',
          border: '1px solid #93c5fd'
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#1e40af' }}>👤 User Management</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ color: '#1e40af', fontWeight: '500' }}>User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => handleUserIdChange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter user ID"
            />
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                padding: '8px 16px',
                backgroundColor: showSidebar ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showSidebar ? 'Hide' : 'Show'} Progress Sidebar
            </button>
          </div>
        </div>

      <div className="skill-controls" style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '15px' }}>Skill Progress Manager</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            <strong>Progress:</strong> {completedSkills.length} / {availableSkills.length} skills completed
          </p>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(completedSkills.length / availableSkills.length) * 100}%`, 
              height: '100%', 
              backgroundColor: '#10b981',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
        
        <div className="skill-buttons" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>Mark Skills as Completed:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableSkills.map(skillId => (
              <button
                key={skillId}
                onClick={() => completeSkill(skillId)}
                disabled={completedSkills.includes(skillId)}
                style={{
                  padding: '8px 16px',
                  border: completedSkills.includes(skillId) 
                    ? '2px solid #10b981' 
                    : '2px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: completedSkills.includes(skillId) 
                    ? '#10b981' 
                    : 'white',
                  color: completedSkills.includes(skillId) 
                    ? 'white' 
                    : '#374151',
                  cursor: completedSkills.includes(skillId) 
                    ? 'default' 
                    : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  opacity: completedSkills.includes(skillId) ? 0.8 : 1
                }}
                onMouseEnter={(e) => {
                  if (!completedSkills.includes(skillId)) {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!completedSkills.includes(skillId)) {
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                {getSkillDisplayName(skillId)}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={resetProgress}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
        >
          🔄 Reset All Progress
        </button>
      </div>

      <div className="graph-container" style={{ 
        border: '2px solid #e5e7eb', 
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}>
        <GraphView 
          userCompletedSkills={completedSkills} 
          userId={userId}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>

      <div className="instructions" style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '12px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '15px' }}>💡 How to Use</h3>
        <ul style={{ color: '#92400e', lineHeight: '1.6' }}>
          <li><strong>Click on skill nodes</strong> to see their details and prerequisites</li>
          <li><strong>Click on unlockable nodes</strong> to mark them as completed</li>
          <li><strong>Watch the graph update</strong> in real-time as you progress</li>
          <li><strong>Green nodes</strong> = completed skills</li>
          <li><strong>Amber nodes</strong> = skills you can unlock now</li>
          <li><strong>Grey nodes</strong> = skills still locked</li>
          <li><strong>Track progress</strong> in the sidebar with points and badges</li>
          <li><strong>Switch users</strong> to see different progress states</li>
        </ul>
      </div>

      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        <p>Built with React + Cytoscape.js + Flask Backend</p>
        <p>🎓 Perfect for gamified learning platforms!</p>
      </footer>
      </div>

      {/* Progress Sidebar */}
      {showSidebar && (
        <UserProgressSidebar
          userId={userId}
          completedSkills={completedSkills}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}

export default DemoApp;
