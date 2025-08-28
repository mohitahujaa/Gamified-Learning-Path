import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LoadingCard } from './LoadingSpinner';
import { ErrorCard } from './ErrorCard';
import { GraphLegend } from './GraphLegend';
import { Button } from './ui/button';
import { RefreshCw, Info } from 'lucide-react';

// Register the dagre layout with Cytoscape
cytoscape.use(dagre);

const GraphView = ({ userCompletedSkills = [] }) => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [unlockableSkills, setUnlockableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ensure all IDs are strings
  const stringCompletedSkills = userCompletedSkills.map(id => id.toString());

  // Fetch all skills from the backend
  const fetchSkills = async () => {
    try {
      setError(null);
      const response = await axios.get('http://127.0.0.1:5000/skills/');
      if (response.data.success) {
        // Ensure all skill IDs are strings
        const skillsWithStringIds = response.data.skills.map(skill => ({
          ...skill,
          id: skill.id.toString(),
          prerequisites: skill.prerequisites.map(prereq => prereq.toString())
        }));
        setSkills(skillsWithStringIds);
        console.log("Fetched skills:", skillsWithStringIds);
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
      setError(null);
      const response = await axios.post('http://127.0.0.1:5000/skills/unlockable', {
        completed_skills: stringCompletedSkills
      });
      if (response.data.success) {
        // Ensure all unlockable skill IDs are strings
        const unlockableWithStringIds = response.data.unlockable.map(skill => ({
          ...skill,
          id: skill.id.toString()
        }));
        setUnlockableSkills(unlockableWithStringIds);
        console.log("Fetched unlockable skills:", unlockableWithStringIds);
      } else {
        throw new Error('Failed to fetch unlockable skills');
      }
    } catch (err) {
      setError('Error fetching unlockable skills: ' + err.message);
      console.error('Error fetching unlockable skills:', err);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    setLoading(true);
    await fetchSkills();
    setIsRefreshing(false);
  };

  // Debug logging
  useEffect(() => {
    if (skills.length === 0) return;
    console.log("=== DEBUG INFO ===");
    console.log("Skills:", skills);
    console.log("Unlockable:", unlockableSkills);
    console.log("User completed (original):", userCompletedSkills);
    console.log("User completed (strings):", stringCompletedSkills);
    console.log("Container dimensions:", containerRef.current?.offsetWidth, "x", containerRef.current?.offsetHeight);
  }, [skills, unlockableSkills, stringCompletedSkills]);

  // Enhanced node click handler
  const handleNodeClick = (node) => {
    const skillId = node.id();
    const skillName = node.data('label');
    const prerequisites = node.data('prerequisites');
    
    // Check if skill is unlockable and not completed
    const isUnlockable = unlockableSkills.some(skill => skill.id === skillId);
    const isCompleted = stringCompletedSkills.includes(skillId);
    
    if (isUnlockable && !isCompleted) {
      // Show completion dialog
      const shouldComplete = confirm(
        `🎯 Complete Skill: ${skillName}\n\n` +
        `Prerequisites: ${prerequisites.length === 0 ? 'None (Starting skill)' : prerequisites.join(', ')}\n\n` +
        `Would you like to mark this skill as completed?`
      );
      
      if (shouldComplete) {
        // Here you would call your skill completion API
        console.log(`Completing skill: ${skillId}`);
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
  };

  // Initialize the graph when skills data changes
  useEffect(() => {
    if (skills.length === 0) return;

    console.log("Initializing Cytoscape with", skills.length, "skills");

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

    console.log("Created nodes:", nodes);
    console.log("Created edges:", edges);

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
              if (stringCompletedSkills.includes(nodeId)) {
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

    console.log("Cytoscape initialized with", cyRef.current.nodes().length, "nodes");

    // Add click event handler
    cyRef.current.on('tap', 'node', (evt) => {
      handleNodeClick(evt.target);
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
  }, [skills, unlockableSkills, stringCompletedSkills]);

  // Fetch data on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch unlockable skills when userCompletedSkills changes
  useEffect(() => {
    if (skills.length > 0) {
      fetchUnlockableSkills();
    }
  }, [stringCompletedSkills, skills]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return <LoadingCard title="Loading Skill Graph" description="Fetching skills and dependencies..." />;
  }

  if (error) {
    return <ErrorCard title="Failed to Load Skills" message={error} onRetry={refreshData} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Legend */}
      <GraphLegend />
      
      {/* Graph Container */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Interactive Skill Graph</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef} 
            className="w-full h-[500px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
            style={{ minHeight: '500px' }}
          />
        </CardContent>
      </Card>
      
      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900">How to Use the Skill Graph</p>
              <ul className="space-y-1 text-blue-800">
                <li>• <strong>Click nodes</strong> to see details and prerequisites</li>
                <li>• <strong>Green nodes</strong> are completed skills</li>
                <li>• <strong>Amber nodes</strong> are ready to unlock</li>
                <li>• <strong>Gray nodes</strong> need prerequisites first</li>
                <li>• Graph updates automatically as you progress</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GraphView;
