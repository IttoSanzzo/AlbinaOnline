import z from "zod";

export function zJsonString<T extends z.ZodTypeAny>(schema: T) {
	return z
		.string()
		.min(1, "Must provide a valid JSON")
		.transform((val, ctx): z.infer<T> | typeof z.NEVER => {
			let parsed: unknown;
			try {
				parsed = JSON.parse(val);
			} catch {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Invalid JSON format",
				});
				return z.NEVER;
			}

			const result = schema.safeParse(parsed);
			if (!result.success) {
				for (const issue of result.error.issues) {
					ctx.addIssue(issue);
				}
				return z.NEVER;
			}

			return result.data;
		});
}
export function zJsonStringTyped<T>(schema: z.ZodType<any, any, unknown>) {
	return z
		.string()
		.min(2, "Must provide a valid JSON")
		.transform((val, ctx): T | typeof z.NEVER => {
			let parsed: unknown;
			try {
				parsed = JSON.parse(val);
			} catch {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Invalid JSON format",
				});
				return z.NEVER;
			}

			const result = schema.safeParse(parsed);
			if (!result.success) {
				const messages = result.error.issues
					.map(
						(issue) =>
							`Error in ${issue.path.join(".") || "root"}: ${issue.message}`
					)
					.join("; ");
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: messages,
				});
				return z.NEVER;
			}

			return result.data;
		});
}
