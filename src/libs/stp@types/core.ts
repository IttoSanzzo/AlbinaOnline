import { NotionTextColor } from "@/components/(NotionBased)";

export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffectContent = {
	type: string;
	color?: keyof typeof NotionTextColor;
	value: string;
};

export type GenericEffect = {
	id: number;
	role: string;
	title?: string;
	titleColor?: keyof typeof NotionTextColor;
	contents: GenericEffectContent[];
};
