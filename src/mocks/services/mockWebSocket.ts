import { mockCollaboratingUsers } from "../data/users";

type EventCallback = (data: unknown) => void;

class MockWebSocket {
	private events: Map<string, EventCallback[]> = new Map();
	private isConnected = false;
	private simulationIntervals: number[] = [];

	connect() {
		setTimeout(() => {
			this.isConnected = true;
			this.emit("connect", {});
			this.startSimulation();
		}, 500);
	}

	disconnect() {
		this.isConnected = false;
		this.stopSimulation();
		this.emit("disconnect", {});
	}

	on(event: string, callback: EventCallback) {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		this.events.get(event)!.push(callback);
	}

	off(event: string, callback: EventCallback) {
		const callbacks = this.events.get(event);
		if (callbacks) {
			const index = callbacks.indexOf(callback);
			if (index !== -1) {
				callbacks.splice(index, 1);
			}
		}
	}

	emit(event: string, data: unknown) {
		const callbacks = this.events.get(event);
		if (callbacks) {
			callbacks.forEach((callback) => callback(data));
		}
	}

	// Simulate sending data to server
	send(event: string, data: unknown) {
		if (!this.isConnected) {
			console.warn("WebSocket not connected");
			return;
		}

		// Simulate server acknowledgment
		setTimeout(() => {
			this.emit(`${event}:ack`, data);
		}, 100);
	}

	private startSimulation() {
		// Simulate cursor movements
		const cursorInterval = setInterval(() => {
			const randomUser =
				mockCollaboratingUsers[
					Math.floor(Math.random() * mockCollaboratingUsers.length)
				];

			this.emit("cursor:move", {
				userId: randomUser.id,
				userName: randomUser.name,
				color: randomUser.color,
				fileId: 1,
				line: Math.floor(Math.random() * 100) + 1,
				column: Math.floor(Math.random() * 80) + 1,
			});
		}, 3000);

		// Simulate typing indicators
		const typingInterval = setInterval(() => {
			const randomUser =
				mockCollaboratingUsers[
					Math.floor(Math.random() * mockCollaboratingUsers.length)
				];

			this.emit("user:typing", {
				userId: randomUser.id,
				userName: randomUser.name,
				fileId: 1,
				lineNumber: Math.floor(Math.random() * 100) + 1,
			});

			// Stop typing after 2 seconds
			setTimeout(() => {
				this.emit("user:stop_typing", {
					userId: randomUser.id,
				});
			}, 2000);
		}, 8000);

		// Simulate user presence updates
		const presenceInterval = setInterval(() => {
			this.emit("presence:update", {
				activeUsers: mockCollaboratingUsers.map((user) => ({
					id: user.id,
					name: user.name,
					avatar: user.avatar,
					color: user.color,
					lastActive: new Date(),
				})),
			});
		}, 10000);

		// Simulate occasional comment additions from other users
		const commentInterval = setInterval(() => {
			if (Math.random() > 0.7) {
				// 30% chance
				const randomUser = mockCollaboratingUsers.filter((u) => u.id !== 5)[0];

				this.emit("comment:added", {
					comment: {
						id: Math.floor(Math.random() * 10000),
						author: randomUser,
						content: "Great catch! This looks much better now.",
						lineNumber: Math.floor(Math.random() * 100) + 1,
						createdAt: new Date(),
					},
				});
			}
		}, 15000);

		this.simulationIntervals.push(
			cursorInterval as unknown as number,
			typingInterval as unknown as number,
			presenceInterval as unknown as number,
			commentInterval as unknown as number,
		);
	}

	private stopSimulation() {
		this.simulationIntervals.forEach((interval) => clearInterval(interval));
		this.simulationIntervals = [];
	}

	getConnectionStatus(): boolean {
		return this.isConnected;
	}
}

export const mockWebSocket = new MockWebSocket();
