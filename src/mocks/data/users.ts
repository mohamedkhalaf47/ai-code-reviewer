import { type User, type CollaboratingUser } from "@/types";

export const mockUsers: User[] = [
	{
		id: 1,
		username: "sarah.chen",
		name: "Sarah Chen",
		email: "sarah.chen@company.com",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
		role: "developer",
		githubId: "sarahchen",
	},
	{
		id: 2,
		username: "mike.johnson",
		name: "Mike Johnson",
		email: "mike.j@company.com",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
		role: "reviewer",
		githubId: "mikej",
	},
	{
		id: 3,
		username: "alex.rivera",
		name: "Alex Rivera",
		email: "alex.r@company.com",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
		role: "developer",
		githubId: "alexrivera",
	},
	{
		id: 4,
		username: "jessica.wong",
		name: "Jessica Wong",
		email: "jessica.w@company.com",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
		role: "admin",
		githubId: "jwong",
	},
	{
		id: 5,
		username: "you",
		name: "You",
		email: "you@company.com",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
		role: "developer",
	},
];

export const mockCollaboratingUsers: CollaboratingUser[] = [
	{
		...mockUsers[0],
		color: "rgb(59, 130, 246)", // blue
		cursorPosition: { fileId: 1, line: 45, column: 12 },
		isTyping: false,
		lastActive: new Date(),
	},
	{
		...mockUsers[1],
		color: "rgb(34, 197, 94)", // green
		cursorPosition: { fileId: 1, line: 78, column: 5 },
		isTyping: true,
		lastActive: new Date(),
	},
	{
		...mockUsers[4],
		color: "rgb(168, 85, 247)", // purple
		cursorPosition: { fileId: 1, line: 120, column: 20 },
		isTyping: false,
		lastActive: new Date(),
	},
];

export const getCurrentUser = (): User => mockUsers[4];
