import { type Comment, type CommentThread } from "@/types";
import { mockComments, mockCommentThreads } from "../data/comments";
import { getCurrentUser } from "../data/users";

const delay = (ms: number = 300) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const commentsStore = [...mockComments];
const threadsStore = [...mockCommentThreads];
let nextCommentId = 100;

export const mockCommentService = {
	// Fetch comments for a PR
	async fetchCommentsByPR(prId: number): Promise<Comment[]> {
		await delay();
		return commentsStore.filter((c) => c.prId === prId);
	},

	// Fetch comment threads for a file
	async fetchThreadsByFile(fileId: number): Promise<CommentThread[]> {
		await delay();
		return threadsStore.filter((t) => t.fileId === fileId);
	},

	// Add new comment
	async addComment(
		prId: number,
		fileId: number,
		lineNumber: number,
		content: string,
		parentId?: number,
	): Promise<Comment> {
		await delay(200);

		const newComment: Comment = {
			id: nextCommentId++,
			prId,
			fileId,
			lineNumber,
			content,
			author: getCurrentUser(),
			createdAt: new Date(),
			updatedAt: new Date(),
			resolved: false,
			parentId,
		};

		commentsStore.push(newComment);

		// Update or create thread
		const existingThread = threadsStore.find(
			(t) => t.fileId === fileId && t.lineNumber === lineNumber,
		);

		if (existingThread) {
			existingThread.comments.push(newComment);
		} else {
			threadsStore.push({
				id: threadsStore.length + 1,
				fileId,
				lineNumber,
				comments: [newComment],
				resolved: false,
			});
		}

		return newComment;
	},

	// Update comment
	async updateComment(
		commentId: number,
		content: string,
	): Promise<Comment | null> {
		await delay(200);

		const comment = commentsStore.find((c) => c.id === commentId);
		if (comment) {
			comment.content = content;
			comment.updatedAt = new Date();
			return comment;
		}
		return null;
	},

	// Delete comment
	async deleteComment(commentId: number): Promise<boolean> {
		await delay(200);

		const index = commentsStore.findIndex((c) => c.id === commentId);
		if (index !== -1) {
			commentsStore.splice(index, 1);
			return true;
		}
		return false;
	},

	// Resolve thread
	async resolveThread(threadId: number): Promise<CommentThread | null> {
		await delay(200);

		const thread = threadsStore.find((t) => t.id === threadId);
		if (thread) {
			thread.resolved = true;
			thread.resolvedBy = getCurrentUser();
			thread.resolvedAt = new Date();

			// Mark all comments in thread as resolved
			thread.comments.forEach((c) => (c.resolved = true));

			return thread;
		}
		return null;
	},

	// Unresolve thread
	async unresolveThread(threadId: number): Promise<CommentThread | null> {
		await delay(200);

		const thread = threadsStore.find((t) => t.id === threadId);
		if (thread) {
			thread.resolved = false;
			thread.resolvedBy = undefined;
			thread.resolvedAt = undefined;

			// Mark all comments in thread as unresolved
			thread.comments.forEach((c) => (c.resolved = false));

			return thread;
		}
		return null;
	},

	// Add reaction to comment
	async addReaction(
		commentId: number,
		reactionType: string,
	): Promise<Comment | null> {
		await delay(100);

		const comment = commentsStore.find((c) => c.id === commentId);
		if (comment) {
			if (!comment.reactions) {
				comment.reactions = [];
			}

			// Check if user already reacted with this type
			const existingReaction = comment.reactions.find(
				(r) => r.user.id === getCurrentUser().id && r.type === reactionType,
			);

			if (!existingReaction) {
				comment.reactions.push({
					id: Math.floor(Math.random() * 10000),
					type: reactionType as never,
					user: getCurrentUser(),
				});
			}

			return comment;
		}
		return null;
	},

	// Remove reaction from comment
	async removeReaction(
		commentId: number,
		reactionType: string,
	): Promise<Comment | null> {
		await delay(100);

		const comment = commentsStore.find((c) => c.id === commentId);
		if (comment && comment.reactions) {
			comment.reactions = comment.reactions.filter(
				(r) => !(r.user.id === getCurrentUser().id && r.type === reactionType),
			);
			return comment;
		}
		return null;
	},
};
