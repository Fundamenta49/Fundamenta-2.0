import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-interactive",
  {
    variants: {
      variant: {
        default: "bg-white border-2 border-primary text-primary hover:bg-primary/5 active:scale-95",
        destructive:
          "bg-white border-2 border-destructive text-destructive hover:bg-destructive/5 active:scale-95",
        outline:
          "border border-input bg-white hover:bg-accent/5 hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-white border-2 border-secondary/30 text-secondary-dark hover:bg-secondary/5 active:scale-95",
        ghost: "text-primary hover:bg-primary/5 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:scale-95",
        wood: "bg-white border-2 border-primary/30 text-primary hover:scale-105 active:scale-95", // Wood variant with interactive effects
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }