import { LintIgnoredAny } from "@/libs/stp@types";

type Listener<T = LintIgnoredAny> = (payload: T) => boolean | Promise<boolean>;

class EventBus {
	private listeners = new Map<string, Listener[]>();

	on<T = LintIgnoredAny>(event: string, listener: Listener<T>) {
		if (!this.listeners.has(event)) this.listeners.set(event, []);
		this.listeners.get(event)!.push(listener);

		return () => {
			const arr = this.listeners.get(event);
			if (!arr) return;
			this.listeners.set(
				event,
				arr.filter((l) => l !== listener),
			);
		};
	}

	async emitAsync<T = LintIgnoredAny>(
		event: string,
		payload: T,
	): Promise<boolean> {
		const listeners = this.listeners.get(event);
		if (!listeners || listeners.length === 0) return true;
		const results = await Promise.all(
			listeners.map(async (listener) => {
				try {
					return await listener(payload);
				} catch {
					return false;
				}
			}),
		);
		return results.every(Boolean);
	}
}

export const eventBus = new EventBus();
