import { type User } from "./user";

export type Comment = {
	id: number;
	prId: number;
	fileId: number;
	lineNumber: number;
	content: string;
	author: User;
	createdAt: Date;
	updatedAt: Date;
	resolved: boolean;
	reactions?: CommentReaction[];
	replies?: Comment[];
	parentId?: number;
}

export type CommentReaction = {
	id: number;
	type: "👍" | "👎" | "❤️" | "🎉" | "😕" | "🚀";
	user: User;
}

export type CommentThread = {
	id: number;
	fileId: number;
	lineNumber: number;
	comments: Comment[];
	resolved: boolean;
	resolvedBy?: User;
	resolvedAt?: Date;
}
