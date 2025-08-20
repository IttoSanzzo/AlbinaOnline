import * as Select from "@radix-ui/react-select";
import { Controller, FieldValues, Path, useController } from "react-hook-form";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useHookedForm } from "../../context/HookedFormContext";

const SelectContainer = newStyledElement.div(styles.selectContainer);
const SelectLabel = newStyledElement.label(styles.selectLabel);
const SelectError = newStyledElement.div(styles.selectError);

export type SelectOption = {
	value: string | number;
	name: string;
	icon?: string;
};

type SelectProps<TFormInput extends FieldValues> = {
	fieldName: Path<TFormInput>;
	label: string;
	placeholder?: string;
	options: SelectOption[];
	width?: CSSProperties["width"];
};
export function SelectComponent<TFormInput extends FieldValues>({
	fieldName,
	label,
	placeholder,
	options,
	width,
}: SelectProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { fieldState } = useController({
		name: fieldName,
		control: control,
	});

	return (
		<SelectContainer style={{ width }}>
			<SelectLabel children={label} />
			{fieldState.error && (
				<SelectError>{fieldState.error.message}</SelectError>
			)}
			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => (
					<Select.Root
						value={field.value ?? ""}
						onValueChange={(event) => {
							field.onChange(event);
							triggerDebounceAction();
						}}>
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
											value={String(option.value)}
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
