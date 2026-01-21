import { assembleMetadata } from "@/metadata/assembleMetadata";
import { Metadata } from "next";
import { StandartTextColor } from "@/components/(UIBasics)";
import { DiceRollerCore } from "@/components/(SPECIAL)";

export const metadata: Metadata = assembleMetadata({
	title: "Dice Roller",
	route: "/dice-roller",
});

export default async function DiceRollerServerShell() {
	return (
		<DiceRollerCore
			mode="simple"
			primaryColor={StandartTextColor.orange}
			secondaryColor={StandartTextColor.darkGray}
			standaloneMode
		/>
	);
}
