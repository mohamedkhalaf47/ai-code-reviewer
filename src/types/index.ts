import type { CollaboratingUser } from "./user";

export * from "./user";
export * from "./file";
export * from "./comment";
export * from "./aiInsight";
export * from "./pullRequest";

// WebSocket event types
export type CursorMoveEvent = {
	userId: number;
	fileId: number;
	line: number;
	column: number;
}

export type CommentAddedEvent = {
	comment: Comment;
	userId: number;
}

export type UserJoinedEvent = {
	user: CollaboratingUser;
};

export type UserLeftEvent = {
	userId: number;
}
