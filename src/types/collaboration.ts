import type { CollaboratingUser } from "@/types";

export type CursorMoveEvent = {
	userId: number;
	userName: string;
	userAvatar: string;
	color: string;
	fileId: number;
	line: number;
	column: number;
	timestamp: number;
};

export type CodeUpdateEvent = {
	code: string;
	fromSelf?: boolean;
};

export type TypingEvent = {
	userId: number;
	userName: string;
	fileId: number;
	lineNumber: number;
	timestamp: number;
};

export type UsersUpdateEvent = {
	users: CollaboratingUser[];
};

export type FileViewChangeEvent = {
	userId: number;
	userName: string;
	fileId: number;
	fileName: string;
	timestamp: number;
};

export type CollaborationEventMap = {
	connect: { room: string };
	disconnect: Record<string, unknown>;
	"users:update": UsersUpdateEvent;
	"code:update": CodeUpdateEvent;
	"cursor:move": CursorMoveEvent;
	"user:typing": TypingEvent;
	"user:stop_typing": { userId: number; timestamp: number };
	"presence:update": UsersUpdateEvent;
	"user:joined": { user: CollaboratingUser & { joinedAt: Date } };
	"file:view_change": FileViewChangeEvent;
};
