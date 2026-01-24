import { useRef } from "react";
import { DiffEditor, type DiffOnMount } from "@monaco-editor/react";
import { type FileChange } from "@/types";
import type * as monacoEditor from "monaco-editor";

interface MonacoDiffViewerProps {
	file: FileChange;
	isDarkMode?: boolean;
}

/**
 * MonacoDiffViewer: Pure diff editor renderer.
 *
 * Responsibility: Render ONLY the Monaco diff editor canvas.
 * No header, no view mode toggle, no fullscreen handling.
 * Parent (EnhancedCodeViewer via PRReview) controls layout and sizing.
 */
const MonacoDiffViewer = ({
	file,
	isDarkMode = false,
}: MonacoDiffViewerProps) => {
	const diffEditorRef =
		useRef<monacoEditor.editor.IStandaloneDiffEditor | null>(null);

	// Parse diff to get original and modified content
	const parseDiff = () => {
		const lines = file.patch?.split("\n") || [];
		const original: string[] = [];
		const modified: string[] = [];

		lines.forEach((line) => {
			if (line.startsWith("-")) {
				original.push(line.substring(1));
			} else if (line.startsWith("+")) {
				modified.push(line.substring(1));
			} else {
				original.push(line);
				modified.push(line);
			}
		});

		return {
			original: original.join("\n"),
			modified: modified.join("\n"),
		};
	};

	const { original, modified } = parseDiff();

	const getLanguage = (filename: string): string => {
		const ext = filename.split(".").pop()?.toLowerCase();
		const languageMap: Record<string, string> = {
			ts: "typescript",
			tsx: "typescript",
			js: "javascript",
			jsx: "javascript",
			json: "json",
			html: "html",
			css: "css",
			scss: "scss",
			py: "python",
			java: "java",
			go: "go",
			rs: "rust",
			rb: "ruby",
			php: "php",
			sql: "sql",
			md: "markdown",
			yml: "yaml",
			yaml: "yaml",
			xml: "xml",
			sh: "shell",
		};
		return languageMap[ext || ""] || "plaintext";
	};

	const handleDiffEditorDidMount: DiffOnMount = (editor) => {
		diffEditorRef.current = editor;

		const modifiedEditor = editor.getModifiedEditor();
		const originalEditor = editor.getOriginalEditor();

		[modifiedEditor, originalEditor].forEach((ed) => {
			ed.updateOptions({
				readOnly: true,
				fontSize: window.innerWidth < 640 ? 11 : 13,
				lineHeight: window.innerWidth < 640 ? 16 : 19,
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				renderLineHighlight: "all",
				scrollbar: {
					vertical: "auto",
					horizontal: "auto",
					useShadows: false,
					verticalScrollbarSize: 8,
					horizontalScrollbarSize: 8,
				},
			});
		});

		editor.updateOptions({
			renderSideBySide: true,
			renderIndicators: true,
			ignoreTrimWhitespace: false,
		});
	};

	return (
		<DiffEditor
			height="100%"
			width="100%"
			language={getLanguage(file.name)}
			original={original}
			modified={modified}
			theme={isDarkMode ? "vs-dark" : "vs-light"}
			onMount={handleDiffEditorDidMount}
			options={{
				automaticLayout: true,
				renderSideBySide: true,
			}}
			loading={
				<div className="flex items-center justify-center h-full">
					<div className="text-sm text-slate-500 dark:text-muted-foreground">
						Loading diff viewer...
					</div>
				</div>
			}
		/>
	);
};

export default MonacoDiffViewer;
