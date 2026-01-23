export type InsightType =
	| "security"
	| "performance"
	| "quality"
	| "best-practice";
export type InsightSeverity = "critical" | "high" | "medium" | "low" | "info";

export type AIInsight = {
	id: number;
	prId: number;
	fileId: number;
	lineNumber: number;
	type: InsightType;
	severity: InsightSeverity;
	title: string;
	description: string;
	suggestion: string;
	codeSnippet?: string;
	suggestedFix?: string;
	createdAt: Date;
};

export type AISummary = {
	id: number;
	prId: number;
	summary: string;
	keyChanges: string[];
	potentialImpact: string;
	reviewFocus: string[];
	estimatedComplexity: "low" | "medium" | "high";
	generatedAt: Date;
};

export type PerformanceAnalysis = {
	algorithmicComplexity: string;
	memoryImpact: "low" | "medium" | "high";
	suggestions: string[];
};
