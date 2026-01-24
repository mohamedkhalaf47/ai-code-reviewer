import { useRef, useState } from "react";
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import type * as monacoEditor from "monaco-editor";
import { type FileChange } from "@/types";
import { Button } from "../ui/button";
import { Download, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonacoCodeEditorProps {
	file: FileChange;
	isDarkMode?: boolean;
}

/**
 * MonacoCodeEditor: Pure editor renderer.
 *
 * Responsibility: Render ONLY the Monaco code editor canvas.
 * No header, no buttons, no fullscreen handling, no comments UI.
 * Parent (PRReview) controls layout and sizing.
 */
const MonacoCodeEditor = ({ file, isDarkMode }: MonacoCodeEditorProps) => {
	const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
		null,
	);
	const monacoRef = useRef<Monaco | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

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

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		editorRef.current = editor;
		monacoRef.current = monaco;

		editor.updateOptions({
			readOnly: true,
			minimap: { enabled: window.innerWidth > 1024 },
			fontSize: window.innerWidth < 640 ? 12 : 14,
			lineHeight: window.innerWidth < 640 ? 18 : 21,
			padding: { top: 16, bottom: 16 },
			scrollBeyondLastLine: false,
			renderLineHighlight: "all",
			lineNumbers: "on",
			glyphMargin: true,
			folding: true,
		});
	};

	const downloadFile = () => {
		const blob = new Blob([file.patch || ""], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = file.name;
		a.click();
		URL.revokeObjectURL(url);
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
				<Editor
					height="100vh"
					language={getLanguage(file.name)}
					value={file.patch || ""}
					theme={isDarkMode ? "vs-dark" : "vs-light"}
					onMount={handleEditorDidMount}
					options={{ automaticLayout: true }}
					loading={
						<div className="flex items-center justify-center h-full">
							{" "}
							<div className="text-sm text-slate-500 dark:text-muted-foreground">
								{" "}
								Loading editor...{" "}
							</div>{" "}
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default MonacoCodeEditor;
