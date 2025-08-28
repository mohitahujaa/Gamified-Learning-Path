import { motion } from "framer-motion"
import { Network, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export function Navbar({ onMenuToggle, isMobileMenuOpen }) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">SkillGraph</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Interactive Learning Path
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Backend Connected
          </div>
        </div>
      </div>
    </motion.header>
  )
}