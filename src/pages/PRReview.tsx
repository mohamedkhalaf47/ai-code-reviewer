import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePullRequest } from "@/hooks/usePullRequests";
import { useComments } from "@/hooks/useComments";
import { useTheme } from "@/hooks/useTheme";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import PRHeader from "@/components/pullRequest/PRHeader";
import PRStats from "@/components/pullRequest/PRStats";
import FileTree from "@/components/code/FileTree";
import EnhancedCodeViewer from "@/components/editor/EnhancedCodeViewer";
import AIInsightsPanel from "@/components/AI/AIInsightsPanel";
import { CommentThread as CommentThreadComponent } from "@/components/comments/CommentThread";
import { type FileChange } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCollaboratingUsers } from "@/mocks/data/users";
import { Sparkles, MessageSquare, ArrowLeft } from "lucide-react";
import ActivityTimeline from "@/components/pullRequest/ActivityTimeline";
import CommitsList from "@/components/pullRequest/CommitsList";

const PRReview = () => {
	const { number } = useParams<{ number: string }>();
	const prNumber = parseInt(number || "0", 10);
	const { isDarkMode } = useTheme();

	const { pullRequest, loading, error } = usePullRequest(prNumber);
	const [selectedFile, setSelectedFile] = useState<FileChange | null>(null);
	const [showComments, setShowComments] = useState(false);
	const [showMobileComments, setShowMobileComments] = useState(false);

	// Comments management
	const {
		threads,
		fetchThreads,
		addComment,
		deleteComment,
		resolveThread,
		unresolveThread,
		addReaction,
	} = useComments(1, selectedFile?.id);

	// Fetch threads when file changes
	useEffect(() => {
		if (selectedFile) {
			fetchThreads();
		}
	}, [selectedFile, fetchThreads]);

	if (loading) {
		return <LoadingPage text="Loading pull request..." />;
	}

	if (error || !pullRequest) {
		return (
			<div className="p-3 sm:p-6">
				<Alert variant="destructive">
					<AlertDescription>
						{error || "Pull request not found"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const handleAddReply = async (threadId: number, content: string) => {
		const thread = threads.find((t) => t.id === threadId);
		if (thread) {
			await addComment(thread.lineNumber, content);
		}
	};

	// Handlers
	const handleFileSelect = (file: FileChange) => {
		setSelectedFile(file);
		setShowComments(false);
	};

	const handleCloseEditor = () => {
		setSelectedFile(null);
		setShowComments(false);
	};

	return (
		<div className="flex h-screen flex-col bg-white dark:bg-background">
			{/* Header */}
			<PRHeader pr={pullRequest} activeUsers={mockCollaboratingUsers} />

			{/* Main Content Area */}
			<div className="flex min-h-0 flex-1 flex-col">
				{/* PR Stats Bar */}
				<div className="border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-border dark:bg-background sm:px-4 sm:py-3">
					<PRStats pr={pullRequest} />
				</div>

				<Tabs defaultValue="files" className="flex min-h-0 flex-1 flex-col">
					{/* Tabs Navigation */}
					<div className="border-b border-slate-200 bg-white px-3 dark:border-border dark:bg-card sm:px-4">
						<TabsList className="bg-transparent p-0">
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
					{/* ========== FILES TAB ========== */}
					<TabsContent value="files" className="m-0 min-h-0 flex-1">
						{/* DESKTOP: lg+ breakpoint */}
						<div className="hidden min-h-0 flex-1 lg:flex flex-col">
							{selectedFile ? (
								/* Full-Width Editor + Floating Comments Button */
								<div className="relative flex min-h-0 flex-1 flex-col">
									{/* Close Button Bar + Comments Button */}
									<div className="border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-border dark:bg-muted/30 sm:px-4 flex items-center justify-between">
										<Button
											variant="ghost"
											size="sm"
											onClick={handleCloseEditor}
											className="h-7 text-xs sm:text-sm"
										>
											<ArrowLeft className="mr-1 h-3.5 w-3.5" />
											Back to Files
										</Button>
										<Button
											onClick={() => setShowComments(true)}
											size="lg"
											title="Open comments"
										>
											<MessageSquare className="mr-2 h-5 w-5" />
											Comments ({threads.length})
										</Button>
									</div>

									{/* Editor: Full Width */}
									<div className="min-h-0 flex-1">
										<EnhancedCodeViewer
											file={selectedFile}
											isDarkMode={isDarkMode}
										/>
									</div>

									{/* Comments Drawer - right-side Sheet */}
									<Sheet open={showComments} onOpenChange={setShowComments}>
										<SheetContent
											side="right"
											className="flex w-full flex-col p-0 sm:max-w-md"
										>
											<SheetHeader className="border-b border-slate-200 px-4 py-3 dark:border-border">
												<SheetTitle className="flex items-center gap-2">
													<MessageSquare className="h-5 w-5" />
													Comments ({threads.length})
												</SheetTitle>
											</SheetHeader>
											<ScrollArea className="min-h-0 flex-1">
												<div className="space-y-3 p-4">
													{threads.length > 0 ? (
														threads.map((thread) => (
															<CommentThreadComponent
																key={thread.id}
																thread={thread}
																onAddReply={handleAddReply}
																onDeleteComment={deleteComment}
																onResolveThread={resolveThread}
																onUnresolveThread={unresolveThread}
																onReact={addReaction}
															/>
														))
													) : (
														<div className="text-center py-8">
															<MessageSquare className="w-12 h-12 text-slate-300 dark:text-muted mx-auto mb-3" />
															<p className="text-sm text-slate-500 dark:text-muted-foreground">
																No comments yet
															</p>
															<p className="text-xs text-slate-400 dark:text-muted-foreground mt-1">
																Click on line numbers to add comments
															</p>
														</div>
													)}
												</div>
											</ScrollArea>
										</SheetContent>
									</Sheet>
								</div>
							) : (
								/* 2-Column Layout: File Tree | AI Insights */
								<div className="flex min-h-0 w-full">
									{/* Left: File Tree */}
									<div className="min-h-0 flex-1 border-r border-slate-200 dark:border-border">
										<FileTree
											files={pullRequest.files}
											selectedFile={selectedFile}
											onFileSelect={handleFileSelect}
										/>
									</div>

									{/* Right: AI Insights */}
									<div className="flex min-h-0 w-96 min-w-0 flex-col">
										<AIInsightsPanel
											insights={pullRequest.aiInsights}
											summary={pullRequest.aiSummary}
										/>
									</div>
								</div>
							)}
						</div>

						{/* MOBILE/TABLET: <lg breakpoint */}
						<div className="flex min-h-0 flex-1 flex-col lg:hidden">
							{selectedFile ? (
								/* Mobile: Full-screen editor + floating button + drawer */
								<div className="relative flex min-h-0 flex-1 flex-col">
									{/* Close Button Bar */}
									<div className="border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-border dark:bg-muted/30">
										<Button
											variant="ghost"
											size="sm"
											onClick={handleCloseEditor}
											className="h-7 text-xs"
										>
											<ArrowLeft className="mr-1 h-3.5 w-3.5" />
											Back
										</Button>
									</div>

									{/* Editor: Full height, no scroll wrapper */}
									<div className="min-h-0 flex-1">
										<EnhancedCodeViewer
											file={selectedFile}
											isDarkMode={isDarkMode}
										/>
									</div>

									{/* Floating Comments Button - bottom-right absolute */}
									<Button
										size="icon"
										onClick={() => setShowMobileComments(true)}
										className="absolute right-4 bottom-4 h-13 w-13 rounded-full shadow-lg z-10"
										title={`Open comments (${threads.length})`}
									>
										<MessageSquare className="h-6 w-6" />
									</Button>

									{/* Comments Sheet (Right Drawer) */}
									<Sheet
										open={showMobileComments}
										onOpenChange={setShowMobileComments}
									>
										<SheetContent
											side="right"
											className="flex min-h-0 flex-col p-0 w-full sm:max-w-md"
										>
											<SheetHeader className="border-b border-slate-200 px-4 py-3 dark:border-border">
												<SheetTitle className="flex items-center gap-2">
													<MessageSquare className="h-4 w-4" />
													Comments ({threads.length})
												</SheetTitle>
											</SheetHeader>
											<ScrollArea className="min-h-0 flex-1">
												<div className="space-y-3 p-4">
													{threads.length > 0 ? (
														threads.map((thread) => (
															<CommentThreadComponent
																key={thread.id}
																thread={thread}
																onAddReply={handleAddReply}
																onDeleteComment={deleteComment}
																onResolveThread={resolveThread}
																onUnresolveThread={unresolveThread}
																onReact={addReaction}
															/>
														))
													) : (
														<div className="py-8 text-center">
															<MessageSquare className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-muted" />
															<p className="text-sm text-slate-500 dark:text-muted-foreground">
																No comments yet
															</p>
														</div>
													)}
												</div>
											</ScrollArea>
										</SheetContent>
									</Sheet>
								</div>
							) : (
								/* Mobile: Tabs for Files and AI Insights */
								<Tabs
									defaultValue="files"
									className="flex min-h-0 flex-1 flex-col"
								>
									<div className="border-b border-slate-200 bg-white dark:border-border dark:bg-card px-3 py-2">
										<TabsList className="grid w-full grid-cols-2 bg-transparent">
											<TabsTrigger value="files" className="text-xs sm:text-sm">
												Files ({pullRequest.files.length})
											</TabsTrigger>
											<TabsTrigger
												value="insights"
												className="gap-1 text-xs sm:text-sm"
											>
												<Sparkles className="h-3.5 w-3.5" />
												<span className="hidden sm:inline">Insights</span>
											</TabsTrigger>
										</TabsList>
									</div>

									<TabsContent value="files" className="m-0 min-h-0 flex-1">
										<FileTree
											files={pullRequest.files}
											selectedFile={selectedFile}
											onFileSelect={handleFileSelect}
										/>
									</TabsContent>

									<TabsContent value="insights" className="m-0 min-h-0 flex-1">
										<AIInsightsPanel
											insights={pullRequest.aiInsights}
											summary={pullRequest.aiSummary}
										/>
									</TabsContent>
								</Tabs>
							)}
						</div>
					</TabsContent>

					{/* ========== CONVERSATION TAB ========== */}
					<TabsContent value="conversation" className="flex-1 m-0">
						<div className="max-w-4xl mx-auto p-3 sm:p-6">
							<div className="mb-4 sm:mb-6">
								<h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-foreground mb-1">
									Conversation
								</h3>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
									Activity timeline for this pull request
								</p>
							</div>
							<ActivityTimeline pullRequest={pullRequest} />
						</div>
					</TabsContent>

					{/* ========== COMMITS TAB ========== */}
					<TabsContent value="commits" className="flex-1 m-0">
						<div className="max-w-4xl mx-auto p-3 sm:p-6">
							<div className="mb-4 sm:mb-6">
								<h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-foreground mb-1">
									Commits
								</h3>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">
									{pullRequest.commits} commits in this pull request
								</p>
							</div>
							<CommitsList pullRequest={pullRequest} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default PRReview;
