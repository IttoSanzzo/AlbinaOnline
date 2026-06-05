import * as Select from "@radix-ui/react-select";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor } from "@/components/(UIBasics)";

const BaseSelectContainer = newStyledElement.div(styles.baseSelectContainer);
const BaseSelectLabel = newStyledElement.label(styles.baseSelectLabel);
const BaseSelectError = newStyledElement.div(styles.baseSelectError);

export type BaseSelectOption = {
	value: string | number;
	name: string;
	icon?: string;
};

export type BaseSelectProps = {
	label?: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
	errorMessage?: string;
	placeholder?: string;
	options: BaseSelectOption[];
	width?: CSSProperties["width"];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};
export function BaseSelect({
	label,
	labelBackground,
	errorMessage,
	placeholder,
	options,
	width,
	...rest
}: BaseSelectProps) {
	return (
		<BaseSelectContainer style={{ width }}>
			{errorMessage && <BaseSelectError>{errorMessage}</BaseSelectError>}
			<Select.Root {...rest}>
				<Select.Trigger
					style={{
						...(labelBackground && {
							backgroundColor: StandartBackgroundColor[labelBackground],
						}),
					}}
					className={styles.baseSelectTrigger}>
					<Select.Value placeholder={placeholder} />
					<Select.Icon className={styles.baseSelectIcon}>
						<ChevronDownIcon />
					</Select.Icon>
				</Select.Trigger>

				<Select.Portal>
					<Select.Content className={styles.baseSelectContent}>
						<Select.ScrollUpButton>
							<ChevronUpIcon />
						</Select.ScrollUpButton>

						<Select.Viewport className={styles.baseSelectViewport}>
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
			<BaseSelectLabel
				style={{
					...(labelBackground && {
						backgroundColor: StandartBackgroundColor[labelBackground],
					}),
				}}
				children={label}
			/>
		</BaseSelectContainer>
	);
	// 	<BaseSelectContainer style={{ width }}>
	// 		<SelectLabel children={label} />
	// 		{fieldState.error && (
	// 			<SelectError>{fieldState.error.message}</SelectError>
	// 		)}
	// 		<Controller
	// 			name={fieldName}
	// 			control={control}
	// 			render={({ field }) => (
	// 				<Select.Root
	// 					value={field.value ?? ""}
	// 					onValueChange={(event) => {
	// 						field.onChange(event);
	// 						triggerDebounceAction();
	// 					}}>
	// 					<Select.Trigger className={styles.selectTrigger}>
	// 						<Select.Value placeholder={placeholder} />
	// 						<Select.Icon className={styles.selectIcon}>
	// 							<ChevronDownIcon />
	// 						</Select.Icon>
	// 					</Select.Trigger>

	// 					<Select.Portal>
	// 						<Select.Content className={styles.selectContent}>
	// 							<Select.ScrollUpButton>
	// 								<ChevronUpIcon />
	// 							</Select.ScrollUpButton>

	// 							<Select.Viewport className={styles.selectViewport}>
	// 								{options.map((option) => (
	// 									<Select.Item
	// 										key={option.value}
	// 										value={String(option.value)}
	// 										className={styles.selectItem}>
	// 										{option.icon && (
	// 											<Image
	// 												src={option.icon}
	// 												alt=""
	// 												width={18}
	// 												height={18}
	// 											/>
	// 										)}
	// 										<Select.ItemText>{option.name}</Select.ItemText>
	// 										<Select.ItemIndicator>
	// 											<CheckIcon />
	// 										</Select.ItemIndicator>
	// 									</Select.Item>
	// 								))}
	// 							</Select.Viewport>

	// 							<Select.ScrollDownButton>
	// 								<ChevronDownIcon />
	// 							</Select.ScrollDownButton>
	// 						</Select.Content>
	// 					</Select.Portal>
	// 				</Select.Root>
	// 			)}
	// 		/>
	// 	</BaseSelectContainer>
	// );
}
