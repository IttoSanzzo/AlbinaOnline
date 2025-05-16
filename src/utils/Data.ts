import { pascalToCamel } from "./StringUtils";

export function convertEnumsFromResponse<T>(data: T): T {
	if (Array.isArray(data)) {
		return data.map(convertEnumsFromResponse) as unknown as T;
	} else if (typeof data == "object" && data !== null) {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			if (key === "color" && typeof value === "string")
				result[key] = pascalToCamel(value);
			else result[key] = convertEnumsFromResponse(value);
		}
		return result as T;
	}
	return data;
}
