import { generateMetadata } from "./metadata";
import { generateStaticParams } from "./staticParams";
import { PageContextMenu } from "./PageContextMenu";

export const routeInfra = {
	generateMetadata: generateMetadata,
	generateStaticParams: generateStaticParams,
	PageContextMenu: PageContextMenu,
};
