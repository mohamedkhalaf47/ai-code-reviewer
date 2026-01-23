import { formatDistanceToNow, format } from "date-fns";

export const formatDate = (date: Date | string): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "MMM d, yyyy");
};

export const formatDateTime = (date: Date | string): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "MMM d, yyyy h:mm a");
};

export const formatRelativeTime = (date: Date | string): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return formatDistanceToNow(d, { addSuffix: true });
};

export const formatNumber = (num: number): string => {
	return new Intl.NumberFormat("en-US").format(num);
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const pluralize = (
	count: number,
	singular: string,
	plural?: string,
): string => {
	if (count === 1) return `${count} ${singular}`;
	return `${count} ${plural || singular + "s"}`;
};

export const truncate = (str: string, maxLength: number): string => {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength - 3) + "...";
};

export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};
