import { useState, useEffect } from "react";
import { type PullRequest } from "@/types";
import { mockPRService } from "@/mocks/services/mockPRService";

export const usePullRequests = () => {
	const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPRs = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await mockPRService.fetchPullRequests();
				setPullRequests(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch pull requests",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPRs();
	}, []);

	const refetch = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await mockPRService.fetchPullRequests();
			setPullRequests(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch pull requests",
			);
		} finally {
			setLoading(false);
		}
	};

	return { pullRequests, loading, error, refetch };
};

export const usePullRequest = (id: number) => {
	const [pullRequest, setPullRequest] = useState<PullRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPR = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await mockPRService.fetchPRById(id);
				setPullRequest(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch pull request",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPR();
	}, [id]);

	const refetch = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await mockPRService.fetchPRById(id);
			setPullRequest(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch pull request",
			);
		} finally {
			setLoading(false);
		}
	};

	return { pullRequest, loading, error, refetch };
};
