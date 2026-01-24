import { useState } from "react";
import {
	CheckCircle,
	XCircle,
	MessageSquare,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { type CommentThread as CommentThreadType } from "@/types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommentThreadProps {
	thread: CommentThreadType;
	onAddReply: (threadId: number, content: string) => void;
	onDeleteComment: (commentId: number) => void;
	onResolveThread: (threadId: number) => void;
	onUnresolveThread: (threadId: number) => void;
	onReact: (commentId: number, reaction: string) => void;
}

export const CommentThread = ({
	thread,
	onAddReply,
	onDeleteComment,
	onResolveThread,
	onUnresolveThread,
	onReact,
}: CommentThreadProps) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleAddReply = (content: string) => {
		onAddReply(thread.id, content);
		setShowReplyForm(false);
	};

	const handleResolve = () => {
		if (thread.resolved) {
			onUnresolveThread(thread.id);
		} else {
			onResolveThread(thread.id);
		}
	};

	return (
		<div
			className={cn(
				"border rounded-lg transition-all",
				thread.resolved
					? "border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5"
					: "border-slate-200 dark:border-border bg-white dark:bg-card",
			)}
		>
			{/* Thread Header */}
			<div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b dark:border-border bg-slate-50 dark:bg-muted/30">
				<div className="flex items-center gap-2 sm:gap-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="h-6 w-6 sm:h-7 sm:w-7 p-0"
					>
						{isCollapsed ? (
							<ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
						) : (
							<ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
						)}
					</Button>

					<div className="flex items-center gap-1.5 sm:gap-2">
						<MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-muted-foreground" />
						<span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-foreground">
							Line {thread.lineNumber}
						</span>
					</div>

					<Badge variant="secondary" className="text-[10px] sm:text-xs">
						{thread.comments.length}{" "}
						{thread.comments.length === 1 ? "comment" : "comments"}
					</Badge>

					{thread.resolved && (
						<div className="flex items-center gap-1 text-green-700 dark:text-green-400">
							<CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							<span className="text-xs font-medium hidden sm:inline">
								Resolved
							</span>
						</div>
					)}
				</div>

				<Button
					variant={thread.resolved ? "outline" : "default"}
					size="sm"
					onClick={handleResolve}
					className="h-6 sm:h-7 px-2 sm:px-3 text-xs gap-1"
				>
					{thread.resolved ? (
						<>
							<XCircle className="w-3 h-3" />
							<span className="hidden xs:inline">Unresolve</span>
						</>
					) : (
						<>
							<CheckCircle className="w-3 h-3" />
							<span className="hidden xs:inline">Resolve</span>
						</>
					)}
				</Button>
			</div>

			{/* Thread Content */}
			{!isCollapsed && (
				<div className="p-3 sm:p-4">
					{/* Comments */}
					<div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
						{thread.comments.map((comment) => (
							<CommentItem
								key={comment.id}
								comment={comment}
								onReply={() => setShowReplyForm(true)}
								onEdit={(id) => console.log("Edit comment", id)}
								onDelete={onDeleteComment}
								onReact={onReact}
							/>
						))}
					</div>

					{/* Reply Form */}
					{showReplyForm ? (
						<div className="pt-3 sm:pt-4 border-t dark:border-border">
							<CommentForm
								onSubmit={handleAddReply}
								onCancel={() => setShowReplyForm(false)}
								placeholder="Write a reply..."
								autoFocus
								submitLabel="Reply"
								showCancel
							/>
						</div>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowReplyForm(true)}
							className="w-full h-7 sm:h-8 text-xs"
						>
							<MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
							Add a reply
						</Button>
					)}
				</div>
			)}

			{/* Resolved Info */}
			{thread.resolved && thread.resolvedBy && (
				<div className="px-3 sm:px-4 py-2 border-t border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10">
					<p className="text-[10px] sm:text-xs text-green-700 dark:text-green-400">
						Resolved by {thread.resolvedBy.name}
						{thread.resolvedAt &&
							` on ${new Date(thread.resolvedAt).toLocaleDateString()}`}
					</p>
				</div>
			)}
		</div>
	);
};
