import { useRef, useState } from "react";
import { DiffEditor, type DiffOnMount } from "@monaco-editor/react";
import { type FileChange } from "@/types";
import type * as monacoEditor from "monaco-editor";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Download, Maximize2, Minimize2 } from "lucide-react";

interface MonacoDiffViewerProps {
	file: FileChange;
	isDarkMode?: boolean;
}

const MonacoDiffViewer = ({
	file,
	isDarkMode = false,
}: MonacoDiffViewerProps) => {
	const diffEditorRef =
		useRef<monacoEditor.editor.IStandaloneDiffEditor | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const downloadFile = () => {
		const blob = new Blob([file.patch || ""], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = file.name;
		a.click();
		URL.revokeObjectURL(url);
	};

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
		<div
			className={cn(
				"h-full min-h-0 flex flex-col bg-white dark:bg-card",
				isFullscreen && "fixed inset-0 z-50",
			)}
		>
			{/* Header */}
			<div className="h-10 px-2 flex items-center gap-1 border-b bg-white dark:bg-card">
				<Button
					variant="ghost"
					size="icon"
					onClick={downloadFile}
					title="Download file"
				>
					<Download className="w-4 h-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsFullscreen((v) => !v)}
					title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
				>
					{isFullscreen ? (
						<Minimize2 className="w-4 h-4" />
					) : (
						<Maximize2 className="w-4 h-4" />
					)}
				</Button>
			</div>

			{/* Monaco */}
			<div className="flex-1 min-h-0">
				<DiffEditor
					height="100vh"
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
			</div>
		</div>
	);
};

export default MonacoDiffViewer;
