import { IconArrowRight, IconCheck, IconRefresh } from "../icons";
import { Button } from "../ui/button";

type ActionButtonsProps = {
	showPharmacist: boolean;
	showRetry: boolean;
	showNext: boolean;
	nextBtnText: string;
	onPharmacist: () => void;
	onRetry: () => void;
	onNext: () => void;
};

export function ActionButtons({
	showPharmacist,
	showRetry,
	showNext,
	nextBtnText,
	onPharmacist,
	onRetry,
	onNext,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			{showPharmacist && (
				<Button variant="success" size="sm" onClick={onPharmacist}>
					<IconCheck />
					藥師確認通過
				</Button>
			)}

			{showRetry && (
				<Button variant="outline" size="sm" onClick={onRetry}>
					<IconRefresh />
					再測一次
				</Button>
			)}

			{showNext && (
				<Button variant="default" size="sm" onClick={onNext}>
					{nextBtnText}
					<IconArrowRight />
				</Button>
			)}
		</div>
	);
}
