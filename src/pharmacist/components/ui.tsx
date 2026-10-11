/**
 * The small set of primitives this app actually uses.
 *
 * shadcn/ui is copy-in, not a dependency: these are its components bound to this
 * product's tokens. The pharmacist end previously styled everything in a
 * hand-written stylesheet, which is why it drifted from the patient end's
 * palette; putting the shared shapes here means both ends draw the same button.
 *
 * Every radius is the same value on purpose. Mixed radii read as "assembled
 * from parts", which is exactly how the pharmacist end looked before.
 */
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-md text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
				secondary:
					"bg-surface text-text hover:bg-surface-muted border border-border",
				ghost: "text-text-secondary hover:bg-surface-muted hover:text-text",
				danger:
					"bg-danger-soft text-danger border border-danger/30 hover:bg-danger hover:text-white",
			},
			// Counter-height for a tablet at a pharmacy counter: the queue is
			// served standing up, often one-handed.
			size: {
				sm: "min-h-10 px-3.5 text-[15px]",
				md: "min-h-11 px-4",
				lg: "min-h-14 px-8 text-lg",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, type = "button", ...props }, ref) => (
		<button
			ref={ref}
			type={type}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	),
);
Button.displayName = "Button";

export const Input = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
	<input
		ref={ref}
		className={cn(
			"min-h-12 w-full rounded-md border border-border bg-surface px-4 py-3 text-lg",
			"placeholder:text-text-muted",
			"focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:border-primary",
			"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted",
			className,
		)}
		{...props}
	/>
));
Input.displayName = "Input";

export const Select = React.forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
	<select
		ref={ref}
		className={cn(
			"min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text",
			"focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:border-primary",
			className,
		)}
		{...props}
	/>
));
Select.displayName = "Select";

/**
 * A labelled form field.
 *
 * The label is not optional here. An input whose only label is a placeholder
 * disappears the moment the pharmacist starts typing a record number, and this
 * screen is entered by someone reading a label off a paper form.
 */
export function Field({
	label,
	hint,
	htmlFor,
	className,
	children,
}: {
	label: string;
	hint?: string;
	htmlFor: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label htmlFor={htmlFor} className="text-sm font-semibold text-text">
				{label}
			</label>
			{children}
			{hint && (
				<p className="text-[15px] leading-relaxed text-text-muted">{hint}</p>
			)}
		</div>
	);
}

export function Card({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border-subtle bg-surface shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

/**
 * Status must not be carried by colour alone: every state here has a word in
 * it. A pharmacist scanning for an overdue case cannot rely on red alone, and a
 * red-only badge fails anyone with colour vision deficiency.
 */
const badgeVariants = cva(
	"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap",
	{
		variants: {
			tone: {
				danger: "border-danger/30 bg-danger-soft text-danger",
				warning: "border-warning/30 bg-warning-soft text-warning",
				success: "border-success/30 bg-success-soft text-success",
				neutral: "border-border bg-surface-muted text-text-secondary",
			},
		},
		defaultVariants: { tone: "neutral" },
	},
);

export function Badge({
	className,
	tone,
	...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/** Section heading inside a card. */
export function CardHeader({
	title,
	description,
	action,
	className,
}: {
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle px-5 py-4",
				className,
			)}
		>
			<div className="min-w-0">
				<h2 className="text-lg font-bold text-text">{title}</h2>
				{description && (
					<p className="mt-1 text-[15px] leading-relaxed text-text-secondary">
						{description}
					</p>
				)}
			</div>
			{action}
		</div>
	);
}

/**
 * Cell padding is a variable rather than a fixed class, so a record list can be
 * dense without every table in the app becoming dense.
 *
 * The queue is a list the pharmacist scans and works through — at the default
 * padding its thirty-seven rows ran to about two and a half screens and the
 * task column wrapped on every row, which doubled the height again. The step
 * checklist is a form they fill in and wants the room, so it keeps the default.
 */
const CELL_PADDING =
	"[--cell-y:0.375rem] [--cell-x:0.75rem] sm:[--cell-y:0.5rem]";

export const DataTable = React.forwardRef<
	HTMLTableElement,
	React.TableHTMLAttributes<HTMLTableElement> & { dense?: boolean }
>(({ className, dense, ...props }, ref) => (
	<table
		ref={ref}
		className={cn(
			"w-full border-collapse text-left text-[15px]",
			dense ? CELL_PADDING : "[--cell-y:0.75rem] [--cell-x:1rem]",
			className,
		)}
		{...props}
	/>
));
DataTable.displayName = "DataTable";

export function Th({
	className,
	...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			className={cn(
				"border-b border-border bg-surface-muted px-(--cell-x) py-(--cell-y) text-[13px] font-bold tracking-wide whitespace-nowrap text-text-secondary",
				className,
			)}
			{...props}
		/>
	);
}

export function Td({
	className,
	...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td
			className={cn(
				"border-b border-border-subtle px-(--cell-x) py-(--cell-y) align-middle",
				className,
			)}
			{...props}
		/>
	);
}
