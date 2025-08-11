import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8"
};

const variantClasses = {
  default: "border-gray-400 border-t-transparent",
  primary: "border-blue-500 border-t-transparent",
  secondary: "border-gray-500 border-t-transparent",
  success: "border-green-500 border-t-transparent",
  warning: "border-yellow-500 border-t-transparent",
  danger: "border-red-500 border-t-transparent"
};

export function Loading({ 
  size = "md", 
  variant = "default", 
  text, 
  className 
}: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 
          className={cn(
            "animate-spin rounded-full border-2",
            sizeClasses[size],
            variantClasses[variant]
          )} 
        />
        {text && (
          <span className="text-sm text-gray-600 font-medium">{text}</span>
        )}
      </div>
    </div>
  );
}

// Full page loading component
export function LoadingPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading size="lg" variant="primary" text={text} />
      </div>
    </div>
  );
}

// Inline loading component
export function LoadingInline({ size = "sm", variant = "default" }: Omit<LoadingProps, "text" | "className">) {
  return (
    <Loader2 
      className={cn(
        "animate-spin rounded-full border-2",
        sizeClasses[size],
        variantClasses[variant]
      )} 
    />
  );
}

// Button loading component
export function LoadingButton({ size = "sm", variant = "default" }: Omit<LoadingProps, "text" | "className">) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingInline size={size} variant={variant} />
      <span>Loading...</span>
    </div>
  );
}
