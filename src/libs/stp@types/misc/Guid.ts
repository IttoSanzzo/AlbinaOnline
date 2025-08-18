const GuidEmpty = "00000000-0000-0000-0000-000000000000" as const;
export type Guid =
	| typeof GuidEmpty
	| (`${string}-${string}-${string}-${string}-${string}` & {
			__brand: "Guid";
	  });

export const Guid = {
	NewGuid(): Guid {
		if (crypto.randomUUID) {
			return crypto.randomUUID() as Guid;
		} else {
			return generateUUID();
		}
	},
	Empty: GuidEmpty as Guid,
	isGuid(value: string): value is Guid {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			value
		);
	},
	Parse(value: unknown): Guid | null {
		if (typeof value === "string" && Guid.isGuid(value)) return value as Guid;
		return null;
	},
	ParseOrThrow(value: unknown): Guid {
		if (typeof value === "string" && Guid.isGuid(value)) return value as Guid;
		throw new Error("Invalid GUID");
	},
};

function generateUUID(): Guid {
	// Gera um UUID v4 simples
	const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
	return uuid as Guid;
}
