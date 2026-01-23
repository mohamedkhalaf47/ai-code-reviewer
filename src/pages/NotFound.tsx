import { useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background">
			<div className="text-center">
				<div className="flex justify-center mb-6">
					<div className="flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 dark:bg-muted">
						<FileQuestion className="w-12 h-12 text-slate-400 dark:text-muted-foreground" />
					</div>
				</div>

				<h1 className="text-6xl font-bold text-slate-900 dark:text-foreground mb-4">
					404
				</h1>
				<h2 className="text-2xl font-semibold text-slate-700 dark:text-muted-foreground mb-2">
					Page not found
				</h2>
				<p className="text-slate-600 dark:text-muted-foreground mb-8 max-w-md">
					The page you're looking for doesn't exist or has been moved.
				</p>

				<div className="flex gap-3 justify-center">
					<Button onClick={() => navigate(-1)} variant="outline">
						Go Back
					</Button>
					<Button onClick={() => navigate("/dashboard")}>
						Go to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
