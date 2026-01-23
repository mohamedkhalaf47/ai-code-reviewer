import {
	FileCode,
	MessageSquare,
	AlertTriangle,
	GitCommit,
} from "lucide-react";
import { type PullRequest } from "@/types";
import { Card } from "@/components/ui/card";

interface PRStatsProps {
	pr: PullRequest;
}

const PRStats = ({ pr }: PRStatsProps) => {
	const totalComments = pr.commentThreads.reduce(
		(sum, thread) => sum + thread.comments.length,
		0,
	);
	const unresolvedThreads = pr.commentThreads.filter((t) => !t.resolved).length;
	const criticalIssues = pr.aiInsights.filter(
		(i) => i.severity === "critical" || i.severity === "high",
	).length;

	const stats = [
		{
			label: "Files Changed",
			value: pr.changedFiles,
			icon: FileCode,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-500/10",
		},
		{
			label: "Comments",
			value: totalComments,
			subValue:
				unresolvedThreads > 0 ? `${unresolvedThreads} unresolved` : undefined,
			icon: MessageSquare,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-500/10",
		},
		{
			label: "Critical Issues",
			value: criticalIssues,
			icon: AlertTriangle,
			color:
				criticalIssues > 0
					? "text-red-600 dark:text-red-400"
					: "text-green-600 dark:text-green-400",
			bgColor:
				criticalIssues > 0
					? "bg-red-50 dark:bg-red-500/10"
					: "bg-green-50 dark:bg-green-500/10",
		},
		{
			label: "Commits",
			value: pr.commits,
			icon: GitCommit,
			color: "text-slate-600 dark:text-slate-400",
			bgColor: "bg-slate-50 dark:bg-slate-500/10",
		},
	];

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card key={stat.label} className="p-2.5 sm:p-3 md:p-4">
						<div className="flex items-start gap-2 sm:gap-3">
							<div
								className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} shrink-0`}
							>
								<Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-foreground">
									{stat.value}
								</p>
								<p className="text-[10px] sm:text-xs text-slate-600 dark:text-muted-foreground truncate">
									{stat.label}
								</p>
								{stat.subValue && (
									<p className="text-[10px] sm:text-xs text-slate-500 dark:text-muted-foreground mt-0.5 truncate">
										{stat.subValue}
									</p>
								)}
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
};

export default PRStats;
