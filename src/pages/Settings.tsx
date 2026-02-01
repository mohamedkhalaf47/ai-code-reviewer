import { useForm, useWatch } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

interface SettingsFormData {
	email: string;
	password: string;
	confirmPassword: string;
	tabSize: string;
	lineWrap: boolean;
	emailNotifications: boolean;
	prNotifications: boolean;
	commentNotifications: boolean;
	dailyDigest: boolean;
	theme: "light" | "dark" | "auto";
}

const Settings = () => {
	const [savedSettings, setSavedSettings] = useLocalStorage<
		Partial<SettingsFormData>
	>("appSettings", {
		tabSize: "2",
		lineWrap: true,
		emailNotifications: true,
		prNotifications: true,
		commentNotifications: true,
		dailyDigest: false,
		theme: "auto",
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<SettingsFormData>({
		defaultValues: {
			email: "sarah.chen@company.com",
			password: "",
			confirmPassword: "",
			tabSize: (savedSettings.tabSize as string) || "2",
			lineWrap: savedSettings.lineWrap !== false,
			emailNotifications: savedSettings.emailNotifications !== false,
			prNotifications: savedSettings.prNotifications !== false,
			commentNotifications: savedSettings.commentNotifications !== false,
			dailyDigest: savedSettings.dailyDigest === true,
		},
	});

	const password = useWatch({ control, name: "password", defaultValue: "" }) || "";

	const onSubmit = async (data: SettingsFormData) => {
		// Validate password confirmation
		if (data.password && data.password !== data.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Save to localStorage
		setSavedSettings({
			tabSize: data.tabSize,
			lineWrap: data.lineWrap,
			emailNotifications: data.emailNotifications,
			prNotifications: data.prNotifications,
			commentNotifications: data.commentNotifications,
			dailyDigest: data.dailyDigest,
			theme: data.theme,
		});

		toast.success("Settings saved successfully!");
	};

	const handleResetPassword = () => {
		reset({
			password: "",
			confirmPassword: "",
		});
		toast.success("Password fields cleared");
	};

	return (
		<div className="p-6">
			<Link
				to={"/dashboard"}
				className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground mb-3 md:mb-4 transition-colors"
			>
				<HomeIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Return To Dashboard
			</Link>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
					Settings
				</h1>
				<p className="text-slate-600 dark:text-muted-foreground mt-2">
					Manage your account preferences and application settings
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Notifications Section */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">
						Notifications
					</h2>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<label className="text-sm font-medium text-slate-900 dark:text-foreground">
									Email Notifications
								</label>
								<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
									Receive email updates about your account
								</p>
							</div>
							<input
								type="checkbox"
								{...register("emailNotifications")}
								className="w-5 h-5 rounded border-slate-300 dark:border-border"
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<label className="text-sm font-medium text-slate-900 dark:text-foreground">
									Pull Request Updates
								</label>
								<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
									Get notified on PR reviews and changes
								</p>
							</div>
							<input
								type="checkbox"
								{...register("prNotifications")}
								className="w-5 h-5 rounded border-slate-300 dark:border-border"
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<label className="text-sm font-medium text-slate-900 dark:text-foreground">
									Comment Notifications
								</label>
								<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
									Get notified when someone comments on your code
								</p>
							</div>
							<input
								type="checkbox"
								{...register("commentNotifications")}
								className="w-5 h-5 rounded border-slate-300 dark:border-border"
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<label className="text-sm font-medium text-slate-900 dark:text-foreground">
									Daily Digest
								</label>
								<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
									Receive a daily summary of activities
								</p>
							</div>
							<input
								type="checkbox"
								{...register("dailyDigest")}
								className="w-5 h-5 rounded border-slate-300 dark:border-border"
							/>
						</div>
					</div>
				</Card>

				{/* Code Editor Section */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">
						Code Editor
					</h2>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-900 dark:text-foreground">
								Tab Size
							</label>
							<select
								{...register("tabSize")}
								className="mt-2 w-full rounded-md border border-slate-300 dark:border-border bg-white dark:bg-card px-3 py-2 text-slate-900 dark:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								<option value="2">2 spaces</option>
								<option value="4">4 spaces</option>
								<option value="8">8 spaces</option>
							</select>
							<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
								Default indentation size for code editor
							</p>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<label className="text-sm font-medium text-slate-900 dark:text-foreground">
									Line Wrapping
								</label>
								<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
									Wrap long lines in the code editor
								</p>
							</div>
							<input
								type="checkbox"
								{...register("lineWrap")}
								className="w-5 h-5 rounded border-slate-300 dark:border-border"
							/>
						</div>
					</div>
				</Card>

				{/* Account Section */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">
						Account
					</h2>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-900 dark:text-foreground">
								Email Address
							</label>
							<Input
								type="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Please enter a valid email address",
									},
								})}
								className="mt-2"
								disabled
							/>
							<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
								Contact support to change your email address
							</p>
							{errors.email && (
								<p className="text-xs text-red-600 dark:text-red-400 mt-1">
									{errors.email.message}
								</p>
							)}
						</div>

						<Separator />

						<div>
							<label className="text-sm font-medium text-slate-900 dark:text-foreground">
								New Password
							</label>
							<Input
								type="password"
								{...register("password", {
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
									pattern: {
										value:
											/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
										message:
											"Password must contain uppercase, lowercase, number and special character",
									},
								})}
								placeholder="Leave empty if you don't want to change"
								className="mt-2"
							/>
							<p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
								Min 8 characters, must include uppercase, lowercase, number, and
								special character
							</p>
							{errors.password && (
								<p className="text-xs text-red-600 dark:text-red-400 mt-1">
									{errors.password.message}
								</p>
							)}
						</div>

						<Separator />

						<div>
							<label className="text-sm font-medium text-slate-900 dark:text-foreground">
								Confirm Password
							</label>
							<Input
								type="password"
								{...register("confirmPassword", {
									validate: (value) =>
										!password || value === password || "Passwords do not match",
								})}
								placeholder="Confirm new password"
								className="mt-2"
								disabled={!password}
							/>
							{errors.confirmPassword && (
								<p className="text-xs text-red-600 dark:text-red-400 mt-1">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						{password && (
							<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-md">
								<p className="text-xs text-blue-700 dark:text-blue-400">
									💡 Password fields are filled. Click Save to update your
									password.
								</p>
							</div>
						)}
					</div>
				</Card>

				{/* Form Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={handleResetPassword}
						disabled={isSubmitting}
					>
						Reset Password Fields
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => reset()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting} className="sm:min-w-32">
						{isSubmitting ? "Saving..." : "Save Settings"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Settings;
