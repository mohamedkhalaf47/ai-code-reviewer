import { type PullRequest } from "@/types";
import { mockUsers } from "./users";
import { mockFiles } from "./files";
import { mockCommentThreads } from "./comments";
import { mockAIInsights, mockAISummary } from "./aiInsights";

export const mockPullRequests: PullRequest[] = [
	{
		id: 1,
		number: 142,
		title: "Add user authentication middleware",
		description: `## Summary
This PR implements JWT-based authentication middleware for protecting API routes.

## Changes
- Added authentication middleware with JWT verification
- Implemented role-based authorization
- Created JWT utility functions
- Added comprehensive test coverage

## Testing
- All unit tests passing
- Manual testing completed
- Security scan performed`,
		author: mockUsers[0],
		status: "open",
		reviewStatus: "pending",
		sourceBranch: "feature/auth-middleware",
		targetBranch: "main",
		repository: "company/backend-api",
		createdAt: new Date("2024-01-20T09:00:00"),
		updatedAt: new Date("2024-01-20T12:30:00"),
		files: mockFiles,
		commentThreads: mockCommentThreads,
		aiInsights: mockAIInsights,
		aiSummary: mockAISummary,
		reviewers: [mockUsers[1], mockUsers[3]],
		additions: 173,
		deletions: 3,
		changedFiles: 5,
		commits: 8,
		labels: ["backend", "security", "enhancement"],
	},
	{
		id: 2,
		number: 141,
		title: "Fix memory leak in WebSocket handler",
		description: `## Summary
Fixes memory leak caused by event listeners not being properly cleaned up in WebSocket connections.

## Changes
- Added cleanup logic for WebSocket event listeners
- Implemented connection pooling
- Added memory monitoring

## Testing
- Memory profiling shows no leaks
- Load tested with 1000 concurrent connections`,
		author: mockUsers[2],
		status: "open",
		reviewStatus: "approved",
		sourceBranch: "fix/websocket-memory-leak",
		targetBranch: "main",
		repository: "company/backend-api",
		createdAt: new Date("2024-01-19T14:00:00"),
		updatedAt: new Date("2024-01-20T10:00:00"),
		files: [],
		commentThreads: [],
		aiInsights: [],
		reviewers: [mockUsers[1]],
		additions: 67,
		deletions: 34,
		changedFiles: 3,
		commits: 4,
		labels: ["bug", "performance", "critical"],
	},
	{
		id: 3,
		number: 140,
		title: "Update React to v18 and migrate to hooks",
		description: `## Summary
Major update to React 18 with full migration from class components to functional components with hooks.

## Changes
- Updated React to v18
- Migrated all class components to functional components
- Implemented new concurrent features
- Updated testing library

## Breaking Changes
- Some internal APIs changed
- Component lifecycle methods replaced with hooks`,
		author: mockUsers[1],
		status: "merged",
		reviewStatus: "approved",
		sourceBranch: "feature/react-18-migration",
		targetBranch: "main",
		repository: "company/frontend-app",
		createdAt: new Date("2024-01-15T10:00:00"),
		updatedAt: new Date("2024-01-18T16:00:00"),
		files: [],
		commentThreads: [],
		aiInsights: [],
		reviewers: [mockUsers[0], mockUsers[3]],
		additions: 892,
		deletions: 654,
		changedFiles: 47,
		commits: 23,
		labels: ["frontend", "breaking-change", "enhancement"],
	},
	{
		id: 4,
		number: 139,
		title: "Add dark mode support",
		description: `## Summary
Implements dark mode with automatic theme detection and manual toggle.

## Changes
- Added theme context provider
- Implemented dark mode styles
- Added theme toggle component
- Persisted user preference in localStorage`,
		author: mockUsers[3],
		status: "open",
		reviewStatus: "changes_requested",
		sourceBranch: "feature/dark-mode",
		targetBranch: "develop",
		repository: "company/frontend-app",
		createdAt: new Date("2024-01-20T08:00:00"),
		updatedAt: new Date("2024-01-20T11:00:00"),
		files: [],
		commentThreads: [],
		aiInsights: [],
		reviewers: [mockUsers[2]],
		additions: 234,
		deletions: 12,
		changedFiles: 15,
		commits: 6,
		labels: ["frontend", "ui", "enhancement"],
	},
	{
		id: 5,
		number: 138,
		title: "Optimize database queries with indexes",
		description: `## Summary
Adds database indexes to improve query performance on high-traffic tables.

## Changes
- Added indexes on user lookup queries
- Optimized JOIN operations
- Added query performance monitoring

## Results
- 85% improvement in user lookup queries
- 60% improvement in dashboard load times`,
		author: mockUsers[0],
		status: "draft",
		reviewStatus: "pending",
		sourceBranch: "perf/database-indexes",
		targetBranch: "main",
		repository: "company/backend-api",
		createdAt: new Date("2024-01-20T07:00:00"),
		updatedAt: new Date("2024-01-20T09:00:00"),
		files: [],
		commentThreads: [],
		aiInsights: [],
		reviewers: [],
		additions: 45,
		deletions: 8,
		changedFiles: 4,
		commits: 3,
		labels: ["database", "performance"],
	},
];

export const getPRById = (id: number): PullRequest | undefined => {
	return mockPullRequests.find((pr) => pr.number === id);
};

export const getPRByNumber = (number: number): PullRequest | undefined => {
	return mockPullRequests.find((pr) => pr.number === number);
};
