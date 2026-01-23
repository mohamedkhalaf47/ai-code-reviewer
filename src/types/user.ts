export type User = {
	id: number;
	username: string;
	name: string;
	email: string;
	avatar: string;
	role: "developer" | "reviewer" | "admin";
	githubId?: string;
};

export type CollaboratingUser = User & {
	color: string;
	cursorPosition?: {
		fileId: number;
		line: number;
		column: number;
	};
	isTyping?: boolean;
	lastActive: Date;
};
