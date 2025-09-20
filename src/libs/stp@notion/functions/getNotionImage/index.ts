import {
	GetDataSourceResponse,
	GetPageResponse,
	PageObjectResponse,
} from "@notionhq/client";

type NotionPageImage = {
	type: "file" | "external";
	file?: {
		url: string;
	};
	external?: {
		url: string;
	};
};

function getImage(notionImage?: NotionPageImage): string | undefined {
	if (!notionImage) return undefined;
	return notionImage[notionImage.type]?.url;
}

export const getNotionImage = {
	Icon: {
		DataSource: (data: GetDataSourceResponse) =>
			getImage((data as { icon?: NotionPageImage }).icon),
		PageObject: (data: PageObjectResponse) =>
			getImage(data.icon as NotionPageImage),
		PageResponse: (data: GetPageResponse) =>
			getImage((data as { icon?: NotionPageImage }).icon),
	},
	Cover: {
		DataSource: (data: GetDataSourceResponse) =>
			getImage((data as { cover?: NotionPageImage }).cover),
		PageObject: (data: PageObjectResponse) =>
			getImage(data.cover as NotionPageImage),
		PageResponse: (data: GetPageResponse) =>
			getImage((data as { cover?: NotionPageImage }).cover),
	},
};
