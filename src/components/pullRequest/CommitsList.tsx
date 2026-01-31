import { useState } from "react";
import {
	GitCommit,
	Copy,
	Check,
	ExternalLink,
	ChevronRight,
	FileCode,
} from "lucide-react";
import { type PullRequest, type User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatRelativeTime, getInitials } from "@/utils/formatting";
import { cn } from "@/lib/utils";

interface CommitsListProps {
	pullRequest: PullRequest;
}

type Commit = {
	sha: string;
	message: string;
	description?: string;
	author: User;
	timestamp: Date;
	filesChanged: number;
	additions: number;
	deletions: number;
	verified?: boolean;
};

const CommitsList = ({ pullRequest }: CommitsListProps) => {
	const [copiedSha, setCopiedSha] = useState<string | null>(null);
	const [expandedCommit, setExpandedCommit] = useState<string | null>(null);

	// Mock commits (in real app, would come from API)
	const commits: Commit[] = [
		{
			sha: "a1b2c3d4e5f6",
			message: "Add user authentication middleware",
			description:
				"Implemented JWT-based authentication with role validation. Added middleware for protecting routes and validating tokens.",
			author: pullRequest.author,
			timestamp: new Date(pullRequest.createdAt),
			filesChanged: 3,
			additions: 145,
			deletions: 12,
			verified: true,
		},
		{
			sha: "b2c3d4e5f6a1",
			message: "Fix JWT token validation",
			description:
				"Fixed issue where expired tokens were not being rejected properly.",
			author: pullRequest.author,
			timestamp: new Date(pullRequest.createdAt.getTime() + 1000 * 60 * 60 * 2),
			filesChanged: 1,
			additions: 23,
			deletions: 8,
			verified: true,
		},
		{
			sha: "c3d4e5f6a1b2",
			message: "Add role-based authorization",
			author: pullRequest.author,
			timestamp: new Date(pullRequest.createdAt.getTime() + 1000 * 60 * 60 * 4),
			filesChanged: 2,
			additions: 67,
			deletions: 5,
			verified: false,
		},
		{
			sha: "d4e5f6a1b2c3",
			message: "Add comprehensive test coverage",
			description:
				"Added unit tests for authentication middleware and authorization logic. Increased coverage to 95%.",
			author: pullRequest.author,
			timestamp: new Date(pullRequest.createdAt.getTime() + 1000 * 60 * 60 * 6),
			filesChanged: 1,
			additions: 89,
			deletions: 0,
			verified: true,
		},
	];

	const copyToClipboard = (sha: string) => {
		navigator.clipboard.writeText(sha);
		setCopiedSha(sha);
		setTimeout(() => setCopiedSha(null), 2000);
	};

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Summary */}
			<Card className="p-3 sm:p-4">
				<div className="flex items-center gap-2 sm:gap-3">
					<GitCommit className="w-5 h-5 text-slate-600 dark:text-muted-foreground" />
					<div>
						<p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-foreground">
							{commits.length} Commits
						</p>
						<p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
							{pullRequest.additions} additions, {pullRequest.deletions}{" "}
							deletions across {pullRequest.changedFiles} files
						</p>
					</div>
				</div>
			</Card>

			{/* Commits List */}
			<div className="space-y-2 sm:space-y-3">
				{commits.map((commit, index) => (
					<Card key={commit.sha} className="overflow-hidden">
						<Collapsible
							open={expandedCommit === commit.sha}
							onOpenChange={(open: boolean) =>
								setExpandedCommit(open ? commit.sha : null)
							}
						>
							<div className="p-3 sm:p-4">
								{/* Commit Header */}
								<div className="flex items-start gap-2 sm:gap-3">
									<Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0">
										<AvatarImage
											src={commit.author.avatar}
											alt={commit.author.name}
										/>
										<AvatarFallback className="text-xs">
											{getInitials(commit.author.name)}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										{/* Commit Message */}
										<div className="flex items-start justify-between gap-2 mb-1">
											<p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-foreground line-clamp-2">
												{commit.message}
											</p>
											{commit.verified && (
												<Badge
													variant="outline"
													className="text-[10px] sm:text-xs shrink-0 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400"
												>
													Verified
												</Badge>
											)}
										</div>

										{/* Commit Info */}
										<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-600 dark:text-muted-foreground">
											<span className="font-medium">{commit.author.name}</span>
											<span className="hidden xs:inline">•</span>
											<span>{formatRelativeTime(commit.timestamp)}</span>
											<span className="hidden sm:inline">•</span>

											{/* SHA */}
											<div className="flex items-center gap-1">
												<code className="px-1.5 py-0.5 bg-slate-100 dark:bg-muted rounded font-mono text-[10px] sm:text-xs">
													{commit.sha.substring(0, 7)}
												</code>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(commit.sha)}
													className="h-5 w-5 sm:h-6 sm:w-6 p-0"
												>
													{copiedSha === commit.sha ? (
														<Check className="w-3 h-3 text-green-600" />
													) : (
														<Copy className="w-3 h-3" />
													)}
												</Button>
											</div>
										</div>

										{/* Stats */}
										<div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs">
											<div className="flex items-center gap-1">
												<FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-muted-foreground" />
												<span className="text-slate-600 dark:text-muted-foreground">
													{commit.filesChanged} files
												</span>
											</div>
											<span className="text-green-600 dark:text-green-400">
												+{commit.additions}
											</span>
											<span className="text-red-600 dark:text-red-400">
												-{commit.deletions}
											</span>
										</div>

										{/* Expand/Collapse Button */}
										{commit.description && (
											<CollapsibleTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="mt-2 h-6 sm:h-7 px-2 text-xs"
												>
													<ChevronRight
														className={cn(
															"w-3 h-3 mr-1 transition-transform",
															expandedCommit === commit.sha && "rotate-90",
														)}
													/>
													{expandedCommit === commit.sha ? "Hide" : "Show"}{" "}
													details
												</Button>
											</CollapsibleTrigger>
										)}
									</div>
								</div>

								{/* Expanded Content */}
								<CollapsibleContent>
									{commit.description && (
										<>
											<Separator className="my-3" />
											<div className="pl-8 sm:pl-11">
												<p className="text-xs sm:text-sm text-slate-700 dark:text-foreground whitespace-pre-wrap">
													{commit.description}
												</p>
												<div className="flex gap-2 mt-3">
													<Button
														variant="outline"
														size="sm"
														className="h-7 text-xs gap-1"
													>
														<ExternalLink className="w-3 h-3" />
														<span className="hidden xs:inline">
															View commit
														</span>
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-7 text-xs gap-1"
													>
														<FileCode className="w-3 h-3" />
														<span className="hidden xs:inline">
															Browse files
														</span>
													</Button>
												</div>
											</div>
										</>
									)}
								</CollapsibleContent>
							</div>

							{/* Commit Separator Line */}
							{index < commits.length - 1 && (
								<div className="h-px bg-slate-200 dark:bg-border" />
							)}
						</Collapsible>
					</Card>
				))}
			</div>

			{/* View All on GitHub */}
			<Button variant="outline" className="w-full gap-2">
				<ExternalLink className="w-4 h-4" />
				View all commits on GitHub
			</Button>
		</div>
	);
};

export default CommitsList;
