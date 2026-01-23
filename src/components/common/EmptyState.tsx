import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	children?: ReactNode;
}

const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
	children,
}: EmptyStateProps) => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
			{Icon && (
				<div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
					<Icon className="w-8 h-8 text-slate-400" />
				</div>
			)}

			<h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

			{description && (
				<p className="text-sm text-slate-600 max-w-sm mb-6">{description}</p>
			)}

			{action && <Button onClick={action.onClick}>{action.label}</Button>}

			{children}
		</div>
	);
};

export default EmptyState;
