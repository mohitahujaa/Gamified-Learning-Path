import { motion, AnimatePresence } from "framer-motion"
import { User, Trophy, Target, BarChart3, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { cn } from "../lib/utils"

export function Sidebar({ 
  isOpen, 
  userId = "student_001", 
  completedSkills = [], 
  userPoints = 0, 
  userBadges = [],
  totalSkills = 5,
  className 
}) {
  const progressPercentage = Math.round((completedSkills.length / totalSkills) * 100)

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 }
  }

  const badgeInfo = {
    'FIRST_STEP': { name: 'First Step', description: 'Completed your first skill!', icon: '🎯' },
    'PATH_MASTER': { name: 'Path Master', description: 'Completed all skills!', icon: '🏆' }
  }

  const skillDisplayNames = {
    'basics': 'Basics of Computer',
    'ms_office': 'MS Office',
    'canva': 'Canva',
    'powerbi': 'Power BI',
    'ai_tools': 'AI Tools'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
          
          {/* Sidebar */}
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gray-50/80 backdrop-blur-sm border-r z-50 overflow-y-auto",
              "md:sticky md:top-16 md:z-auto",
              className
            )}
          >
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Student Profile</CardTitle>
                      <p className="text-xs text-muted-foreground">{userId}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Progress Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed Skills</span>
                      <span className="font-medium">{completedSkills.length} / {totalSkills}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {progressPercentage}% Complete
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-amber-600">⭐</span>
                      <span className="font-semibold">{userPoints}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="h-4 w-4" />
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBadges.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No badges yet. Keep learning to earn badges!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {userBadges.map((badgeId, index) => {
                        const badge = badgeInfo[badgeId]
                        if (!badge) return null
                        
                        return (
                          <motion.div
                            key={badgeId}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
                          >
                            <span className="text-xl">{badge.icon}</span>
                            <div>
                              <p className="font-medium text-sm text-amber-900">{badge.name}</p>
                              <p className="text-xs text-amber-700">{badge.description}</p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Completed Skills */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    Completed Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completedSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No skills completed yet. Start with the basics!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {completedSkills.map((skillId, index) => (
                        <motion.div
                          key={skillId}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Badge variant="success" className="w-full justify-start">
                            {skillDisplayNames[skillId] || skillId}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}