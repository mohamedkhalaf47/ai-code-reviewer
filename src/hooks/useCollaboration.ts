import { useEffect, useRef, useState } from "react";
import { mockWebSocket } from "@/mocks/services/mockWebSocket";
import type { CollaboratingUser } from "@/types";
import type { CursorMoveEvent as CollaborationCursorMoveEvent } from "@/types/collaboration";

export function useCollaboration(roomId: string) {
	const [users, setUsers] = useState<CollaboratingUser[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	const isRemoteUpdate = useRef(false);

	useEffect(() => {
		mockWebSocket.connect(roomId);

		const handleConnect = () => setIsConnected(true);
		const handleDisconnect = () => setIsConnected(false);

		const handleUsersUpdate = (data: { users: CollaboratingUser[] }) => {
			setUsers(data.users);
		};

		mockWebSocket.on("connect", handleConnect);
		mockWebSocket.on("disconnect", handleDisconnect);
		mockWebSocket.on("users:update", handleUsersUpdate);

		return () => {
			mockWebSocket.off("connect", handleConnect);
			mockWebSocket.off("disconnect", handleDisconnect);
			mockWebSocket.off("users:update", handleUsersUpdate);
			mockWebSocket.disconnect();
		};
	}, [roomId]);

	/* ---------------- Code Sync ---------------- */
	const onRemoteCodeChange = (cb: (code: string) => void) => {
		mockWebSocket.on("code:update", (data) => {
			if (data.fromSelf) return;
			isRemoteUpdate.current = true;
			cb(data.code);
		});
	};

	const broadcastCodeChange = (code: string) => {
		if (isRemoteUpdate.current) {
			isRemoteUpdate.current = false;
			return;
		}

		mockWebSocket.send("code:update", { code });
	};

	/* ---------------- Cursor Sync ---------------- */
	const broadcastCursorMove = (cursorData: CollaborationCursorMoveEvent) => {
		mockWebSocket.send("cursor:move", cursorData);
	};

	return {
		users,
		isConnected,
		onRemoteCodeChange,
		broadcastCodeChange,
		broadcastCursorMove,
	};
}
