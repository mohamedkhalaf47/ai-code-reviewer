export type FileStatus = "added" | "modified" | "deleted" | "renamed";

export type FileChange = {
	id: number;
	name: string;
	path: string;
	status: FileStatus;
	additions: number;
	deletions: number;
	patch?: string;
	language?: string;
	hasComments?: boolean;
	aiIssuesCount?: number;
};

export type DiffLine = {
	lineNumber: number;
	oldLineNumber?: number;
	newLineNumber?: number;
	type: "added" | "deleted" | "unchanged" | "modified";
	content: string;
	hasComment?: boolean;
};
