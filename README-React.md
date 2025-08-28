# React GraphView Component

A React component for displaying skill dependency graphs using Cytoscape.js with DAGRE layout.

## Features

- 🎯 **Interactive Skill Graph**: Visual representation of skill dependencies
- 🎨 **Color-coded Nodes**: 
  - 🟢 Green: Completed skills
  - 🟡 Amber: Unlockable skills  
  - ⚫ Grey: Locked skills
- 📱 **Responsive Design**: Works on all screen sizes
- 🖱️ **Interactive**: Click nodes to see skill details and prerequisites
- 🔄 **Real-time Updates**: Automatically updates based on user progress
- 📊 **DAG Layout**: Left-to-right directed acyclic graph layout
- 👤 **User Progress Tracking**: Individual progress for multiple users
- ⭐ **Gamification System**: Points (50 per skill) and badges
- 🏆 **Achievement Badges**: First Step, Path Master badges
- 📈 **Progress Sidebar**: Real-time progress visualization
- 🎮 **Skill Completion**: Click unlockable nodes to mark as completed

## Installation

### 1. Install Required Packages

```bash
npm install react-cytoscapejs cytoscape cytoscape-dagre axios
```

### 2. Install React Dependencies (if not already installed)

```bash
npm install react react-dom
```

## Usage

### Basic Usage

```jsx
import React, { useState } from 'react';
import GraphView from './GraphView';

function App() {
  const [completedSkills, setCompletedSkills] = useState(['basics_computer']);

  return (
    <div className="App">
      <h1>My Learning Path</h1>
      <GraphView userCompletedSkills={completedSkills} />
      
      {/* Example: Mark a skill as completed */}
      <button onClick={() => setCompletedSkills([...completedSkills, 'ms_office'])}>
        Complete MS Office
      </button>
    </div>
  );
}

export default App;
```

### Advanced Usage with Skill Management

```jsx
import React, { useState } from 'react';
import GraphView from './GraphView';

function SkillManager() {
  const [completedSkills, setCompletedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([
    'basics_computer',
    'ms_office', 
    'canva',
    'power_bi',
    'ai_tools'
  ]);

  const completeSkill = (skillId) => {
    if (!completedSkills.includes(skillId)) {
      setCompletedSkills([...completedSkills, skillId]);
    }
  };

  const resetProgress = () => {
    setCompletedSkills([]);
  };

  return (
    <div className="skill-manager">
      <div className="controls">
        <h2>Skill Progress</h2>
        <p>Completed: {completedSkills.length} / {availableSkills.length}</p>
        
        <div className="skill-buttons">
          {availableSkills.map(skillId => (
            <button
              key={skillId}
              onClick={() => completeSkill(skillId)}
              disabled={completedSkills.includes(skillId)}
              className={completedSkills.includes(skillId) ? 'completed' : ''}
            >
              {skillId.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        
        <button onClick={resetProgress} className="reset-btn">
          Reset Progress
        </button>
      </div>

      <div className="graph-container">
        <GraphView userCompletedSkills={completedSkills} />
      </div>
    </div>
  );
}

export default SkillManager;
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userCompletedSkills` | `string[]` | `[]` | Array of completed skill IDs |

## API Endpoints

The component expects these Flask backend endpoints:

- **GET** `/skills/` - Returns all available skills
- **POST** `/skills/unlockable` - Returns unlockable skills based on completed skills
- **POST** `/skills/progress` - Mark a skill as completed for a user
- **GET** `/skills/user_summary/<user_id>` - Get user progress summary with points and badges

### Expected Response Format

```json
// GET /skills/
{
  "success": true,
  "skills": [
    {
      "id": "basics_computer",
      "name": "Basics of Computer",
      "description": "Fundamental computer literacy...",
      "prerequisites": []
    }
  ]
}

// POST /skills/unlockable
{
  "success": true,
  "unlockable": [
    {
      "id": "ms_office",
      "name": "MS Office",
      "description": "Microsoft Office suite..."
    }
  ]
}
```

## Styling

The component uses Tailwind CSS classes for styling. If you're not using Tailwind, you can add custom CSS:

```css
.graph-container {
  width: 100%;
  height: 400px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
}

.controls {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.skill-buttons button {
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.skill-buttons button.completed {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.reset-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Troubleshooting

### Common Issues

1. **Graph not rendering**: Check if the Flask backend is running on `http://127.0.0.1:5000`
2. **CORS errors**: Ensure your Flask backend has CORS enabled
3. **Layout issues**: The DAGRE layout requires all nodes to be connected in a valid DAG structure

### Debug Mode

Enable debug logging by adding this to your component:

```jsx
useEffect(() => {
  console.log('Skills:', skills);
  console.log('Unlockable:', unlockableSkills);
  console.log('Completed:', userCompletedSkills);
}, [skills, unlockableSkills, userCompletedSkills]);
```

## License

MIT License - feel free to use in your projects!
