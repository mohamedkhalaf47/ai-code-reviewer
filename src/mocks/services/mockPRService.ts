import { type PullRequest, type Review, type ReviewStatus } from "@/types";
import {
	mockPullRequests,
	getPRById,
	getPRByNumber,
} from "../data/pullRequests";

// Simulate network delay
const delay = (ms: number = 500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const mockPRService = {
	// Fetch all pull requests
	async fetchPullRequests(): Promise<PullRequest[]> {
		await delay();
		return [...mockPullRequests];
	},

	// Fetch single PR by ID
	async fetchPRById(id: number): Promise<PullRequest | null> {
		await delay();
		const pr = getPRById(id);
		return pr || null;
	},

	// Fetch single PR by number
	async fetchPRByNumber(number: number): Promise<PullRequest | null> {
		await delay();
		const pr = getPRByNumber(number);
		return pr || null;
	},

	// Filter PRs by status
	async fetchPRsByStatus(status: string): Promise<PullRequest[]> {
		await delay();
		return mockPullRequests.filter((pr) => pr.status === status);
	},

	// Filter PRs by author
	async fetchPRsByAuthor(authorId: number): Promise<PullRequest[]> {
		await delay();
		return mockPullRequests.filter((pr) => pr.author.id === authorId);
	},

	// Search PRs
	async searchPRs(query: string): Promise<PullRequest[]> {
		await delay();
		const lowerQuery = query.toLowerCase();
		return mockPullRequests.filter(
			(pr) =>
				pr.title.toLowerCase().includes(lowerQuery) ||
				pr.description.toLowerCase().includes(lowerQuery),
		);
	},

	// Submit review
	async submitReview(
		prId: number,
		status: ReviewStatus,
		comment?: string,
	): Promise<Review> {
		await delay();
		const review: Review = {
			id: Math.floor(Math.random() * 10000),
			prId,
			reviewer: {
				id: 5,
				username: "you",
				name: "You",
				email: "you@company.com",
				avatar: "",
				role: "developer",
			},
			status,
			comment,
			submittedAt: new Date(),
		};

		// Update the PR's review status in mock data
		const pr = getPRById(prId);
		if (pr) {
			pr.reviewStatus = status;
			pr.updatedAt = new Date();
		}

		return review;
	},

	// Merge PR
	async mergePR(prId: number): Promise<PullRequest | null> {
		await delay();
		const pr = getPRById(prId);
		if (pr) {
			pr.status = "merged";
			pr.updatedAt = new Date();
			return pr;
		}
		return null;
	},

	// Close PR
	async closePR(prId: number): Promise<PullRequest | null> {
		await delay();
		const pr = getPRById(prId);
		if (pr) {
			pr.status = "closed";
			pr.updatedAt = new Date();
			return pr;
		}
		return null;
	},
};
