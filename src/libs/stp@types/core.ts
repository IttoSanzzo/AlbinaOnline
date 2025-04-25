export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffectContent = {
	type: string;
	value: string;
};

export type GenericEffect = {
	id: number;
	role: string;
	title?: string;
	titleColor: string;
	contents: GenericEffectContent[];
};
