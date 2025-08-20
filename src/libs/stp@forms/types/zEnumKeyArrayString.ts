import z from "zod";
import { zArrayString } from "./zArrayString";

export const zEnumKeyArrayString = <TEnum extends object>(
	enumObj: TEnum,
	notIncluded: (keyof TEnum)[] = []
) =>
	zArrayString().pipe(
		z
			.array(z.string())
			.refine((arr) => arr.every((val) => Object.keys(enumObj).includes(val)), {
				message: `Invalid ${enumObj.constructor.name} key in array`,
			})
			.transform((arr) => arr.map((val) => enumObj[val as keyof TEnum]))
			.refine(
				(arr) => arr.every((val) => !notIncluded.includes(val as keyof TEnum)),
				{
					message: `${enumObj.constructor.name} cannot include excluded values`,
				}
			)
	);
