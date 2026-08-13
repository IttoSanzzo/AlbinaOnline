export interface Alignment {
	ethic: keyof typeof EthicAlignment;
	moral: keyof typeof MoralAlignment;
}

export enum EthicAlignment {
	Unknown,

	Lawful,
	Neutral,
	Chaotic,
}
export enum MoralAlignment {
	Unknown,

	Good,
	Neutral,
	Evil,
}

export const EthicAlignmentName: Record<keyof typeof EthicAlignment, string> = {
	Unknown: "Imparcial",
	Lawful: "Leal",
	Neutral: "Neutro",
	Chaotic: "Caótico",
};
export const MoralAlignmentName: Record<keyof typeof MoralAlignment, string> = {
	Unknown: "Imparcial",
	Good: "Bom",
	Neutral: "Neutro",
	Evil: "Mal",
};
export function GetAlignmentName(alignment: Alignment): string {
	if (alignment.ethic === "Unknown" && alignment.moral === "Unknown")
		return "Imparcial";

	const ethic = EthicAlignmentName[alignment.ethic];
	const moral = MoralAlignmentName[alignment.moral];
	if (alignment.ethic === "Unknown") return moral;
	if (alignment.moral === "Unknown") return ethic;
	return `${ethic} ${moral}`;
}
