import { useState, useCallback } from "react";
import { type CommentThread } from "@/types";
import { mockCommentService } from "@/mocks/services/mockCommentService";
import { toast } from "sonner";

export const useComments = (prId: number, fileId?: number) => {
	const [threads, setThreads] = useState<CommentThread[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchThreads = useCallback(async () => {
		try {
			setLoading(true);
			const data = fileId
				? await mockCommentService.fetchThreadsByFile(fileId)
				: await mockCommentService.fetchCommentsByPR(prId).then(() => {
						// Group comments into threads (simplified)
						return [];
					});
			setThreads(data);
		} catch (error: unknown) {
			toast.error((error as Error).message);
		} finally {
			setLoading(false);
		}
	}, [prId, fileId]);

	const addComment = useCallback(
		async (lineNumber: number, content: string, parentId?: number) => {
			try {
				const newComment = await mockCommentService.addComment(
					prId,
					fileId || 0,
					lineNumber,
					content,
					parentId,
				);

				toast.success("Comment Added successfully");

				// Refresh threads
				await fetchThreads();
				return newComment;
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[prId, fileId, fetchThreads],
	);

	const updateComment = useCallback(
		async (commentId: number, content: string) => {
			try {
				await mockCommentService.updateComment(commentId, content);

				toast.success("Comment updated successfully");

				await fetchThreads();
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[fetchThreads],
	);

	const deleteComment = useCallback(
		async (commentId: number) => {
			try {
				await mockCommentService.deleteComment(commentId);

				toast.success("Comment deleted successfully");

				await fetchThreads();
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[fetchThreads],
	);

	const resolveThread = useCallback(
		async (threadId: number) => {
			try {
				await mockCommentService.resolveThread(threadId);

				toast.success("Thread resolved");

				await fetchThreads();
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[fetchThreads],
	);

	const unresolveThread = useCallback(
		async (threadId: number) => {
			try {
				await mockCommentService.unresolveThread(threadId);

				toast.success("Thread unresolved");

				await fetchThreads();
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[fetchThreads],
	);

	const addReaction = useCallback(
		async (commentId: number, reaction: string) => {
			try {
				await mockCommentService.addReaction(commentId, reaction);
				await fetchThreads();
			} catch (error: unknown) {
				toast.error((error as Error).message);
			}
		},
		[fetchThreads],
	);

	return {
		threads,
		loading,
		fetchThreads,
		addComment,
		updateComment,
		deleteComment,
		resolveThread,
		unresolveThread,
		addReaction,
	};
};
