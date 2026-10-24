/**
 * Which programme's measurement is on screen.
 *
 * A segmented switch, not a row of links and not another navigation item. The
 * programmes read the same cases in different ways, so they are a choice
 * within one screen; the navigation is the pharmacist's jobs (record, follow
 * up, read the results, edit the teaching material), and a measurement is not
 * a job. Adding a programme adds a tab here, and the navigation stays four
 * items however many programmes arrive.
 *
 * The switch is a fieldset with pressed buttons, the same pattern the queue
 * uses for its scope filter: one control that says which of several views is
 * showing, with the choice announced rather than implied by a colour.
 */
import type { ProgrammeMeta } from "../../api-client";
import { cn } from "../../lib/utils";

export function ProgrammeTabs({
	programmes,
	active,
	onChange,
}: {
	programmes: ProgrammeMeta[];
	active: string;
	onChange: (id: string) => void;
}) {
	return (
		<fieldset className="inline-flex flex-wrap rounded-md border border-border-subtle bg-surface p-1">
			<legend className="sr-only">要看哪一個計畫的成效</legend>
			{programmes.map((p) => (
				<button
					key={p.id}
					type="button"
					aria-pressed={active === p.id}
					onClick={() => onChange(p.id)}
					className={cn(
						"inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold transition-colors",
						active === p.id
							? "bg-primary text-primary-foreground"
							: "text-text-secondary hover:bg-surface-muted hover:text-text",
					)}
				>
					{p.label}
				</button>
			))}
		</fieldset>
	);
}
