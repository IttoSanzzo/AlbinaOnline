import { shallowCompare } from "@/utils/Data";
import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";

type WatchedActionProps<TFormData> = {
	isValid?: boolean;
	debounce?: number;
	watch: UseFormWatch<any>;
	action: (watchedValues: TFormData) => Promise<boolean>;
};
export function WatchedAction<TFormData>({
	isValid,
	action,
	watch,
	debounce = 800,
}: WatchedActionProps<TFormData>) {
	const watchedValues = watch();
	const lastValue = useRef({ ...watchedValues });

	useEffect(() => {
		if (
			(isValid != undefined ? isValid : true) &&
			!shallowCompare(lastValue.current, watchedValues)
		) {
			const timeout = setTimeout(async () => {
				const actionResult = await action(watchedValues);
				if (actionResult == true) lastValue.current = { ...watchedValues };
			}, debounce);
			return () => clearTimeout(timeout);
		}
	}, [watchedValues, isValid]);

	return null;
}
