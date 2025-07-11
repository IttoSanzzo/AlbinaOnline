import { generateMetadata } from "./metadata";
import { generateStaticParams } from "./staticParams";
import { getPageData } from "./pageData";
import { PageContextMenu } from "./PageContextMenu";

export const routeInfra = {
	generateMetadata: generateMetadata,
	generateStaticParams: generateStaticParams,
	getPageData: getPageData,
	PageContextMenu: PageContextMenu,
};
