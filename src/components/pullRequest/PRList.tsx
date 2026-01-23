import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { type PullRequest } from "@/types";
import  PRCard  from "./PRCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface PRListProps {
	pullRequests: PullRequest[];
}

type SortOption = "newest" | "oldest" | "most-comments" | "most-changes";
type StatusFilter = "all" | "open" | "closed" | "merged" | "draft";

export const PRList = ({ pullRequests }: PRListProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [showCriticalOnly, setShowCriticalOnly] = useState(false);
	const [showWithComments, setShowWithComments] = useState(false);

	// Filter PRs
	const filteredPRs = pullRequests.filter((pr) => {
		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				pr.title.toLowerCase().includes(query) ||
				pr.description.toLowerCase().includes(query) ||
				pr.number.toString().includes(query) ||
				pr.author.name.toLowerCase().includes(query);

			if (!matchesSearch) return false;
		}

		// Status filter
		if (statusFilter !== "all" && pr.status !== statusFilter) {
			return false;
		}

		// Critical issues filter
		if (showCriticalOnly) {
			const hasCritical = pr.aiInsights.some((i) => i.severity === "critical");
			if (!hasCritical) return false;
		}

		// Comments filter
		if (showWithComments) {
			const totalComments = pr.commentThreads.reduce(
				(sum, t) => sum + t.comments.length,
				0,
			);
			if (totalComments === 0) return false;
		}

		return true;
	});

	// Sort PRs
	const sortedPRs = [...filteredPRs].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "oldest":
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case "most-comments":
				{ const aComments = a.commentThreads.reduce(
					(sum, t) => sum + t.comments.length,
					0,
				);
				const bComments = b.commentThreads.reduce(
					(sum, t) => sum + t.comments.length,
					0,
				);
				return bComments - aComments; }
			case "most-changes":
				return b.additions + b.deletions - (a.additions + a.deletions);
			default:
				return 0;
		}
	});

	const activeFiltersCount =
		(statusFilter !== "all" ? 1 : 0) +
		(showCriticalOnly ? 1 : 0) +
		(showWithComments ? 1 : 0);

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Search and Filters Bar */}
			<div className="flex flex-col gap-2 sm:gap-3">
				{/* Search */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search pull requests..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Filters Row */}
				<div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
					{/* Sort */}
					<Select
						value={sortBy}
						onValueChange={(value) => setSortBy(value as SortOption)}
					>
						<SelectTrigger className="w-35 sm:w-45 shrink-0">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest first</SelectItem>
							<SelectItem value="oldest">Oldest first</SelectItem>
							<SelectItem value="most-comments">Most comments</SelectItem>
							<SelectItem value="most-changes">Most changes</SelectItem>
						</SelectContent>
					</Select>

					{/* Status Filter */}
					<Select
						value={statusFilter}
						onValueChange={(value) => setStatusFilter(value as StatusFilter)}
					>
						<SelectTrigger className="w-27.5 sm:w-35 shrink-0">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All status</SelectItem>
							<SelectItem value="open">Open</SelectItem>
							<SelectItem value="closed">Closed</SelectItem>
							<SelectItem value="merged">Merged</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
						</SelectContent>
					</Select>

					{/* Advanced Filters */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="relative shrink-0"
							>
								<SlidersHorizontal className="w-4 h-4 sm:mr-2" />
								<span className="hidden sm:inline">Filters</span>
								{activeFiltersCount > 0 && (
									<Badge
										variant="destructive"
										className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
									>
										{activeFiltersCount}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Filter by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={showCriticalOnly}
								onCheckedChange={setShowCriticalOnly}
							>
								Critical issues only
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={showWithComments}
								onCheckedChange={setShowWithComments}
							>
								Has comments
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Active Filters Display */}
			{activeFiltersCount > 0 && (
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
						Active filters:
					</span>
					{statusFilter !== "all" && (
						<Badge variant="secondary" className="gap-1 text-xs">
							Status: {statusFilter}
							<button
								onClick={() => setStatusFilter("all")}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{showCriticalOnly && (
						<Badge variant="secondary" className="gap-1 text-xs">
							Critical issues
							<button
								onClick={() => setShowCriticalOnly(false)}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{showWithComments && (
						<Badge variant="secondary" className="gap-1 text-xs">
							Has comments
							<button
								onClick={() => setShowWithComments(false)}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setStatusFilter("all");
							setShowCriticalOnly(false);
							setShowWithComments(false);
						}}
						className="h-6 text-xs"
					>
						Clear all
					</Button>
				</div>
			)}

			{/* Results Count */}
			<div className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
				Showing {sortedPRs.length} of {pullRequests.length} pull requests
			</div>

			{/* PR Cards */}
			<div className="space-y-2 sm:space-y-3">
				{sortedPRs.length > 0 ? (
					sortedPRs.map((pr) => <PRCard key={pr.id} pr={pr} />)
				) : (
					<div className="text-center py-8 sm:py-12">
						<Filter className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-muted mx-auto mb-3" />
						<p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground">
							No pull requests match your filters
						</p>
						<Button
							variant="link"
							onClick={() => {
								setSearchQuery("");
								setStatusFilter("all");
								setShowCriticalOnly(false);
								setShowWithComments(false);
							}}
							className="mt-2"
						>
							Clear all filters
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
