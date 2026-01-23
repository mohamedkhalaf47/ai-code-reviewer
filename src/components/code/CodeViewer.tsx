import { useState } from "react";
import { type FileChange, type CommentThread } from "@/types";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import CommentForm from "@/components/comments/CommentForm";
import { CommentThread as CommentThreadComponent } from "@/components/comments/CommentThread";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
	file: FileChange;
	commentThreads: CommentThread[];
	onAddComment?: (lineNumber: number, content: string) => void;
	onAddReply?: (threadId: number, content: string) => void;
	onEditComment?: (commentId: number, content: string) => void;
	onDeleteComment?: (commentId: number) => void;
	onResolveThread?: (threadId: number) => void;
	onUnresolveThread?: (threadId: number) => void;
	onReact?: (commentId: number, reaction: string) => void;
}

const CodeViewer = ({
	file,
	commentThreads,
	onAddComment,
	onAddReply,
	onEditComment,
	onDeleteComment,
	onResolveThread,
	onUnresolveThread,
	onReact,
}: CodeViewerProps) => {
	const [hoveredLine, setHoveredLine] = useState<number | null>(null);
	const [activeCommentLine, setActiveCommentLine] = useState<number | null>(
		null,
	);

	const lines = file.patch?.split("\n") || [];

	const getLineType = (line: string): "added" | "deleted" | "unchanged" => {
		if (line.startsWith("+")) return "added";
		if (line.startsWith("-")) return "deleted";
		return "unchanged";
	};

	const getLineNumber = (index: number): number => {
		return index + 1;
	};

	const hasCommentOnLine = (lineNumber: number): boolean => {
		return commentThreads.some((thread) => thread.lineNumber === lineNumber);
	};

	const getThreadForLine = (lineNumber: number): CommentThread | undefined => {
		return commentThreads.find((thread) => thread.lineNumber === lineNumber);
	};

	const handleAddComment = (lineNumber: number, content: string) => {
		onAddComment?.(lineNumber, content);
		setActiveCommentLine(null);
	};

	return (
		<div className="h-full flex flex-col bg-white dark:bg-card">
			{/* File Header */}
			<div className="px-3 sm:px-4 py-2 sm:py-3 border-b dark:border-border flex items-center justify-between">
				<div>
					<h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-foreground mb-1 truncate">
						{file.path}
					</h3>
					<div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-600 dark:text-muted-foreground">
						<Badge variant="outline" className="text-[10px] sm:text-xs">
							{file.status}
						</Badge>
						<span className="text-green-600 dark:text-green-400">
							+{file.additions}
						</span>
						<span className="text-red-600 dark:text-red-400">
							-{file.deletions}
						</span>
					</div>
				</div>
			</div>

			{/* Code Content */}
			<ScrollArea className="flex-1">
				<div className="font-mono text-xs sm:text-sm">
					{lines.map((line, index) => {
						const lineNumber = getLineNumber(index);
						const lineType = getLineType(line);
						const hasComment = hasCommentOnLine(lineNumber);
						const thread = getThreadForLine(lineNumber);
						const isHovered = hoveredLine === lineNumber;
						const showCommentForm = activeCommentLine === lineNumber;

						return (
							<div key={index}>
								{/* Code Line */}
								<div
									className={cn(
										"flex items-start group",
										lineType === "added" && "bg-green-50 dark:bg-green-500/10",
										lineType === "deleted" && "bg-red-50 dark:bg-red-500/10",
										hasComment && "bg-blue-50 dark:bg-blue-500/5",
									)}
									onMouseEnter={() => setHoveredLine(lineNumber)}
									onMouseLeave={() => setHoveredLine(null)}
								>
									{/* Line Number */}
									<div className="shrink-0 w-10 sm:w-12 px-1.5 sm:px-2 py-1 sm:py-1.5 text-right text-slate-400 dark:text-muted-foreground select-none bg-slate-50 dark:bg-muted/30 border-r dark:border-border text-[10px] sm:text-xs">
										{lineNumber}
									</div>

									{/* Status Indicator */}
									<div
										className={cn(
											"shrink-0 w-6 sm:w-8 flex items-center justify-center py-1 sm:py-1.5 text-xs sm:text-sm",
											lineType === "added" &&
												"text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10",
											lineType === "deleted" &&
												"text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
										)}
									>
										{lineType === "added" && "+"}
										{lineType === "deleted" && "-"}
									</div>

									{/* Code Content */}
									<div className="flex-1 px-2 sm:px-4 py-1 sm:py-1.5 overflow-x-auto">
										<code
											className={cn(
												"text-slate-700 dark:text-foreground",
												lineType === "added" &&
													"text-green-800 dark:text-green-300",
												lineType === "deleted" &&
													"text-red-800 dark:text-red-300 line-through",
											)}
										>
											{line.replace(/^[+-]/, "")}
										</code>
									</div>

									{/* Actions */}
									<div className="shrink-0 w-12 sm:w-16 flex items-center justify-center py-1 sm:py-1.5">
										{hasComment ? (
											<Button
												variant="ghost"
												size="icon"
												className="h-5 w-5 sm:h-6 sm:w-6"
												onClick={() =>
													setActiveCommentLine(
														activeCommentLine === lineNumber
															? null
															: lineNumber,
													)
												}
											>
												<MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-400" />
											</Button>
										) : isHovered ? (
											<Button
												variant="ghost"
												size="icon"
												className="h-5 w-5 sm:h-6 sm:w-6"
												onClick={() => setActiveCommentLine(lineNumber)}
											>
												<Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
											</Button>
										) : null}
									</div>
								</div>

								{/* Comment Thread */}
								{thread && (
									<div className="ml-10 sm:ml-12 mr-2 sm:mr-4 my-2 sm:my-3">
										<CommentThreadComponent
											thread={thread}
											onAddReply={(threadId: number, content: string) =>
												onAddReply?.(threadId, content)
											}
											onEditComment={(id: number, content: string) =>
												onEditComment?.(id, content)
											}
											onDeleteComment={(id: number) => onDeleteComment?.(id)}
											onResolveThread={(id: number) => onResolveThread?.(id)}
											onUnresolveThread={(id: number) =>
												onUnresolveThread?.(id)
											}
											onReact={(id: number, reaction: string) =>
												onReact?.(id, reaction)
											}
										/>
									</div>
								)}

								{/* New Comment Form */}
								{showCommentForm && !thread && (
									<div className="ml-10 sm:ml-12 mr-2 sm:mr-4 my-2 sm:my-3 p-2 sm:p-3 border dark:border-border rounded-lg bg-slate-50 dark:bg-muted/30">
										<CommentForm
											onSubmit={(content) =>
												handleAddComment(lineNumber, content)
											}
											onCancel={() => setActiveCommentLine(null)}
											placeholder={`Comment on line ${lineNumber}...`}
											autoFocus
											showCancel
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};

export default CodeViewer;
