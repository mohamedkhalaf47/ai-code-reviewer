import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	text?: string;
	className?: string;
}

const sizeClasses = {
	sm: "w-4 h-4",
	md: "w-8 h-8",
	lg: "w-12 h-12",
};

export const LoadingSpinner = ({
	size = "md",
	text,
	className,
}: LoadingSpinnerProps) => {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3",
				className,
			)}
		>
			<Loader2
				className={cn("animate-spin text-blue-600", sizeClasses[size])}
			/>
			{text && <p className="text-sm text-slate-600 font-medium">{text}</p>}
		</div>
	);
};

// Full page loading spinner
export const LoadingPage = ({ text = "Loading..." }: { text?: string }) => {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<LoadingSpinner size="lg" text={text} />
		</div>
	);
};

// Inline loading spinner
export const LoadingInline = ({ text }: { text?: string }) => {
	return (
		<div className="flex items-center gap-2 text-sm text-slate-600">
			<Loader2 className="w-4 h-4 animate-spin" />
			{text && <span>{text}</span>}
		</div>
	);
};
