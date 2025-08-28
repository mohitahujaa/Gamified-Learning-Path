import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import axios from 'axios';

// Register the dagre layout with Cytoscape
cytoscape.use(dagre);

const GraphView = ({ userCompletedSkills = [] }) => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [unlockableSkills, setUnlockableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all skills from the backend
  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/skills/');
      if (response.data.success) {
        setSkills(response.data.skills);
      } else {
        throw new Error('Failed to fetch skills');
      }
    } catch (err) {
      setError('Error fetching skills: ' + err.message);
      console.error('Error fetching skills:', err);
    }
  };

  // Fetch unlockable skills based on completed skills
  const fetchUnlockableSkills = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/skills/unlockable', {
        completed_skills: userCompletedSkills
      });
      if (response.data.success) {
        setUnlockableSkills(response.data.unlockable);
      } else {
        throw new Error('Failed to fetch unlockable skills');
      }
    } catch (err) {
      setError('Error fetching unlockable skills: ' + err.message);
      console.error('Error fetching unlockable skills:', err);
    }
  };

  // Initialize the graph when skills data changes
  useEffect(() => {
    if (skills.length === 0) return;

    // Create nodes and edges for Cytoscape
    const nodes = skills.map(skill => ({
      data: {
        id: skill.id,
        label: skill.name,
        description: skill.description,
        prerequisites: skill.prerequisites
      }
    }));

    const edges = [];
    skills.forEach(skill => {
      skill.prerequisites.forEach(prereqId => {
        edges.push({
          data: {
            id: `${prereqId}-${skill.id}`,
            source: prereqId,
            target: skill.id
          }
        });
      });
    });

    // Initialize Cytoscape
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: nodes,
        edges: edges
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele) => {
              const nodeId = ele.id();
              if (userCompletedSkills.includes(nodeId)) {
                return '#10B981'; // Green for completed skills
              } else if (unlockableSkills.some(skill => skill.id === nodeId)) {
                return '#F59E0B'; // Amber for unlockable skills
              } else {
                return '#6B7280'; // Grey for locked skills
              }
            },
            'color': '#FFFFFF',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            'font-size': '12px',
            'font-weight': 'bold',
            'border-width': 2,
            'border-color': '#374151',
            'width': 80,
            'height': 80,
            'shape': 'ellipse'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#6B7280',
            'target-arrow-color': '#6B7280',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.5
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'LR', // Left to right layout
        nodeSep: 100,
        rankSep: 150,
        padding: 50
      }
    });

    // Add click event handler
    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      const skillName = node.data('label');
      const prerequisites = node.data('prerequisites');
      
      let message = `Skill: ${skillName}\n`;
      if (prerequisites.length === 0) {
        message += 'Prerequisites: None (Starting skill)';
      } else {
        const prereqNames = prerequisites.map(prereqId => {
          const prereqSkill = skills.find(s => s.id === prereqId);
          return prereqSkill ? prereqSkill.name : prereqId;
        });
        message += `Prerequisites: ${prereqNames.join(', ')}`;
      }
      
      alert(message);
    });

    // Add hover effects
    cyRef.current.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      node.style('border-width', 4);
      node.style('border-color', '#3B82F6');
    });

    cyRef.current.on('mouseout', 'node', (evt) => {
      const node = evt.target;
      node.style('border-width', 2);
      node.style('border-color', '#374151');
    });

    setLoading(false);
  }, [skills, unlockableSkills, userCompletedSkills]);

  // Fetch data on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch unlockable skills when userCompletedSkills changes
  useEffect(() => {
    if (skills.length > 0) {
      fetchUnlockableSkills();
    }
  }, [userCompletedSkills, skills]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '256px' 
      }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading skill graph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '256px' 
      }}>
        <div style={{ fontSize: '18px', color: '#dc2626' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ 
        marginBottom: '16px', 
        padding: '16px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Skill Graph Legend</h3>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#10b981', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></div>
            <span>Completed Skills</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#f59e0b', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></div>
            <span>Unlockable Skills</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#6b7280', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></div>
            <span>Locked Skills</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '384px', 
          border: '1px solid #d1d5db', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          minHeight: '400px' 
        }}
      />
      
      <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
        <p>💡 Click on any skill node to see its details and prerequisites</p>
        <p>🔄 The graph updates automatically based on your completed skills</p>
      </div>
    </div>
  );
};

export default GraphView;
