import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import styles from "./MechanicalAbilityViewer.module.css";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import {
	MechanicalAbility,
	MechanicalAbilityCategoryColor,
	MechanicalAbilityCategoryName,
	MechanicalAbilityTriggerName,
} from "@/libs/stp@types";

interface MechanicalAbilityViewerProps {
	mechanicalAbility: MechanicalAbility;
	withoutMargin?: boolean;
}
export function MechanicalAbilityViewer({
	mechanicalAbility,
	withoutMargin = false,
}: MechanicalAbilityViewerProps) {
	const colorStyle = {
		color:
			StandartTextColor[
				MechanicalAbilityCategoryColor[mechanicalAbility.category]
			],
	};

	return (
		<UIBasics.Box
			withoutBorder
			withoutMargin={withoutMargin}>
			<UIBasics.Box
				className={styles.header}
				withoutBorder
				backgroundColor={"gray"}>
				<StyledFalseLink
					title={mechanicalAbility.name}
					withoutIcon
					style={colorStyle}
				/>
				<div className={styles.header}>
					<StyledFalseLink
						title={MechanicalAbilityCategoryName[mechanicalAbility.category]}
						withoutIcon
						style={colorStyle}
					/>
					<StyledFalseLink
						title={MechanicalAbilityTriggerName[mechanicalAbility.trigger]}
						withoutIcon
						style={colorStyle}
					/>
				</div>
			</UIBasics.Box>
			<UIBasics.Box
				className={styles.header}
				withoutBorder
				backgroundColor={"gray"}>
				<UIBasics.Text textColor="gray">
					{mechanicalAbility.definition}
				</UIBasics.Text>
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
