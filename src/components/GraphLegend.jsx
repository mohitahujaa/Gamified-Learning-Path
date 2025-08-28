import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function GraphLegend() {
  const legendItems = [
    {
      color: "bg-green-500",
      label: "Completed Skills",
      description: "Skills you have mastered"
    },
    {
      color: "bg-amber-500", 
      label: "Unlockable Skills",
      description: "Skills you can learn now"
    },
    {
      color: "bg-gray-400",
      label: "Locked Skills", 
      description: "Skills requiring prerequisites"
    }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Graph Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {legendItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-4 h-4 rounded-full ${item.color} flex-shrink-0`} />
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}