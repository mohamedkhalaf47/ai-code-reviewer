import { useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

const ErrorBoundary = ({ children, fallback }: Props) => {
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Handle errors from child components
	if (hasError) {
		if (fallback) {
			return fallback;
		}

		return (
			<div className="flex items-center justify-center min-h-100 p-4">
				<Alert variant="destructive" className="max-w-lg">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Something went wrong</AlertTitle>
					<AlertDescription className="mt-2">
						<p className="mb-4">
							{error?.message || "An unexpected error occurred"}
						</p>
						<Button
							variant="outline"
							onClick={() => {
								setHasError(false);
								setError(null);
								window.location.reload();
							}}
						>
							Reload Page
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return children;
}

export default ErrorBoundary;