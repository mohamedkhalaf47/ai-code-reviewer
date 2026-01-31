import {
	GitPullRequest,
	MessageSquare,
	GitCommit,
	CheckCircle,
	XCircle,
	GitMerge,
	AlertCircle
} from "lucide-react";
import { type PullRequest, type User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRelativeTime, getInitials } from "@/utils/formatting";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
	pullRequest: PullRequest;
}

type ActivityItem = {
	id: string;
	type:
		| "created"
		| "comment"
		| "commit"
		| "review"
		| "merged"
		| "closed"
		| "reopened";
	timestamp: Date;
	author: User;
	data?: {
		status?: string;
		content?: string;
		reactions?: Array<{ type: string }>;
		message?: string;
		id?: string;
	};
};

const ActivityTimeline = ({ pullRequest }: ActivityTimelineProps) => {
	// Generate timeline items from PR data
	const generateTimeline = (): ActivityItem[] => {
		const items: ActivityItem[] = [];

		// PR Created
		items.push({
			id: "created",
			type: "created",
			timestamp: pullRequest.createdAt,
			author: pullRequest.author,
		});

		// Comments
		pullRequest.commentThreads.forEach((thread) => {
			thread.comments.forEach((comment) => {
				items.push({
					id: `comment-${comment.id}`,
					type: "comment",
					timestamp: comment.createdAt,
					author: comment.author,
					data: { ...comment, id: comment.id.toString() },
				});
			});
		});

		// Mock commits (in real app, would come from PR data)
		const mockCommits = [
			{
				id: "commit-1",
				message: "Add authentication middleware",
				author: pullRequest.author,
				timestamp: new Date(pullRequest.createdAt.getTime() + 1000 * 60 * 30),
			},
			{
				id: "commit-2",
				message: "Fix JWT token validation",
				author: pullRequest.author,
				timestamp: new Date(
					pullRequest.createdAt.getTime() + 1000 * 60 * 60 * 2,
				),
			},
			{
				id: "commit-3",
				message: "Add role-based authorization",
				author: pullRequest.author,
				timestamp: new Date(
					pullRequest.createdAt.getTime() + 1000 * 60 * 60 * 4,
				),
			},
		];

		mockCommits.forEach((commit) => {
			items.push({
				id: commit.id,
				type: "commit",
				timestamp: commit.timestamp,
				author: commit.author,
				data: commit,
			});
		});

		// Reviews (if any)
		if (pullRequest.reviewStatus === "approved") {
			items.push({
				id: "review-approved",
				type: "review",
				timestamp: new Date(pullRequest.updatedAt),
				author: pullRequest.reviewers[0],
				data: { status: "approved" },
			});
		}

		// Sort by timestamp
		return items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	};

	const timeline = generateTimeline();

	const getIcon = (type: string) => {
		switch (type) {
			case "created":
				return GitPullRequest;
			case "comment":
				return MessageSquare;
			case "commit":
				return GitCommit;
			case "review":
				return CheckCircle;
			case "merged":
				return GitMerge;
			case "closed":
				return XCircle;
			default:
				return AlertCircle;
		}
	};

	const getIconColor = (type: string) => {
		switch (type) {
			case "created":
				return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20";
			case "comment":
				return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20";
			case "commit":
				return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/20";
			case "review":
				return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20";
			case "merged":
				return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20";
			case "closed":
				return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20";
			default:
				return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/20";
		}
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{timeline.map((item, index) => {
				const Icon = getIcon(item.type);
				const isLast = index === timeline.length - 1;

				return (
					<div key={item.id} className="relative">
						{/* Timeline Line */}
						{!isLast && (
							<div className="absolute left-4 sm:left-5 top-10 sm:top-12 bottom-0 w-0.5 bg-slate-200 dark:bg-border" />
						)}

						{/* Activity Item */}
						<div className="flex gap-3 sm:gap-4">
							{/* Icon */}
							<div
								className={cn(
									"shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
									getIconColor(item.type),
								)}
							>
								<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								{/* Header */}
								<div className="flex items-start gap-2 mb-1">
									<Avatar className="w-5 h-5 sm:w-6 sm:h-6">
										<AvatarImage
											src={item.author.avatar}
											alt={item.author.name}
										/>
										<AvatarFallback className="text-xs">
											{getInitials(item.author.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="text-xs sm:text-sm text-slate-700 dark:text-foreground">
											<span className="font-semibold">{item.author.name}</span>{" "}
											{item.type === "created" && "opened this pull request"}
											{item.type === "comment" && "commented"}
											{item.type === "commit" && "committed"}
											{item.type === "review" && (
												<>
													{item.data?.status === "approved" &&
														"approved these changes"}
													{item.data?.status === "changes_requested" &&
														"requested changes"}
													{item.data?.status === "commented" && "reviewed"}
												</>
											)}
										</p>
										<p className="text-xs text-slate-500 dark:text-muted-foreground">
											{formatRelativeTime(item.timestamp)}
										</p>
									</div>
								</div>

								{/* Activity Content */}
								{item.type === "created" && (
									<Card className="p-3 sm:p-4 mt-2 bg-slate-50 dark:bg-muted/30">
										<h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-foreground mb-2">
											{pullRequest.title}
										</h3>
										<p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground whitespace-pre-wrap line-clamp-3">
											{pullRequest.description}
										</p>
										<div className="flex flex-wrap gap-2 mt-3">
											{pullRequest.labels?.map((label) => (
												<Badge
													key={label}
													variant="secondary"
													className="text-xs"
												>
													{label}
												</Badge>
											))}
										</div>
									</Card>
								)}

								{item.type === "comment" && item.data && (
									<Card className="p-3 sm:p-4 mt-2">
										<p className="text-xs sm:text-sm text-slate-700 dark:text-foreground whitespace-pre-wrap">
											{item.data.content}
										</p>
										{item.data?.reactions && item.data.reactions.length > 0 && (
											<div className="flex gap-2 mt-2">
												{["👍", "❤️", "🎉"].map((emoji) => {
													const count = item.data?.reactions?.filter(
														(r: { type: string }) => r.type === emoji,
													).length ?? 0;
													if (count === 0) return null;
													return (
														<span
															key={emoji}
															className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-muted"
														>
															{emoji} {count}
														</span>
													);
												})}
											</div>
										)}
									</Card>
								)}

								{item.type === "commit" && item.data && (
									<Card className="p-3 sm:p-4 mt-2 bg-slate-50 dark:bg-muted/30">
										<div className="flex items-start gap-2">
											<code className="flex-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-foreground">
												{item.data.message}
											</code>
											<code className="text-xs text-slate-500 dark:text-muted-foreground font-mono">
												{item.data.id?.substring(0, 7)}
											</code>
										</div>
									</Card>
								)}

								{item.type === "review" && (
									<Card className="p-3 sm:p-4 mt-2 border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10">
										<p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
											This pull request has been approved
										</p>
									</Card>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ActivityTimeline;