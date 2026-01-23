import { type AIInsight, type AISummary } from "@/types";
import { mockAIInsights, mockAISummary } from "../data/aiInsights";

const delay = (ms: number = 1500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const mockAIService = {
	// Fetch AI insights for a PR
	async fetchAIInsights(prId: number): Promise<AIInsight[]> {
		// Simulate longer processing time for AI
		await delay(1500);
		return mockAIInsights.filter((insight) => insight.prId === prId);
	},

	// Fetch AI insights for a specific file
	async fetchAIInsightsByFile(
		prId: number,
		fileId: number,
	): Promise<AIInsight[]> {
		await delay(1000);
		return mockAIInsights.filter(
			(insight) => insight.prId === prId && insight.fileId === fileId,
		);
	},

	// Fetch AI summary for a PR
	async fetchAISummary(prId: number): Promise<AISummary | null> {
		await delay(2000);
		return mockAISummary.prId === prId ? mockAISummary : null;
	},

	// Generate AI insights for code (simulated)
	async generateInsights(fileId: number): Promise<AIInsight[]> {
		// Simulate AI processing time
		await delay(3000);

		// In real implementation, this would call Claude API
		// For now, return mock insights
		return mockAIInsights.filter((insight) => insight.fileId === fileId);
	},

	// Generate code documentation
	async generateDocumentation(): Promise<string> {
		await delay(2000);

		return `/**
 * Authentication middleware for JWT token verification
 * 
 * This middleware validates incoming requests by:
 * 1. Extracting JWT token from Authorization header
 * 2. Verifying token signature and expiration
 * 3. Fetching user data from database
 * 4. Attaching user object to request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns 401 if authentication fails, calls next() if successful
 * 
 * @example
 * router.get('/protected', authenticateUser, handler);
 */`;
	},

	// Suggest code improvements
	async suggestImprovements(): Promise<string[]> {
		await delay(1500);

		return [
			"Consider adding input validation for the token",
			"Add rate limiting to prevent brute force attacks",
			"Implement token refresh mechanism",
			"Add logging for failed authentication attempts",
			"Consider using async/await consistently throughout",
		];
	},

	// Analyze code complexity
	async analyzeComplexity(): Promise<{
		cyclomaticComplexity: number;
		cognitiveComplexity: number;
		linesOfCode: number;
		maintainabilityIndex: number;
	}> {
		await delay(1000);

		return {
			cyclomaticComplexity: 8,
			cognitiveComplexity: 12,
			linesOfCode: 58,
			maintainabilityIndex: 72,
		};
	},
};
