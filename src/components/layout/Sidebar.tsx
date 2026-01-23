import { Link } from "react-router-dom";
import {
	LayoutDashboard,
	GitPullRequest,
	CheckCircle,
	XCircle,
	Clock,
	FileCode,
	User,
	Users,
	Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
	title: string;
	href: string;
	icon: React.ElementType;
	badge?: number;
}

const navItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "All Pull Requests",
		href: "/prs",
		icon: GitPullRequest,
		badge: 12,
	},
	{
		title: "Open",
		href: "/prs/open",
		icon: Clock,
		badge: 8,
	},
	{
		title: "Merged",
		href: "/prs/merged",
		icon: CheckCircle,
		badge: 4,
	},
	{
		title: "Closed",
		href: "/prs/closed",
		icon: XCircle,
	},
];

const filterItems: NavItem[] = [
	{
		title: "Created by me",
		href: "/prs/created-by-me",
		icon: User,
		badge: 3,
	},
	{
		title: "Assigned to me",
		href: "/prs/assigned",
		icon: Users,
		badge: 5,
	},
	{
		title: "Needs my review",
		href: "/prs/review-requests",
		icon: FileCode,
		badge: 2,
	},
];

const SidebarContent = ({ onLinkClick }: { onLinkClick: () => void }) => (
	<div className="h-full flex flex-col">
		<ScrollArea className="flex-1 py-6">
			<nav className="space-y-6 px-3">
				{/* Main Navigation */}
				<div className="space-y-1">
					<h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
						Navigation
					</h3>
					{navItems.map((item) => {
						const isActive = location.pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								to={item.href}
								onClick={onLinkClick}
								className={cn(
									"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
									isActive
										? "bg-white dark:bg-sidebar-accent text-blue-600 dark:text-sidebar-accent-foreground shadow-sm"
										: "text-slate-700 dark:text-sidebar-foreground hover:bg-white dark:hover:bg-sidebar-accent hover:text-slate-900 dark:hover:text-sidebar-accent-foreground",
								)}
							>
								<Icon className="w-4 h-4 shrink-0" />
								<span className="flex-1">{item.title}</span>
								{item.badge !== undefined && (
									<Badge
										variant={isActive ? "default" : "secondary"}
										className="ml-auto"
									>
										{item.badge}
									</Badge>
								)}
							</Link>
						);
					})}
				</div>

				{/* Filter Section */}
				<div className="space-y-1">
					<h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
						Filters
					</h3>
					{filterItems.map((item) => {
						const isActive = location.pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								to={item.href}
								onClick={onLinkClick}
								className={cn(
									"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
									isActive
										? "bg-white dark:bg-sidebar-accent text-blue-600 dark:text-sidebar-accent-foreground shadow-sm"
										: "text-slate-700 dark:text-sidebar-foreground hover:bg-white dark:hover:bg-sidebar-accent hover:text-slate-900 dark:hover:text-sidebar-accent-foreground",
								)}
							>
								<Icon className="w-4 h-4 shrink-0" />
								<span className="flex-1">{item.title}</span>
								{item.badge !== undefined && (
									<Badge
										variant={isActive ? "default" : "secondary"}
										className="ml-auto"
									>
										{item.badge}
									</Badge>
								)}
							</Link>
						);
					})}
				</div>

				{/* Recent PRs */}
				<div className="space-y-1">
					<h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
						Recent
					</h3>
					<Link
						to="/pr/142"
						onClick={onLinkClick}
						className="flex items-start gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white dark:hover:bg-sidebar-accent transition-colors"
					>
						<GitPullRequest className="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
						<div className="flex-1 min-w-0">
							<p className="font-medium dark:text-foreground truncate">
								Add user auth middleware
							</p>
							<p className="text-xs text-slate-500 dark:text-muted-foreground">
								#142
							</p>
						</div>
					</Link>
					<Link
						to="/pr/141"
						onClick={onLinkClick}
						className="flex items-start gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white dark:hover:bg-sidebar-accent transition-colors"
					>
						<GitPullRequest className="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
						<div className="flex-1 min-w-0">
							<p className="font-medium dark:text-foreground truncate">
								Fix WebSocket memory leak
							</p>
							<p className="text-xs text-slate-500 dark:text-muted-foreground">
								#141
							</p>
						</div>
					</Link>
					<Link
						to="/pr/140"
						onClick={onLinkClick}
						className="flex items-start gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white dark:hover:bg-sidebar-accent transition-colors"
					>
						<GitPullRequest className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
						<div className="flex-1 min-w-0">
							<p className="font-medium dark:text-foreground truncate">
								Update React to v18
							</p>
							<p className="text-xs text-slate-500 dark:text-muted-foreground">
								#140 • Merged
							</p>
						</div>
					</Link>
				</div>
			</nav>
		</ScrollArea>

		{/* Bottom Section */}
		<div className="p-4 border-t dark:border-sidebar-border bg-white dark:bg-sidebar">
			<div className="flex items-center gap-3 text-xs text-slate-500 dark:text-sidebar-foreground">
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 rounded-full bg-green-500 dark:shadow-glow-success"></div>
					<span>Connected</span>
				</div>
				<span>•</span>
				<span>3 active reviewers</span>
			</div>
		</div>
	</div>
);

const Sidebar = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Mobile Drawer Trigger */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden fixed bottom-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
					>
						<Menu className="h-5 w-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-0 w-64">
					<SidebarContent onLinkClick={() => setOpen(false)} />
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<aside className="hidden lg:block w-64 border-r bg-slate-50/50 dark:bg-sidebar dark:border-sidebar-border">
				<SidebarContent onLinkClick={() => {}} />
			</aside>
		</>
	);
};

export default Sidebar;
