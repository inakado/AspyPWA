import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("elegant-badge", {
  variants: {
    variant: {
      default: "border-transparent bg-art-primary text-white",
      secondary: "border-transparent bg-art-secondary text-white",
      accent: "border-transparent bg-art-accent text-art-primary",
      outline: "border border-art-primary text-art-primary",
      destructive: "border-transparent bg-destructive text-destructive-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
