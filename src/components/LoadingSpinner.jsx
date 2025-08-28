import { Loader2 } from "lucide-react"
import { cn } from "../lib/utils"

export function LoadingSpinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  return (
    <Loader2 
      className={cn("animate-spin text-primary", sizeClasses[size], className)} 
      {...props} 
    />
  )
}

export function LoadingCard({ title = "Loading...", description }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}