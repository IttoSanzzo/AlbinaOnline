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
