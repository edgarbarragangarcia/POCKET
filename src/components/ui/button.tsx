"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Import cva directly from our types file to avoid module resolution issues
type CVAFunction = (props?: Record<string, any>) => string;

type VariantProps<T extends CVAFunction> = {
  [K in keyof Parameters<T>[0]]: Parameters<T>[0][K];
};

const buttonVariants = (options: { 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "neumorphic" | "glassmorphic" | "brutalist" | "gradient",
  size?: "default" | "sm" | "lg" | "icon", 
  className?: string 
} = {}) => {
  const { variant = "default", size = "default", className = "" } = options;
  
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    neumorphic: "neumorphic-light dark:neumorphic-dark text-foreground",
    glassmorphic: "glassmorphic text-foreground",
    brutalist: "brutalist text-foreground",
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white animate-gradient-flow bg-size-200"
  }[variant];
  
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  }[size];
  
  return cn(baseStyles, variantStyles, sizeStyles, className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "neumorphic" | "glassmorphic" | "brutalist" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
