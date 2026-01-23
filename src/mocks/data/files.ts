import { type FileChange } from "@/types";
import {
	authMiddlewareCode,
	apiRoutesCode,
	jwtUtilsCode,
	authTestCode,
} from "./codeExamples";

export const mockFiles: FileChange[] = [
	{
		id: 1,
		name: "auth.ts",
		path: "src/middleware/auth.ts",
		status: "added",
		additions: 58,
		deletions: 0,
		language: "typescript",
		hasComments: true,
		aiIssuesCount: 3,
		patch: authMiddlewareCode,
	},
	{
		id: 2,
		name: "api.ts",
		path: "src/routes/api.ts",
		status: "modified",
		additions: 15,
		deletions: 3,
		language: "typescript",
		hasComments: true,
		aiIssuesCount: 1,
		patch: apiRoutesCode,
	},
	{
		id: 3,
		name: "jwt.ts",
		path: "src/utils/jwt.ts",
		status: "added",
		additions: 45,
		deletions: 0,
		language: "typescript",
		hasComments: true,
		aiIssuesCount: 1,
		patch: jwtUtilsCode,
	},
	{
		id: 4,
		name: "auth.test.ts",
		path: "tests/auth.test.ts",
		status: "added",
		additions: 52,
		deletions: 0,
		language: "typescript",
		hasComments: false,
		aiIssuesCount: 0,
		patch: authTestCode,
	},
	{
		id: 5,
		name: "package.json",
		path: "package.json",
		status: "modified",
		additions: 3,
		deletions: 0,
		language: "json",
		hasComments: false,
		aiIssuesCount: 0,
		patch: `{
  "dependencies": {
    "express": "^4.18.2",
+   "jsonwebtoken": "^9.0.2",
+   "bcrypt": "^5.1.1"
  }
}`,
	},
];
