import { useState } from "react";
import { type FileChange } from "@/types";
import MonacoCodeEditor from "./MonacoCodeEditor";
import MonacoDiffViewer from "./MonacoDiffViewer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, GitCompare } from "lucide-react";

interface EnhancedCodeViewerProps {
	file: FileChange;
	isDarkMode?: boolean;
}

/**
 * EnhancedCodeViewer: Minimal editor wrapper.
 *
 * Responsibility: ONLY render code/diff toggle tabs and the editor canvas.
 * Layout, comments, and fullscreen are controlled by PRReview.tsx.
 *
 * Props: file, isDarkMode (that's it!)
 * No comment threads, no comment handlers, no layout wrappers.
 */
const EnhancedCodeViewer = ({
	file,
	isDarkMode = false,
}: EnhancedCodeViewerProps) => {
	const [viewMode, setViewMode] = useState<"code" | "diff">("code");

	return (
		<div className="flex min-h-0 w-full flex-col bg-white dark:bg-card">
			{/* View Mode Tabs */}
			<div className="border-b border-slate-200 bg-white px-3 py-2 dark:border-border dark:bg-card sm:px-4">
				<Tabs
					value={viewMode}
					onValueChange={(v) => setViewMode(v as "code" | "diff")}
				>
					<TabsList className="h-8 bg-transparent">
						<TabsTrigger value="code" className="gap-1.5 text-xs sm:text-sm">
							<FileCode className="h-3.5 w-3.5" />
							<span className="hidden xs:inline">Code</span>
						</TabsTrigger>
						<TabsTrigger value="diff" className="gap-1.5 text-xs sm:text-sm">
							<GitCompare className="h-3.5 w-3.5" />
							<span className="hidden xs:inline">Diff</span>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Editor Canvas - NO SCROLL WRAPPER, Let parent control it */}
			<div className="min-h-0 flex-1">
				{viewMode === "code" ? (
					<MonacoCodeEditor file={file} isDarkMode={isDarkMode} />
				) : (
					<MonacoDiffViewer file={file} isDarkMode={isDarkMode} />
				)}
			</div>
		</div>
	);
};

export default EnhancedCodeViewer;
