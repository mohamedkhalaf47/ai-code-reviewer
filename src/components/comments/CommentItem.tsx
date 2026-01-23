import { useState } from "react";
import {
	MoreVertical,
	Trash2,
	Edit2,
	Reply,
	CheckCircle,
} from "lucide-react";
import { type Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, getInitials } from "@/utils/formatting";
import { getCurrentUser } from "@/mocks/data/users";
import { cn } from "@/lib/utils";

type CommentItemProps = {
	comment: Comment;
	onReply?: (commentId: number) => void;
	onEdit?: (commentId: number) => void;
	onDelete?: (commentId: number) => void;
	onReact?: (commentId: number, reaction: string) => void;
	isNested?: boolean;
}

const CommentItem = ({
	comment,
	onReply,
	onEdit,
	onDelete,
	onReact,
	isNested = false,
}: CommentItemProps) => {
	const currentUser = getCurrentUser();
	const isAuthor = comment.author.id === currentUser.id;
	const [showActions, setShowActions] = useState(false);

	const reactionEmojis = ["👍", "❤️", "🎉", "😕", "🚀"];

	const getUserReaction = () => {
		return comment.reactions?.find((r) => r.user.id === currentUser.id)?.type;
	};

	const getReactionCount = (emoji: string) => {
		return comment.reactions?.filter((r) => r.type === emoji).length || 0;
	};

	return (
		<div
			className={cn("group relative", !isNested && "pb-3 sm:pb-4")}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			<div className="flex gap-2 sm:gap-3">
				{/* Avatar */}
				<Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
					<AvatarImage src={comment.author.avatar} alt={comment.author.name} />
					<AvatarFallback className="text-xs">
						{getInitials(comment.author.name)}
					</AvatarFallback>
				</Avatar>

				{/* Content */}
				<div className="flex-1 min-w-0">
					{/* Header */}
					<div className="flex items-start justify-between gap-2 mb-1">
						<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
							<span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-foreground">
								{comment.author.name}
							</span>
							<span className="text-xs text-slate-500 dark:text-muted-foreground">
								{formatRelativeTime(comment.createdAt)}
							</span>
							{comment.resolved && (
								<div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 rounded text-green-700 dark:text-green-400">
									<CheckCircle className="w-3 h-3" />
									<span className="text-xs font-medium">Resolved</span>
								</div>
							)}
						</div>

						{/* Actions Menu */}
						{isAuthor && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className={cn(
											"h-6 w-6 sm:h-7 sm:w-7 transition-opacity",
											showActions
												? "opacity-100"
												: "opacity-0 sm:group-hover:opacity-100",
										)}
									>
										<MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => onEdit?.(comment.id)}>
										<Edit2 className="w-4 h-4 mr-2" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => onDelete?.(comment.id)}
										className="text-red-600 focus:text-red-600 dark:text-red-400"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>

					{/* Comment Body */}
					<div className="prose prose-sm dark:prose-invert max-w-none mb-2">
						<p className="text-xs sm:text-sm text-slate-700 dark:text-foreground leading-relaxed whitespace-pre-wrap">
							{comment.content}
						</p>
					</div>

					{/* Reactions */}
					{comment.reactions && comment.reactions.length > 0 && (
						<div className="flex flex-wrap items-center gap-1 mb-2">
							{reactionEmojis.map((emoji) => {
								const count = getReactionCount(emoji);
								const hasReacted = getUserReaction() === emoji;

								if (count === 0) return null;

								return (
									<button
										key={emoji}
										onClick={() => onReact?.(comment.id, emoji)}
										className={cn(
											"flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs transition-colors",
											hasReacted
												? "bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30"
												: "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent",
										)}
									>
										<span>{emoji}</span>
										<span
											className={cn(
												"font-medium",
												hasReacted
													? "text-blue-700 dark:text-blue-400"
													: "text-slate-700 dark:text-slate-300",
											)}
										>
											{count}
										</span>
									</button>
								);
							})}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex items-center gap-3 sm:gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onReply?.(comment.id)}
							className="h-6 sm:h-7 px-2 text-xs text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
						>
							<Reply className="w-3 h-3 mr-1" />
							Reply
						</Button>

						{/* Quick Reactions */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 sm:h-7 px-2 text-xs text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
								>
									{getUserReaction() || "😊"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<div className="flex gap-1 p-2">
									{reactionEmojis.map((emoji) => (
										<button
											key={emoji}
											onClick={() => onReact?.(comment.id, emoji)}
											className="hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded transition-colors text-lg"
										>
											{emoji}
										</button>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Nested Replies */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="ml-6 sm:ml-9 mt-3 space-y-3 border-l-2 border-slate-200 dark:border-border pl-3 sm:pl-4">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							onReply={onReply}
							onEdit={onEdit}
							onDelete={onDelete}
							onReact={onReact}
							isNested
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentItem;