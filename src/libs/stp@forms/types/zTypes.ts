import { Guid } from "@/libs/stp@types";
import z from "zod";

export const zGuid = () =>
	z
		.string()
		.refine((val) => Guid.isGuid(val), { message: "Invalid Guid" })
		.transform((val) => val as Guid);

export const zSlug = () =>
	z
		.string()
		.min(1, "Min 1 length")
		.regex(/^[a-z0-9-]+$/, "Only lower, numbers and '-'")
		.regex(
			/^[a-z0-9]+(-[a-z0-9]+)*$/,
			"Invalid slug (cannot start or end with with '-')"
		);

export const zEnumKey = <TEnum extends object>(
	enumObj: TEnum,
	notIncluded: (keyof TEnum)[] = []
) =>
	z
		.string()
		.refine((val) => Object.keys(enumObj).includes(val), {
			message: `Invalid ${enumObj.constructor.name}`,
		})
		.transform((val) => enumObj[val as keyof TEnum])
		.refine((val) => !notIncluded.includes(val as keyof TEnum), {
			message: `${enumObj.constructor.name} cannot be excluded value`,
		});
