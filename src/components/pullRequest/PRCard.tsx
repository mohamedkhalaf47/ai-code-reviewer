import { Link } from "react-router-dom";
import { GitPullRequest, MessageSquare, AlertTriangle } from "lucide-react";
import { type PullRequest } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getInitials } from "@/utils/formatting";
import { cn } from "@/lib/utils";

interface PRCardProps {
	pr: PullRequest;
}

const PRCard = ({ pr }: PRCardProps) => {
	const statusColors = {
		open: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border dark:border-green-500/30",
		closed:
			"bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border dark:border-red-500/30",
		merged:
			"bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border dark:border-purple-500/30",
		draft:
			"bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border dark:border-gray-500/30",
	};

	const reviewStatusColors = {
		pending:
			"bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
		approved:
			"bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
		changes_requested:
			"bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
		commented:
			"bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
	};

	const criticalIssues = pr.aiInsights.filter(
		(i) => i.severity === "critical",
	).length;
	const highIssues = pr.aiInsights.filter((i) => i.severity === "high").length;
	const totalComments = pr.commentThreads.reduce(
		(sum, thread) => sum + thread.comments.length,
		0,
	);

	return (
		<Link to={`/pr/${pr.number}`} className="block group">
			<div
				className={cn(
					"bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-3 sm:p-4 md:p-5",
					"hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-200",
					"hover:border-blue-300 dark:hover:border-primary/50",
				)}
			>
				{/* Header */}
				<div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
					<div className="shrink-0 mt-0.5 sm:mt-1">
						<GitPullRequest
							className={cn(
								"w-4 h-4 sm:w-5 sm:h-5",
								pr.status === "open" && "text-green-600 dark:text-green-400",
								pr.status === "merged" &&
									"text-purple-600 dark:text-purple-400",
								pr.status === "closed" && "text-red-600 dark:text-red-400",
							)}
						/>
					</div>

					<div className="flex-1 min-w-0">
						<h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-primary transition-colors line-clamp-2">
							{pr.title}
						</h3>

						<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
							<span className="font-medium">#{pr.number}</span>
							<span className="hidden xs:inline">•</span>
							<span className="hidden xs:inline">
								{formatRelativeTime(pr.createdAt)}
							</span>
							<span className="hidden sm:inline">•</span>
							<span className="hidden sm:inline">by {pr.author.name}</span>
						</div>
					</div>

					<div className="flex flex-col gap-1.5 sm:gap-2 shrink-0">
						<Badge
							className={cn(
								"text-[10px] sm:text-xs font-medium px-1.5 sm:px-2",
								statusColors[pr.status],
							)}
						>
							{pr.status}
						</Badge>
						{pr.reviewStatus !== "pending" && (
							<Badge
								className={cn(
									"text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 hidden sm:inline-flex",
									reviewStatusColors[pr.reviewStatus],
								)}
							>
								{pr.reviewStatus === "changes_requested"
									? "Changes"
									: pr.reviewStatus}
							</Badge>
						)}
					</div>
				</div>

				{/* Stats */}
				<div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm flex-wrap">
					<div className="flex items-center gap-1 sm:gap-1.5">
						<span className="text-slate-600 dark:text-muted-foreground">
							Files:
						</span>
						<span className="font-medium text-slate-900 dark:text-foreground">
							{pr.changedFiles}
						</span>
					</div>

					<div className="flex items-center gap-1.5 sm:gap-2">
						<span className="text-green-600 dark:text-green-400 font-medium">
							+{pr.additions}
						</span>
						<span className="text-red-600 dark:text-red-400 font-medium">
							-{pr.deletions}
						</span>
					</div>

					<div className="items-center gap-1 sm:gap-1.5 hidden sm:flex">
						<span className="text-slate-600 dark:text-muted-foreground">
							Commits:
						</span>
						<span className="font-medium text-slate-900 dark:text-foreground">
							{pr.commits}
						</span>
					</div>
				</div>

				{/* Badges & Alerts */}
				<div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2 sm:mb-3">
					{criticalIssues > 0 && (
						<div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
							<AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 dark:text-red-400" />
							<span className="text-[10px] sm:text-xs font-medium text-red-700 dark:text-red-400">
								{criticalIssues} critical
							</span>
						</div>
					)}

					{highIssues > 0 && (
						<div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
							<AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 dark:text-orange-400" />
							<span className="text-[10px] sm:text-xs font-medium text-orange-700 dark:text-orange-400">
								{highIssues} high
							</span>
						</div>
					)}

					{totalComments > 0 && (
						<div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
							<MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-400" />
							<span className="text-[10px] sm:text-xs font-medium text-blue-700 dark:text-blue-400">
								{totalComments} comments
							</span>
						</div>
					)}

					{pr.labels &&
						pr.labels.length > 0 &&
						pr.labels.slice(0, 2).map((label) => (
							<Badge
								key={label}
								variant="outline"
								className="text-[10px] sm:text-xs hidden sm:inline-flex"
							>
								{label}
							</Badge>
						))}
				</div>

				{/* Reviewers */}
				{pr.reviewers.length > 0 && (
					<div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-0">
						<span className="text-[10px] sm:text-xs text-slate-600 dark:text-muted-foreground">
							Reviewers:
						</span>
						<div className="flex -space-x-1.5 sm:-space-x-2">
							{pr.reviewers.slice(0, 3).map((reviewer) => (
								<Avatar
									key={reviewer.id}
									className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white dark:border-card"
								>
									<AvatarImage src={reviewer.avatar} alt={reviewer.name} />
									<AvatarFallback className="text-[10px] sm:text-xs">
										{getInitials(reviewer.name)}
									</AvatarFallback>
								</Avatar>
							))}
							{pr.reviewers.length > 3 && (
								<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 dark:bg-muted border-2 border-white dark:border-card flex items-center justify-center">
									<span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-muted-foreground">
										+{pr.reviewers.length - 3}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Footer with branch info */}
				<div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 dark:border-border/50 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-muted-foreground overflow-x-auto">
					<code className="px-1 sm:px-1.5 py-0.5 bg-slate-100 dark:bg-muted rounded font-mono whitespace-nowrap">
						{pr.sourceBranch}
					</code>
					<span>→</span>
					<code className="px-1 sm:px-1.5 py-0.5 bg-slate-100 dark:bg-muted rounded font-mono whitespace-nowrap">
						{pr.targetBranch}
					</code>
				</div>
			</div>
		</Link>
	);
};

export default PRCard;
