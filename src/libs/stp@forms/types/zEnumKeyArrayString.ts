import z from "zod";

export const zEnumKeyArrayString = <TEnum extends object>(
	enumObj: TEnum,
	notIncluded: (keyof TEnum)[] = []
) =>
	z
		.string()
		.transform((val, ctx) => {
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
		})
		.pipe(
			z
				.array(z.string())
				.refine(
					(arr) => arr.every((val) => Object.keys(enumObj).includes(val)),
					{
						message: `Invalid ${enumObj.constructor.name} key in array`,
					}
				)
				.transform((arr) => arr.map((val) => enumObj[val as keyof TEnum]))
				.refine(
					(arr) =>
						arr.every((val) => !notIncluded.includes(val as keyof TEnum)),
					{
						message: `${enumObj.constructor.name} cannot include excluded values`,
					}
				)
		);
