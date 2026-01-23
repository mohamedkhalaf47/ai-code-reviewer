import {
	ArrowLeft,
	GitPullRequest,
	Check,
	X,
	MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type PullRequest } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, getInitials } from "@/utils/formatting";
import { cn } from "@/lib/utils";

interface PRHeaderProps {
	pr: PullRequest;
	activeUsers: Array<{
		id: number;
		name: string;
		avatar: string;
		color: string;
	}>;
}

const PRHeader = ({ pr, activeUsers }: PRHeaderProps) => {
	const statusColors = {
		open: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border dark:border-green-500/30",
		closed:
			"bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border dark:border-red-500/30",
		merged:
			"bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border dark:border-purple-500/30",
		draft:
			"bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border dark:border-gray-500/30",
	};

	return (
		<header className="sticky top-14 md:top-16 z-40 bg-white dark:bg-card border-b dark:border-border">
			<div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
				{/* Back Button */}
				<Link
					to="/dashboard"
					className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground mb-3 md:mb-4 transition-colors"
				>
					<ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
					Back to Pull Requests
				</Link>

				{/* Main Header */}
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4 mb-3 md:mb-4">
					<div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
						<GitPullRequest
							className={cn(
								"w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-1 shrink-0",
								pr.status === "open" && "text-green-600 dark:text-green-400",
								pr.status === "merged" &&
									"text-purple-600 dark:text-purple-400",
								pr.status === "closed" && "text-red-600 dark:text-red-400",
							)}
						/>
						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-foreground">
									{pr.title}
								</h1>
								<Badge
									className={cn(
										"text-[10px] sm:text-xs font-medium",
										statusColors[pr.status],
									)}
								>
									{pr.status}
								</Badge>
							</div>
							<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
								<span className="font-medium">#{pr.number}</span>
								<span className="hidden xs:inline">•</span>
								<div className="flex items-center gap-1.5 sm:gap-2">
									<Avatar className="w-4 h-4 sm:w-5 sm:h-5">
										<AvatarImage src={pr.author.avatar} alt={pr.author.name} />
										<AvatarFallback className="text-[10px] sm:text-xs">
											{getInitials(pr.author.name)}
										</AvatarFallback>
									</Avatar>
									<span className="hidden xs:inline">{pr.author.name}</span>
								</div>
								<span className="hidden sm:inline">•</span>
								<span className="hidden sm:inline">
									{formatRelativeTime(pr.createdAt)}
								</span>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
						{/* Active Reviewers - Hidden on mobile */}
						{activeUsers.length > 0 && (
							<div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-muted rounded-lg border dark:border-border">
								<div className="flex -space-x-1.5 sm:-space-x-2">
									{activeUsers.map((user) => (
										<div
											key={user.id}
											className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-medium border-2 border-white dark:border-card"
											style={{ backgroundColor: user.color }}
											title={user.name}
										>
											{getInitials(user.name)}
										</div>
									))}
								</div>
								<span className="text-xs font-medium text-slate-700 dark:text-foreground">
									{activeUsers.length} reviewing
								</span>
							</div>
						)}

						{/* Review Actions */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
								>
									<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
									<span className="hidden xs:inline">Review</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem className="gap-2">
									<Check className="w-4 h-4 text-green-600" />
									Approve
								</DropdownMenuItem>
								<DropdownMenuItem className="gap-2">
									<MessageSquare className="w-4 h-4 text-blue-600" />
									Comment
								</DropdownMenuItem>
								<DropdownMenuItem className="gap-2">
									<X className="w-4 h-4 text-red-600" />
									Request Changes
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{pr.status === "open" && (
							<Button
								variant="outline"
								size="sm"
								className="hidden md:inline-flex text-xs sm:text-sm"
							>
								Merge Pull Request
							</Button>
						)}
					</div>
				</div>

				{/* Stats Bar */}
				<div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
					<div className="flex items-center gap-1.5 sm:gap-2">
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
					<div className="items-center gap-1.5 sm:gap-2 hidden xs:flex">
						<span className="text-slate-600 dark:text-muted-foreground">
							Commits:
						</span>
						<span className="font-medium text-slate-900 dark:text-foreground">
							{pr.commits}
						</span>
					</div>
					{pr.aiInsights.length > 0 && (
						<div className="flex items-center gap-1.5 sm:gap-2">
							<span className="text-slate-600 dark:text-muted-foreground hidden sm:inline">
								AI Issues:
							</span>
							<span className="font-medium text-red-600 dark:text-red-400">
								{pr.aiInsights.length}
							</span>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default PRHeader;
