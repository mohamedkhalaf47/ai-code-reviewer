import { type User } from "./user";
import { type FileChange } from "./file";
import { type CommentThread } from "./comment";
import { type AIInsight, type AISummary } from "./aiInsight";

export type PRStatus = "open" | "closed" | "merged" | "draft";
export type ReviewStatus =
	| "pending"
	| "approved"
	| "changes_requested"
	| "commented";

export type PullRequest = {
	id: number;
	number: number;
	title: string;
	description: string;
	author: User;
	status: PRStatus;
	reviewStatus: ReviewStatus;
	sourceBranch: string;
	targetBranch: string;
	repository: string;
	createdAt: Date;
	updatedAt: Date;
	files: FileChange[];
	commentThreads: CommentThread[];
	aiInsights: AIInsight[];
	aiSummary?: AISummary;
	reviewers: User[];
	additions: number;
	deletions: number;
	changedFiles: number;
	commits: number;
	labels?: string[];
};

export type Review = {
	id: number;
	prId: number;
	reviewer: User;
	status: ReviewStatus;
	comment?: string;
	submittedAt: Date;
};
