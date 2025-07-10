import * as Select from "@radix-ui/react-select";
import { Control, Controller, Path } from "react-hook-form";
import { SelectContainer, SelectError, SelectLabel } from "./styledElements";
import styles from "./styles.module.css";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

export type SelectWithIconOption = {
	value: string;
	name: string;
	icon: string;
};

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type SelectWithIconProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
	errorMessage?: string;
	placeholder?: string;
	options: SelectWithIconOption[];
};
export function SelectWithIcon<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	errorMessage,
	placeholder,
	options,
}: SelectWithIconProps<TControl>) {
	return (
		<SelectContainer>
			<SelectLabel children={label} />
			{errorMessage && <SelectError>{errorMessage}</SelectError>}
			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => (
					<Select.Root
						value={field.value ?? ""}
						onValueChange={field.onChange}>
						<Select.Trigger className={styles.selectTrigger}>
							<Select.Value placeholder={placeholder} />
							<Select.Icon className={styles.selectIcon}>
								<ChevronDownIcon />
							</Select.Icon>
						</Select.Trigger>

						<Select.Portal>
							<Select.Content className={styles.selectContent}>
								<Select.ScrollUpButton>
									<ChevronUpIcon />
								</Select.ScrollUpButton>

								<Select.Viewport className={styles.selectViewport}>
									{options.map((option) => (
										<Select.Item
											key={option.value}
											value={option.value}
											className={styles.selectItem}>
											{option.icon && (
												<Image
													src={option.icon}
													alt=""
													width={18}
													height={18}
												/>
											)}
											<Select.ItemText>{option.name}</Select.ItemText>
											<Select.ItemIndicator>
												<CheckIcon />
											</Select.ItemIndicator>
										</Select.Item>
									))}
								</Select.Viewport>

								<Select.ScrollDownButton>
									<ChevronDownIcon />
								</Select.ScrollDownButton>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				)}
			/>
		</SelectContainer>
	);
}
