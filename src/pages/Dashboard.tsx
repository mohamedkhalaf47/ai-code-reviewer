import { usePullRequests } from "@/hooks/usePullRequests";
import EmptyState from "@/components/common/EmptyState";
import { GitPullRequest } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingPage } from "@/components/common/LoadingSpinner";

const Dashboard = () => {
	const { pullRequests, loading, error } = usePullRequests();

	if (loading) {
		return <LoadingPage text="Loading pull requests..." />;
	}

	if (error) {
		return (
			<div className="p-6">
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (pullRequests.length === 0) {
		return (
			<EmptyState
				icon={GitPullRequest}
				title="No pull requests found"
				description="There are no pull requests to review at the moment."
			/>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Pull Requests</h1>
				<p className="text-slate-600 mt-1">
					Review and manage your team's pull requests
				</p>
			</div>

			<div className="grid gap-4">
				{pullRequests.map((pr) => (
					<div
						key={pr.id}
						className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-4 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5 transition-all card-elevated"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<h3 className="font-semibold dark:text-foreground mb-1">
									{pr.title}
								</h3>
								<div className="flex items-center gap-3 text-sm text-slate-600 dark:text-muted-foreground">
									<span>#{pr.number}</span>
									<span>•</span>
									<span>by {pr.author.name}</span>
									<span>•</span>
									<span>{pr.changedFiles} files</span>
									<span>•</span>
									<span className="text-green-600">+{pr.additions}</span>
									<span className="text-red-600">-{pr.deletions}</span>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border dark:border-green-500/30">
									{pr.status}
								</span>
								{pr.aiInsights.length > 0 && (
									<span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border dark:border-red-500/30">
										{pr.aiInsights.length} issues
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
