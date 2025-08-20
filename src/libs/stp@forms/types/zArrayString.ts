import z from "zod";

export const zArrayString = () =>
	z.string().transform((val, ctx) => {
		try {
			const parsed = JSON.parse(val);
			if (!Array.isArray(parsed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Expected array, received ${typeof parsed}`,
				});
				return z.NEVER;
			}
			if (!parsed.every((x) => typeof x === "string")) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Expected array of strings`,
				});
				return z.NEVER;
			}
			return parsed;
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Invalid JSON array string`,
			});
			return z.NEVER;
		}
	});
