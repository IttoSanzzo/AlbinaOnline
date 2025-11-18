import { Guid } from "../misc";

export type MetadataData = {
	id: Guid;
	title: string;
	icon: string;
	ogImage: string;
	description: string | undefined;
};
