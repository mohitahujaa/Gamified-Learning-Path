import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import axios from 'axios';

// Register the dagre layout with Cytoscape
cytoscape.use(dagre);

const GraphView = ({ userCompletedSkills = [], userId = "default_user", onProgressUpdate }) => {
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
        user_id: userId,
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

  // Mark skill as completed
  const markSkillCompleted = async (skillId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/skills/progress', {
        user_id: userId,
        skill_id: skillId
      });
      
      if (response.data.success) {
        // Update unlockable skills
        setUnlockableSkills(response.data.unlockable_skills);
        
        // Notify parent component about progress update
        if (onProgressUpdate) {
          onProgressUpdate(response.data.completed_skills);
        }
        
        // Show success message
        alert(`🎉 Skill "${skillId}" completed successfully!`);
      } else {
        throw new Error(response.data.error || 'Failed to mark skill as completed');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Error marking skill as completed:', err);
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
      const skillId = node.id();
      const skillName = node.data('label');
      const prerequisites = node.data('prerequisites');
      
      // Check if skill is unlockable and not completed
      const isUnlockable = unlockableSkills.some(skill => skill.id === skillId);
      const isCompleted = userCompletedSkills.includes(skillId);
      
      if (isUnlockable && !isCompleted) {
        // Show completion dialog
        const shouldComplete = confirm(
          `🎯 Complete Skill: ${skillName}\n\n` +
          `Prerequisites: ${prerequisites.length === 0 ? 'None (Starting skill)' : prerequisites.join(', ')}\n\n` +
          `Would you like to mark this skill as completed?`
        );
        
        if (shouldComplete) {
          markSkillCompleted(skillId);
        }
      } else if (isCompleted) {
        // Show completed skill info
        alert(`✅ ${skillName}\n\nThis skill has been completed!`);
      } else {
        // Show locked skill info
        const prereqNames = prerequisites.map(prereqId => {
          const prereqSkill = skills.find(s => s.id === prereqId);
          return prereqSkill ? prereqSkill.name : prereqId;
        });
        
        alert(`🔒 ${skillName}\n\nPrerequisites needed: ${prereqNames.join(', ')}`);
      }
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
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading skill graph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Skill Graph Legend</h3>
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Completed Skills</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
            <span>Unlockable Skills</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <span>Locked Skills</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-96 border border-gray-300 rounded-lg bg-white"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p>💡 Click on any skill node to see its details and prerequisites</p>
        <p>🔄 The graph updates automatically based on your completed skills</p>
      </div>
    </div>
  );
};

export default GraphView;
