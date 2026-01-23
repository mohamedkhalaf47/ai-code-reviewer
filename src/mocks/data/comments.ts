import { type Comment, type CommentThread } from "@/types";
import { mockUsers } from "./users";

export const mockComments: Comment[] = [
	{
		id: 1,
		prId: 1,
		fileId: 1,
		lineNumber: 18,
		content:
			"🚨 This is a critical SQL injection vulnerability! We need to use parameterized queries here.",
		author: mockUsers[1],
		createdAt: new Date("2024-01-20T11:00:00"),
		updatedAt: new Date("2024-01-20T11:00:00"),
		resolved: false,
		reactions: [
			{ id: 1, type: "👍", user: mockUsers[0] },
			{ id: 2, type: "👍", user: mockUsers[2] },
		],
	},
	{
		id: 2,
		prId: 1,
		fileId: 1,
		lineNumber: 18,
		content:
			"Good catch! I'll switch to prepared statements. Should I use the db.query method with parameters or switch to an ORM?",
		author: mockUsers[0],
		createdAt: new Date("2024-01-20T11:15:00"),
		updatedAt: new Date("2024-01-20T11:15:00"),
		resolved: false,
		parentId: 1,
	},
	{
		id: 3,
		prId: 1,
		fileId: 1,
		lineNumber: 18,
		content:
			'The parameterized query approach is fine for now. Something like: `db.query("SELECT * FROM users WHERE id = $1", [decoded.userId])`',
		author: mockUsers[1],
		createdAt: new Date("2024-01-20T11:20:00"),
		updatedAt: new Date("2024-01-20T11:20:00"),
		resolved: false,
		parentId: 1,
	},
	{
		id: 4,
		prId: 1,
		fileId: 1,
		lineNumber: 42,
		content:
			"This nested loop will be slow for users with many roles. Consider using a Set for O(1) lookups instead.",
		author: mockUsers[3],
		createdAt: new Date("2024-01-20T11:30:00"),
		updatedAt: new Date("2024-01-20T11:30:00"),
		resolved: true,
		reactions: [{ id: 3, type: "🎉", user: mockUsers[0] }],
	},
	{
		id: 5,
		prId: 1,
		fileId: 1,
		lineNumber: 42,
		content: "Fixed in commit abc123. Now using Set for role checking.",
		author: mockUsers[0],
		createdAt: new Date("2024-01-20T12:00:00"),
		updatedAt: new Date("2024-01-20T12:00:00"),
		resolved: true,
		parentId: 4,
	},
	{
		id: 6,
		prId: 1,
		fileId: 3,
		lineNumber: 5,
		content:
			"Please move this to an environment variable immediately. Hardcoded secrets should never be committed.",
		author: mockUsers[3],
		createdAt: new Date("2024-01-20T11:45:00"),
		updatedAt: new Date("2024-01-20T11:45:00"),
		resolved: false,
		reactions: [
			{ id: 4, type: "🚀", user: mockUsers[1] },
			{ id: 5, type: "👍", user: mockUsers[2] },
		],
	},
	{
		id: 7,
		prId: 1,
		fileId: 2,
		lineNumber: 10,
		content:
			"Nice work on the API structure! Very clean and easy to understand.",
		author: mockUsers[2],
		createdAt: new Date("2024-01-20T10:45:00"),
		updatedAt: new Date("2024-01-20T10:45:00"),
		resolved: true,
		reactions: [{ id: 6, type: "❤️", user: mockUsers[0] }],
	},
];

export const mockCommentThreads: CommentThread[] = [
	{
		id: 1,
		fileId: 1,
		lineNumber: 18,
		comments: mockComments.filter((c) => c.lineNumber === 18),
		resolved: false,
	},
	{
		id: 2,
		fileId: 1,
		lineNumber: 42,
		comments: mockComments.filter((c) => c.lineNumber === 42),
		resolved: true,
		resolvedBy: mockUsers[0],
		resolvedAt: new Date("2024-01-20T12:00:00"),
	},
	{
		id: 3,
		fileId: 3,
		lineNumber: 5,
		comments: mockComments.filter((c) => c.lineNumber === 5 && c.fileId === 3),
		resolved: false,
	},
	{
		id: 4,
		fileId: 2,
		lineNumber: 10,
		comments: mockComments.filter((c) => c.id === 10 && c.fileId === 2),
		resolved: true,
		resolvedBy: mockUsers[2],
		resolvedAt: new Date("2024-01-20T11:00:00"),
	},
];
