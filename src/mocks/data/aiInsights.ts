import { type AIInsight, type AISummary } from "@/types";

export const mockAIInsights: AIInsight[] = [
	{
		id: 1,
		prId: 1,
		fileId: 1,
		lineNumber: 18,
		type: "security",
		severity: "critical",
		title: "SQL Injection Vulnerability",
		description:
			"User input is directly concatenated into SQL query without parameterization. This allows attackers to inject malicious SQL code.",
		suggestion:
			"Use parameterized queries or an ORM to prevent SQL injection attacks. Replace string concatenation with prepared statements.",
		codeSnippet:
			'const user = await db.query("SELECT * FROM users WHERE id = " + decoded.userId);',
		suggestedFix:
			'const user = await db.query("SELECT * FROM users WHERE id = $1", [decoded.userId]);',
		createdAt: new Date("2024-01-20T10:30:00"),
	},
	{
		id: 2,
		prId: 1,
		fileId: 1,
		lineNumber: 42,
		type: "performance",
		severity: "high",
		title: "Inefficient Nested Loop - O(n²) Complexity",
		description:
			"Nested loop iterating over two arrays results in quadratic time complexity. For large datasets, this will cause significant performance degradation.",
		suggestion:
			"Convert one of the arrays to a Set or Map for O(1) lookups, reducing overall complexity to O(n).",
		codeSnippet: `for (let i = 0; i < allowedRoles.length; i++) {
  for (let j = 0; j < req.user.roles.length; j++) {
    if (allowedRoles[i] === req.user.roles[j]) {
      return next();
    }
  }
}`,
		suggestedFix: `const roleSet = new Set(req.user.roles);
return allowedRoles.some(role => roleSet.has(role)) ? next() : res.status(403).json({ error: 'Forbidden' });`,
		createdAt: new Date("2024-01-20T10:31:00"),
	},
	{
		id: 3,
		prId: 1,
		fileId: 3,
		lineNumber: 5,
		type: "security",
		severity: "high",
		title: "Hardcoded JWT Secret",
		description:
			"JWT secret is hardcoded in the source code and appears to be weak. This is a major security vulnerability as the secret could be exposed in version control.",
		suggestion:
			"Move the JWT secret to environment variables and ensure it is at least 256 bits (32 characters) of random data.",
		codeSnippet: 'const JWT_SECRET = "myS3cr3t123";',
		suggestedFix:
			'const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET not set") })();',
		createdAt: new Date("2024-01-20T10:32:00"),
	},
	{
		id: 4,
		prId: 1,
		fileId: 1,
		lineNumber: 27,
		type: "quality",
		severity: "medium",
		title: "Missing Error Logging",
		description:
			"Authentication errors are caught but not logged. This makes debugging production issues difficult and hides potential security threats.",
		suggestion:
			"Add proper error logging with a logging library like Winston or Pino. Include relevant context while being careful not to log sensitive data.",
		codeSnippet: `} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}`,
		suggestedFix: `} catch (error) {
  logger.error('Authentication failed', { error: error.message, ip: req.ip });
  return res.status(401).json({ error: 'Authentication failed' });
}`,
		createdAt: new Date("2024-01-20T10:33:00"),
	},
	{
		id: 5,
		prId: 1,
		fileId: 2,
		lineNumber: 15,
		type: "best-practice",
		severity: "low",
		title: "Consider Rate Limiting",
		description:
			"Authentication endpoints do not have rate limiting. This makes the application vulnerable to brute-force attacks.",
		suggestion:
			"Implement rate limiting using express-rate-limit or similar middleware to prevent abuse.",
		codeSnippet: "router.post('/auth/login', userController.login);",
		suggestedFix: `import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
router.post('/auth/login', loginLimiter, userController.login);`,
		createdAt: new Date("2024-01-20T10:34:00"),
	},
];

export const mockAISummary: AISummary = {
	id: 1,
	prId: 1,
	summary:
		"This pull request implements JWT-based authentication middleware for the application. The changes introduce user verification logic, token validation, and role-based authorization. The implementation adds three new files: authentication middleware, API route definitions, and JWT utility functions, along with comprehensive test coverage.",
	keyChanges: [
		"Added authenticateUser middleware for JWT token verification",
		"Implemented authorizeRole middleware for role-based access control",
		"Created JWT utility functions for token generation and verification",
		"Added protected API routes with authentication guards",
		"Included test suite for authentication flows",
	],
	potentialImpact:
		"This is a critical security feature that affects all protected endpoints in the application. It introduces breaking changes for any existing API consumers who will now need to include authentication tokens in their requests.",
	reviewFocus: [
		"SQL injection vulnerability in user lookup query (Line 18)",
		"Performance issue with nested role checking loop (Line 42)",
		"Hardcoded JWT secret that should be in environment variables",
		"Missing error logging in catch blocks",
		"Lack of rate limiting on authentication endpoints",
	],
	estimatedComplexity: "medium",
	generatedAt: new Date("2024-01-20T10:30:00"),
};
