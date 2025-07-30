import { NotionText } from "@/components/(NotionBased)";

export function bonusColor(bonusValue: number) {
	return bonusValue < 0 ? "red" : bonusValue > 0 ? "green" : "gray";
}

export function bonusValueText(bonusValue: number) {
	return (
		<NotionText
			display="block"
			textColor={bonusColor(bonusValue)}
			textAlign="center">
			{`${bonusValue >= 0 ? "+" : ""}${bonusValue}`}
		</NotionText>
	);
}
