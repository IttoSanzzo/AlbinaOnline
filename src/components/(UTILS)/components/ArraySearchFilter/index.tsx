import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
	searchString: z.string(),
});
type FormData = z.infer<typeof schema>;

function checkStringKeys<TArrayType>(
	stringKeysToCheck: (keyof TArrayType)[],
	item: TArrayType,
	searchString: string
): boolean {
	return stringKeysToCheck.some((key) =>
		(item[key] as string).toLowerCase().includes(searchString)
	);
}
function checkArrayKeys<TArrayType>(
	arrayKeysToCheck: (keyof TArrayType)[],
	item: TArrayType,
	searchString: string
): boolean {
	const search = searchString.toLowerCase();

	return arrayKeysToCheck.some((key) => {
		const value = item[key];

		if (!Array.isArray(value)) return false;
		return (value as unknown[]).some((entry) => {
			if (typeof entry !== "string") return false;
			return entry.toLowerCase().includes(search);
		});
	});
}

interface ArraySearchFilterProps<TArrayType> {
	array: TArrayType[];
	setFilteredState: Dispatch<SetStateAction<TArrayType[]>>;
	label: string;
	placeholder?: string;
	stringKeysToCheck?: (keyof TArrayType)[];
	arrayKeysToCheck?: (keyof TArrayType)[];
	minLengthToCheck?: number;
}
export function ArraySearchFilter<TArrayType>({
	array,
	setFilteredState,
	label,
	placeholder,
	stringKeysToCheck = [],
	arrayKeysToCheck = [],
	minLengthToCheck = 2,
}: ArraySearchFilterProps<TArrayType>) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { searchString: "" },
	});
	const searchString = form.watch().searchString;

	useEffect(() => {
		if (
			!searchString ||
			searchString.length < minLengthToCheck ||
			(stringKeysToCheck.length === 0 && arrayKeysToCheck.length === 0)
		) {
			setFilteredState(array);
			return;
		}
		const searchStringInLowerCase = searchString.toLowerCase();
		if (stringKeysToCheck.length > 0 && arrayKeysToCheck.length > 0) {
			setFilteredState(
				array.filter(
					(item) =>
						checkStringKeys(stringKeysToCheck, item, searchStringInLowerCase) ||
						checkArrayKeys(arrayKeysToCheck, item, searchStringInLowerCase)
				)
			);
		} else if (stringKeysToCheck.length > 0) {
			setFilteredState(
				array.filter((item) =>
					checkStringKeys(stringKeysToCheck, item, searchStringInLowerCase)
				)
			);
			return;
		} else if (arrayKeysToCheck.length > 0) {
			setFilteredState(
				array.filter((item) =>
					checkArrayKeys(arrayKeysToCheck, item, searchStringInLowerCase)
				)
			);
			return;
		}
	}, [array, searchString]);

	return (
		<HookedForm.Form form={form}>
			<HookedForm.TextInput<FormData>
				fieldName="searchString"
				label={label}
				placeholder={placeholder}
			/>
		</HookedForm.Form>
	);
}
