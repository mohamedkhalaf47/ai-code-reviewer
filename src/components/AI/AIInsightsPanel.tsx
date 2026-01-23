import { useState } from "react";
import {
	Shield,
	Zap,
	Sparkles,
	Info,
	AlertTriangle,
	AlertCircle,
} from "lucide-react";
import { type AIInsight, type AISummary } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AIInsightsPanelProps {
	insights: AIInsight[];
	summary?: AISummary;
}

const AIInsightsPanel = ({ insights, summary }: AIInsightsPanelProps) => {
	const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(
		null,
	);
	const getInsightIcon = (type: string) => {
		switch (type) {
			case "security":
				return Shield;
			case "performance":
				return Zap;
			case "quality":
				return Sparkles;
			case "best-practice":
				return Info;
			default:
				return Info;
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "critical":
				return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30";
			case "high":
				return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30";
			case "medium":
				return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30";
			case "low":
				return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30";
			default:
				return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30";
		}
	};

	const getSeverityIcon = (severity: string) => {
		if (severity === "critical" || severity === "high") {
			return AlertCircle;
		}
		return AlertTriangle;
	};

	const criticalCount = insights.filter(
		(i) => i.severity === "critical",
	).length;
	const highCount = insights.filter((i) => i.severity === "high").length;
	const mediumCount = insights.filter((i) => i.severity === "medium").length;

	return (
		<div className="h-full flex flex-col bg-white dark:bg-card border-l dark:border-border">
			{/* Header */}
			<div className="px-4 py-3 border-b dark:border-border">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
						<Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
						AI Insights
					</h3>
					{criticalCount > 0 && (
						<Badge variant="destructive" className="text-xs">
							{criticalCount} Critical
						</Badge>
					)}
				</div>

				{/* Summary Stats */}
				<div className="flex items-center gap-2 text-xs text-slate-600 dark:text-muted-foreground">
					{highCount > 0 && <span>{highCount} High</span>}
					{mediumCount > 0 && <span>• {mediumCount} Medium</span>}
				</div>
			</div>

			<ScrollArea className="flex-1">
				<div className="p-4 space-y-4">
					{/* AI Summary */}
					{summary && (
						<Card className="p-4 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-200 dark:border-blue-500/30">
							<div className="flex items-start gap-2 mb-2">
								<Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
								<h4 className="text-sm font-semibold text-slate-900 dark:text-foreground">
									AI Summary
								</h4>
							</div>
							<p className="text-sm text-slate-700 dark:text-foreground/90 leading-relaxed">
								{summary.summary}
							</p>

							{summary.reviewFocus.length > 0 && (
								<div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-500/20">
									<p className="text-xs font-medium text-slate-700 dark:text-foreground mb-2">
										Focus Areas:
									</p>
									<ul className="space-y-1">
										{summary.reviewFocus.slice(0, 3).map((focus, index) => (
											<li
												key={index}
												className="text-xs text-slate-600 dark:text-muted-foreground flex items-start gap-2"
											>
												<span className="text-blue-600 dark:text-blue-400 mt-0.5">
													•
												</span>
												<span className="flex-1">{focus}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</Card>
					)}

					{/* Insights List */}
					<div className="space-y-2">
						{insights.map((insight) => {
							const Icon = getInsightIcon(insight.type);
							const SeverityIcon = getSeverityIcon(insight.severity);

							return (
								<button
									key={insight.id}
									onClick={() => setSelectedInsight(insight)}
									className={cn(
										"w-full text-left p-3 border rounded-lg overflow-hidden transition-all hover:shadow-md",
										getSeverityColor(insight.severity),
									)}
								>
									<div className="flex items-start gap-2">
										<Icon className="w-4 h-4 mt-0.5 shrink-0" />
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium leading-tight">
												{insight.title}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Badge variant="outline" className="text-xs h-5 px-1.5">
													{insight.type}
												</Badge>
												<span className="text-xs">
													Line {insight.lineNumber}
												</span>
											</div>
										</div>
										<SeverityIcon className="w-4 h-4 shrink-0" />
									</div>
								</button>
							);
						})}
					</div>

					{/* Insight Detail Modal */}
					{selectedInsight && (
						<Dialog
							open={!!selectedInsight}
							onOpenChange={(open) => !open && setSelectedInsight(null)}
						>
							<DialogContent className="max-w-3xl max-h-[90vh] w-[95vw] flex flex-col">
								<DialogHeader className="shrink-0">
									<DialogTitle className="flex items-center gap-2">
										{(() => {
											const Icon = getInsightIcon(selectedInsight.type);
											return <Icon className="w-5 h-5" />;
										})()}
										{selectedInsight.title}
									</DialogTitle>
								</DialogHeader>
								<div className="flex-1 overflow-y-auto space-y-4 text-sm pr-4">
									<div className="flex gap-2 flex-wrap">
										<Badge variant="outline">{selectedInsight.type}</Badge>
										<Badge
											className={getSeverityColor(selectedInsight.severity)}
										>
											{selectedInsight.severity}
										</Badge>
										<Badge variant="secondary">
											Line {selectedInsight.lineNumber}
										</Badge>
									</div>

									<div>
										<p className="font-medium mb-2">Description</p>
										<p className="leading-relaxed text-foreground/90">
											{selectedInsight.description}
										</p>
									</div>

									<div>
										<p className="font-medium mb-2">Suggestion</p>
										<p className="leading-relaxed text-foreground/90">
											{selectedInsight.suggestion}
										</p>
									</div>

									{selectedInsight.codeSnippet && (
										<div>
											<p className="font-medium mb-2">Current Code</p>
											<pre className="text-xs bg-black/5 dark:bg-black/20 p-3 rounded overflow-x-auto border">
												<code>{selectedInsight.codeSnippet}</code>
											</pre>
										</div>
									)}

									{selectedInsight.suggestedFix && (
										<div>
											<p className="font-medium mb-2">Suggested Fix</p>
											<pre className="text-xs bg-green-500/10 dark:bg-green-500/20 p-3 rounded overflow-x-auto border border-green-500/30">
												<code>{selectedInsight.suggestedFix}</code>
											</pre>
										</div>
									)}
								</div>
							</DialogContent>
						</Dialog>
					)}
					{insights.length === 0 && (
						<div className="text-center py-8">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 mx-auto mb-3">
								<Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<p className="text-sm font-medium text-slate-900 dark:text-foreground mb-1">
								No issues found!
							</p>
							<p className="text-xs text-slate-600 dark:text-muted-foreground">
								This code looks good to go.
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default AIInsightsPanel;
