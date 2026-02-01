import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/mocks/data/users";
import { mockPullRequests } from "@/mocks/data/pullRequests";
import { getInitials, formatRelativeTime } from "@/utils/formatting";
import {
	GitPullRequest,
	MessageSquare,
	Code2,
	Calendar,
	Home,
	Mail,
	User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EditProfileFormData {
	name: string;
	email: string;
	username: string;
}

const Profile = () => {
	// Using the user from mockUsers
	const baseUser = mockUsers[4];
	const [editedUser, setEditedUser] = useState(baseUser);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<EditProfileFormData>({
		defaultValues: {
			name: editedUser.name,
			email: editedUser.email,
			username: editedUser.username,
		},
	});

	// Calculate stats using useMemo to avoid recalculation
	const stats = useMemo(() => {
		const prsCreated = mockPullRequests.filter(
			(pr) => pr.author.id === editedUser.id,
		).length;

		const prsReviewed = mockPullRequests.filter((pr) =>
			pr.reviewers.some((reviewer) => reviewer.id === editedUser.id),
		).length;

		const totalComments = mockPullRequests.reduce((sum, pr) => {
			return (
				sum +
				pr.commentThreads.reduce(
					(threadSum, thread) =>
						threadSum +
						(thread.comments.filter((c) => c.author.id === editedUser.id)
							.length || 0),
					0,
				)
			);
		}, 0);

		return { prsCreated, prsReviewed, totalComments };
	}, [editedUser.id]);

	// Get filtered PRs for tabs
	const userAuthoredPRs = useMemo(
		() => mockPullRequests.filter((pr) => pr.author.id === editedUser.id),
		[editedUser.id],
	);

	const userReviewedPRs = useMemo(
		() =>
			mockPullRequests.filter((pr) =>
				pr.reviewers.some((reviewer) => reviewer.id === editedUser.id),
			),
		[editedUser.id],
	);

	const onEditSubmit = async (data: EditProfileFormData) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Update user
			setEditedUser((prev) => ({
				...prev,
				name: data.name,
				email: data.email,
				username: data.username,
			}));

			setIsEditDialogOpen(false);
			toast.success("Profile updated successfully!");
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	const roleColors = {
		developer:
			"bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
		reviewer:
			"bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
		admin: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
	};

	const statusColors = {
		open: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
		closed: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
		merged:
			"bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
		draft: "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400",
	};

	const renderPRRow = (pr: (typeof mockPullRequests)[0]) => (
		<Link to={`/pr/${pr.number}`} key={pr.id} className="block group">
			<div className="px-4 py-3 border-b border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-card/50 transition-colors">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<h4 className="font-semibold text-sm text-slate-900 dark:text-foreground group-hover:text-primary transition-colors line-clamp-2">
							{pr.title}
						</h4>
						<div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-muted-foreground">
							<span>#{pr.number}</span>
							<span>•</span>
							<span>{formatRelativeTime(pr.createdAt)}</span>
						</div>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<span
							className={cn(
								"px-2 py-1 text-xs font-medium rounded-full",
								statusColors[pr.status as keyof typeof statusColors],
							)}
						>
							{pr.status}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);

	return (
		<div className="p-6">
			<Link
				to={"/dashboard"}
				className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground mb-3 md:mb-4 transition-colors"
			>
				<Home className="w-3 h-3 sm:w-4 sm:h-4" /> Return To Dashboard
			</Link>

			{/* Profile Header */}
			<div className="mb-8">
				<Card className="p-6">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						<Avatar className="w-24 h-24">
							<AvatarImage src={editedUser.avatar} alt={editedUser.name} />
							<AvatarFallback>{getInitials(editedUser.name)}</AvatarFallback>
						</Avatar>

						<div className="flex-1 max-sm:text-center">
							<h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
								{editedUser.name}
							</h1>
							<p className="text-slate-600 dark:text-muted-foreground mt-1">
								@{editedUser.username}
							</p>

							<div className="flex flex-wrap items-center gap-3 mt-4">
								<Badge
									variant="outline"
									className={
										roleColors[editedUser.role as keyof typeof roleColors]
									}
								>
									{editedUser.role.charAt(0).toUpperCase() +
										editedUser.role.slice(1)}
								</Badge>

								<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground">
									<Calendar className="w-4 h-4" />
									<span>Joined Jan 2024</span>
								</div>
							</div>

							<p className="text-sm text-slate-600 dark:text-muted-foreground mt-3 flex items-center max-sm:justify-center gap-2">
								<Mail className="w-4 h-4" />
								{editedUser.email}
							</p>
						</div>

						<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
							<DialogTrigger asChild>
								<Button className="hidden sm:inline-flex">Edit Profile</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-106.25">
								<DialogHeader>
									<DialogTitle>Edit Profile</DialogTitle>
									<DialogDescription>
										Update your profile information. Click save when you're
										done.
									</DialogDescription>
								</DialogHeader>

								<form
									onSubmit={handleSubmit(onEditSubmit)}
									className="space-y-4"
								>
									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											<User className="w-4 h-4" />
											Full Name
										</label>
										<Input
											{...register("name", {
												required: "Name is required",
												minLength: {
													value: 2,
													message: "Name must be at least 2 characters",
												},
											})}
											placeholder="Your full name"
										/>
										{errors.name && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.name.message}
											</p>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											<Mail className="w-4 h-4" />
											Email Address
										</label>
										<Input
											type="email"
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
													message: "Please enter a valid email",
												},
											})}
											placeholder="your.email@example.com"
										/>
										{errors.email && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.email.message}
											</p>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											Username
										</label>
										<Input
											{...register("username", {
												required: "Username is required",
												minLength: {
													value: 3,
													message: "Username must be at least 3 characters",
												},
											})}
											placeholder="your_username"
										/>
										{errors.username && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.username.message}
											</p>
										)}
									</div>

									<Separator />

									<div className="flex gap-3 justify-end">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsEditDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? "Saving..." : "Save Changes"}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					<div className="sm:hidden mt-4">
						<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
							<DialogTrigger asChild>
								<Button className="w-full">Edit Profile</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-106.25">
								<DialogHeader>
									<DialogTitle>Edit Profile</DialogTitle>
									<DialogDescription>
										Update your profile information. Click save when you're
										done.
									</DialogDescription>
								</DialogHeader>

								<form
									onSubmit={handleSubmit(onEditSubmit)}
									className="space-y-4"
								>
									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											<User className="w-4 h-4" />
											Full Name
										</label>
										<Input
											{...register("name", {
												required: "Name is required",
												minLength: {
													value: 2,
													message: "Name must be at least 2 characters",
												},
											})}
											placeholder="Your full name"
										/>
										{errors.name && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.name.message}
											</p>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											<Mail className="w-4 h-4" />
											Email Address
										</label>
										<Input
											type="email"
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
													message: "Please enter a valid email",
												},
											})}
											placeholder="your.email@example.com"
										/>
										{errors.email && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.email.message}
											</p>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-slate-900 dark:text-foreground flex items-center gap-2 mb-2">
											Username
										</label>
										<Input
											{...register("username", {
												required: "Username is required",
												minLength: {
													value: 3,
													message: "Username must be at least 3 characters",
												},
											})}
											placeholder="your_username"
										/>
										{errors.username && (
											<p className="text-xs text-red-600 dark:text-red-400 mt-1">
												{errors.username.message}
											</p>
										)}
									</div>

									<Separator />

									<div className="flex gap-3 justify-end">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsEditDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? "Saving..." : "Save Changes"}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</Card>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card className="p-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
							<GitPullRequest className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-slate-600 dark:text-muted-foreground text-sm">
								Pull Requests Created
							</p>
							<p className="text-2xl font-bold text-slate-900 dark:text-foreground">
								{stats.prsCreated}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
							<Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div>
							<p className="text-slate-600 dark:text-muted-foreground text-sm">
								Pull Requests Reviewed
							</p>
							<p className="text-2xl font-bold text-slate-900 dark:text-foreground">
								{stats.prsReviewed}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
							<MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<p className="text-slate-600 dark:text-muted-foreground text-sm">
								Total Comments
							</p>
							<p className="text-2xl font-bold text-slate-900 dark:text-foreground">
								{stats.totalComments}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Activity Tabs */}
			<Card>
				<Tabs defaultValue="created" className="w-full">
					<TabsList className="w-full justify-start border-b border-slate-200 dark:border-border rounded-none bg-transparent p-0">
						<TabsTrigger
							value="created"
							className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
						>
							Pull Requests Created
						</TabsTrigger>
						<TabsTrigger
							value="reviewed"
							className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
						>
							Pull Requests Reviewed
						</TabsTrigger>
					</TabsList>

					<TabsContent value="created" className="mt-0">
						{userAuthoredPRs.length > 0 ? (
							<div>{userAuthoredPRs.map((pr) => renderPRRow(pr))}</div>
						) : (
							<div className="p-6 text-center">
								<p className="text-slate-600 dark:text-muted-foreground">
									No pull requests created yet
								</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value="reviewed" className="mt-0">
						{userReviewedPRs.length > 0 ? (
							<div>{userReviewedPRs.map((pr) => renderPRRow(pr))}</div>
						) : (
							<div className="p-6 text-center">
								<p className="text-slate-600 dark:text-muted-foreground">
									No pull requests reviewed yet
								</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
};

export default Profile;
