import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import PRReview from "./pages/PRReview";
import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme/theme-provider";


function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<ErrorBoundary>
				<BrowserRouter>
					<Routes>
						{/* Redirect root to dashboard */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />

						{/* Dashboard */}
						<Route
							path="/dashboard"
							element={
								<Layout>
									<Dashboard />
								</Layout>
							}
						/>

						{/* PR Review Page */}
						<Route
							path="/pr/:number"
							element={
								<Layout showSidebar={false}>
									<PRReview />
								</Layout>
							}
						/>

						{/* Catch all - 404 */}
						<Route path="*" element={<NotFound />} />
					</Routes>

					{/* Toast notifications */}
					<Toaster />
				</BrowserRouter>
			</ErrorBoundary>
		</ThemeProvider>
	);
}

export default App;
