import { FileCode, MessageSquare, AlertTriangle } from "lucide-react";
import { type FileChange } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FileTreeProps {
	files: FileChange[];
	selectedFile: FileChange | null;
	onFileSelect: (file: FileChange) => void;
}

const FileTree = ({
	files,
	selectedFile,
	onFileSelect,
}: FileTreeProps) => {
	const getFileIcon = () => {
		return FileCode;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "added":
				return "text-green-600 dark:text-green-400";
			case "modified":
				return "text-yellow-600 dark:text-yellow-400";
			case "deleted":
				return "text-red-600 dark:text-red-400";
			case "renamed":
				return "text-blue-600 dark:text-blue-400";
			default:
				return "text-slate-600 dark:text-muted-foreground";
		}
	};

	const getStatusSymbol = (status: string) => {
		switch (status) {
			case "added":
				return "A";
			case "modified":
				return "M";
			case "deleted":
				return "D";
			case "renamed":
				return "R";
			default:
				return "";
		}
	};

	return (
		<div className="h-full flex flex-col bg-white dark:bg-card border-r dark:border-border">
			{/* Header */}
			<div className="px-4 py-3 border-b dark:border-border">
				<h3 className="text-sm font-semibold text-slate-900 dark:text-foreground">
					Files Changed ({files.length})
				</h3>
			</div>

			{/* File List */}
			<ScrollArea className="flex-1">
				<div className="p-2 space-y-1">
					{files.map((file) => {
						const Icon = getFileIcon();
						const isSelected = selectedFile?.id === file.id;

						return (
							<button
								key={file.id}
								onClick={() => onFileSelect(file)}
								className={cn(
									"w-full text-left px-3 py-2.5 rounded-lg transition-all",
									"hover:bg-slate-50 dark:hover:bg-muted",
									isSelected &&
										"bg-blue-50 dark:bg-primary/10 border border-blue-200 dark:border-primary/30",
								)}
							>
								<div className="flex items-start gap-2">
									<Icon className="w-4 h-4 mt-0.5 shrink-0 text-slate-400 dark:text-muted-foreground" />

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm font-medium text-slate-900 dark:text-foreground truncate">
												{file.name}
											</span>
											<span
												className={cn(
													"shrink-0 w-4 h-4 rounded text-xs font-bold flex items-center justify-center",
													getStatusColor(file.status),
												)}
											>
												{getStatusSymbol(file.status)}
											</span>
										</div>

										<p className="text-xs text-slate-500 dark:text-muted-foreground truncate mb-1">
											{file.path}
										</p>

										<div className="flex items-center gap-3 text-xs">
											<span className="text-green-600 dark:text-green-400">
												+{file.additions}
											</span>
											<span className="text-red-600 dark:text-red-400">
												-{file.deletions}
											</span>

											{file.hasComments && (
												<div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
													<MessageSquare className="w-3 h-3" />
												</div>
											)}

											{file.aiIssuesCount && file.aiIssuesCount > 0 && (
												<div className="flex items-center gap-1 text-red-600 dark:text-red-400">
													<AlertTriangle className="w-3 h-3" />
													<span>{file.aiIssuesCount}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};

export default FileTree;