import { useState } from "react";
import { usePullRequest } from "@/hooks/usePullRequests";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import PRHeader from "@/components/pullRequest/PRHeader";
import PRStats from "@/components/pullRequest/PRStats";
import FileTree from "@/components/code/FileTree";
import CodeViewer from "@/components/code/CodeViewer";
import AIInsightsPanel from "@/components/AI/AIInsightsPanel";
import { type FileChange } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockCollaboratingUsers } from "@/mocks/data/users";
import { useParams } from "react-router-dom";

const PRReview = () => {
	const { number } = useParams<{ number: string }>();
	const prNumber = parseInt(number || "0", 10);

	// In real app, we'd fetch by number. For now, we'll use ID
	const { pullRequest, loading, error } = usePullRequest(prNumber);

	const [selectedFile, setSelectedFile] = useState<FileChange | null>(null);
	const [mobileView, setMobileView] = useState<"files" | "code" | "insights">(
		"code",
	);

if (loading) {
	return <LoadingPage text="Loading pull request..." />;
}

if (error || !pullRequest) {
	return (
		<div className="p-3 sm:p-6">
			<Alert variant="destructive">
				<AlertDescription>{error || "Pull request not found"}</AlertDescription>
			</Alert>
		</div>
	);
}

if (!selectedFile && pullRequest.files.length > 0) {
	setSelectedFile(pullRequest.files[0]);
}

const handleAddComment = (lineNumber: number) => {
	console.log("Add comment at line:", lineNumber);
};

return (
	<div className="flex flex-col">
		{/* PR Header */}
		<PRHeader pr={pullRequest} activeUsers={mockCollaboratingUsers} />

		{/* Main Content */}
		<div className="flex-1 flex flex-col overflow-hidden">
			{/* Stats */}
			<div className="p-3 sm:p-4 border-b dark:border-border bg-slate-50 dark:bg-background">
				<PRStats pr={pullRequest} />
			</div>

			{/* Tabs */}
			<Tabs
				defaultValue="files"
				className="flex-1 flex flex-col overflow-hidden"
			>
				<div className="px-3 sm:px-4 border-b dark:border-border bg-white dark:bg-card overflow-x-auto">
					<TabsList className="h-auto p-0 bg-transparent">
						<TabsTrigger value="files" className="text-xs sm:text-sm">
							Files Changed
						</TabsTrigger>
						<TabsTrigger value="conversation" className="text-xs sm:text-sm">
							Conversation
						</TabsTrigger>
						<TabsTrigger value="commits" className="text-xs sm:text-sm">
							Commits
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="files" className="flex-1 m-0 overflow-hidden">
					{/* Desktop Layout: 3-column grid */}
					<div className="hidden lg:grid h-full grid-cols-[280px_1fr_320px]">
						<FileTree
							files={pullRequest.files}
							selectedFile={selectedFile}
							onFileSelect={setSelectedFile}
						/>
						{selectedFile ? (
							<CodeViewer
								file={selectedFile}
								commentThreads={pullRequest.commentThreads.filter(
									(t) => t.fileId === selectedFile.id,
								)}
								onAddComment={handleAddComment}
							/>
						) : (
							<div className="flex items-center justify-center text-slate-500 dark:text-muted-foreground">
								Select a file to view changes
							</div>
						)}
						<AIInsightsPanel
							insights={pullRequest.aiInsights.filter(
								(i) => !selectedFile || i.fileId === selectedFile.id,
							)}
							summary={pullRequest.aiSummary}
						/>
					</div>

					{/* Mobile/Tablet Layout: Tabbed view */}
					<div className="lg:hidden h-full flex flex-col">
						{/* Mobile View Tabs */}
						<div className="border-b dark:border-border bg-white dark:bg-card">
							<div className="flex">
								<button
									onClick={() => setMobileView("files")}
									className={`flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
										mobileView === "files"
											? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
											: "border-transparent text-slate-600 dark:text-muted-foreground"
									}`}
								>
									Files ({pullRequest.files.length})
								</button>
								<button
									onClick={() => setMobileView("code")}
									className={`flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
										mobileView === "code"
											? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
											: "border-transparent text-slate-600 dark:text-muted-foreground"
									}`}
								>
									Code
								</button>
								<button
									onClick={() => setMobileView("insights")}
									className={`flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
										mobileView === "insights"
											? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
											: "border-transparent text-slate-600 dark:text-muted-foreground"
									}`}
								>
									AI ({pullRequest.aiInsights.length})
								</button>
							</div>
						</div>

						{/* Mobile Content */}
						<div className="flex-1 overflow-hidden">
							{mobileView === "files" && (
								<FileTree
									files={pullRequest.files}
									selectedFile={selectedFile}
									onFileSelect={(file) => {
										setSelectedFile(file);
										setMobileView("code");
									}}
								/>
							)}
							{mobileView === "code" && selectedFile && (
								<CodeViewer
									file={selectedFile}
									commentThreads={pullRequest.commentThreads.filter(
										(t) => t.fileId === selectedFile.id,
									)}
									onAddComment={handleAddComment}
								/>
							)}
							{mobileView === "insights" && (
								<AIInsightsPanel
									insights={pullRequest.aiInsights.filter(
										(i) => !selectedFile || i.fileId === selectedFile.id,
									)}
									summary={pullRequest.aiSummary}
								/>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent
					value="conversation"
					className="flex-1 m-0 p-3 sm:p-6 overflow-auto"
				>
					<div className="max-w-4xl mx-auto">
						<h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-foreground mb-4">
							Conversation
						</h3>
						<p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground">
							Conversation view coming soon...
						</p>
					</div>
				</TabsContent>

				<TabsContent
					value="commits"
					className="flex-1 m-0 p-3 sm:p-6 overflow-auto"
				>
					<div className="max-w-4xl mx-auto">
						<h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-foreground mb-4">
							Commits ({pullRequest.commits})
						</h3>
						<p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground">
							Commits view coming soon...
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
);
};

export default PRReview;
