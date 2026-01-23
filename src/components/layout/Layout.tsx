import { type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
	children: ReactNode;
	showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-background">
			<Header />
			<div className="flex">
				{showSidebar && <Sidebar />}
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
