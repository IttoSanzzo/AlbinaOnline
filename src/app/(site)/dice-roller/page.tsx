import { assembleMetadata } from "@/metadata/assembleMetadata";
import { Metadata } from "next";
import { DiceRollerCore } from "../sandbox/subcomponents/DiceRoller/subcomponents/DiceRollerCore";
import { StandartTextColor } from "@/components/(UIBasics)";

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
