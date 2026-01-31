import type { CollaborationEventMap } from "@/types/collaboration";
import { mockCollaboratingUsers } from "../data/users";

type EventName = keyof CollaborationEventMap;
type EventCallback<E extends EventName> = (
	data: CollaborationEventMap[E],
) => void;

class MockWebSocket {
	private events: {
		[K in EventName]?: EventCallback<K>[];
	} = {};

	private isConnected = false;
	private simulationIntervals: number[] = [];
	private currentRoom: string | null = null;

	connect(room: string = "default") {
		this.currentRoom = room;

		setTimeout(() => {
			this.isConnected = true;
			this.emit("connect", { room });
			this.startSimulation();

			this.emit("users:update", {
				users: mockCollaboratingUsers.map((u) => ({
					...u,
					lastActive: new Date(),
				})),
			});
		}, 500);
	}

	disconnect() {
		this.isConnected = false;
		this.stopSimulation();
		this.emit("disconnect", {});
		this.currentRoom = null;
	}

	on<E extends EventName>(event: E, callback: EventCallback<E>) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event]!.push(callback);
	}

	off<E extends EventName>(event: E, callback: EventCallback<E>) {
		const callbacks = this.events[event] as EventCallback<E>[] | undefined;
		if (!callbacks) return;
		const filtered = callbacks.filter((cb) => cb !== callback);
		callbacks.length = 0;
		callbacks.push(...filtered);
	}

	emit<E extends EventName>(event: E, data: CollaborationEventMap[E]) {
		this.events[event]?.forEach((callback) => callback(data));
	}

	send<E extends EventName>(event: E, data: CollaborationEventMap[E]) {
		if (!this.isConnected) {
			console.warn("WebSocket not connected");
			return;
		}

		setTimeout(() => {
			this.emit(event, data);

			// broadcast simulation
			if (event !== "cursor:move") {
				this.emit(event, { ...data, fromSelf: false });
			}
		}, 50);
	}

	private startSimulation() {
		const cursorInterval = window.setInterval(() => {
			if (!this.isConnected) return;

			const others = mockCollaboratingUsers.filter((u) => u.id !== 5);
			const user = others[Math.floor(Math.random() * others.length)];

			this.emit("cursor:move", {
				userId: user.id,
				userName: user.name,
				userAvatar: user.avatar,
				color: user.color,
				fileId: 1,
				line: Math.floor(Math.random() * 100) + 1,
				column: Math.floor(Math.random() * 80) + 1,
				timestamp: Date.now(),
			});
		}, 2000);

		this.simulationIntervals.push(cursorInterval);
	}

	private stopSimulation() {
		this.simulationIntervals.forEach(clearInterval);
		this.simulationIntervals = [];
	}

	getConnectionStatus() {
		return this.isConnected;
	}

	getCurrentRoom() {
		return this.currentRoom;
	}
}

export const mockWebSocket = new MockWebSocket();
