import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProgressSidebar = ({ userId, completedSkills, onProgressUpdate }) => {
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user summary from backend
  const fetchUserSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/skills/user_summary/${userId}`);
      
      if (response.data.success) {
        setUserSummary(response.data);
        // Update parent component with latest completed skills
        if (onProgressUpdate) {
          onProgressUpdate(response.data.completed_skills);
        }
      } else {
        throw new Error(response.data.error || 'Failed to fetch user summary');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user summary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user summary when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchUserSummary();
    }
  }, [userId]);

  // Refresh user summary when completed skills change
  useEffect(() => {
    if (userId && completedSkills.length > 0) {
      fetchUserSummary();
    }
  }, [completedSkills, userId]);

  if (loading) {
    return (
      <div className="user-progress-sidebar">
        <div className="loading">Loading progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-progress-sidebar">
        <div className="error">Error: {error}</div>
        <button onClick={fetchUserSummary} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!userSummary) {
    return (
      <div className="user-progress-sidebar">
        <div className="no-data">No progress data available</div>
      </div>
    );
  }

  return (
    <div className="user-progress-sidebar" style={{
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
          ID: {userId}
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
              {userSummary.completed_skills.length} / {userSummary.total_skills}
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
              width: `${userSummary.progress_percentage}%`,
              height: '100%',
              backgroundColor: '#10b981',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
            {userSummary.progress_percentage}% Complete
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
            ⭐ {userSummary.points}
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
        
        {userSummary.badges.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No badges yet. Keep learning to earn badges!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {userSummary.badges.map((badge, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <span style={{ fontSize: '20px' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#92400e' }}>{badge.name}</div>
                  <div style={{ fontSize: '12px', color: '#a16207' }}>{badge.description}</div>
                </div>
              </div>
            ))}
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
        
        {userSummary.completed_skills.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No skills completed yet. Start with the basics!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {userSummary.completed_skills.map((skillId, index) => {
              const skill = userSummary.completed_skills.find(s => s.id === skillId);
              return (
                <div key={index} style={{
                  padding: '6px 8px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                  fontSize: '12px',
                  color: '#166534'
                }}>
                  {skill ? skill.name : skillId}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={fetchUserSummary}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔄 Refresh Progress
        </button>
      </div>
    </div>
  );
};

export default UserProgressSidebar;
