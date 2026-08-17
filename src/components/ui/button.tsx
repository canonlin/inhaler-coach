import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl",
				secondary:
					"bg-surface border border-border text-text hover:bg-surface-light hover:border-primary",
				outline:
					"border border-white/30 bg-white/10 text-white hover:bg-white/20",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				success: "bg-success text-white shadow-lg hover:bg-success/90",
			},
			size: {
				default: "h-13 px-9 sm:h-14 sm:px-10",
				sm: "h-9 px-4 text-sm",
				lg: "h-14 px-10 text-lg",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
