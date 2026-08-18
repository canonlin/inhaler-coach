import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
	{
		variants: {
			variant: {
				default:
					"bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700 hover:shadow-xl",
				secondary:
					"bg-slate-800 border border-slate-700 text-white hover:bg-slate-700",
				outline:
					"border border-white/40 bg-black/40 backdrop-blur-md text-white hover:bg-white/20",
				ghost: "hover:bg-slate-800 hover:text-white",
				success:
					"bg-emerald-600 text-white font-black shadow-xl shadow-emerald-950/50 border border-emerald-400/40 hover:bg-emerald-500 hover:shadow-2xl",
			},
			size: {
				default: "h-12 px-7 text-base rounded-xl",
				sm: "h-10 px-5 text-sm rounded-xl",
				lg: "h-14 px-10 text-lg rounded-xl",
				icon: "h-10 w-10 rounded-xl",
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
