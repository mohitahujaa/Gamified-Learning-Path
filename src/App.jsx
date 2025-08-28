import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import GraphView from './components/GraphView';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { RotateCcw, Zap } from 'lucide-react';

function App() {
  const [userCompletedSkills, setUserCompletedSkills] = useState(['basics']);
  const [userPoints, setUserPoints] = useState(50);
  const [userBadges, setUserBadges] = useState(['FIRST_STEP']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          userId="student_001"
          completedSkills={userCompletedSkills}
          userPoints={userPoints}
          userBadges={userBadges}
          totalSkills={5}
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Interactive Learning Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your progress through the skill dependency graph
              </p>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Progress:</span>
                    <Badge variant="outline">
                      {userCompletedSkills.length} / 5 Skills
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Points:</span>
                    <Badge variant="secondary">
                      ⭐ {userPoints}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetProgress}
                    className="gap-2 ml-auto"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Progress
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Graph View */}
            <GraphView userCompletedSkills={userCompletedSkills} />

            {/* Footer */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-blue-900">
                    🚀 Built with React + Cytoscape.js + TailwindCSS
                  </p>
                  <p className="text-xs text-blue-700">
                    Perfect for gamified learning platforms and skill tracking systems
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
