import { useState } from "react";
import { type FileChange, type CommentThread } from "@/types";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
	file: FileChange;
	commentThreads: CommentThread[];
	onAddComment?: (lineNumber: number) => void;
}

const CodeViewer = ({
	file,
	commentThreads,
	onAddComment,
}: CodeViewerProps) => {
	const [hoveredLine, setHoveredLine] = useState<number | null>(null);

	// Split code into lines
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

	return (
		<div className="h-full flex flex-col bg-white dark:bg-card">
			{/* File Header */}
			<div className="px-4 py-3 border-b dark:border-border flex items-center justify-between">
				<div>
					<h3 className="text-sm font-semibold text-slate-900 dark:text-foreground mb-1">
						{file.path}
					</h3>
					<div className="flex items-center gap-3 text-xs text-slate-600 dark:text-muted-foreground">
						<Badge variant="outline" className="text-xs">
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
				<div className="font-mono text-sm">
					{lines.map((line, index) => {
						const lineNumber = getLineNumber(index);
						const lineType = getLineType(line);
						const hasComment = hasCommentOnLine(lineNumber);
						const thread = getThreadForLine(lineNumber);
						const isHovered = hoveredLine === lineNumber;

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
									<div className="shrink-0 w-12 px-2 py-1.5 text-right text-slate-400 dark:text-muted-foreground select-none bg-slate-50 dark:bg-muted/30 border-r dark:border-border">
										{lineNumber}
									</div>

									{/* Status Indicator */}
									<div
										className={cn(
											"shrink-0 w-8 flex items-center justify-center py-1.5",
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
									<div className="flex-1 px-4 py-1.5 overflow-x-auto">
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
									<div className="shrink-0 w-16 flex items-center justify-center py-1.5">
										{hasComment ? (
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() => onAddComment?.(lineNumber)}
											>
												<MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
											</Button>
										) : isHovered ? (
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() => onAddComment?.(lineNumber)}
											>
												<Plus className="w-3.5 h-3.5" />
											</Button>
										) : null}
									</div>
								</div>

								{/* Comment Thread (if exists) */}
								{thread && (
									<div className="ml-12 border-l-2 border-blue-500 dark:border-blue-400 bg-slate-50 dark:bg-muted/30 p-4">
										<div className="space-y-3">
											{thread.comments.map((comment) => (
												<div key={comment.id} className="flex gap-3">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="text-sm font-medium text-slate-900 dark:text-foreground">
																{comment.author.name}
															</span>
															<span className="text-xs text-slate-500 dark:text-muted-foreground">
																{new Date(
																	comment.createdAt,
																).toLocaleDateString()}
															</span>
															{thread.resolved && (
																<Badge variant="outline" className="text-xs">
																	Resolved
																</Badge>
															)}
														</div>
														<p className="text-sm text-slate-700 dark:text-foreground">
															{comment.content}
														</p>
													</div>
												</div>
											))}
										</div>
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