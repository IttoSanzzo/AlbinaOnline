import * as Popover from "@radix-ui/react-popover";
import { Controller, FieldValues, Path, useController } from "react-hook-form";
import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useHookedForm } from "../../context/HookedFormContext";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const MultiSelectContainer = newStyledElement.div(styles.multiSelectContainer);
const MultiSelectLabel = newStyledElement.label(styles.multiSelectLabel);
const MultiSelectError = newStyledElement.div(styles.multiSelectError);

export type MultiSelectOption = {
	value: string | number;
	name: string;
	icon?: string;
};

type MultiSelectProps<TFormInput extends FieldValues> = {
	fieldName: Path<TFormInput>;
	label: string;
	options: MultiSelectOption[];
	width?: CSSProperties["width"];
};
export function MultiSelectComponent<TFormInput extends FieldValues>({
	fieldName,
	label,
	options,
	width,
}: MultiSelectProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { fieldState } = useController({
		name: fieldName,
		control: control,
	});

	return (
		<MultiSelectContainer style={{ width }}>
			<MultiSelectLabel children={label} />
			{fieldState.error && (
				<MultiSelectError>{fieldState.error.message}</MultiSelectError>
			)}

			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => {
					const selected: string[] = field.value ?? [];

					function toggle(value: string) {
						let next;
						if (selected.includes(value))
							next = selected.filter((v) => v !== value);
						else next = [...selected, value];
						field.onChange(next);
						triggerDebounceAction();
					}

					return (
						<Popover.Root>
							<Popover.Trigger className={styles.multiSelectTrigger}>
								<span>{`${selected.length} selecionados`}</span>

								<ChevronDownIcon className={styles.multiSelectIcon} />
							</Popover.Trigger>

							<Popover.Portal>
								<Popover.Content className={styles.multiSelectContent}>
									<div className={styles.multiSelectViewport}>
										{options.map((option) => {
											const value = String(option.value);
											const isSelected = selected.includes(value);

											return (
												<div
													key={value}
													className={styles.multiSelectItem}
													onClick={() => toggle(value)}>
													<CheckIcon
														className={styles.multiSelectCheckIcon}
														opacity={isSelected ? 1 : 0}
													/>
													{option.icon && (
														<Image
															src={option.icon}
															alt="Option's icon"
															width={18}
															height={18}
														/>
													)}
													<span>{option.name}</span>
												</div>
											);
										})}
									</div>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					);
				}}
			/>
		</MultiSelectContainer>
	);
}
