import { GitPullRequest, Search, Bell, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/mocks/data/users";
import { getInitials } from "@/utils/formatting";
import { APP_NAME } from "@/utils/constants";
import { ModeToggle } from "../theme/mode-toggle";

const Header = () => {
const currentUser = getCurrentUser();
const notificationCount = 3;

return (
	<header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-card dark:border-border">
		<div className="flex h-16 items-center px-6 gap-4">
			{/* Logo & Brand */}
			<Link to="/dashboard" className="flex items-center gap-2 mr-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
					<GitPullRequest className="w-5 h-5 text-white" />
				</div>
				<span className="font-bold text-lg hidden sm:inline">
					{APP_NAME}
				</span>
			</Link>

			{/* Search Bar */}
			<div className="flex-1 max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						type="search"
						placeholder="Search pull requests..."
						className="pl-10 bg-slate-50 dark:bg-muted border-slate-200 dark:border-border focus:bg-white dark:focus:bg-card"
					/>
				</div>
			</div>

			{/* Right Side Actions */}
			<div className="flex items-center gap-1 md:gap-2 ml-auto">
				{/* Search Icon for Mobile */}
				<Button variant="ghost" size="icon" className="md:hidden">
					<Search className="w-4 h-4" />
				</Button>

				{/* Theme Toggle */}
				<ModeToggle />

				{/* Notifications */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="w-4 h-4 md:w-5 md:h-5" />
							{notificationCount > 0 && (
								<Badge
									variant="destructive"
									className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs"
								>
									{notificationCount}
								</Badge>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72 md:w-80">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<div className="max-h-75 overflow-y-auto">
							<DropdownMenuItem>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">New comment on PR #142</p>
									<p className="text-xs text-slate-500 dark:text-muted-foreground">
										Mike Johnson commented 5 minutes ago
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">PR #141 approved</p>
									<p className="text-xs text-slate-500 dark:text-muted-foreground">
										Sarah Chen approved 1 hour ago
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">
										You were mentioned in PR #140
									</p>
									<p className="text-xs text-slate-500 dark:text-muted-foreground">
										Alex Rivera mentioned you 2 hours ago
									</p>
								</div>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="gap-2 px-1 md:px-2">
							<Avatar className="h-7 w-7 md:h-8 md:w-8">
								<AvatarImage src={currentUser.avatar} alt={currentUser.name} />
								<AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
							</Avatar>
							<span className="hidden lg:inline text-sm font-medium">
								{currentUser.name}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>
							<div className="flex flex-col gap-1">
								<p className="text-sm font-medium">{currentUser.name}</p>
								<p className="text-xs text-slate-500 dark:text-muted-foreground">
									{currentUser.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/profile" className="cursor-pointer">
								<User className="w-4 h-4 mr-2" />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings" className="cursor-pointer">
								<Settings className="w-4 h-4 mr-2" />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400">
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	</header>
);
};

export default Header;