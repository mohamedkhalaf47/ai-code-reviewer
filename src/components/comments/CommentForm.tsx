import { useState } from "react";
import { Send, Code, Bold, Italic, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/mocks/data/users";
import { getInitials } from "@/utils/formatting";
import { cn } from "@/lib/utils";

type CommentFormProps = {
	onSubmit: (content: string) => void;
	onCancel?: () => void;
	placeholder?: string;
	autoFocus?: boolean;
	initialValue?: string;
	submitLabel?: string;
	showCancel?: boolean;
}

const CommentForm = ({
	onSubmit,
	onCancel,
	placeholder = "Write a comment...",
	autoFocus = false,
	initialValue = "",
	submitLabel = "Comment",
	showCancel = false,
}: CommentFormProps) => {
	const currentUser = getCurrentUser();
	const [content, setContent] = useState(initialValue);
	const [isFocused, setIsFocused] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (content.trim()) {
			onSubmit(content.trim());
			setContent("");
			setIsFocused(false);
		}
	};

	const handleCancel = () => {
		setContent("");
		setIsFocused(false);
		onCancel?.();
	};

	const insertMarkdown = (before: string, after: string = "") => {
		const textarea = document.querySelector("textarea");
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = content.substring(start, end);
		const newText =
			content.substring(0, start) +
			before +
			selectedText +
			after +
			content.substring(end);

		setContent(newText);

		// Set cursor position after insertion
		setTimeout(() => {
			textarea.focus();
			const newPosition = start + before.length + selectedText.length;
			textarea.setSelectionRange(newPosition, newPosition);
		}, 0);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
			<div className="flex gap-2 sm:gap-3">
				{/* Avatar */}
				<Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
					<AvatarImage src={currentUser.avatar} alt={currentUser.name} />
					<AvatarFallback className="text-xs">
						{getInitials(currentUser.name)}
					</AvatarFallback>
				</Avatar>

				{/* Input Area */}
				<div className="flex-1 min-w-0">
					<div
						className={cn(
							"border rounded-lg transition-all",
							isFocused
								? "border-blue-300 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-500/20"
								: "border-slate-300 dark:border-border",
						)}
					>
						<Textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							onFocus={() => setIsFocused(true)}
							placeholder={placeholder}
							autoFocus={autoFocus}
							className="min-h-15 sm:min-h-20 resize-none border-0 focus-visible:ring-0 text-xs sm:text-sm"
						/>

						{/* Formatting Toolbar */}
						{isFocused && (
							<div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-t dark:border-border bg-slate-50 dark:bg-muted/30">
								<div className="flex items-center gap-0.5 sm:gap-1">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 w-6 sm:h-7 sm:w-7 p-0"
										onClick={() => insertMarkdown("**", "**")}
										title="Bold"
									>
										<Bold className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 w-6 sm:h-7 sm:w-7 p-0"
										onClick={() => insertMarkdown("*", "*")}
										title="Italic"
									>
										<Italic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 w-6 sm:h-7 sm:w-7 p-0"
										onClick={() => insertMarkdown("`", "`")}
										title="Code"
									>
										<Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 w-6 sm:h-7 sm:w-7 p-0"
										onClick={() => insertMarkdown("[", "](url)")}
										title="Link"
									>
										<LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
								</div>

								<div className="flex items-center gap-1.5 sm:gap-2">
									{showCancel && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={handleCancel}
											className="h-6 sm:h-7 px-2 sm:px-3 text-xs"
										>
											Cancel
										</Button>
									)}
									<Button
										type="submit"
										size="sm"
										disabled={!content.trim()}
										className="h-6 sm:h-7 px-2 sm:px-3 text-xs gap-1"
									>
										<Send className="w-3 h-3" />
										<span className="hidden xs:inline">{submitLabel}</span>
									</Button>
								</div>
							</div>
						)}
					</div>

					{/* Helper Text */}
					{isFocused && (
						<p className="text-[10px] sm:text-xs text-slate-500 dark:text-muted-foreground mt-1 sm:mt-2">
							Supports markdown formatting
						</p>
					)}
				</div>
			</div>
		</form>
	);
};

export default CommentForm;