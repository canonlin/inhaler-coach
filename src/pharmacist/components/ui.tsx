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

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
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
				sm: "min-h-10 px-3.5 text-base",
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
			"min-h-12 w-full rounded-md border border-border bg-surface px-4 py-3 text-base",
			"placeholder:text-text-muted",
			"focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:border-primary",
			"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted",
			className,
		)}
		{...props}
	/>
));
Input.displayName = "Input";

/**
 * Select, built on Radix the way shadcn/ui builds it: a button that opens a
 * listbox, not a native <select>.
 *
 * The native control was the last native form element left in the pharmacist
 * end, and it behaves badly for the two things this screen does. It cannot be
 * opened from the keyboard's type-ahead on a tablet without the on-screen
 * keyboard covering the list, and it renders the platform's own popup, so the
 * follow-up queue's 「結案者」 looked like a different control from every
 * Button beside it.
 *
 * Radix also brings behaviour that has to be built by hand here: the trigger is
 * a real button with aria-haspopup, and `required` is not a thing — see
 * SelectItem below.
 */
export const Select = React.forwardRef<
	HTMLButtonElement,
	Omit<
		React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
		"children"
	> & {
		children: React.ReactNode;
		className?: string;
		/** Forwarded to the trigger: it is the focusable button, and a label's
		 *  htmlFor has to reach that rather than the hidden native select Radix
		 *  keeps for form submission. */
		id?: string;
		/** Shown while nothing is chosen.
		 *
		 *  This is not a nicety: Radix rejects `value=""`, because an empty
		 *  string is how it spells "no selection". Carrying the old
		 *  `<option value="">—</option>` across would either throw or silently
		 *  read as a real answer to the knowledge question, which is the one
		 *  thing an unanswered question must not do. */
		placeholder?: string;
	}
>(({ className, children, id, placeholder, ...props }, ref) => (
	<SelectPrimitive.Root {...props}>
		<SelectPrimitive.Trigger
			ref={ref}
			id={id}
			className={cn(
				"flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-base text-text",
				"data-placeholder:text-text-muted",
				"focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:border-primary",
				"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted",
				"[&>span]:truncate",
				className,
			)}
		>
			<SelectPrimitive.Value />
			<SelectPrimitive.Icon asChild>
				<ChevronDown
					className="size-4 shrink-0 opacity-60"
					aria-hidden="true"
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				position="popper"
				sideOffset={4}
				className={cn(
					"z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface shadow-md",
					"data-[state=open]:animate-in data-[state=open]:fade-in-0",
				)}
			>
				<SelectPrimitive.Viewport className="p-1">
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	</SelectPrimitive.Root>
));
Select.displayName = "Select";

/**
 * One option.
 *
 * Radix has no `required` on items, so the empty placeholder carries it: a
 * select that has not been answered is marked `aria-invalid` rather than being
 * silently equal to a real choice.
 */
export function SelectItem({
	value,
	children,
	className,
}: {
	value: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<SelectPrimitive.Item
			value={value}
			className={cn(
				"relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-base text-text outline-none",
				"data-highlighted:bg-surface-muted data-highlighted:text-text",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

/**
 * Checkbox, built on Radix.
 *
 * The two native checkboxes in the assessment were invisible targets on a
 * tablet — a 16px square is below the 44px target a hand needs, and the whole
 * point of this end is large targets. Radix renders a button with role=checkbox,
 * which takes the same padding as everything else here.
 */
export const Checkbox = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"flex size-6 shrink-0 items-center justify-center rounded border-2 border-border bg-surface",
			"data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
			"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
			"disabled:cursor-not-allowed disabled:opacity-50",
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator>
			<Check className="size-4" strokeWidth={3} aria-hidden="true" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

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
			<LabelPrimitive.Root
				htmlFor={htmlFor}
				className="text-base font-semibold text-text"
			>
				{label}
			</LabelPrimitive.Root>
			{children}
			{hint && (
				<p className="text-base leading-relaxed text-text-muted">{hint}</p>
			)}
		</div>
	);
}

/**
 * A bordered surface. It carries no padding of its own.
 *
 * CardHeader sets `px-5 py-4`, so a body rendered as Card's other child must
 * set the same or it will sit flush against the border — and any grid inside it
 * will hang past the right edge. That is not a style preference; it is the
 * contract, and two components already had to be fixed for breaking it.
 */
/**
 * One block of a loading placeholder.
 *
 * Decorative by construction — the shape, not the content — so it is hidden from
 * assistive technology. The state itself is carried by Pending, which announces
 * it once instead of on every bar.
 */
export function Skeleton({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"block animate-pulse rounded bg-surface-muted motion-reduce:animate-none",
				className,
			)}
		/>
	);
}

/**
 * What is on screen while a request is still open.
 *
 * The three earlier versions were: a bare 「載入中」 word, and in two places
 * nothing at all — CaseHistory returned null, so typing a record number simply
 * produced no history box until the answer arrived. Both read as 「這裡沒有
 * 資料」, which is the one thing the panel must never say while it has not
 * asked yet. A pharmacist who reads that, concludes the patient is new, and
 * skips the check.
 *
 * So the placeholder has to look like the thing it is standing in for: the same
 * rows, the same columns, the same height. That also removes the layout jump
 * when the data lands, which is what a spinner does not do.
 *
 * `aria-busy` marks the region so a screen reader says it is working; the
 * visible bars are `aria-hidden`, because "loading" announced once is a state
 * and announced per bar is noise.
 */
export function Pending({
	label,
	rows = 3,
	className,
	testId,
	children,
}: {
	label: string;
	rows?: number;
	className?: string;
	/**
	 * Lets a caller name its own pending state in a test, so the test asserts
	 * about this panel rather than searching the document for a loading word
	 * that some other panel may also be showing.
	 */
	testId?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			role="status"
			aria-busy="true"
			data-testid={testId}
			className={className}
		>
			<span className="sr-only">{label}</span>
			{children ?? (
				<SkeletonRows count={rows} className="mb-2 h-4 w-full last:mb-0" />
			)}
		</div>
	);
}

/**
 * N placeholder rows of a given width, for building a skeleton.
 *
 * The same four-line loop had been written out at four call sites, each with its
 * own key question answered differently. It lives here so there is one.
 *
 * The index IS the key, and that is correct rather than tolerated: these are
 * fixed-length positions in a list that never reorders, never changes length and
 * holds no data. A generated key would imply a stable identity that a grey bar
 * does not have, and would make React's reconciliation look like it is tracking
 * something when there is nothing to track.
 */
export function SkeletonRows({
	count,
	className,
}: {
	count: number;
	className?: string;
}) {
	return (
		<>
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: positional placeholder, see above
				<Skeleton key={i} className={className} />
			))}
		</>
	);
}

/**
 * A bordered surface. It carries no padding of its own.
 */
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
	"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-caption font-semibold whitespace-nowrap",
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
					<p className="mt-1 text-base leading-relaxed text-text-secondary">
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
			"w-full border-collapse text-left text-base",
			dense ? CELL_PADDING : "[--cell-y:0.75rem] [--cell-x:1rem]",
			className,
		)}
		{...props}
	/>
));
DataTable.displayName = "DataTable";

/**
 * A column header.
 *
 * `scope` defaults to "col" here rather than at each call site. A missing scope
 * is invisible — the table still looks right and every value still lines up —
 * but a screen reader announcing a data cell has no way to say which column it
 * belongs to, so the whole table degrades to an undifferentiated stream of
 * numbers. Seven of the queue's headers were missing it, which is what the a11y
 * guard found: nothing in the markup made it obvious at the point of writing.
 */
export function Th({
	className,
	scope = "col",
	...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			scope={scope}
			className={cn(
				"border-b border-border bg-surface-muted px-(--cell-x) py-(--cell-y) text-base font-bold tracking-wide whitespace-nowrap text-text-secondary",
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
